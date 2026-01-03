'use client';

import React, { useEffect, useState, useRef } from 'react';
import { X, Microphone, Keyboard, CaretLeft, DotsThreeVertical } from '@phosphor-icons/react';
import { GoogleGenAI } from '@google/genai';

interface VoiceModeProps {
    isOpen: boolean;
    onClose: () => void;
}

// ----------------------------------------------------------------------------
// Critical Helper Functions (Manual Audio Processing)
// ----------------------------------------------------------------------------

// 1. Manual Base64 Encode (Float32 -> Int16 -> Base64)
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// 2. Manual Base64 Decode
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// 3. Audio Buffer Conversion (Int16 -> Float32 for Browser Playback)
async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------

export default function VoiceMode({ isOpen, onClose }: VoiceModeProps) {
    const [transcript, setTranscript] = useState('Connecting to Rima...');
    const [phase, setPhase] = useState<'connecting' | 'listening' | 'speaking' | 'processing' | 'idle'>('connecting');

    // Audio Context Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    // Playback Refs
    const nextStartTimeRef = useRef<number>(0);
    const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

    // SDK Session Ref
    const sessionRef = useRef<any>(null);

    // Initialize Connection
    useEffect(() => {
        if (isOpen) {
            connect();
        } else {
            disconnect();
        }

        return () => disconnect();
    }, [isOpen]);

    const connect = async () => {
        try {
            setPhase('connecting');
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            if (!apiKey) throw new Error('Missing API Key');

            const client = new GoogleGenAI({ apiKey });

            // The SDK logic is tricky. If we pass callbacks in connect, they handle events.
            // If the SDK returns a session, we might need to attach listener to session.conn if it exists. 
            // BUT strict mode TS complains about session.onmessage not existing.
            // Let's try to access the underlying WebSocket if possible, or assume the SDK handles it if we pass callbacks.
            // However, since 'callbacks' property in connect param is supported (per d.ts check), we should use it.
            // I will Re-Do the connect call to include callbacks.

            await disconnect(); // Ensure clean slate

            const newSession = await client.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: ['AUDIO'] as any,
                },
                callbacks: {
                    onopen: async () => {
                        console.log('Gemini Live Connected');
                        // We need access to the session to send audio. 
                        // But session isn't assigned to ref yet!
                        // Typically onopen fires after connect resolves? No, connect awaits open.
                        // So we are good.
                    },
                    onmessage: async (event: any) => {
                        const message = event.data ? JSON.parse(event.data) : event;
                        if (message.serverContent) {
                            const { modelTurn, interrupted } = message.serverContent;
                            if (interrupted) {
                                console.log('Interrupted!');
                                stopAllAudio();
                                return;
                            }
                            if (modelTurn?.parts) {
                                for (const part of modelTurn.parts) {
                                    if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                                        const audioBytes = decode(part.inlineData.data);
                                        await queueAudio(audioBytes);
                                        setPhase('speaking');
                                        setTranscript("Speaking...");
                                    }
                                }
                            }
                            if (message.serverContent.turnComplete) {
                                setPhase('listening');
                                setTranscript("I'm listening...");
                            }
                        }
                    },
                    onclose: () => {
                        console.log('Gemini Session Closed');
                        setPhase('idle');
                    },
                    onerror: (err: any) => {
                        console.error('Gemini Session Error:', err);
                        setPhase('idle');
                    }
                }
            } as any);

            sessionRef.current = newSession;

            // Audio Setup
            await setupAudioInput(newSession);
            setPhase('listening');
            setTranscript("I'm listening...");

        } catch (error) {
            console.error('Connection Failed:', error);
            setTranscript('Failed to connect.');
            setPhase('idle');
        }
    };

    const setupAudioInput = async (session: any) => {
        // 1. Audio Context
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = ctx;

        // 2. Microphone Stream
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                sampleRate: 16000,
                channelCount: 1,
                echoCancellation: true,
                autoGainControl: true,
                noiseSuppression: true
            }
        });
        mediaStreamRef.current = stream;

        // 3. ScriptProcessor (Legacy but requested)
        const source = ctx.createMediaStreamSource(stream);
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);

            // Convert Float32 to Int16
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                // Clamp and scale
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }

            // Base64 Encode manually
            const uint8 = new Uint8Array(pcm16.buffer);
            const base64 = encode(uint8);

            // Send to Session
            // Note: The SDK's session.sendRealtimeInput likely attempts to send via WS.
            // We need to ensure the session is still valid/open.
            try {
                // There isn't a direct 'readyState' check on the abstraction, but we can wrap in try/catch
                // or check our own 'phase' state before sending.
                if (phase === 'idle') return;
                session.sendRealtimeInput({
                    mediaChunks: [{
                        data: base64,
                        mimeType: 'audio/pcm'
                    }]
                });
            } catch (e) {
                console.warn("Failed to send audio chunk:", e);
            }
        };

        source.connect(processor);
        processor.connect(ctx.destination); // Keep alive
    };

    const queueAudio = async (itemBytes: Uint8Array) => {
        const ctx = audioContextRef.current;
        if (!ctx) return;

        // Decode Int16 PCM to AudioBuffer
        const buffer = await decodeAudioData(itemBytes, ctx, 24000, 1); // Model returns 24kHz

        // Create Source
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);

        // Schedule
        const currentTime = ctx.currentTime;
        // Ensure we schedule in the future (gapless)
        // If nextStartTime is in the past, reset it to now
        if (nextStartTimeRef.current < currentTime) {
            nextStartTimeRef.current = currentTime;
        }

        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += buffer.duration;

        // Track source for cancellation
        scheduledSourcesRef.current.push(source);

        // Cleanup on end
        source.onended = () => {
            scheduledSourcesRef.current = scheduledSourcesRef.current.filter(s => s !== source);
            if (scheduledSourcesRef.current.length === 0) {
                // Technically we might still be 'speaking' if more chunks coming,
                // but typically turnComplete handles phase.
            }
        };
    };

    const stopAllAudio = () => {
        scheduledSourcesRef.current.forEach(source => {
            try { source.stop(); } catch (e) { }
        });
        scheduledSourcesRef.current = [];
        const ctx = audioContextRef.current;
        if (ctx) {
            nextStartTimeRef.current = ctx.currentTime;
        }
    };

    const disconnect = () => {
        if (sessionRef.current) {
            // Try close if method exists
            try { sessionRef.current.close(); } catch (e) { }
            sessionRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
            mediaStreamRef.current = null;
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        stopAllAudio();
        setPhase('idle');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0B0E14] animate-fade-in sm:rounded-[32px] sm:overflow-hidden sm:m-4 sm:ring-8 sm:ring-black/5 shadow-2xl font-sans text-white">

            {/* Top Bar */}
            <div className="flex items-center justify-between p-6 px-8 z-10">
                <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                    <CaretLeft size={24} weight="bold" />
                </button>
                <h2 className="text-lg font-bold tracking-wide">AI Voice</h2>
                <button className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors">
                    <DotsThreeVertical size={24} weight="bold" />
                </button>
            </div>

            {/* Main Visual Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-md mx-auto px-6">

                {/* Status Text (Top of Visual) */}
                <div className="absolute top-10 text-center space-y-2 animate-slide-up">
                    <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                        {phase === 'connecting' ? 'CONNECTING...' : 'SPEAKING TO RIMA'}
                    </p>
                </div>

                {/* Central Visual Orb */}
                <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
                    {/* Glowing layers */}
                    <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-1000 ${phase === 'listening' ? 'bg-[#6C30FF]/30 opacity-100' : 'bg-purple-500/10 opacity-50'}`} />

                    {/* Core Orb */}
                    <div className="relative w-full h-full">
                        {/* Animated Rings for Listening/Speaking Phase */}
                        {(phase === 'listening' || phase === 'speaking') && (
                            <>
                                <div className="absolute inset-0 border border-[#6C30FF]/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                                <div className="absolute inset-4 border border-[#6C30FF]/40 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />
                                <div className="absolute inset-8 border border-[#6C30FF]/50 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.8s' }} />
                            </>
                        )}

                        {/* Center Gradient Sphere */}
                        <div className={`absolute inset-12 rounded-full bg-gradient-to-tr from-[#6C30FF] to-purple-600 shadow-[0_0_60px_rgba(108,48,255,0.4)] transition-all duration-700 flex items-center justify-center ${(phase === 'listening' || phase === 'speaking') ? 'scale-110' : 'scale-100'}`}>
                            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm" />
                        </div>
                    </div>
                </div>

                {/* Transcript / Large Text Prompt */}
                <div className="text-center space-y-4 max-w-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-2xl font-medium leading-tight">
                        {transcript}
                    </h3>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between px-10 pb-12 w-full max-w-md mx-auto">
                <button className="p-4 rounded-full bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm group">
                    <Keyboard size={24} weight="fill" className="group-hover:scale-110 transition-transform" />
                </button>

                {/* Mic Button (Main Action - mostly visual since it's auto) */}
                <button className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95 ${(phase === 'listening' || phase === 'speaking') ? 'bg-white text-black' : 'bg-[#6C30FF] text-white'}`}>
                    <Microphone size={32} weight="fill" className={(phase === 'speaking') ? 'animate-pulse' : ''} />
                </button>

                <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm group"
                >
                    <X size={24} weight="bold" className="group-hover:rotate-90 transition-transform" />
                </button>
            </div>

        </div>
    );
}

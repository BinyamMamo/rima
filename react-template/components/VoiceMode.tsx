import React, { useEffect, useRef, useState } from 'react';
import { X, Microphone, Waveform } from "@phosphor-icons/react";
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface VoiceModeProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper functions for base64 encoding/decoding as required by the Live API
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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

const VoiceMode: React.FC<VoiceModeProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'connecting' | 'active' | 'error'>('connecting');
  const sessionRef = useRef<any>(null);
  const audioContextsRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    let micStream: MediaStream | null = null;
    let scriptProcessor: ScriptProcessorNode | null = null;

    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextsRef.current = { input: inputCtx, output: outputCtx };

        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              if (isCancelled) return;
              setStatus('active');
              
              const source = inputCtx.createMediaStreamSource(micStream!);
              scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputCtx.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              if (isCancelled) return;
              
              const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioData) {
                const ctx = audioContextsRef.current?.output;
                if (!ctx) return;

                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => {
              console.error('Live API Error:', e);
              setStatus('error');
            },
            onclose: () => {
              if (!isCancelled) onClose();
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: 'You are Rima, a highly efficient AI workspace assistant. You are helping Sara manage her productivity suite. Provide concise, high-value information. Avoid informal pleasantries unless relevant.',
          },
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error('Failed to start voice session:', err);
        setStatus('error');
      }
    };

    startSession();

    return () => {
      isCancelled = true;
      if (sessionRef.current) sessionRef.current.close();
      if (micStream) micStream.getTracks().forEach(track => track.stop());
      if (scriptProcessor) scriptProcessor.disconnect();
      if (audioContextsRef.current) {
        audioContextsRef.current.input.close();
        audioContextsRef.current.output.close();
      }
      sourcesRef.current.forEach(s => s.stop());
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0b] flex flex-col items-center justify-center animate-slide-in overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(40,40,60,0.1),_transparent_80%)]"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
        <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase">Voice Assistant</span>
            <span className="text-sm font-bold text-zinc-400">
              {status === 'connecting' ? 'Connecting...' : status === 'active' ? 'Active' : 'Disconnected'}
            </span>
        </div>
        <button 
          onClick={onClose}
          className="p-3 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={24} weight="light" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <div className="relative mb-20">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white/5 ${status === 'active' ? 'animate-ping' : ''} opacity-10`}></div>
            
            <div className={`relative w-40 h-40 rounded-3xl bg-[#141416] shadow-2xl flex items-center justify-center group overflow-hidden border border-white/5 transition-all duration-500 ${status === 'active' ? 'scale-110 shadow-white/5 border-white/20' : 'scale-100'}`}>
                <div className="flex items-center gap-2 h-16">
                   {[...Array(5)].map((_, i) => (
                       <div 
                         key={i} 
                         className={`w-2 bg-stone-300 rounded-full transition-all duration-300 ${status === 'active' ? 'animate-[voice-bounce_1s_ease-in-out_infinite]' : 'h-2 opacity-20'}`}
                         style={{ 
                            height: status === 'active' ? `${30 + Math.random() * 70}%` : '8px',
                            animationDelay: `${i * 0.15}s`
                         }}
                       ></div>
                   ))}
                </div>
            </div>
        </div>

        <div className="max-w-xs space-y-2">
            <h2 className="text-4xl font-black tracking-tight text-white uppercase">RIMA</h2>
            <p className={`text-zinc-500 text-lg font-light leading-relaxed ${status === 'active' ? 'animate-pulse' : ''}`}>
                {status === 'connecting' ? 'Initializing...' : status === 'active' ? 'Listening' : 'System standby'}
            </p>
        </div>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center gap-4 z-10">
        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 ${status === 'active' ? 'bg-stone-200 text-black scale-110' : 'bg-zinc-900 text-zinc-700'}`}>
            <Microphone size={28} weight={status === 'active' ? 'fill' : 'light'} />
        </div>
      </div>

      <style>{`
        @keyframes voice-bounce {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50% { transform: scaleY(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default VoiceMode;
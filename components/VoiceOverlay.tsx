import React, { useEffect, useState } from 'react';
import { X, Microphone, Keyboard, CaretLeft, DotsThreeVertical } from '@phosphor-icons/react';

interface VoiceOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onCommandDetected?: (command: string) => void;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ isOpen, onClose, onCommandDetected }) => {
    const [transcript, setTranscript] = useState('');
    const [phase, setPhase] = useState<'intro' | 'listening' | 'processing' | 'idle'>('intro');

    useEffect(() => {
        if (isOpen) {
            setPhase('listening');
            setTranscript("Go ahead, I'm listening...");

            // Simulation Sequence
            // 1. Listen for 3s
            const listeningTimer = setTimeout(() => {
                setPhase('processing');
                setTranscript("Processing...");

                // 2. Process for 1.5s then showing result
                setTimeout(() => {
                    const simulatedCommand = "Create a task to review the budget";
                    setTranscript(`"${simulatedCommand}"`);

                    if (onCommandDetected) {
                        setTimeout(() => {
                            onCommandDetected(simulatedCommand);
                            // Keep overlay open for a moment to show result? 
                            // Or maybe switch to 'idle' with the result shown?
                            setPhase('idle');
                        }, 1000);
                    }
                }, 2000);
            }, 3500);

            return () => clearTimeout(listeningTimer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-app)] animate-fade-in sm:rounded-[32px] sm:overflow-hidden sm:m-4 sm:ring-8 sm:ring-black/5 shadow-2xl">

            {/* Top Bar */}
            <div className="flex items-center justify-between p-6 px-8 z-10">
                <button onClick={onClose} className="p-2 -ml-2 text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-full transition-colors">
                    <CaretLeft size={24} weight="bold" />
                </button>
                <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-wide">AI Voice</h2>
                <button className="p-2 -mr-2 text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-full transition-colors">
                    <DotsThreeVertical size={24} weight="bold" />
                </button>
            </div>

            {/* Main Visual Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-md mx-auto px-6">

                {/* Status Text (Top of Visual) */}
                <div className="absolute top-10 text-center space-y-2 animate-slide-up">
                    <p className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">Speaking to Rima</p>
                </div>

                {/* Central Visual Orb */}
                <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
                    {/* Glowing layers */}
                    <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-1000 ${phase === 'listening' ? 'bg-[var(--primary)]/20 opacity-100' : 'bg-purple-500/10 opacity-50'}`} />

                    {/* Core Orb */}
                    <div className="relative w-full h-full">
                        {/* Animated Rings for Listening Phase */}
                        {phase === 'listening' && (
                            <>
                                <div className="absolute inset-0 border border-[var(--primary)]/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                                <div className="absolute inset-4 border border-[var(--primary)]/40 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.4s' }} />
                                <div className="absolute inset-8 border border-[var(--primary)]/50 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.8s' }} />
                            </>
                        )}

                        {/* Center Gradient Sphere */}
                        <div className={`absolute inset-12 rounded-full bg-gradient-to-tr from-[var(--primary)] to-purple-600 shadow-[0_0_60px_rgba(108,48,255,0.4)] transition-all duration-700 flex items-center justify-center ${phase === 'listening' ? 'scale-105' : 'scale-100'}`}>
                            {/* Inner texture/noise could go here */}
                            <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm" />
                        </div>
                    </div>
                </div>

                {/* Transcript / Large Text Prompt */}
                <div className="text-center space-y-4 max-w-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-2xl font-medium text-[var(--text-primary)] leading-tight">
                        {transcript}
                    </h3>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between px-10 pb-12 w-full max-w-md mx-auto">
                {/* Keyboard Toggle */}
                <button className="p-4 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-all shadow-sm group">
                    <Keyboard size={24} weight="fill" className="group-hover:scale-110 transition-transform" />
                </button>

                {/* Mic Button (Main Action) */}
                <button className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95 ${phase === 'listening' ? 'bg-[var(--text-primary)] text-[var(--bg-app)]' : 'bg-[var(--primary)] text-white'}`}>
                    <Microphone size={32} weight="fill" className={phase === 'listening' ? 'animate-pulse' : ''} />
                </button>

                {/* Close/Cancel */}
                <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-all shadow-sm group"
                >
                    <X size={24} weight="bold" className="group-hover:rotate-90 transition-transform" />
                </button>
            </div>

        </div>
    );
};

export default VoiceOverlay;

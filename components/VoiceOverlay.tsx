import React, { useEffect, useState } from 'react';
import { Sparkle, X, Microphone } from '@phosphor-icons/react';

interface VoiceOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ isOpen, onClose }) => {
    const [transcript, setTranscript] = useState('');
    const [isRimaSpeaking, setIsRimaSpeaking] = useState(false);
    const [phase, setPhase] = useState<'intro' | 'listening' | 'processing'>('intro');

    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setTranscript("Hi, I'm Rima. I can help you manage your workspace, schedule tasks, and answer your questions. How can I help you today?");
            setIsRimaSpeaking(true);
            setPhase('intro');

            // Simulate Rima finishing speaking after a delay
            const introTimer = setTimeout(() => {
                setIsRimaSpeaking(false);
                setPhase('listening');
                setTranscript(''); // Clear for user input
            }, 5000);

            return () => clearTimeout(introTimer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-app)]/90 backdrop-blur-xl animate-fade-in">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-3 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all shadow-sm"
            >
                <X size={24} weight="bold" />
            </button>

            {/* Main Visuals */}
            <div className="flex flex-col items-center gap-12 max-w-2xl w-full px-8 text-center">

                {/* Rima Avatar / Visualizer */}
                <div className="relative">
                    {/* Pulsing Rings (Active when Rima speaks or Processing) */}
                    {(isRimaSpeaking || phase === 'processing') && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-[var(--primary)]/20 animate-ping" style={{ animationDuration: '3s' }} />
                            <div className="absolute inset-0 rounded-full bg-[var(--primary)]/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                        </>
                    )}

                    {/* Core Avatar */}
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${phase === 'listening' ? 'bg-[var(--bg-surface)] border-4 border-[var(--primary)] scale-100' : 'bg-gradient-to-br from-[var(--primary)] to-purple-600 scale-110'
                        }`}>
                        {phase === 'listening' ? (
                            <Microphone size={48} weight="fill" className="text-[var(--primary)] animate-pulse" />
                        ) : (
                            <Sparkle size={64} weight="fill" className="text-white animate-spin-slow" />
                        )}
                    </div>
                </div>

                {/* Transcript / Status Text */}
                <div className="min-h-[120px] flex flex-col items-center justify-center space-y-4">
                    {/* Phase Indicator */}
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] opacity-80">
                        {phase === 'intro' ? 'Rima is speaking...' : phase === 'listening' ? 'Listening...' : 'Processing...'}
                    </span>

                    {/* Text Content */}
                    <p className="text-2xl md:text-3xl font-medium text-[var(--text-primary)] leading-relaxed animate-slide-up">
                        {transcript || (phase === 'listening' ? "Go ahead, I'm listening..." : "...")}
                    </p>
                </div>

                {/* Waveform Visualization (CSS Animation) */}
                <div className="h-16 flex items-center justify-center gap-1.5 opacity-80">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 rounded-full bg-[var(--primary)] transition-all duration-300 ${isRimaSpeaking || phase === 'listening' ? 'animate-wave' : 'h-2 bg-[var(--text-muted)]'}`}
                            style={{
                                height: isRimaSpeaking || phase === 'listening' ? `${Math.random() * 40 + 10}px` : '4px',
                                animationDelay: `${i * 0.1}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VoiceOverlay;

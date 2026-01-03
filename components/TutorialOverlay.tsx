import React, { useState } from 'react';
import { X, Sparkle, ChatText, SquaresFour, Microphone, Users } from '@phosphor-icons/react';

interface TutorialOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(0);

    if (!isOpen) return null;

    const steps = [
        {
            title: "Welcome to Rima",
            description: "Your AI-powered project manager. Rima helps you coordinate tasks, track health, and manage your universe.",
            icon: Sparkle,
            color: "text-[var(--primary)]"
        },
        {
            title: "Conversational Intelligence",
            description: "Chat with Rima naturally. Ask for summaries, assign tasks, or just brainstorm ideas.",
            icon: ChatText,
            color: "text-blue-500"
        },
        {
            title: "Dynamic Dashboards",
            description: "Switch to Dashboard view to see live insights, tasks extracted from chats, and key metrics.",
            icon: SquaresFour,
            color: "text-purple-500"
        },
        {
            title: "Voice Control",
            description: "Tap the microphone to speak with Rima hands-free. Perfect for quick updates on the go.",
            icon: Microphone,
            color: "text-rose-500"
        },
        {
            title: "Team Collaboration",
            description: "Invite your team (or family!) to workspaces. Rima keeps everyone in sync.",
            icon: Users,
            color: "text-amber-500"
        }
    ];

    const currentStep = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onClose();
            setStep(0); // Reset for next time
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-surface)] text-[var(--text-muted)] transition-colors z-10"
                >
                    <X size={20} weight="bold" />
                </button>

                {/* Content */}
                <div className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className={`w-20 h-20 rounded-full bg-[var(--bg-surface)] flex items-center justify-center mb-2 ${currentStep.color}`}>
                        <currentStep.icon size={40} weight="fill" />
                    </div>

                    <div className="space-y-3 min-h-[120px]">
                        <h3 className="text-2xl font-bold text-[var(--text-primary)]">{currentStep.title}</h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                            {currentStep.description}
                        </p>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex gap-2 justify-center py-4">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${idx === step ? 'bg-[var(--primary)] w-6' : 'bg-[var(--text-muted)] opacity-30'}`}
                            />
                        ))}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleNext}
                        className="w-full py-4 bg-[var(--primary)] text-white font-bold rounded-2xl hover:brightness-110 transition-all text-lg"
                    >
                        {step === steps.length - 1 ? "Get Started" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorialOverlay;


import React, { useState } from 'react';
import { X, EnvelopeSimple, PaperPlaneRight } from '@phosphor-icons/react';

interface InviteModalProps {
    onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Simulate sending invite
        setTimeout(() => {
            setSent(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-card border border-subtle rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold font-branding text-primary">Invite to Universe</h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-secondary hover:text-primary hover:bg-surface rounded-full transition-colors"
                        >
                            <X size={20} weight="bold" />
                        </button>
                    </div>

                    {!sent ? (
                        <form onSubmit={handleSend} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Email Address</label>
                                <div className="relative">
                                    <EnvelopeSimple
                                        size={20}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="colleague@example.com"
                                        autoFocus
                                        className="w-full h-12 bg-surface border border-subtle rounded-xl pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-primary placeholder:text-muted"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={!email}
                                    className="w-full h-12 bg-[var(--primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-[var(--primary)]/20"
                                >
                                    <PaperPlaneRight size={20} weight="fill" />
                                    <span>Send Invitation</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="py-8 flex flex-col items-center text-center space-y-3 animate-fade-in">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                <PaperPlaneRight size={32} weight="fill" />
                            </div>
                            <h4 className="text-lg font-bold text-primary">Invitation Sent!</h4>
                            <p className="text-secondary text-sm">We've sent an email to <span className="font-bold text-primary">{email}</span></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InviteModal;

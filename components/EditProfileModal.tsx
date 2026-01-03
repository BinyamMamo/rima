import React, { useState, useEffect } from 'react';
import { X, Camera, User, Envelope, TextAa } from '@phosphor-icons/react';
import { User as UserType } from '@/types';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserType;
    onSave: (updatedUser: Partial<UserType>) => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatarColor, setAvatarColor] = useState(user?.avatarColor || 'bg-blue-500');
    const [isSaving, setIsSaving] = useState(false);

    // Sync state when user prop changes
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setAvatarColor(user.avatarColor || 'bg-blue-500');
        }
    }, [user]);

    if (!isOpen) return null;

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            onSave({ name, email, avatarColor });
            setIsSaving(false);
            onClose();
        }, 800);
    };

    const colors = [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500'
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-md bg-[var(--bg-card)] rounded-3xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden animate-scale-up">

                {/* Header */}
                <div className="relative h-32 bg-[#6C30FF]">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                    >
                        <X size={20} weight="bold" />
                    </button>
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                        <div className={`relative w-24 h-24 rounded-full ${avatarColor} border-4 border-[var(--bg-card)] flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                            {name.charAt(0).toUpperCase()}
                            <div className="absolute bottom-0 right-0 p-1.5 bg-[var(--bg-surface)] rounded-full border border-[var(--border-subtle)] shadow-sm cursor-pointer hover:scale-110 transition-transform">
                                <Camera size={16} className="text-[var(--text-primary)]" weight="fill" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-16 pb-8 px-6 space-y-6">

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                                <User size={14} weight="fill" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all font-medium"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                                <Envelope size={14} weight="fill" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-all font-medium"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                                Avatar Color
                            </label>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setAvatarColor(color)}
                                        className={`w-8 h-8 rounded-full ${color} transition-all hover:scale-110 ${avatarColor === color ? 'ring-2 ring-offset-2 ring-[var(--primary)] ring-offset-[var(--bg-card)] scale-110' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !name.trim()}
                            className="w-full py-3.5 rounded-xl bg-[var(--primary)] text-white font-bold text-base shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full mt-3 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

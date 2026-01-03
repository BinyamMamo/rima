import React from 'react';
import { Warning, X } from '@phosphor-icons/react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-[var(--text-primary)]">
                        <div className={`p-3 rounded-full ${isDestructive ? 'bg-rose-500/10 text-rose-500' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                            <Warning size={24} weight="fill" />
                        </div>
                        <h3 className="text-xl font-bold">{title}</h3>
                    </div>

                    <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex items-center gap-3 p-6 pt-2 bg-[var(--bg-surface)]/50">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 ${isDestructive
                                ? 'bg-rose-500 shadow-rose-500/20'
                                : 'bg-[var(--primary)] shadow-[var(--primary)]/20'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

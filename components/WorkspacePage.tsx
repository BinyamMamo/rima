
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Workspace, User } from '@/types';

import ProfileCard from './ProfileCard';
import MessageBubble from './MessageBubble';
import VoiceOverlay from '@/components/VoiceOverlay';
import { Checks, Sparkle, Heart, Trash, NotePencil, X, Hash, Lock } from "@phosphor-icons/react";

interface WorkspacePageProps {
    workspace: Workspace;
    currentUser: User | null;
    onVoiceToggle: () => void;
    onSendMessage: (content: string) => void;
    onInvitePeople: () => void;
    isRimaTyping: boolean;
}

export default function WorkspacePage({
    workspace, currentUser, onVoiceToggle, onSendMessage, onInvitePeople, isRimaTyping
}: WorkspacePageProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);
    const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(null);
    const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [workspace.messages, isRimaTyping]);

    return (
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col overflow-hidden relative">
            <VoiceOverlay isOpen={showVoiceOverlay} onClose={() => setShowVoiceOverlay(false)} />
            {/* Rooms Row */}
            <div className="w-full h-14 flex items-center gap-2 px-4 bg-[var(--bg-app)]/40 backdrop-blur-md border-b border-[var(--border-subtle)] overflow-x-auto scrollbar-hide z-30 shrink-0">
                <div className="flex items-center gap-2 min-w-max">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mr-2">Rooms</span>
                    {workspace.rooms.map(room => (
                        <button
                            key={room.id}
                            onClick={() => router.push(`/workspace/${workspace.id}/room/${room.id}`)}
                            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--primary)] transition-all hover:scale-105"
                        >
                            {room.isPrivate ? (
                                <Lock size={14} className="text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                            ) : (
                                <Hash size={14} className="text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                            )}
                            <span className="text-[11px] font-bold text-[var(--text-primary)]">{room.title}</span>
                            {room.unreadCount && room.unreadCount > 0 ? (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[9px] font-bold text-white">
                                    {room.unreadCount}
                                </span>
                            ) : null}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide pb-40">
                {workspace.messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center px-8 animate-fade-in space-y-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center shadow-2xl shadow-[var(--primary)]/20 ring-4 ring-[var(--bg-app)] animate-fade-in">
                            <Sparkle size={48} weight="fill" className="text-white" />
                        </div>
                        <div className="space-y-2 max-w-md">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)]">Welcome to {workspace.title}</h3>
                            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                                I&apos;m <span className="font-bold text-[var(--primary)]">Rima</span>, your AI project manager.
                                I&apos;m here to help you coordinate tasks, analyze data, and keep your team aligned.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm opacity-60">
                            <div className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)]">
                                &quot;What are the deadlines?&quot;
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)]">
                                &quot;Create a task&quot;
                            </div>
                        </div>
                    </div>
                )}

                {workspace.messages.map((msg, idx) => {
                    const isSelf = msg.sender !== 'Rima' && !!currentUser && (msg.sender as User).id === currentUser.id;
                    const isRima = msg.sender === 'Rima';
                    const showAvatar = !isSelf && (idx === 0 || workspace.messages[idx - 1].sender !== msg.sender);

                    return (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isSelf={isSelf}
                            isRima={isRima}
                            showAvatar={showAvatar}
                            onProfileClick={setSelectedProfileUser}
                        />
                    );
                })}

                {isRimaTyping && (
                    <div className="flex w-full justify-start items-center gap-3 animate-fade-in">
                        <div className="w-10 h-10 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center">
                            <Sparkle size={18} weight="fill" className="animate-spin-slow" />
                        </div>
                        <div className="flex gap-1 p-4 glass rounded-[24px] rounded-bl-lg">
                            <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}

                <div ref={scrollRef} />
            </div>

            {selectedProfileUser && (
                <ProfileCard user={selectedProfileUser} onClose={() => setSelectedProfileUser(null)} />
            )}

            <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}

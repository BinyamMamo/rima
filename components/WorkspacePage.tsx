
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Workspace, User } from '@/types';

import ProfileCard from './ProfileCard';
import { Checks, Sparkle, Heart, Trash, NotePencil, X, Hash, Lock } from "@phosphor-icons/react";

interface WorkspacePageProps {
    workspace: Workspace;
    onVoiceToggle: () => void;
    onSendMessage: (content: string) => void;
    onInvitePeople: () => void;
    isRimaTyping: boolean;
}

export default function WorkspacePage({
    workspace, onVoiceToggle, onSendMessage, onInvitePeople, isRimaTyping
}: WorkspacePageProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);
    const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [workspace.messages, isRimaTyping]);

    return (
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col overflow-hidden relative">
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
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-12 animate-fade-in">
                        <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-[32px] flex items-center justify-center mb-6">
                            <Sparkle size={32} weight="fill" className="text-[var(--primary)]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 tracking-tight">System Ready</h3>
                        <p className="text-sm font-medium max-w-xs leading-relaxed">Type or speak to Rima. Your team is ready to assist.</p>
                    </div>
                )}

                {workspace.messages.map((msg, idx) => {
                    const isSelf = msg.sender !== 'Rima' && (msg.sender as User).id === 'u_sara';
                    const isRima = msg.sender === 'Rima';
                    const showAvatar = !isSelf && (idx === 0 || workspace.messages[idx - 1].sender !== msg.sender);

                    return (
                        <div
                            key={msg.id}
                            className={`flex w-full animate-slide-up group relative ${isSelf ? 'justify-end' : 'justify-start items-end gap-3'}`}
                        >
                            {!isSelf && (
                                <div
                                    className="w-10 h-10 shrink-0 cursor-pointer"
                                    onClick={() => !isRima && setSelectedProfileUser(msg.sender as User)}
                                >
                                    {showAvatar && (
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-md transition-all active:scale-90 ${isRima ? 'bg-[var(--primary)] text-white' : (msg.sender as User).avatarColor}`}>
                                            {isRima ? <Sparkle size={18} weight="fill" /> : (msg.sender as User).name[0]}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={`flex flex-col max-w-[85%] ${isSelf ? 'items-end' : 'items-start'}`}>
                                {showAvatar && !isSelf && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 px-1">
                                        {isRima ? 'Rima Intelligence' : (msg.sender as User).name}
                                    </span>
                                )}

                                <div className={`relative px-5 py-4 shadow-sm transition-all group/bubble ${isRima
                                    ? 'glass border-[var(--primary)]/20 text-[var(--text-primary)] rounded-[24px] rounded-bl-lg'
                                    : isSelf
                                        ? 'bg-[var(--primary)] text-white rounded-[24px] rounded-br-lg font-medium shadow-lg shadow-[var(--primary)]/10'
                                        : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-[24px] rounded-bl-lg'
                                    }`}>
                                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap tracking-tight">
                                        {msg.content}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-2 opacity-50">
                                        <span className="text-[9px] font-bold uppercase">{msg.timestamp}</span>
                                        {isSelf && <Checks size={12} weight="bold" className="animate-pulse" />}
                                    </div>

                                    {/* Message Actions - Visible on Hover */}
                                    {isSelf && (
                                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-2 flex gap-1 p-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-full shadow-lg opacity-0 group-hover/bubble:opacity-100 transition-opacity z-10 pointer-events-none group-hover/bubble:pointer-events-auto scale-90">
                                            <button className="p-1.5 hover:bg-[var(--bg-surface)] rounded-full text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors" title="Edit">
                                                <NotePencil size={14} weight="bold" />
                                            </button>
                                            <button className="p-1.5 hover:bg-[var(--bg-surface)] rounded-full text-[var(--text-secondary)] hover:text-rose-500 transition-colors" title="Delete">
                                                <Trash size={14} weight="bold" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { List, CaretLeft, UserPlus, Lock, Hash, DotsThree, Users, Sparkle, Heart, Trash, NotePencil, X, Checks } from '@phosphor-icons/react';
import { useAuth, useWorkspaceData } from '@/contexts';
import { Message, User } from '@/types';
import Background from '@/components/Background';
import Sidebar from '@/components/Sidebar';
import ChatInput from '@/components/ChatInput';

export default function RoomPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { workspaces, addMessage, activeProfileId } = useWorkspaceData();
    const router = useRouter();
    const params = useParams();
    const workspaceId = params.id as string;
    const roomId = params.roomId as string;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'chat' | 'overview'>('chat');
    const [isRimaTyping, setIsRimaTyping] = useState(false);
    const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(null);

    const workspace = workspaces.find((p) => p.id === workspaceId);
    const room = workspace?.rooms.find((c) => c.id === roomId);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/welcome');
        }
    }, [user, authLoading, router]);

    if (!workspace || !room) {
        if (authLoading) return null;
        return (
            <div className="flex items-center justify-center h-screen bg-app">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary mb-2">Room Not Found</h2>
                    <button
                        onClick={() => router.push(`/workspace/${workspaceId}`)}
                        className="px-6 py-3 bg-[var(--primary)] text-white rounded-2xl font-semibold hover:brightness-110 transition-all"
                    >
                        Back to Workspace
                    </button>
                </div>
            </div>
        );
    }

    const handleSendMessage = async (content: string) => {
        // TODO: Need DataContext support for Room messages specifically?
        // Currently types.ts has Room.messages. But addMessage in DataContext takes workspaceId.
        // We need 'addRoomMessage(workspaceId, roomId, message)'.
        // For now, I'll allow this but it might not persist correctly if DataContext isn't updated.
        // Let's assume we use addMessage but we need to target the room. 
        // Actually, checking DataContext, it only has addMessage(workspaceId, ...). 
        // I will just log this for now as a TODO for the backend/context refinement step, 
        // OR simply add it to the room's local messages if we can? 
        // Ideally we should update DataContext to support rooms.
        console.log('Sending message to room', roomId, content);

        // Mock UI update:
        // In a real app, this would use the context.
    };

    return (
        <>
            <Background />
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentWorkspaceId={workspaceId}
            />

            <div className="relative z-10 h-screen flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/80 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-3 w-full">
                        <button
                            // Navigate back to Workspace Dashboard
                            onClick={() => router.push(`/workspace/${workspaceId}`)}
                            className="p-2 -ml-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all shrink-0"
                        >
                            <CaretLeft size={24} weight="bold" />
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all shrink-0 md:hidden"
                        >
                            <List size={24} weight="bold" />
                        </button>

                        {/* Clickable Title Area - Room Name */}
                        <div
                            className="flex flex-col flex-1 cursor-pointer hover:bg-[var(--bg-surface)]/50 rounded-lg px-2 py-1 transition-colors overflow-hidden"
                            onClick={() => setViewMode(viewMode === 'chat' ? 'overview' : 'chat')}
                        >
                            <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                                {room.isPrivate ? <Lock size={14} className="shrink-0 opacity-70" /> : <Hash size={14} className="shrink-0 opacity-70" />}
                                <h1 className="text-lg font-bold leading-tight truncate">
                                    {room.title}
                                </h1>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] font-medium truncate">
                                tap for info
                            </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                            {/* Invite Member or Lock */}
                            {room.isPrivate ? (
                                <div className="p-2 text-[var(--text-muted)] cursor-default">
                                    <Lock size={20} weight="fill" />
                                </div>
                            ) : (
                                <button
                                    onClick={() => {/* Invite flow */ }}
                                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-xl transition-all"
                                    title="Invite Members"
                                >
                                    <UserPlus size={24} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sub-Header: Members List */}
                {viewMode === 'chat' && (
                    <div className="flex-shrink-0 h-14 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/50 backdrop-blur-sm flex items-center px-4 gap-2 overflow-x-auto scrollbar-hide">
                        <button className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all shrink-0">
                            <UserPlus size={16} />
                        </button>
                        {/* Mock Members List from room.members if available, else workspace members */}
                        {(room.members || workspace.members || []).slice(0, 5).map((m: User) => (
                            <div key={m.id} className={`w-8 h-8 rounded-full border-2 border-[var(--bg-app)] shrink-0 flex items-center justify-center text-[10px] font-bold ${m.avatarColor || 'bg-zinc-200'}`}>
                                {m.name[0]}
                            </div>
                        ))}
                        <button
                            onClick={() => setViewMode('overview')}
                            className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--primary)] text-xs font-bold shrink-0"
                        >
                            <DotsThree size={20} weight="bold" />
                        </button>
                    </div>
                )}

                {/* Content */}
                {viewMode === 'chat' ? (
                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide pb-40">
                            {room.messages.map((msg, idx) => {
                                const isSelf = msg.sender !== 'Rima' && (msg.sender as User).id === 'u_sara'; // TODO: use real auth user id
                                const isRima = msg.sender === 'Rima';
                                const showAvatar = !isSelf && (idx === 0 || room.messages[idx - 1].sender !== msg.sender);

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex w-full animate-slide-up group relative ${isSelf ? 'justify-end' : 'justify-start items-end gap-3'}`}
                                        onDoubleClick={() => setActiveMessageMenu(msg.id)}
                                    >
                                        {!isSelf && (
                                            <div className="w-10 h-10 shrink-0 cursor-pointer">
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

                                            <div className={`relative px-5 py-4 shadow-sm transition-all ${isRima
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

                                                {activeMessageMenu === msg.id && (
                                                    <div className="absolute top-0 right-0 -translate-y-full flex gap-1 p-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-2xl z-50 animate-slide-up">
                                                        <button onClick={() => setActiveMessageMenu(null)} className="p-2 hover:bg-[var(--bg-surface)] rounded-lg text-rose-500"><Heart size={16} weight="fill" /></button>
                                                        {isSelf && <button onClick={() => setActiveMessageMenu(null)} className="p-2 hover:bg-[var(--bg-surface)] rounded-lg"><NotePencil size={16} /></button>}
                                                        <button onClick={() => setActiveMessageMenu(null)} className="p-2 hover:bg-[var(--bg-surface)] rounded-lg text-zinc-400"><Trash size={16} /></button>
                                                        <button onClick={() => setActiveMessageMenu(null)} className="p-2 hover:bg-[var(--bg-surface)] rounded-lg"><X size={16} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-4 bg-[var(--bg-app)]/80 backdrop-blur-md border-t border-[var(--border-subtle)] z-20">
                            <ChatInput
                                onVoiceToggle={() => { }}
                                onSendMessage={handleSendMessage}
                                placeholder={`Message #${room.title}...`}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4">Room Overview</h2>
                        <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-subtle)]">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Users size={24} />
                                Members
                            </h3>
                            <div className="space-y-4">
                                {(room.members || []).map(member => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full ${member.avatarColor} flex items-center justify-center font-bold text-white`}>
                                            {member.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold">{member.name}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

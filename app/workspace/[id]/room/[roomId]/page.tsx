'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { List, CaretLeft, UserPlus, Lock, Hash, Sparkle, Checks, ChatText, DotsThreeVertical, PencilSimple, Trash, House } from '@phosphor-icons/react';
import { useAuth, useWorkspaceData } from '@/contexts';
import { generateGeminiResponse } from '@/lib/gemini';
import { Message, User } from '@/types';
import Background from '@/components/Background';
import Sidebar from '@/components/Sidebar';
import ChatInput from '@/components/ChatInput';
import RoomDashboardView from '@/components/RoomDashboardView';
import ParticipantsBar from '@/components/ParticipantsBar';
import InviteModal from '@/components/InviteModal';
import ProfileCard from '@/components/ProfileCard';
import ConfirmModal from '@/components/ConfirmModal';
import MessageBubble from '@/components/MessageBubble';
import VoiceOverlay from '@/components/VoiceOverlay';

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
        <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM104,144a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
    </svg>
);

export default function RoomPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { workspaces, addRoomMessage, updateRoom, deleteRoom, updateWorkspace, systemUsers } = useWorkspaceData();
    const router = useRouter();
    const params = useParams();
    const workspaceId = params.id as string;
    const roomId = params.roomId as string;
    const scrollRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'chat' | 'dashboard'>('chat');
    const [isRimaTyping, setIsRimaTyping] = useState(false);

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);

    // New State for Menu/Editing
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);


    const workspace = workspaces.find((p) => p.id === workspaceId);
    const room = workspace?.rooms.find((c) => c.id === roomId);

    const handleDeleteRoom = () => {
        if (!workspace || !room) return;
        deleteRoom(workspace.id, room.id);
        router.push(`/workspace/${workspace.id}`);
    };

    const handleSaveRoom = (title: string, description: string) => {
        if (!workspace || !room) return;
        if (updateRoom) {
            updateRoom(workspaceId, roomId, { title, description });
        }
        setIsEditing(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/welcome');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (room && room.unreadCount && room.unreadCount > 0) {
            updateRoom(workspaceId, roomId, { unreadCount: 0 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, workspaceId, room?.unreadCount]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [room?.messages, isRimaTyping]);

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

    const toggleDashboard = () => {
        setViewMode(viewMode === 'chat' ? 'dashboard' : 'chat');
    };

    const handleSendMessage = async (content: string) => {
        if (!workspace || !room || !user) return;

        // Check if Rima is mentioned
        const mentionsRima = content.toLowerCase().includes('@rima');

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            content,
            sender: user,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        addRoomMessage(workspaceId, roomId, userMessage);

        // Clear unread count when user sends a message
        if (room.unreadCount && room.unreadCount > 0) {
            updateRoom(workspaceId, roomId, { unreadCount: 0 });
        }

        // If Rima is mentioned, process commands
        if (mentionsRima) {
            setIsRimaTyping(true);
            const lowerContent = content.toLowerCase();

            // Simulate "thinking" time
            setTimeout(async () => {
                let rimaResponseContent = "I heard you, but I'm not sure how to help with that yet.";
                const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let actionExecuted = false;

                // --- COMMAND: CREATE ROOM ---
                if (lowerContent.includes('create room') || lowerContent.includes('create channel')) {
                    const match = content.match(/create (?:room|channel) (.+)/i);
                    // Cleanup title: remove "called" or "named" if present (simple NLP)
                    let newRoomTitle = match ? match[1].replace(/\b(?:called|named)\b/gi, '').trim() : 'New Room';
                    // Remove potential punctuation
                    newRoomTitle = newRoomTitle.replace(/[.,?!]/g, '');

                    if (newRoomTitle) {
                        const newRoomId = `c_${Date.now()}`;
                        const newRoomObject = {
                            id: newRoomId,
                            title: newRoomTitle,
                            members: [user],
                            messages: [],
                            unreadCount: 0
                        };

                        // Update Workspace
                        const updatedRooms = [...workspace.rooms, newRoomObject];
                        updateWorkspace(workspaceId, { rooms: updatedRooms });

                        rimaResponseContent = `I've created the room "#${newRoomTitle}" for you.`;
                        actionExecuted = true;
                    }
                }

                // --- COMMAND: ADD MEMBER ---
                else if (lowerContent.includes('add member') || lowerContent.includes('add user') || (lowerContent.includes('add') && !lowerContent.includes('task'))) {
                    // Try to match specific names from constants
                    const targetName = systemUsers.find(u => lowerContent.includes(u.name.toLowerCase()));

                    if (targetName) {
                        // Check if already in room
                        if (room.members.some(m => m.id === targetName.id)) {
                            rimaResponseContent = `${targetName.name} is already in this room.`;
                        } else {
                            const updatedMembers = [...room.members, targetName];
                            updateRoom(workspaceId, roomId, { members: updatedMembers });
                            rimaResponseContent = `I've added ${targetName.name} to this conversation.`;
                        }
                        actionExecuted = true;
                    } else {
                        // Fallback heuristic for unknown name in mock
                        const match = content.match(/add\s+([A-Z][a-z]+)/); // Simple capitalize match
                        if (match) {
                            rimaResponseContent = `I couldn't find "${match[1]}" in the system users directory.`;
                        } else {
                            rimaResponseContent = "Who would you like me to add? Please specify their name.";
                        }
                    }
                }

                // --- COMMAND: SUMMARIZE ---
                else if (lowerContent.includes('summarize') || lowerContent.includes('summary') || lowerContent.includes('recap')) {
                    const recentMsgs = room.messages.slice(-10).map(m => `${m.sender === 'Rima' ? 'Rima' : (m.sender as User).name}: ${m.content}`).join('\n');

                    try {
                        const summary = await generateGeminiResponse(
                            "Please provide a concise summary of the recent conversation.",
                            `Recent messages:\n${recentMsgs}`
                        );
                        rimaResponseContent = summary;
                    } catch (error) {
                        console.error("Summary generation failed", error);
                        rimaResponseContent = "I'm having trouble accessing my summarization features right now.";
                    }
                    actionExecuted = true;
                }

                // Default Intelligent Response
                if (!actionExecuted) {
                    if (lowerContent.includes('hello') || lowerContent.includes('hi')) {
                        rimaResponseContent = `Hello ${user.name}! How can I help you manage this workspace today?`;
                    } else {
                        // Use Gemini for general chat if Rima is mentioned but no specific command matched
                        try {
                            const recentContext = room.messages.slice(-5).map(m => `${m.sender === 'Rima' ? 'Rima' : (m.sender as User).name}: ${m.content}`).join('\n');
                            const response = await generateGeminiResponse(content, `You are Rima, a helpful project assistant. User asked: ${content}. Context:\n${recentContext}`);
                            rimaResponseContent = response;
                        } catch (e) {
                            rimaResponseContent = `I'm analyzing the context of your request. I can help you **create rooms**, **add members**, or **summarize** discussions.`;
                        }
                    }
                }

                const rimaMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: rimaResponseContent,
                    sender: 'Rima',
                    timestamp
                };
                addRoomMessage(workspaceId, roomId, rimaMessage);
                setIsRimaTyping(false);
            }, 1200);
        }
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
                <div className="flex-shrink-0 min-h-16 flex items-center justify-between px-4 border-b border-subtle bg-app/80 backdrop-blur-md z-20">
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">

                        {/* Navigation Button: Back (Dashboard) or Sidebar Toggle (Chat) */}
                        {viewMode === 'dashboard' ? (
                            <button
                                onClick={() => setViewMode('chat')}
                                className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all shrink-0"
                                title="Back to Chat"
                            >
                                <CaretLeft size={24} weight="bold" />
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all shrink-0 md:hidden"
                            >
                                <List size={24} weight="bold" />
                            </button>
                        )}

                        <div className="flex flex-col min-w-0">
                            {/* Room Name - Top (Toggle Dashboard) */}
                            <div
                                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setViewMode('dashboard')}
                            >
                                {room.isPrivate ? <Lock size={16} className="text-muted shrink-0" /> : <Hash size={16} className="text-muted shrink-0" />}
                                <h1 className="text-base font-bold text-primary leading-tight truncate">
                                    {room.title}
                                </h1>
                            </div>
                            {/* Workspace Name - Bottom (Go to Workspace) */}
                            <span
                                className="text-[10px] uppercase font-bold text-muted truncate leading-none mt-0.5 cursor-pointer hover:text-primary transition-colors"
                                onClick={() => router.push(`/workspace/${workspaceId}`)}
                            >
                                {workspace.title}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* Toggle Dashboard/Chat Button */}
                        <button
                            onClick={toggleDashboard}
                            className={`p-2 rounded-xl transition-all ${viewMode === 'dashboard'
                                ? 'bg-surface text-primary'
                                : 'text-secondary hover:text-primary hover:bg-surface'
                                }`}
                            title={viewMode === 'chat' ? 'View Dashboard' : 'View Chat'}
                        >
                            {viewMode === 'chat' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM104,144a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path></svg>
                            ) : (
                                <ChatText size={24} weight="fill" />
                            )}
                        </button>

                        {/* Action Menu (Fixed Position in Navbar) */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-surface)] transition-all"
                            >
                                <DotsThreeVertical size={24} weight="bold" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-lg overflow-hidden z-50 animate-fade-in">
                                    <button
                                        onClick={() => {
                                            router.push(`/workspace/${workspaceId}`);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors flex items-center gap-3"
                                    >
                                        <House size={18} weight="bold" />
                                        View Workspace
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowInviteModal(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors flex items-center gap-3"
                                    >
                                        <UserPlus size={18} weight="bold" />
                                        Add Member
                                    </button>
                                    <div className="h-[1px] bg-[var(--border-subtle)] my-1" />
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setViewMode('dashboard'); // Force switch to dashboard view to see inputs
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors flex items-center gap-3"
                                    >
                                        <PencilSimple size={18} weight="bold" />
                                        Edit Room
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-3"
                                    >
                                        <Trash size={18} weight="bold" />
                                        Delete Room
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Participants Bar - Hide in Dashboard View and for Private Rooms */}
                {viewMode === 'chat' && !room.isPrivate && (
                    <div className="flex-shrink-0 z-10 border-b border-subtle bg-app/50 backdrop-blur-sm animate-fade-in">
                        <ParticipantsBar
                            members={room.members || []}
                            onParticipantClick={setSelectedProfileUser}
                            onInvitePeople={() => setShowInviteModal(true)}
                            onOverflowClick={() => setViewMode('dashboard')}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-hidden relative">
                    {/* Chat View */}
                    <div
                        className={`absolute inset-0 transition-all duration-300 ${viewMode === 'chat'
                            ? 'translate-y-0 opacity-100'
                            : '-translate-y-4 opacity-0 pointer-events-none'
                            }`}
                    >
                        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide pb-32 h-full">
                            {/* Rima Welcome - Empty State */}
                            {room.messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center px-8 animate-fade-in space-y-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center shadow-2xl shadow-[var(--primary)]/20 animate-fade-in ring-4 ring-[var(--bg-app)]">
                                        <Sparkle size={48} weight="fill" className="text-white" />
                                    </div>
                                    <div className="space-y-2 max-w-md">
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)]">Welcome to #{room.title}</h3>
                                        <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                                            I&apos;m <span className="font-bold text-[var(--primary)]">Rima</span>.
                                            This room is ready for collaboration. Direct message me or tag @Rima for help.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm opacity-60">
                                        <div className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)]">
                                            &quot;@Rima summarize this room&quot;
                                        </div>
                                    </div>
                                </div>
                            )}

                            {room.messages.map((msg, idx) => {
                                const isSelf = msg.sender !== 'Rima' && (msg.sender as User).id === user?.id;
                                const isRima = msg.sender === 'Rima';
                                const showAvatar = !isSelf && (idx === 0 || room.messages[idx - 1].sender !== msg.sender);

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex w-full animate-slide-up group relative ${isSelf ? 'justify-end' : 'justify-start items-end gap-3'}`}
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
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 px-1">
                                                    {isRima ? 'Rima Intelligence' : (msg.sender as User).name}
                                                </span>
                                            )}

                                            <div className={`relative px-5 py-4 shadow-sm transition-all ${isRima
                                                ? 'glass border-[var(--primary)]/20 text-primary rounded-[24px] rounded-bl-lg bg-gradient-to-br from-[var(--primary)]/5 to-transparent'
                                                : isSelf
                                                    ? 'bg-[var(--primary)] text-white rounded-[24px] rounded-br-lg font-medium shadow-lg shadow-[var(--primary)]/10'
                                                    : 'bg-card text-primary border border-subtle rounded-[24px] rounded-bl-lg'
                                                }`}>
                                                <div className="text-[15px] leading-relaxed whitespace-pre-wrap tracking-tight">
                                                    {msg.content}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-2 opacity-50">
                                                    <span className="text-[9px] font-bold uppercase">{msg.timestamp}</span>
                                                    {isSelf && <Checks size={12} weight="bold" className="animate-pulse" />}
                                                </div>
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
                                        <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}

                            <div ref={scrollRef} />
                        </div>
                    </div>

                    {/* Dashboard View */}
                    <div
                        className={`absolute inset-0 transition-all duration-300 ${viewMode === 'dashboard'
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-4 opacity-0 pointer-events-none'
                            }`}
                    >
                        <RoomDashboardView
                            room={room}
                            onInvitePeople={() => setShowInviteModal(true)}
                            onParticipantClick={setSelectedProfileUser}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            onSave={handleSaveRoom}
                        />
                    </div>
                </div>

                {/* Floating Chat Input - Only in Chat Mode */}
                {viewMode === 'chat' && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-6 pointer-events-none">
                        <ChatInput
                            onVoiceToggle={() => setShowVoiceOverlay(true)}
                            onSendMessage={handleSendMessage}
                            placeholder={`Message ${room.isPrivate ? '' : '#'}${room.title}...`}
                            members={room.members}
                        />
                    </div>
                )}
            </div>

            {/* Voice Overlay */}
            <VoiceOverlay isOpen={showVoiceOverlay} onClose={() => setShowVoiceOverlay(false)} />

            {/* Profile Modal */}
            {selectedProfileUser && (
                <ProfileCard
                    user={selectedProfileUser}
                    onClose={() => setSelectedProfileUser(null)}
                />
            )}

            {/* Invite Modal */}
            {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}

            {/* Delete Confirmation Modal */}
            {room && (
                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={handleDeleteRoom}
                    title="Delete Room"
                    message={`Are you sure you want to delete room "${room.title}"? This action cannot be undone.`}
                    isDestructive={true}
                    confirmText="Delete Room"
                />
            )}

            <style>{`
                .animate-spin-slow { animation: spin 4s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CaretLeft, Hash, Lock, Check, CaretDown, MagnifyingGlass, X, UserPlus, Eraser } from '@phosphor-icons/react';
import { useWorkspaceData } from '@/contexts';
import { Room } from '@/types';
import Background from '@/components/Background';
import Sidebar from '@/components/Sidebar';
import InviteModal from '@/components/InviteModal';

import { Suspense } from 'react';

function CreateRoomContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const workspaceId = searchParams.get('workspaceId');
    const { workspaces, updateWorkspace, systemUsers } = useWorkspaceData();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

    // UI States for Search and Accordion
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    const workspace = workspaces.find(p => p.id === workspaceId);

    // Use systemUsers to allow adding anyone, filter by search query
    const filteredMembers = systemUsers
        .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const toggleDescription = () => setIsDescriptionOpen(!isDescriptionOpen);

    const handleMemberToggle = (userId: string) => {
        setSelectedMemberIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    useEffect(() => {
        if (!workspaceId || !workspace) {
            router.push('/dashboard');
        }
    }, [workspaceId, workspace, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workspace || !name.trim()) return;

        setIsSubmitting(true);

        try {
            // Find selected user objects from systemUsers
            const selectedMembers = systemUsers.filter(u => selectedMemberIds.includes(u.id));

            const newRoom: Room = {
                id: `r_${Date.now()}`,
                title: name.trim(),
                description: description.trim(),
                isPrivate,
                members: selectedMembers,
                messages: [],
            };

            const updatedRooms = [...workspace.rooms, newRoom];
            updateWorkspace(workspace.id, { rooms: updatedRooms });

            setTimeout(() => {
                router.push(`/workspace/${workspace.id}`);
            }, 500);

        } catch (error) {
            console.error('Failed to create room', error);
            setIsSubmitting(false);
        }
    };

    if (!workspace) return null;

    return (
        <>
            <Background />
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                currentWorkspaceId={workspace.id}
            />

            <div className="relative z-10 h-screen flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 h-16 flex items-center gap-4 px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/80 backdrop-blur-sm">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
                    >
                        <CaretLeft size={24} weight="bold" />
                    </button>
                    <h1 className="text-lg font-bold text-[var(--text-primary)]">Create Room</h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <div className="max-w-xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Room Name</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                        {isPrivate ? <Lock size={20} /> : <Hash size={20} />}
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. marketing-updates"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all font-medium"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Description Accordion (Refined) */}
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={toggleDescription}
                                    className="flex items-center justify-between w-full text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors group"
                                >
                                    <span>Description (Optional)</span>
                                    <CaretDown
                                        size={16}
                                        className={`transition-transform duration-300 ${isDescriptionOpen ? 'rotate-180' : ''} group-hover:text-[var(--primary)]`}
                                    />
                                </button>

                                {isDescriptionOpen && (
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="What's this room about?"
                                        className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all font-medium resize-none h-32 animate-fade-in"
                                    />
                                )}
                            </div>

                            {/* Privacy Switch */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isPrivate ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'}`}>
                                        <Lock size={20} weight={isPrivate ? 'fill' : 'regular'} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)]">Private Room</h3>
                                        <p className="text-sm text-[var(--text-secondary)]">Only invited members can view this room</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsPrivate(!isPrivate)}
                                    className={`w-14 h-8 rounded-full transition-colors relative ${isPrivate ? 'bg-[var(--primary)]' : 'bg-[var(--border-subtle)]'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {/* Add Members Section */}
                            {!isPrivate && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <label className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Add Members</label>
                                            {selectedMemberIds.length > 0 && (
                                                <span className="text-xs font-bold text-[var(--primary)]">{selectedMemberIds.length} selected</span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowInviteModal(true)}
                                            className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-surface)]"
                                            title="Invite via Email"
                                        >
                                            <UserPlus size={20} />
                                        </button>
                                    </div>

                                    {/* Selected Members Badges - Horizontal Scroll */}
                                    {selectedMemberIds.length > 0 && (
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-thin scrollbar-thumb-[var(--border-subtle)] scrollbar-track-transparent">
                                            {/* Clear All Button */}
                                            <button
                                                onClick={() => setSelectedMemberIds([])}
                                                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-[var(--text-muted)] hover:text-red-500 transition-colors mr-2 sticky left-0 z-10"
                                                title="Clear all"
                                            >
                                                <Eraser size={18} weight="bold" />
                                            </button>

                                            {systemUsers.filter(m => selectedMemberIds.includes(m.id)).map(member => (
                                                <div key={member.id} className="flex-shrink-0 flex items-center gap-1 pl-1 pr-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full border border-[var(--primary)]/20 animate-fade-in transition-all">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${member.avatarColor}`}>
                                                        {member.name[0]}
                                                    </div>
                                                    <span className="text-xs font-bold whitespace-nowrap">{member.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMemberToggle(member.id)}
                                                        className="ml-1 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={12} weight="bold" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden flex flex-col transition-all">
                                        {/* Search Header - Blended */}
                                        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                                            <div className="flex items-center gap-3 text-[var(--text-muted)]">
                                                <MagnifyingGlass size={18} />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onFocus={() => setIsSearchFocused(true)}
                                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                                    placeholder="Search to add members..."
                                                    className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none font-medium"
                                                />
                                            </div>
                                        </div>

                                        {/* Scrollable List - Show when typing OR focused */}
                                        {(searchQuery.length > 0 || isSearchFocused) && (
                                            <div
                                                className="flex-1 overflow-y-scroll p-2 space-y-1 max-h-[250px] animate-fade-in"
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {filteredMembers.map(member => (
                                                    <div
                                                        key={member.id}
                                                        className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer group ${selectedMemberIds.includes(member.id) ? 'bg-[var(--primary)]/5' : 'hover:bg-[var(--bg-surface)]'}`}
                                                        onClick={() => handleMemberToggle(member.id)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${member.avatarColor}`}>
                                                                {member.name[0]}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className={`text-sm font-bold ${selectedMemberIds.includes(member.id) ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}>{member.name}</span>
                                                                <span className="text-xs text-[var(--text-muted)]">{member.role || 'User'}</span>
                                                            </div>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedMemberIds.includes(member.id) ? 'bg-[var(--primary)] border-[var(--primary)] text-white scale-110' : 'border-[var(--border-subtle)] group-hover:border-[var(--primary)]'}`}>
                                                            {selectedMemberIds.includes(member.id) && <Check size={14} weight="bold" />}
                                                        </div>
                                                    </div>
                                                ))}
                                                {filteredMembers.length === 0 && (
                                                    <div className="p-8 text-center text-[var(--text-muted)] text-sm">
                                                        No members found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!name.trim() || isSubmitting}
                                className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[var(--primary)]/20"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Room'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
        </>
    );
}

export default function CreateRoomPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateRoomContent />
        </Suspense>
    );
}

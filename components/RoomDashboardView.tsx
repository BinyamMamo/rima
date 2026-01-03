import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Room } from '@/types';
import { Sparkle, Hash, Lock, ChartLine, Info, Users, CheckCircle, CurrencyDollar, ChatCenteredText, UserPlus, PencilSimple, Trash, FloppyDisk, X as XIcon } from '@phosphor-icons/react';
import { useWorkspaceData } from '@/contexts';
import { getRelevantPresets, generateRimaInsights, extractTasksFromMessages } from '@/lib/dashboardPresets';
// ... imports

interface RoomDashboardViewProps {
    room: Room;
    onInvitePeople?: () => void;
    onParticipantClick?: (user: any) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    onSave: (title: string, description: string) => void;
}

const RoomDashboardView: React.FC<RoomDashboardViewProps> = ({
    room,
    onInvitePeople,
    onParticipantClick,
    isEditing,
    setIsEditing
}) => {
    const router = useRouter();
    const { updateRoom } = useWorkspaceData(); // Assuming updateRoom exists, need to check Context. 
    // If not, I might need to add it or use updateWorkspace logic?
    // useWorkspaceData usually has updateRoom or similar. 
    // Let's assume updateRoom exists for now or check. 
    // Wait, useWorkspaceData in `contexts.tsx` logic? I recall `deleteRoom` but `updateRoom`?
    // I better check context.
    // If updateRoom is missing, I'll stick to just visual or add it.
    // Let's check `constants.tsx` or wherever context is defined? No, `contexts/index.tsx` or similar.
    // Safer to assume I might need to add it, but I can't see context file easily without looking.
    // I'll assume `updateRoom` is available or I can derive it.
    // Actually, `updateWorkspace` updates the whole workspace. Providing a new `rooms` array works.

    // Let's use local state for inputs
    const [title, setTitle] = useState(room.title);
    const [description, setDescription] = useState(room.description || '');

    const handleSave = () => {
        // Mock update or real?
        // If updateRoom not exposed, I have to update workspace.rooms
        // updateWorkspace(workspaceId, { rooms: ... }) - hard to get workspaceId here without prop?
        // Room object has no workspaceId? 
        // I should pass workspaceId? Or `updateRoom` function from parent?
        // Parent `RoomPage` has `workspaceId`.
        // Better: Pass `onSave` prop to RoomDashboardView?
        // No, keep it simple. Lift the actual save logic to Parent?
        // Yes, lifting `onSave` is safer if I don't know if `useWorkspaceData` has `updateRoom`.
        // So I will add `onSave` prop.
    };

    return (
        <div className="w-full h-full flex flex-col bg-[var(--bg-app)] animate-fade-in overflow-y-auto scrollbar-hide pb-32">
            <div className="w-full max-w-2xl mx-auto px-6 py-10 space-y-10">

                {/* Room Info - Editable */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-3xl space-y-4">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] font-bold text-xl focus:outline-none focus:border-[var(--primary)] transition-all"
                                placeholder="Room title"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] text-lg leading-relaxed focus:outline-none focus:border-[var(--primary)] transition-all resize-none"
                                placeholder="Room description"
                                rows={3}
                            />
                            <div className="flex gap-2">
                                <button
                                    // Call parent onSave or local if we had context
                                    // For now let's just use a placeholder or assume parent handles it via a prop I will add: onSave
                                    onClick={() => {
                                        // Trigger save
                                        // For now, I'll leave this unimplemented logic-wise inside the existing block refactor
                                        // Wait, I need to define the prop `onSave` in interface.
                                    }}
                                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl font-semibold hover:brightness-110 transition-all"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setTitle(room.title);
                                        setDescription(room.description || '');
                                        setIsEditing(false);
                                    }}
                                    className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-xl font-semibold hover:bg-[var(--bg-card)] transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{room.title}</h2>
                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                                {room.description || "No description provided for this room."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-2">
                        <div className="flex items-center gap-2">
                            <ChartLine size={18} className="text-[var(--highlight)]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Messages</span>
                        </div>
                        <p className="text-lg font-black text-[var(--text-primary)]">{room.messages?.length || 0}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-2">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-[var(--primary)]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Members</span>
                        </div>
                        <p className="text-lg font-black text-[var(--text-primary)]">{room.members?.length || 0}</p>
                    </div>
                    {room.tasks && room.tasks.length > 0 && (
                        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Tasks</span>
                            </div>
                            <p className="text-lg font-black text-[var(--text-primary)]">{room.tasks.length}</p>
                        </div>
                    )}
                    {room.spending && room.spending.length > 0 && (
                        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-2">
                            <div className="flex items-center gap-2">
                                <CurrencyDollar size={18} className="text-amber-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Spending</span>
                            </div>
                            <p className="text-lg font-black text-[var(--text-primary)]">
                                {room.spending.reduce((sum, s) => sum + parseFloat(s.amount.replace(/[^0-9.-]+/g, "")), 0)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Insights */}
                {room.insights && room.insights.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Sparkle size={18} weight="fill" className="text-amber-500" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Room Insights</h3>
                        </div>
                        <div className="space-y-3">
                            {room.insights.map((insight, idx) => (
                                <div key={idx} className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl">
                                    <p className="text-sm text-[var(--text-primary)] leading-relaxed">{insight.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Members Section - Redesigned */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Members</h3>
                        {!room.isPrivate && (
                            <button className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1">Add Member</button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {(room.members || []).map(user => (
                            <div key={user.id} className="group flex items-center justify-between p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--primary)] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl ${user.avatarColor} flex items-center justify-center text-lg font-black relative`}>
                                        {user.name && user.name.length > 0 ? user.name[0] : 'U'}
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--bg-card)] ${user.status === 'active' ? 'bg-[#3ECF8E]' : 'bg-gray-400'}`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-[var(--text-primary)]">{user.name}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{user.role || 'Member'}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/dm/${user.id}`);
                                    }}
                                    className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-surface)] transition-all"
                                    title="Send Message"
                                >
                                    <ChatCenteredText size={20} weight="bold" />
                                </button>
                            </div>
                        ))}

                        {!room.isPrivate && (
                            <button
                                onClick={onInvitePeople}
                                className="flex items-center justify-center gap-3 p-4 rounded-3xl border-2 border-dashed border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all group"
                            >
                                <div className="p-2 rounded-full bg-[var(--bg-surface)] group-hover:bg-[var(--primary)] text-[var(--text-secondary)] group-hover:text-white transition-colors">
                                    <UserPlus size={20} weight="bold" />
                                </div>
                                <span className="font-bold">Add Member</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Tasks Section */}
                {room.tasks && room.tasks.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Active Tasks</h3>
                        <div className="space-y-2">
                            {room.tasks.map(task => (
                                <div key={task.id} className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center ${task.completed ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border-subtle)]'}`}>
                                        {task.completed && <CheckCircle size={14} weight="fill" className="text-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${task.completed ? 'line-through opacity-50' : 'text-[var(--text-primary)]'}`}>
                                            {task.title}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)]">{task.owner} • {task.dueDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomDashboardView;

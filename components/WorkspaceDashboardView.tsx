
import React, { useState, useEffect } from 'react';
import { Workspace, Insight } from '@/types';
import {
    FileText, CurrencyDollar, Hourglass, Users, CheckCircle, Lock, Hash, Plus, Trash, PencilSimple, DotsThreeVertical, X, Sparkle,
    CurrencyCircleDollar, Calendar, UsersThree, CheckSquare, TrendUp, Receipt,
    Question, Warning, WarningCircle, Clock, XCircle, ChatCircleDots,
    Icon
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { useWorkspaceData } from '@/contexts';
import { getRelevantPresets, generateRimaInsights, extractTasksFromMessages } from '@/lib/dashboardPresets';

// Icon mapping function
const getIcon = (iconName: string): Icon => {
    const iconMap: Record<string, Icon> = {
        'CurrencyCircleDollar': CurrencyCircleDollar,
        'Calendar': Calendar,
        'UsersThree': UsersThree,
        'CheckSquare': CheckSquare,
        'TrendUp': TrendUp,
        'Receipt': Receipt,
        'Question': Question,
        'Warning': Warning,
        'WarningCircle': WarningCircle,
        'Clock': Clock,
        'XCircle': XCircle,
        'ChatCircleDots': ChatCircleDots,
        'Sparkle': Sparkle,
    };
    return iconMap[iconName] || Sparkle; // Fallback to Sparkle if icon not found
};

interface WorkspaceDashboardViewProps {
    workspace: Workspace;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    rimaInsights: Insight[];
    setRimaInsights: (insights: Insight[]) => void;
    onGenerateInsights: () => void;
    isGeneratingInsights: boolean;
}

const WorkspaceDashboardView: React.FC<WorkspaceDashboardViewProps> = ({
    workspace,
    isEditing,
    setIsEditing,
    rimaInsights,
    setRimaInsights,
    onGenerateInsights,
    isGeneratingInsights
}) => {
    const router = useRouter();
    const { updateWorkspace, deleteWorkspace, deleteRoom } = useWorkspaceData();
    // Lifted state: showMenu removed (moved to Navbar). isEditing lifted. Insights lifted.

    const [workspaceTitle, setWorkspaceTitle] = useState(workspace.title);
    const [workspaceDescription, setWorkspaceDescription] = useState(workspace.description);
    // rimaInsights lifted
    // isGeneratingInsights managed by parent or here?
    // Actually, distinct generation logic might stay here if triggered via prop ref?
    // Or cleaner: Parent handles generation logic? Parent doesn't have `generateRimaInsights` import yet.
    // Let's keep generation logic here but triggered? No, User wants button in Navbar.
    // So Parent MUST have generation logic.
    // I will remove `isGeneratingInsights` and `handleGenerateInsights` from here and expect parent to handle it.
    // Parent passes `rimaInsights`.

    const [extractedTasks, setExtractedTasks] = useState<any[]>([]);

    const handleSave = () => {
        updateWorkspace(workspace.id, {
            title: workspaceTitle,
            description: workspaceDescription,
        });
        setIsEditing(false);
    };

    const handleDeleteRoom = (roomId: string, roomTitle: string) => {
        if (confirm(`Are you sure you want to delete room "${roomTitle}"?`)) {
            deleteRoom(workspace.id, roomId);
        }
    };

    // Extract tasks from all messages in workspace and rooms
    useEffect(() => {
        const allMessages = [
            ...workspace.messages,
            ...workspace.rooms.flatMap(r => r.messages),
        ];
        const tasks = extractTasksFromMessages(allMessages);
        setExtractedTasks(tasks);
    }, [workspace]);

    // Get relevant presets for this workspace
    const relevantPresets = getRelevantPresets(workspace);

    return (
        <div className="h-full overflow-y-auto px-6 py-8 space-y-8 pb-32 animate-fade-in">
            {/* Header / Actions Row has been moved to Navbar */}

            {/* Workspace Info - Editable */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-3xl space-y-4">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={workspaceTitle}
                            onChange={(e) => setWorkspaceTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] font-bold text-xl focus:outline-none focus:border-[var(--primary)] transition-all"
                            placeholder="Workspace title"
                        />
                        <textarea
                            value={workspaceDescription}
                            onChange={(e) => setWorkspaceDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] text-lg leading-relaxed focus:outline-none focus:border-[var(--primary)] transition-all resize-none"
                            placeholder="Workspace description"
                            rows={3}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl font-semibold hover:brightness-110 transition-all"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => {
                                    setWorkspaceTitle(workspace.title);
                                    setWorkspaceDescription(workspace.description);
                                    setIsEditing(false);
                                }}
                                className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded-xl font-semibold hover:bg-[var(--bg-card)] transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                        {workspace.description || "No description provided for this workspace."}
                    </p>
                )}
            </div>

            {/* Dynamic Stats Grid - Only Show Relevant Presets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relevantPresets.map(preset => {
                    const data = preset.renderData(workspace);
                    const IconComponent = getIcon(preset.icon);
                    return (
                        <div key={preset.id} className="p-8 rounded-[32px] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-4 hover:border-[var(--primary)] transition-colors group">
                            <IconComponent size={48} weight="fill" className="text-[var(--primary)]" />
                            <div>
                                <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
                                    {data.value}
                                </h3>
                                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1 block">
                                    {data.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* RIMA Insights Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkle size={24} weight="fill" className="text-[var(--primary)]" />
                        <h3 className="text-xl font-bold text-[var(--text-primary)]">RIMA Insights</h3>
                    </div>
                </div>
                {rimaInsights.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rimaInsights.map((insight, idx) => {
                            const IconComponent = getIcon(insight.icon);
                            return (
                                <div
                                    key={idx}
                                    className="p-6 rounded-3xl bg-gradient-to-br from-[var(--primary)]/5 to-transparent border border-[var(--primary)]/20 animate-fade-in"
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    <div className="flex items-start gap-3">
                                        <IconComponent size={24} weight="fill" className="text-[var(--primary)] shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-[var(--text-primary)] leading-relaxed">{insight.text}</p>
                                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mt-2 block">
                                                {insight.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-12 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center">
                        <Sparkle size={48} weight="fill" className="text-[var(--text-muted)] mx-auto mb-4" />
                        <p className="text-[var(--text-secondary)] mb-4">Click below to let RIMA analyze this workspace</p>
                        <button
                            onClick={onGenerateInsights}
                            disabled={isGeneratingInsights}
                            className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            {isGeneratingInsights ? 'Generating...' : 'Generate Insights'}
                        </button>
                    </div>
                )}
            </div>

            {/* Extracted Tasks from Conversations */}
            {extractedTasks.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Tasks from Conversations</h3>
                    <div className="space-y-2">
                        {extractedTasks.map(task => (
                            <div key={task.id} className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex items-center gap-3 hover:border-[var(--primary)] transition-all">
                                <CheckCircle size={20} className="text-[var(--text-muted)]" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-[var(--text-primary)]">{task.title}</p>
                                    <p className="text-xs text-[var(--text-muted)]">Mentioned by {task.owner}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rooms List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Rooms</h3>
                    <button
                        onClick={() => router.push(`/create-room?workspaceId=${workspace.id}`)}
                        className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl font-bold text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)] transition-all flex items-center gap-2"
                    >
                        <Plus size={16} weight="bold" />
                        Add Room
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workspace.rooms.map(room => (
                        <div
                            key={room.id}
                            className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--primary)] transition-all group flex items-center gap-4 relative"
                        >
                            <div
                                onClick={() => router.push(`/workspace/${workspace.id}/room/${room.id}`)}
                                className="flex items-center gap-4 flex-1 cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">
                                    {room.isPrivate ? <Lock size={20} weight="fill" /> : <Hash size={20} weight="regular" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-[var(--text-primary)]">{room.title}</h4>
                                    <p className="text-xs text-[var(--text-muted)] line-clamp-1">{room.description || 'No description'}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRoom(room.id, room.title);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all"
                                title="Delete room"
                            >
                                <Trash size={16} weight="bold" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkspaceDashboardView;

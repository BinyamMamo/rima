'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CaretLeft, Chats, CheckCircle, Hash } from '@phosphor-icons/react';
import { SYSTEM_USERS, INITIAL_PROJECTS } from '@/constants';
import { User, Project, Task, Channel } from '@/types';

const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function PersonDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const user = SYSTEM_USERS.find(u => u.id === userId);

    if (!user) {
        return <div className="p-8 text-center text-[var(--text-secondary)]">User not found</div>;
    }

    // Derive Data
    const sharedChannels: { project: Project; channel: Channel }[] = [];
    const assignedTasks: { project: Project; task: Task }[] = [];

    INITIAL_PROJECTS.forEach(project => {
        // Check project channels
        project.channels.forEach(channel => {
            if (channel.members.some(m => m.id === user.id)) {
                sharedChannels.push({ project, channel });
            }
        });

        // Check project tasks
        if (project.tasks) {
            project.tasks.forEach(task => {
                if (task.owner === user.name) {
                    assignedTasks.push({ project, task });
                }
            });
        }
    });

    return (
        <div className="min-h-screen bg-[var(--bg-app)] flex flex-col">
            {/* Header */}
            <div className="flex items-center px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/50 backdrop-blur-md sticky top-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
                >
                    <CaretLeft size={24} weight="bold" />
                </button>
                <h1 className="ml-4 text-lg font-bold text-[var(--text-primary)]">Profile Details</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                {/* Profile Card */}
                <div className="flex flex-col items-center p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm">
                    <div className={`w-24 h-24 rounded-3xl ${user.avatarColor} flex items-center justify-center text-4xl font-black shadow-lg relative mb-4`}>
                        {getInitials(user.name)}
                        <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-[var(--bg-card)] ${user.status === 'active' ? 'bg-[#3ECF8E]' : user.status === 'away' ? 'bg-[#F59E0B]' : 'bg-[#94A3B8]'
                            }`} />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">{user.name}</h2>
                    <span className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">{user.role}</span>

                    <div className="flex gap-4 mt-6 w-full max-w-xs">
                        <button
                            onClick={() => router.push(`/dm/${user.id}`)}
                            className="flex-1 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/20"
                        >
                            Message
                        </button>
                    </div>
                </div>

                {/* Bio / Activity */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)] px-1">Current Status</h3>
                    <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                        <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                            {user.recentActivity ? `Currently working on: ${user.recentActivity}` : 'No recent activity logged.'}
                        </p>
                    </div>
                </div>

                {/* Involvement */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">Shared Channels</h3>
                        <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 py-1 rounded-lg">{sharedChannels.length}</span>
                    </div>

                    {sharedChannels.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {sharedChannels.map((item, idx) => (
                                <div
                                    key={`${item.project.id}-${item.channel.id}-${idx}`}
                                    onClick={() => router.push(`/project/${item.project.id}?channel=${item.channel.id}`)}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--bg-surface)] transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors">
                                        <Hash size={20} weight="bold" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[var(--text-primary)] font-bold group-hover:text-[var(--primary)] transition-colors">{item.channel.title}</span>
                                            <span className="text-[var(--text-muted)] text-xs">• {item.project.title}</span>
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-1">{item.channel.description || 'No description'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-[var(--text-muted)] italic">No shared channels</div>
                    )}
                </div>

                {/* Tasks */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">Assigned Tasks</h3>
                        <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 py-1 rounded-lg">{assignedTasks.length}</span>
                    </div>

                    {assignedTasks.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {assignedTasks.map((item, idx) => (
                                <div key={`${item.task.id}-${idx}`} className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.task.completed ? 'border-[var(--primary)] bg-[var(--primary)] text-white' : 'border-[var(--text-muted)]'}`}>
                                        {item.task.completed && <CheckCircle size={14} weight="fill" />}
                                    </div>
                                    <div className="flex-1">
                                        <span className={`block font-bold ${item.task.completed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>{item.task.title}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 py-0.5 rounded">{item.project.title}</span>
                                            <span className="text-xs text-[var(--text-muted)]">Due: {item.task.dueDate}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-[var(--text-muted)] italic">No active tasks assigned</div>
                    )}
                </div>

            </div>
        </div>
    );
}

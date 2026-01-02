
import React from 'react';
import { Project } from '@/types';
import { FileText, CurrencyDollar, Hourglass, Users, CheckCircle } from '@phosphor-icons/react';

interface ProjectDashboardViewProps {
    project: Project;
}

const ProjectDashboardView: React.FC<ProjectDashboardViewProps> = ({ project }) => {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 pb-32 animate-fade-in">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-branding font-bold text-[var(--text-primary)]">Overview</h2>
                <button className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/20">
                    <FileText size={20} weight="fill" />
                    <span>Generate Report</span>
                </button>
            </div>

            {/* Description */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-3xl">
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                    {project.description || "No description provided for this workspace."}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budget Card */}
                <div className="p-8 rounded-[32px] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-4 hover:border-[var(--primary)] transition-colors group">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform">
                        <CurrencyDollar size={32} weight="duotone" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
                            {project.budget || "€0"}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1 block">
                            Budget
                        </span>
                    </div>
                </div>

                {/* Deadline Card */}
                <div className="p-8 rounded-[32px] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-4 hover:border-[var(--primary)] transition-colors group">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform">
                        <Hourglass size={32} weight="duotone" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                            {project.deadline || "Ongoing"}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1 block">
                            Deadline
                        </span>
                    </div>
                </div>

                {/* Team Card */}
                <div className="p-8 rounded-[32px] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-4 hover:border-[var(--primary)] transition-colors group">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform">
                        <Users size={32} weight="duotone" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
                            {project.members.length}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1 block">
                            Team Members
                        </span>
                    </div>
                </div>

                {/* Tasks Card */}
                <div className="p-8 rounded-[32px] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-4 hover:border-[var(--primary)] transition-colors group">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform">
                        <CheckCircle size={32} weight="duotone" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
                            {project.tasks?.length || 0}
                        </h3>
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1 block">
                            Active Tasks
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDashboardView;

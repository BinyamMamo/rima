'use client';

import React from 'react';
import { Project, ThemeColor } from '@/types';
import { Hash, CaretRight, Clock, Folders } from '@phosphor-icons/react';

interface WorkspaceCardProps {
  workspace: Project;
  subProjects?: Project[];
  onClick: () => void;
  onChannelClick?: (channelId: string) => void;
  onSubProjectClick?: (projectId: string) => void;
}

const themeStyles: Record<ThemeColor, {
  accent: string;
  light: string;
}> = {
  teal: { accent: 'bg-[#3ECF8E]', light: 'text-[#3ECF8E]' },
  emerald: { accent: 'bg-[#10B981]', light: 'text-[#10B981]' },
  rust: { accent: 'bg-[#EA580C]', light: 'text-[#EA580C]' },
  gold: { accent: 'bg-[#F59E0B]', light: 'text-[#F59E0B]' },
  obsidian: { accent: 'bg-[#3F3F46]', light: 'text-[#3F3F46]' },
  indigo: { accent: 'bg-[#6366F1]', light: 'text-[#6366F1]' },
  rose: { accent: 'bg-[#FF8FAB]', light: 'text-[#FF8FAB]' },
  sky: { accent: 'bg-[#0EA5E9]', light: 'text-[#0EA5E9]' },
  violet: { accent: 'bg-[#6C63FF]', light: 'text-[#6C63FF]' },
  slate: { accent: 'bg-[#64748B]', light: 'text-[#64748B]' },
};

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  subProjects = [],
  onClick,
  onChannelClick,
  onSubProjectClick
}) => {
  const styles = themeStyles[workspace.theme] || themeStyles.obsidian;

  const sortedChannels = [...workspace.channels].sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0));

  return (
    <div
      className="group relative flex flex-col bg-card border border-subtle rounded-3xl transition-all overflow-hidden cursor-pointer hover:border-[var(--primary)] hover:shadow-lg"
      onClick={onClick}
    >
      <div className="p-7 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 flex-1 min-w-0 pr-4">
            <h3 className="text-xl font-bold tracking-tight truncate group-hover:text-[var(--primary)] transition-colors">
              {workspace.title}
            </h3>
            <p className="text-sm text-secondary line-clamp-2 font-medium leading-relaxed opacity-80">
              {workspace.description}
            </p>
          </div>
          <div className={`shrink-0 w-12 h-12 rounded-2xl ${styles.accent} flex items-center justify-center text-white shadow-lg`}>
            <span className="text-lg font-bold">{workspace.title[0]}</span>
          </div>
        </div>

        <div className="space-y-2">
          {subProjects.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {subProjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubProjectClick?.(sub.id);
                  }}
                  className="flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--primary)] hover:text-white transition-all text-xs font-bold relative group/chip"
                >
                  <Folders size={14} className="text-[var(--text-muted)] group-hover/chip:text-white transition-colors" />
                  <span className="text-[var(--text-primary)] group-hover/chip:text-white transition-colors whitespace-nowrap">{sub.title}</span>
                </button>
              ))}
            </div>
          )}

          {sortedChannels.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {sortedChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChannelClick?.(channel.id);
                  }}
                  className="flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--primary)] hover:text-white transition-all text-xs font-bold relative group/chip"
                >
                  <Hash size={14} className="text-[var(--text-muted)] group-hover/chip:text-white transition-colors" />
                  <span className="text-[var(--text-primary)] group-hover/chip:text-white transition-colors whitespace-nowrap">{channel.title}</span>
                  {(channel.unreadCount || 0) > 0 && (
                    <span className={`flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full ${styles.accent} text-white text-[10px] font-bold shadow-sm group-hover/chip:bg-white group-hover/chip:text-[var(--primary)] transition-colors`}>
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-5 border-t border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-secondary">
            <Clock size={18} weight="bold" />
            <span className="text-xs font-bold">{workspace.deadline || 'Updated recently'}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <div className="w-20 h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                <div className={`h-full ${styles.accent} transition-all duration-1000 ease-out`} style={{ width: `${workspace.progress || 0}%` }} />
              </div>
            </div>
            <div className="p-2 rounded-full bg-[var(--border-subtle)] text-secondary group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
              <CaretRight size={16} weight="bold" />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default WorkspaceCard;

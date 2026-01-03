
import React from 'react';
import { Project, ThemeColor } from '../types';
import { Hash, CaretRight, Clock } from "@phosphor-icons/react";

interface WorkspaceCardProps {
  workspace: Project;
  onClick: () => void;
  onChannelClick: (channelId: string) => void;
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

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace, onClick, onChannelClick }) => {
  const styles = themeStyles[workspace.theme] || themeStyles.obsidian;

  return (
    <div
      className={`group relative flex flex-col m3-card transition-all overflow-hidden cursor-pointer`}
      onClick={onClick}
    >
      <div className="p-7 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 flex-1 min-w-0 pr-4">
            <h3 className="text-xl font-bold tracking-tight truncate group-hover:text-[var(--primary)] transition-colors">{workspace.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 font-medium leading-relaxed opacity-80">{workspace.description}</p>
          </div>
          <div className={`shrink-0 w-12 h-12 rounded-2xl ${styles.accent} flex items-center justify-center text-white shadow-lg`}>
            <span className="text-lg font-bold">{workspace.title[0]}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {workspace.channels.slice(0, 2).map((channel) => (
            <button
              key={channel.id}
              onClick={(e) => {
                e.stopPropagation();
                onChannelClick(channel.id);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--border-subtle)] hover:bg-[var(--primary)] hover:text-white transition-all text-sm font-medium"
            >
              <Hash size={14} className="opacity-50" />
              <span>{channel.title}</span>
            </button>
          ))}
          {workspace.channels.length > 2 && (
            <div className="flex items-center px-3 text-xs text-[var(--text-muted)] font-bold">
              +{workspace.channels.length - 2} more
            </div>
          )}
        </div>

        <div className="pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
            <Clock size={18} weight="bold" />
            <span className="text-xs font-bold">{workspace.deadline || 'Updated recently'}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <div className="w-20 h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                <div className={`h-full ${styles.accent} transition-all duration-1000 ease-out`} style={{ width: `${workspace.progress || 0}%` }} />
              </div>
            </div>
            <div className="p-2 rounded-full bg-[var(--border-subtle)] text-[var(--text-secondary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
              <CaretRight size={16} weight="bold" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;

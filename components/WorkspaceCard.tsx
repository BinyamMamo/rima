'use client';

import React from 'react';
import { Workspace, ThemeColor } from '@/types';
import { Hash, CaretRight, Clock, Folders, Lock } from '@phosphor-icons/react';

interface WorkspaceCardProps {
  workspace: Workspace;
  subWorkspaces?: Workspace[];
  onClick: () => void;
  onRoomClick?: (roomId: string) => void;
  onSubWorkspaceClick?: (workspaceId: string) => void;
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
  subWorkspaces = [],
  onClick,
  onRoomClick,
  onSubWorkspaceClick
}) => {
  const styles = themeStyles[workspace.theme] || themeStyles.obsidian;

  // Sort rooms by a visual weight metric (length of title + unread count) - logic from previous edit
  const sortedRooms = [...workspace.rooms].sort((a, b) => (b.title + (b.unreadCount || '').toString() || '').length - (a.title + (a.unreadCount || '').toString() || '').length);

  return (
    <div
      className="group relative flex flex-col bg-card border border-subtle rounded-3xl transition-all overflow-hidden cursor-pointer hover:border-[var(--primary)]"
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

          {/* Member Badges or Lock Icon */}
          {workspace.isPrivate ? (
            <div className={`shrink-0 w-12 h-12 rounded-2xl ${styles.accent} flex items-center justify-center text-white`}>
              <Lock size={20} weight="fill" />
            </div>
          ) : (
            <div className="flex -space-x-3 isolate">
              {workspace.members.slice(0, 3).map((member, i) => (
                <div
                  key={member.id}
                  className={`w-10 h-10 rounded-full border-2 border-[var(--bg-card)] ${member.avatarColor || 'bg-gray-400'} flex items-center justify-center text-[12px] font-bold text-white relative z-[${3 - i}]`}
                  title={member.name}
                >
                  {member.name[0]}
                </div>
              ))}
              {workspace.members.length > 3 && (
                <div className="w-10 h-10 rounded-full border-2 border-[var(--bg-card)] bg-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)] relative z-0">
                  +{workspace.members.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          {sortedRooms.length > 0 && (
            <div className="flex gap-2 flex-wrap pb-1">
              {sortedRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoomClick?.(room.id);
                  }}
                  className="flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--primary)] hover:text-white transition-all text-xs font-bold relative group/chip"
                >
                  <Hash size={14} className="text-[var(--text-muted)] group-hover/chip:text-white transition-colors" />
                  <span className="text-[var(--text-primary)] group-hover/chip:text-white transition-colors whitespace-nowrap">{room.title}</span>
                  {(room.unreadCount || 0) > 0 && (
                    <span className={`flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full ${styles.accent} text-white text-[10px] font-bold shadow-sm group-hover/chip:bg-white group-hover/chip:text-[var(--primary)] transition-colors`}>
                      {room.unreadCount}
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


import React from 'react';
import { User } from '../types';
import { PlusCircle, Sparkle } from "@phosphor-icons/react";

interface ParticipantsBarProps {
  members: User[];
  onParticipantClick: (user: User) => void;
  onInvitePeople: () => void;
}

const ParticipantsBar: React.FC<ParticipantsBarProps> = ({ members, onParticipantClick, onInvitePeople }) => {
  return (
    <div className="w-full h-14 flex items-center gap-2 px-4 bg-[var(--bg-app)]/40 backdrop-blur-md border-b border-[var(--border-subtle)] overflow-x-auto scrollbar-hide z-30 shrink-0">
      <div className="flex items-center gap-1.5 min-w-max">
        {/* RIMA Always Present in Spirit */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 shadow-sm">
          <div className="w-6 h-6 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white">
            <Sparkle size={14} weight="fill" className="animate-pulse" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--primary)]">RIMA AI</span>
        </div>

        <div className="w-[1px] h-6 bg-[var(--border-subtle)] mx-2" />

        {members.map(user => (
          <button
            key={user.id}
            onClick={() => onParticipantClick(user)}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--primary)] transition-all hover:scale-105"
          >
            <div className={`w-6 h-6 rounded-lg ${user.avatarColor} flex items-center justify-center text-[10px] font-black relative`}>
              {user.name[0]}
              {user.status === 'active' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#3ECF8E] border-2 border-[var(--bg-card)]" />
              )}
            </div>
            <div className="flex flex-col items-start leading-none pr-1">
              <span className="text-[11px] font-bold text-[var(--text-primary)]">{user.name}</span>
              <span className="text-[8px] font-black uppercase tracking-tight text-[var(--text-muted)] group-hover:text-[var(--primary)]">{user.role?.split(' ')[0] || 'Member'}</span>
            </div>
          </button>
        ))}

        <button 
          onClick={onInvitePeople}
          className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-dashed border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all"
        >
          <PlusCircle size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
};

export default ParticipantsBar;

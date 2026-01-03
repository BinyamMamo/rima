
import React from 'react';
import { User } from '../types';
import { PlusCircle, Sparkle } from "@phosphor-icons/react";

interface ParticipantsBarProps {
  members: User[];
  onParticipantClick: (user: User) => void;
  onInvitePeople: () => void;
  onOverflowClick?: () => void;
}

const ParticipantsBar: React.FC<ParticipantsBarProps> = ({ members = [], onParticipantClick, onInvitePeople, onOverflowClick }) => {
  // Filter out 'Rima' if present in members list (though usually she is separate)
  // Logic: Show max 4 members + overflow
  const realMembers = members.filter(m => m.name !== 'Rima');
  const maxDisplay = 4;
  const displayMembers = realMembers.slice(0, maxDisplay);
  const remainingCount = realMembers.length - maxDisplay;

  // if (displayMembers?.length < 2) return null;

  return (
    <div className="w-full h-14 flex items-center gap-2 px-4 bg-[var(--bg-app)]/40 backdrop-blur-md border-b border-[var(--border-subtle)] overflow-x-auto scrollbar-hide z-30 shrink-0">
      <div className="flex items-center gap-2 min-w-max">
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mr-2">Members</span>

        {/* Member List */}
        {displayMembers.map(user => (
          <button
            key={user.id}
            onClick={() => onParticipantClick(user)}
            className="group flex items-center gap-2 px-2 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--primary)] transition-all hover:scale-105"
          >
            <div className={`w-6 h-6 rounded-full ${user.avatarColor} flex items-center justify-center text-[10px] font-black relative`}>
              {user.name[0]}
              {user.status === 'active' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#3ECF8E] border-2 border-[var(--bg-card)]" />
              )}
            </div>
            <div className="flex flex-col items-start leading-none pr-1">
              <span className="text-[10px] font-bold text-[var(--text-primary)] max-w-[60px] truncate">{user.name.split(' ')[0]}</span>
            </div>
          </button>
        ))}

        <div className="w-[1px] h-6 bg-[var(--border-subtle)] mx-1" />

        {/* Add Member Button - Moved to End */}
        <button
          onClick={onInvitePeople}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
          title="Add Member"
        >
          <PlusCircle size={18} weight="bold" />
        </button>

        {/* Overflow Badge */}
        {remainingCount > 0 && (
          <button
            onClick={onOverflowClick}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)] hover:bg-[var(--primary)] hover:text-white transition-all cursor-pointer"
          >
            +{remainingCount}
          </button>
        )}

      </div>
    </div>
  );
};

export default ParticipantsBar;

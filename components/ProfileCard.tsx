
import React from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { X, Calendar, CheckCircle, ChatCenteredText, Pulse } from "@phosphor-icons/react";

interface ProfileCardProps {
  user: User;
  onClose: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onClose }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm glass rounded-[32px] overflow-hidden animate-slide-up shadow-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
        {/* Header/Status */}
        <div className="flex items-start justify-between p-4 relative">
          <div className='flex items-center gap-4'>
            <div className={`relative w-20 h-20 rounded-3xl ${user.avatarColor} flex items-center justify-center text-2xl font-black border-4 border-[var(--bg-card)]`}>
              {user.name.split(' ').map(n => n[0]).join('')}
              {/* Presence Dot */}
              <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-[var(--bg-card)] ${user.status === 'active' ? 'bg-[#3ECF8E]' : user.status === 'away' ? 'bg-[#F59E0B]' : 'bg-[#94A3B8]'
                }`} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{user.name}</h2>
              <p className="text-sm font-bold text-[var(--primary)] uppercase tracking-widest">{user.role || 'Participant'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-[var(--text-primary)]/10 hover:bg-[var(--text-primary)]/20 rounded-xl transition-colors text-[var(--text-primary)]"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="px-8 pb-8 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-1 opacity-60">
                <Calendar size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Involvement</span>
              </div>
              <p className="text-sm font-bold">{user.roomInvolvement} Rooms</p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-1 opacity-60">
                <CheckCircle size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Tasks</span>
              </div>
              <p className="text-sm font-bold">2 Assigned</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Pulse size={16} className="text-[var(--primary)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Latest Activity</span>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <p className="text-xs font-medium text-[var(--text-secondary)] leading-relaxed italic">
                &quot;{user.recentActivity || 'Idle recently'}&quot;
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              router.push(`/dm/${user.id}`);
            }}
            className="w-full py-4 rounded-2xl bg-[var(--primary)] text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <ChatCenteredText size={20} weight="fill" />
            Direct Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

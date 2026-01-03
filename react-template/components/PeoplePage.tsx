
import React, { useState } from 'react';
import { User } from '../types';
import { MagnifyingGlass, Funnel, ChatCenteredText, IdentificationCard } from "@phosphor-icons/react";
import { SYSTEM_USERS } from '../constants';

interface PeoplePageProps {
  onParticipantClick: (user: User) => void;
}

const PeoplePage: React.FC<PeoplePageProps> = ({ onParticipantClick }) => {
  const [search, setSearch] = useState('');

  const filtered = SYSTEM_USERS.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl px-6 flex flex-col gap-8 pb-32 pt-8 overflow-y-auto scrollbar-hide animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">People System</h2>
        <p className="text-sm text-[var(--text-secondary)] font-medium">Directory of all participants in your universe.</p>
      </div>

      <div className="relative">
        <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or role..."
          className="w-full h-14 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all font-medium text-[var(--text-primary)] shadow-sm"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-[var(--primary)]">
          <Funnel size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(user => (
          <div 
            key={user.id}
            className="group flex items-center justify-between p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
            onClick={() => onParticipantClick(user)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${user.avatarColor} flex items-center justify-center text-xl font-black shadow-lg relative`}>
                {user.name[0]}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[var(--bg-card)] ${
                  user.status === 'active' ? 'bg-[#3ECF8E]' : user.status === 'away' ? 'bg-[#F59E0B]' : 'bg-[#94A3B8]'
                }`} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{user.name}</span>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{user.role}</span>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-3 bg-[var(--bg-surface)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all">
                <ChatCenteredText size={20} weight="bold" />
              </button>
              <button className="p-3 bg-[var(--bg-surface)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all">
                <IdentificationCard size={20} weight="bold" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center space-y-4 opacity-40">
            <MagnifyingGlass size={48} className="mx-auto" />
            <p className="font-bold uppercase tracking-widest text-xs">No users matching search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeoplePage;

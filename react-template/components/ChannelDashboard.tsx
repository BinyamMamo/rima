
import React from 'react';
import { Channel, Project } from '../types';
import { Sparkle, Hash, Receipt, CheckCircle, Activity, Info } from "@phosphor-icons/react";

interface ChannelDashboardProps {
  channel: Channel;
  project: Project;
}

const ChannelDashboard: React.FC<ChannelDashboardProps> = ({ channel, project }) => {
  return (
    <div className="w-full h-full flex flex-col bg-[var(--bg-app)] animate-fade-in overflow-y-auto scrollbar-hide pb-32">
      <div className="w-full max-w-2xl mx-auto px-6 py-10 space-y-10">
        
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white">
               <Hash size={18} weight="bold" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">#{channel.title}</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-medium">{channel.description || 'Channel-specific dashboard for coordination.'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-2">
            <div className="flex items-center gap-2">
               <Activity size={18} className="text-[var(--highlight)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Activity</span>
            </div>
            <p className="text-lg font-black text-[var(--text-primary)]">Synced</p>
          </div>
          <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-2">
            <div className="flex items-center gap-2">
               <Info size={18} className="text-[var(--primary)]" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Context</span>
            </div>
            <p className="text-lg font-black text-[var(--text-primary)]">Active</p>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkle size={18} weight="fill" className="text-amber-500" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Room Insights</h3>
          </div>
          <div className="p-8 text-center bg-[var(--bg-card)] border border-dashed border-[var(--border-subtle)] rounded-3xl opacity-50">
             <p className="text-xs font-bold uppercase tracking-widest">Rima is monitoring #${channel.title.toLowerCase()}...</p>
          </div>
        </div>

        {/* Members */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Team Presence</h3>
           <div className="flex flex-wrap gap-2">
              {channel.members.map(user => (
                <div key={user.id} className="flex items-center gap-2 p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-sm">
                   <div className={`w-8 h-8 rounded-xl ${user.avatarColor} flex items-center justify-center text-[10px] font-black`}>
                    {user.name[0]}
                   </div>
                   <div className="flex flex-col">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{user.name}</span>
                    <span className="text-[8px] font-black uppercase tracking-tight text-[var(--text-muted)]">{user.role}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDashboard;

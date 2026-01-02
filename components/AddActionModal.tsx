
import React from 'react';
import { X, Folders, Hash, Files, PlusCircle, Rocket, ChatCenteredText } from "@phosphor-icons/react";

interface AddActionModalProps {
  onClose: () => void;
  onCreateWorkspace: () => void;
  onCreateSubRoom: () => void;
  onCreateChannel: () => void;
  onCreateNote: () => void;
  context: 'global' | 'room';
}

const AddActionModal: React.FC<AddActionModalProps> = ({ onClose, onCreateWorkspace, onCreateSubRoom, onCreateChannel, onCreateNote, context }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[var(--bg-card)] rounded-[32px] overflow-hidden animate-slide-up shadow-2xl border border-[var(--border-subtle)]">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Initialize</h2>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">New Entry Point</p>
            </div>
            <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <X size={24} weight="bold" />
            </button>
          </div>

          <div className="space-y-3">
            <ActionButton 
              icon={<Rocket size={24} weight="fill" className="text-[var(--primary)]" />} 
              title="New Workspace" 
              subtitle="Start a fresh mission hub"
              onClick={onCreateWorkspace} 
            />
            {context === 'room' && (
              <>
                <ActionButton 
                  icon={<Folders size={24} weight="fill" className="text-[var(--secondary)]" />} 
                  title="New Sub-Room" 
                  subtitle="Nest specialized contexts"
                  onClick={onCreateSubRoom} 
                />
                <ActionButton 
                  icon={<Hash size={24} weight="bold" className="text-[var(--highlight)]" />} 
                  title="New Channel" 
                  subtitle="Direct line of communication"
                  onClick={onCreateChannel} 
                />
              </>
            )}
            <ActionButton 
              icon={<ChatCenteredText size={24} weight="fill" className="text-[var(--text-muted)]" />} 
              title="Quick Note" 
              subtitle="Drop a context brain-dump"
              onClick={onCreateNote} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }> = ({ icon, title, subtitle, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-5 bg-[var(--bg-surface)] hover:bg-[var(--primary)]/10 border border-[var(--border-subtle)] rounded-3xl transition-all group hover:-translate-y-1 active:scale-95"
  >
    <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-left flex-1">
      <p className="text-base font-black text-[var(--text-primary)] leading-tight">{title}</p>
      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tight mt-1">{subtitle}</p>
    </div>
  </button>
);

export default AddActionModal;

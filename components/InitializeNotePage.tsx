
import React, { useState } from 'react';
import { ChatCenteredText, Check, Target, Hash } from "@phosphor-icons/react";

interface InitializeNotePageProps {
  targetRoom: string;
  onBack: () => void;
}

const InitializeNotePage: React.FC<InitializeNotePageProps> = ({ targetRoom, onBack }) => {
  const [content, setContent] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = () => {
    if (!content.trim()) return;
    setIsSuccess(true);
    setTimeout(() => onBack(), 1500);
  };

  if (isSuccess) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
        <div className="w-20 h-20 bg-[var(--highlight)]/20 rounded-[32px] flex items-center justify-center text-[var(--highlight)] mb-4">
          <Check size={40} weight="bold" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Note Synchronized</h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl px-6 flex flex-col gap-10 py-10 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Quick Note</h2>
        <div className="flex items-center gap-2 text-[var(--text-secondary)] font-medium">
          <Target size={18} />
          <span>Context: </span>
          <span className="text-[var(--primary)] font-bold">#{targetRoom}</span>
        </div>
      </div>

      <div className="space-y-8">
        <textarea 
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Rima will structure this later..."
          className="w-full h-64 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-[32px] p-8 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 transition-all resize-none shadow-sm"
        />

        <div className="flex flex-col gap-4">
          <button 
            disabled={!content.trim()}
            onClick={handleSave}
            className="w-full h-16 bg-[var(--primary)] text-white rounded-3xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-xl hover:brightness-110 active:scale-95 disabled:opacity-20 transition-all"
          >
            <ChatCenteredText size={20} weight="fill" />
            Save to Universe
          </button>
          
          <button onClick={onBack} className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] py-4">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default InitializeNotePage;

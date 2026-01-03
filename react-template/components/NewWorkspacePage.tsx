
import React, { useState } from 'react';
import { ThemeColor } from '../types';
import { CheckCircle, Rocket, Briefcase, User, GraduationCap, Heartbeat } from "@phosphor-icons/react";

interface NewWorkspacePageProps {
  onCreate: (title: string, theme: ThemeColor, category: string) => void;
  initialProfileId: string;
}

const NewWorkspacePage: React.FC<NewWorkspacePageProps> = ({ onCreate, initialProfileId }) => {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState<ThemeColor>('violet');
  const [category, setCategory] = useState(initialProfileId === 'all' ? 'p_work' : initialProfileId);

  const categories = [
    { id: 'p_work', name: 'Work', icon: <Briefcase /> },
    { id: 'p_life', name: 'Life', icon: <User /> },
    { id: 'p_edu', name: 'Education', icon: <GraduationCap /> },
    { id: 'p_health', name: 'Health', icon: <Heartbeat /> }
  ];

  const themes: {id: ThemeColor, color: string}[] = [
    { id: 'violet', color: 'bg-[#8b5cf6]' },
    { id: 'indigo', color: 'bg-[#6366f1]' },
    { id: 'sky', color: 'bg-[#0ea5e9]' },
    { id: 'teal', color: 'bg-[#14b8a6]' },
    { id: 'emerald', color: 'bg-[#10b981]' },
    { id: 'gold', color: 'bg-[#f59e0b]' },
    { id: 'rust', color: 'bg-[#ea580c]' },
    { id: 'rose', color: 'bg-[#f43f5e]' },
  ];

  return (
    <div className="w-full max-w-lg px-6 flex flex-col gap-10 py-10 animate-fade-in overflow-y-auto scrollbar-hide">
      <div className="space-y-2 text-center">
        <p className="text-[var(--text-secondary)] font-light text-lg">Define a new environment for your goals</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Category</label>
          <div className="grid grid-cols-2 gap-2">
             {categories.map(c => (
               <button 
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${category === c.id ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'}`}
               >
                 <span className="text-xl">{c.icon}</span>
                 <span className="text-sm font-bold">{c.name}</span>
               </button>
             ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Workspace Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dubai Marina Project"
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all placeholder:text-[var(--text-muted)]"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Visual ID Accent</label>
          <div className="flex flex-wrap gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-10 h-10 rounded-xl ${t.color} transition-all duration-300 relative shadow-sm ${theme === t.id ? 'scale-110 ring-2 ring-[var(--text-primary)] ring-offset-4 ring-offset-[var(--bg-app)]' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
              >
                {theme === t.id && <div className="absolute inset-0 flex items-center justify-center text-white"><CheckCircle weight="fill" size={18} /></div>}
              </button>
            ))}
          </div>
        </div>

        <button 
          disabled={!title.trim()}
          onClick={() => onCreate(title, theme, category)}
          className={`w-full h-16 bg-[var(--primary)] text-white rounded-3xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-[var(--primary)]/20 mt-6 ${!title.trim() ? 'opacity-30 cursor-not-allowed' : 'hover:brightness-110'}`}
        >
          <Rocket size={20} weight="fill" />
          Initialize Space
        </button>
      </div>
    </div>
  );
};

export default NewWorkspacePage;

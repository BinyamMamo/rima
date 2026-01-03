
import React, { useState } from 'react';
import { Moon, CaretLeft, EyeClosed, Check, Sun } from "@phosphor-icons/react";
import { ThemeColor } from '../types';

interface SettingsPageProps {
  onBack: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  accent: ThemeColor;
  setAccent: (val: ThemeColor) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, darkMode, setDarkMode, accent, setAccent }) => {
  const [motion, setMotion] = useState(true);
  const themes: ThemeColor[] = ['violet', 'indigo', 'sky', 'teal', 'emerald', 'gold', 'rust', 'rose'];

  return (
    <div className="w-full h-full bg-[var(--bg-app)] overflow-y-auto scrollbar-hide animate-fade-in theme-transition">
      <div className="w-full max-w-2xl mx-auto px-6 flex flex-col gap-8 pb-32 pt-8">
        <Section title="Interface">
            <ToggleItem 
              icon={darkMode ? <Moon size={20}/> : <Sun size={20}/>} 
              label="Dark Mode" 
              active={darkMode} 
              onToggle={() => setDarkMode(!darkMode)} 
            />
            <ToggleItem 
              icon={<EyeClosed size={20}/>} 
              label="Reduced Motion" 
              active={motion} 
              onToggle={() => setMotion(!motion)} 
            />
        </Section>

        <Section title="Theme Accent">
          <div className="p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm transition-colors">
              <div className="grid grid-cols-4 gap-4">
                  {themes.map(t => (
                      <button 
                          key={t}
                          onClick={() => setAccent(t)}
                          className={`h-12 rounded-2xl flex items-center justify-center transition-all ${accent === t ? 'ring-2 ring-[var(--text-primary)] ring-offset-4 ring-offset-[var(--bg-card)] scale-95 shadow-lg' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                          style={{ backgroundColor: getHex(t) }}
                      >
                          {accent === t && <Check size={18} weight="bold" className="text-white drop-shadow-sm" />}
                      </button>
                  ))}
              </div>
          </div>
        </Section>

        <Section title="System Information">
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm space-y-4 transition-colors">
                <StatusLine label="Neural Engine" status="Optimized" color="text-[#3ECF8E]" />
                <StatusLine label="Build" status="v2.2.0-neo" color="text-[var(--text-secondary)]" />
                <StatusLine label="Contrast" status="WCAG AA" color="text-[var(--text-secondary)]" />
            </div>
        </Section>

        <div className="text-center opacity-40 mt-12 py-8 border-t border-[var(--border-subtle)]">
            <p className="text-[10px] uppercase tracking-[0.6em] mb-2 font-branding text-[var(--text-primary)]">RIMA OS</p>
            <p className="text-[9px] font-black uppercase tracking-widest italic text-[var(--text-secondary)]">Personal Productivity Universe</p>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-secondary)] ml-2">{title}</h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const ToggleItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onToggle: () => void }> = ({ icon, label, active, onToggle }) => (
    <div 
        className="flex items-center justify-between p-5 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm hover:border-[var(--text-muted)] transition-all cursor-pointer group"
        onClick={onToggle}
    >
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-colors ${active ? 'bg-[var(--primary)] text-white shadow-sm' : 'bg-[var(--bg-surface)] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'}`}>
                {icon}
            </div>
            <span className="text-sm font-bold text-[var(--text-primary)]">{label}</span>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${active ? 'bg-[var(--primary)]' : 'bg-[var(--text-muted)]/30'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    </div>
);

const StatusLine: React.FC<{ label: string; status: string; color: string }> = ({ label, status, color }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-tight">{label}</span>
        <span className={`text-xs font-black uppercase tracking-widest ${color}`}>{status}</span>
    </div>
);

function getHex(theme: ThemeColor): string {
    const map: Record<ThemeColor, string> = {
        teal: '#14b8a6', emerald: '#10b981', gold: '#f59e0b', rust: '#ea580c',
        indigo: '#6366f1', rose: '#f43f5e', sky: '#0ea5e9', violet: '#8b5cf6',
        obsidian: '#3f3f46', slate: '#64748b'
    };
    return map[theme];
}

export default SettingsPage;

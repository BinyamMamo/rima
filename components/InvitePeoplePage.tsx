
import React, { useState } from 'react';
/* Added missing PlusCircle and PaperPlaneTilt imports */
import { UserPlus, Link, X, Check, UsersThree, Info, ArrowRight, MagnifyingGlass, PlusCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import { UserRole } from '../types';

interface InvitePeoplePageProps {
  roomName: string;
  onBack: () => void;
}

const InvitePeoplePage: React.FC<InvitePeoplePageProps> = ({ roomName, onBack }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [role, setRole] = useState<UserRole>('Collaborator');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const addEmail = () => {
    if (inputValue && !emails.includes(inputValue)) {
      setIsSearching(true);
      setTimeout(() => {
        setEmails([...emails, inputValue]);
        setInputValue('');
        setIsSearching(false);
      }, 600);
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSend = () => {
    if (emails.length === 0) return;
    setIsSuccess(true);
    setTimeout(() => onBack(), 2000);
  };

  if (isSuccess) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 animate-fade-in text-center space-y-4">
        <div className="w-20 h-20 bg-[var(--highlight)]/20 rounded-[32px] flex items-center justify-center text-[var(--highlight)] mb-4">
          <Check size={40} weight="bold" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Invites Sent!</h2>
        <p className="text-[var(--text-secondary)] font-medium">Your team will receive their links shortly.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl px-6 flex flex-col gap-10 py-10 overflow-y-auto scrollbar-hide animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Invite to {roomName}</h2>
        <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
          Share access to this space. Collaborators can contribute to chats and dashboards.
        </p>
      </div>

      <div className="space-y-8">
        {/* Recipient Input */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Usernames or Emails</label>
          <div className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEmail()}
              placeholder="e.g. alex@rima.com, @jordan"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl pl-6 pr-14 py-4 focus:outline-none focus:border-[var(--primary)] transition-all"
            />
            <button 
              onClick={addEmail}
              disabled={!inputValue}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl flex items-center justify-center disabled:opacity-20 transition-all"
            >
              {isSearching ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <PlusCircle size={20} weight="bold" />}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {emails.map(e => (
              <div key={e} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs font-bold border border-[var(--primary)]/20 animate-slide-up">
                {e}
                <button onClick={() => removeEmail(e)}><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Role Selector */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Access Role</label>
          <div className="grid grid-cols-3 gap-2">
            {(['Viewer', 'Collaborator', 'Admin'] as UserRole[]).map(r => (
              <button 
                key={r}
                onClick={() => setRole(r)}
                className={`p-4 rounded-2xl border text-center transition-all ${role === r ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--primary)]'}`}
              >
                <span className="text-xs font-black uppercase tracking-widest">{r}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[var(--text-muted)] font-medium flex items-center gap-2 px-2 mt-2">
            <Info size={14} />
            {role === 'Viewer' && 'Can read messages and view dashboards only.'}
            {role === 'Collaborator' && 'Can send messages, upload files, and edit tasks.'}
            {role === 'Admin' && 'Full control: can manage members and workspace settings.'}
          </p>
        </div>

        {/* Note */}
        <div className="space-y-3">
           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Personal Note (Optional)</label>
           <textarea 
             value={note}
             onChange={(e) => setNote(e.target.value)}
             placeholder="Hey! Join our coordination room..."
             className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-2xl px-6 py-4 min-h-[100px] focus:outline-none focus:border-[var(--primary)] transition-all resize-none"
           />
        </div>

        <div className="flex flex-col gap-4 pt-6">
          <button 
            disabled={emails.length === 0}
            onClick={handleSend}
            className="w-full h-16 bg-[var(--primary)] text-white rounded-3xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-xl disabled:opacity-20 transition-all hover:brightness-110 active:scale-95"
          >
            <PaperPlaneTilt size={20} weight="fill" />
            Send Invites
          </button>
          
          <button className="flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <Link size={18} />
            Copy Invite Link
          </button>
        </div>

        {/* Pending Section */}
        <div className="pt-10 border-t border-[var(--border-subtle)] space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Pending Invites</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 bg-[var(--bg-card)]/50 border border-[var(--border-subtle)] rounded-2xl opacity-60">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)]"><UsersThree size={18} /></div>
                  <span className="text-sm font-bold">alex.ops@rima.com</span>
               </div>
               <span className="text-[9px] font-black uppercase bg-[var(--bg-surface)] px-2 py-1 rounded-md tracking-tighter">Sent 2h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePeoplePage;

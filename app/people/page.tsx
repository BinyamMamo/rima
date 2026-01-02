'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, Funnel, ChatCenteredText, IdentificationCard, List, Sun, Moon, CaretLeft, UserPlus } from '@phosphor-icons/react';
import { useAuth, useUI } from '@/contexts';
import { SYSTEM_USERS } from '@/constants';
import { User } from '@/types';
import Background from '@/components/Background';
import Sidebar from '@/components/Sidebar';
import ChatInput from '@/components/ChatInput';
import ProfileCard from '@/components/ProfileCard';
import InviteModal from '@/components/InviteModal';
import { useWorkspaceData } from '@/contexts';

export default function PeoplePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { projects, activeProfileId, setActiveProfileId } = useWorkspaceData();
  const { darkMode, toggleDarkMode } = useUI();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/welcome');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-app">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-secondary font-branding text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const filtered = SYSTEM_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Background />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projects}
        activeProfileId={activeProfileId}
        onProfileChange={setActiveProfileId}
      />

      <div className="relative z-10 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 h-24 flex items-center justify-between px-6 border-b border-subtle bg-app/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-3 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all"
            >
              <CaretLeft size={24} weight="bold" />
            </button>
            <h1 className="text-2xl font-branding font-bold text-primary">People</h1>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="p-3 text-secondary hover:text-primary hover:scale-110 active:scale-95 transition-all"
          >
            <UserPlus size={24} weight="bold" />
          </button>
        </div>

        {/* People Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 pb-32 scrollbar-hide">
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 animate-fade-in">
            <div className="relative">
              <MagnifyingGlass
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or role..."
                className="w-full h-14 bg-card border border-subtle rounded-2xl pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all font-medium text-primary shadow-sm"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[var(--text-muted)] hover:text-[var(--primary)]">
                <Funnel size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filtered.map((person) => (
                <div
                  key={person.id}
                  className="group flex items-center justify-between p-5 rounded-3xl bg-card border border-subtle hover:-translate-y-1 transition-all cursor-pointer hover:border-[var(--primary)]"
                  onClick={() => {
                    // TODO: Show user profile modal
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl ${person.avatarColor} flex items-center justify-center text-xl font-black relative`}
                    >
                      {person.name.split(' ').map(n => n[0]).join('')}
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-card ${person.status === 'active'
                          ? 'bg-[#3ECF8E]'
                          : person.status === 'away'
                            ? 'bg-[#F59E0B]'
                            : 'bg-[#94A3B8]'
                          }`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-primary group-hover:text-[var(--primary)] transition-colors">
                        {person.name}
                      </span>
                      <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
                        {person.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dm/${person.id}`);
                      }}
                      className="p-3 bg-surface rounded-xl text-secondary hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all"
                    >
                      <ChatCenteredText size={20} weight="bold" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Open user details modal
                        setSelectedProfileUser(person);
                      }}
                      className="p-3 bg-surface rounded-xl text-secondary hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all"
                    >
                      <IdentificationCard size={20} weight="bold" />
                    </button>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-20 text-center space-y-4 opacity-40">
                  <MagnifyingGlass size={48} className="mx-auto text-secondary" />
                  <p className="font-bold uppercase tracking-widest text-xs text-secondary">
                    No users matching search
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Chat Input */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-6 pointer-events-none">
          <ChatInput
            onVoiceToggle={() => {
              console.log('Voice mode');
            }}
            onSendMessage={(content) => {
              console.log('Message:', content);
            }}
            placeholder="Talk to Rima..."
          />
        </div>

        {/* Profile Modal */}
        {selectedProfileUser && (
          <ProfileCard
            user={selectedProfileUser}
            onClose={() => setSelectedProfileUser(null)}
          />
        )}
        {/* Invite Modal */}
        {showInviteModal && (
          <InviteModal onClose={() => setShowInviteModal(false)} />
        )}
      </div>
    </>
  );
}

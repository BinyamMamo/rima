'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { List, Sun, Moon, UserPlus } from '@phosphor-icons/react';
import { useAuth, useWorkspaceData, useUI } from '@/contexts';
import Background from '@/components/Background';
import Sidebar from '@/components/Sidebar';
import WorkspaceCard from '@/components/WorkspaceCard';
import ChatInput from '@/components/ChatInput';
import InviteModal from '@/components/InviteModal';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { projects, activeProfileId, setActiveProfileId, isLoading: dataLoading } = useWorkspaceData();
  const { darkMode, toggleDarkMode } = useUI();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/welcome');
    }
  }, [user, authLoading, router]);

  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-app">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-secondary font-branding text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredProjects = activeProfileId === 'all'
    ? projects
    : projects.filter((p) => p.profileId === activeProfileId);

  const rootProjects = filteredProjects.filter((p) => !p.parentRoomId);

  return (
    <>
      <Background />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="relative z-10 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 h-24 flex items-center justify-between px-6 border-b border-subtle bg-app/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all"
            >
              <List size={24} weight="bold" />
            </button>
            <h1 className="text-2xl font-branding font-bold text-primary">
              RIMA
            </h1>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="p-3 text-secondary hover:text-primary hover:scale-110 active:scale-95 transition-all"
          >
            <UserPlus size={24} weight="bold" />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 pb-32 scrollbar-hide">
          {rootProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center max-w-md animate-fade-in">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-2xl font-bold text-primary mb-2">No Workspaces Yet</h2>
                <p className="text-secondary mb-6">
                  Create your first workspace to get started with RIMA.
                </p>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="px-6 py-3 bg-[var(--primary)] text-white rounded-2xl font-semibold hover:brightness-110 transition-all shadow-lg"
                >
                  Create Workspace
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
              {rootProjects.map((project) => (
                <WorkspaceCard
                  key={project.id}
                  workspace={project}
                  subProjects={projects.filter(p => p.parentRoomId === project.id)}
                  onClick={() => router.push(`/project/${project.id}`)}
                  onChannelClick={(channelId) => router.push(`/project/${project.id}?channel=${channelId}`)}
                  onSubProjectClick={(subId) => router.push(`/project/${subId}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Chat Input */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-6 pointer-events-none">
          <ChatInput
            onVoiceToggle={() => {
              // TODO: Open voice mode
              console.log('Voice mode');
            }}
            onSendMessage={(content) => {
              // TODO: Send message to Rima
              console.log('Message:', content);
            }}
            placeholder="Talk to Rima..."
          />
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <InviteModal onClose={() => setShowInviteModal(false)} />
        )}
      </div>
    </>
  );
}

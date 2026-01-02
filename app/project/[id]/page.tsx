'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { List, ChatCircleText, ChartBar, UserPlus } from '@phosphor-icons/react';
import { useAuth, useWorkspaceData } from '@/contexts';
import { Message, User } from '@/types';
import Background from '@/components/Background';
import Sidebar from '@/components/Sidebar';
import ProjectPageContent from '@/components/ProjectPage';
import ProjectDashboardView from '@/components/ProjectDashboardView';
import ChatInput from '@/components/ChatInput';
import InviteModal from '@/components/InviteModal';

export default function ProjectPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { projects, addMessage } = useWorkspaceData();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRimaTyping, setIsRimaTyping] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'dashboard'>('chat');

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/welcome');
    }
  }, [user, authLoading, router]);

  const handleSendMessage = async (content: string) => {
    if (!project || !user) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: user,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };
    addMessage(project.id, userMessage);

    // Simulate Rima typing and response
    setIsRimaTyping(true);

    // Simulate network delay
    setTimeout(() => {
      const rimaMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've received your message about "${project.title}". I'm analyzing the context and will help you with that.`,
        sender: 'Rima',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };
      addMessage(project.id, rimaMessage);
      setIsRimaTyping(false);
    }, 1500);
  };

  const handleVoiceToggle = () => {
    // TODO: Implement voice mode
    console.log('Voice mode toggled');
  };

  const handleInvitePeople = () => {
    setShowInviteModal(true);
  };

  if (!project) {
    if (authLoading) return null;
    return (
      <div className="flex items-center justify-center h-screen bg-app">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Project Not Found</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-[var(--primary)] text-white rounded-2xl font-semibold hover:brightness-110 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Background />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="relative z-10 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 h-20 flex items-center justify-between px-4 border-b border-subtle bg-app/80 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3 w-1/3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all"
            >
              <List size={24} weight="bold" />
            </button>
          </div>

          <div className="flex justify-center w-1/3">
            <div className="flex bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-subtle)]">
              <button
                onClick={() => setViewMode('chat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'chat'
                    ? 'bg-[var(--primary)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <ChatCircleText size={18} weight="fill" />
                CHAT
              </button>
              <button
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'dashboard'
                    ? 'bg-[var(--primary)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                <ChartBar size={18} weight="fill" />
                DASH
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 w-1/3">
            <button
              onClick={handleInvitePeople}
              className="p-3 bg-[var(--primary)] text-white rounded-full hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/20"
            >
              <UserPlus size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* Project Content */}
        {viewMode === 'chat' ? (
          <div className="flex-1 overflow-hidden relative flex flex-col">
            <div className="flex-1 overflow-hidden relative">
              <ProjectPageContent
                project={project}
                onVoiceToggle={handleVoiceToggle}
                onSendMessage={handleSendMessage}
                onInvitePeople={handleInvitePeople}
                isRimaTyping={isRimaTyping}
              />
            </div>
            {/* Chat Input Area */}
            <div className="p-4 bg-app/80 backdrop-blur-md border-t border-subtle z-20">
              <ChatInput
                onVoiceToggle={handleVoiceToggle}
                onSendMessage={handleSendMessage}
                placeholder={`Message ${project.title}...`}
              />
            </div>
          </div>
        ) : (
          <ProjectDashboardView project={project} />
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <InviteModal onClose={() => setShowInviteModal(false)} />
        )}
      </div>
    </>
  );
}

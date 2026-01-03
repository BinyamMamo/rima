'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { List, ChatCircleText, ChartBar, UserPlus, Plus } from '@phosphor-icons/react';
import { useAuth, useWorkspaceData } from '@/contexts';
import { Message, User } from '@/types';
import Background from '@/components/Background';
import Sidebar from '@/components/Sidebar';
import WorkspacePageContent from '@/components/WorkspacePage';
import WorkspaceDashboardView from '@/components/WorkspaceDashboardView';
import ChatInput from '@/components/ChatInput';
import InviteModal from '@/components/InviteModal';

export default function WorkspacePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { workspaces, addMessage } = useWorkspaceData();
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRimaTyping, setIsRimaTyping] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'dashboard'>('chat');

  const workspace = workspaces.find((p) => p.id === workspaceId);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/welcome');
    }
  }, [user, authLoading, router]);

  const handleSendMessage = async (content: string) => {
    if (!workspace || !user) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: user,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    addMessage(workspace.id, userMessage);

    // Simulate Rima typing and response
    setIsRimaTyping(true);

    // Simulate network delay
    setTimeout(() => {
      const rimaMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've received your message about "${workspace.title}". I'm analyzing the context and will help you with that.`,
        sender: 'Rima',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      addMessage(workspace.id, rimaMessage);
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

  if (!workspace) {
    if (authLoading) return null;
    return (
      <div className="flex items-center justify-center h-screen bg-app">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Workspace Not Found</h2>
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
        currentWorkspaceId={workspace.id}
      />

      <div className="relative z-10 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-subtle bg-app/80 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all shrink-0"
            >
              <List size={24} weight="bold" />
            </button>

            {/* Clickable Title Area - WhatsApp Style */}
            <div
              className="flex flex-col flex-1 cursor-pointer hover:bg-surface/50 rounded-lg px-2 py-1 transition-colors"
              onClick={() => setViewMode(viewMode === 'chat' ? 'dashboard' : 'chat')}
            >
              <h1 className="text-lg font-branding font-bold text-primary leading-tight truncate">
                {workspace.title}
              </h1>
              <p className="text-xs text-secondary font-medium truncate">
                tap for more info
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Add Room Button */}
              <button
                onClick={() => router.push(`/create-room?workspaceId=${workspace.id}`)}
                className="p-2 text-secondary hover:text-primary hover:bg-surface rounded-xl transition-all"
                title="Create Room"
              >
                <Plus size={24} weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Content */}
        {viewMode === 'chat' ? (
          <div className="flex-1 overflow-hidden relative flex flex-col">
            <div className="flex-1 overflow-hidden relative">
              <WorkspacePageContent
                workspace={workspace}
                onVoiceToggle={handleVoiceToggle}
                onSendMessage={handleSendMessage}
                onInvitePeople={handleInvitePeople} // TODO: Remove or repurpose
                isRimaTyping={isRimaTyping}
              />
            </div>
            {/* Chat Input Area */}
            <div className="p-4 bg-app/80 backdrop-blur-md border-t border-subtle z-20">
              <ChatInput
                onVoiceToggle={handleVoiceToggle}
                onSendMessage={handleSendMessage}
                placeholder={`Message ${workspace.title}...`}
              />
            </div>
          </div>
        ) : (
          <WorkspaceDashboardView workspace={workspace} />
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <InviteModal onClose={() => setShowInviteModal(false)} />
        )}
      </div>
    </>
  );
}

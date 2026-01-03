'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FileText, CaretLeft, DotsThreeVertical, PencilSimple, Trash, Plus, Sparkle, ChatText, FolderPlus, List } from '@phosphor-icons/react';
import { generateRimaInsights } from '@/lib/dashboardPresets';
import { Insight } from '@/types';

import { useAuth, useWorkspaceData } from '@/contexts';
import { Message } from '@/types';
import Background from '@/components/Background';
import Sidebar from '@/components/Sidebar';
import WorkspacePageContent from '@/components/WorkspacePage';
import WorkspaceDashboardView from '@/components/WorkspaceDashboardView';
import ChatInput from '@/components/ChatInput';
import InviteModal from '@/components/InviteModal';
import ConfirmModal from '@/components/ConfirmModal';
import VoiceOverlay from '@/components/VoiceOverlay';

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
    <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM104,144a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
  </svg>
);

export default function WorkspacePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { workspaces, addMessage, deleteWorkspace } = useWorkspaceData();
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;
  const menuRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRimaTyping, setIsRimaTyping] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'dashboard'>('chat');
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rimaInsights, setRimaInsights] = useState<Insight[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // New State
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);

  const workspace = workspaces.find((p) => p.id === workspaceId);

  // ... (useEffect and other handlers)

  const handleDeleteWorkspace = () => {
    if (workspace) {
      deleteWorkspace(workspace.id);
      router.push('/dashboard'); // Or home
    }
  };

  // Update the menu button to just open the modal
  const onRequestDelete = () => {
    setShowDeleteConfirm(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    setShowVoiceOverlay(true);
  };

  const handleInvitePeople = () => {
    setShowInviteModal(true);
  };

  const toggleDashboard = () => {
    setViewMode(viewMode === 'chat' ? 'dashboard' : 'chat');
  };

  const handleGenerateInsights = async () => {
    if (!workspace) return;
    setIsGeneratingInsights(true);
    try {
      const insights = await generateRimaInsights(workspace);
      setRimaInsights(insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsGeneratingInsights(false);
    }
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
        <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-subtle bg-app/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">

            {/* Back Button (Dashboard Mode) or Sidebar Toggle (Chat Mode) */}
            {viewMode === 'dashboard' ? (
              <button
                onClick={() => setViewMode('chat')}
                className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all shrink-0"
                title="Back to Chat"
              >
                <CaretLeft size={24} weight="bold" />
              </button>
            ) : (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all shrink-0"
              >
                <List size={24} weight="bold" />
              </button>
            )}

            <h1
              onClick={toggleDashboard}
              className="text-xl font-branding font-bold text-primary leading-tight truncate cursor-pointer hover:opacity-80 transition-opacity"
              title={workspace.title}
            >
              {workspace.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Toggle Dashboard/Chat Button */}
            <button
              onClick={toggleDashboard}
              className={`p-2 rounded-xl transition-all ${viewMode === 'dashboard'
                ? 'bg-surface text-primary'
                : 'text-secondary hover:text-primary hover:bg-surface'
                }`}
              title={viewMode === 'chat' ? 'View Dashboard' : 'View Chat'}
            >
              {viewMode === 'chat' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM104,144a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path></svg>
              ) : (
                <ChatText size={24} weight="fill" />
              )}
            </button>

            {/* Action Menu (Dashboard Mode) */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all shrink-0"
              >
                <DotsThreeVertical size={24} weight="bold" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-lg overflow-hidden z-50 animate-fade-in">
                  <button
                    onClick={() => {
                      router.push(`/create-room?workspaceId=${workspace.id}`);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors flex items-center gap-3"
                  >
                    <FolderPlus size={18} weight="bold" />
                    Add Room
                  </button>
                  <button
                    onClick={handleGenerateInsights}
                    disabled={isGeneratingInsights}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors flex items-center gap-3"
                  >
                    {isGeneratingInsights ? (
                      <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FileText size={18} weight="fill" />
                    )}
                    Generate Report
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setViewMode('dashboard');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors flex items-center gap-3"
                  >
                    <PencilSimple size={18} weight="bold" />
                    Edit Workspace
                  </button>
                  <div className="h-[1px] bg-[var(--border-subtle)] my-1" />
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-3"
                  >
                    <Trash size={18} weight="bold" />
                    Delete Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Workspace Content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Chat View */}
          <div
            className={`absolute inset-0 transition-all duration-300 ${viewMode === 'chat'
              ? 'translate-y-0 opacity-100'
              : '-translate-y-4 opacity-0 pointer-events-none'
              }`}
          >
            <WorkspacePageContent
              workspace={workspace}
              onVoiceToggle={handleVoiceToggle}
              onSendMessage={handleSendMessage}
              onInvitePeople={handleInvitePeople}
              isRimaTyping={isRimaTyping}
            />
          </div>

          {/* Dashboard View */}
          <div
            className={`absolute inset-0 transition-all duration-300 ${viewMode === 'dashboard'
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0 pointer-events-none'
              }`}
          >
            <WorkspaceDashboardView
              workspace={workspace}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              rimaInsights={rimaInsights}
              setRimaInsights={setRimaInsights}
              onGenerateInsights={handleGenerateInsights}
              isGeneratingInsights={isGeneratingInsights}
            />
          </div>
        </div>

        {/* Floating Chat Input - Only in Chat Mode */}
        {viewMode === 'chat' && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-6 pointer-events-none">
            <ChatInput
              onVoiceToggle={handleVoiceToggle}
              onSendMessage={handleSendMessage}
              placeholder={`Message ${workspace.title}...`}
              members={workspace.members}
            />
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <InviteModal onClose={() => setShowInviteModal(false)} />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteWorkspace}
          title="Delete Workspace"
          message={`Are you sure you want to delete "${workspace.title}"? This action cannot be undone and all data associated with this workspace will be lost.`}
          isDestructive={true}
          confirmText="Delete Workspace"
        />

        {/* Voice Overlay */}
        <VoiceOverlay isOpen={showVoiceOverlay} onClose={() => setShowVoiceOverlay(false)} />
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CaretLeft, PaperPlaneRight, Info } from '@phosphor-icons/react';
import { useAuth, useUI } from '@/contexts';
import { SYSTEM_USERS } from '@/constants';
import { User, Message } from '@/types';
import Background from '@/components/Background';

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function DirectMessagePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { darkMode, toggleDarkMode } = useUI();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const chatUser = SYSTEM_USERS.find((u) => u.id === userId);

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

  if (!chatUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-app">
        <p className="text-secondary">User not found</p>
      </div>
    );
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: `m_${Date.now()}`,
        sender: user!,
        content: inputValue,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  return (
    <>
      <Background />

      <div className="relative z-10 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 h-24 flex items-center justify-between px-6 border-b border-subtle bg-app/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-3 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all"
            >
              <CaretLeft size={24} weight="bold" />
            </button>
            <button
              onClick={() => router.push(`/people/${userId}`)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
            >
              <div className={`w-12 h-12 rounded-2xl ${chatUser.avatarColor} flex items-center justify-center text-lg font-black relative`}>
                {getInitials(chatUser.name)}
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-app ${chatUser.status === 'active'
                    ? 'bg-[#3ECF8E]'
                    : chatUser.status === 'away'
                      ? 'bg-[#F59E0B]'
                      : 'bg-[#94A3B8]'
                    }`}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-primary">{chatUser.name}</h1>
                <span className="text-xs text-secondary font-medium">
                  {chatUser.status === 'active' ? 'Active now' : chatUser.status === 'away' ? 'Away' : 'Offline'}
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/people/${userId}`)}
              className="p-3 rounded-xl text-secondary hover:text-primary hover:bg-surface transition-all"
            >
              <Info size={24} weight="bold" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
          <div className="w-full max-w-3xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 opacity-40">
                <div className={`w-20 h-20 rounded-2xl ${chatUser.avatarColor} flex items-center justify-center text-3xl font-black mb-4`}>
                  {getInitials(chatUser.name)}
                </div>
                <p className="text-lg font-bold text-primary">{chatUser.name}</p>
                <p className="text-sm text-secondary">{chatUser.role}</p>
                <p className="text-xs text-secondary mt-2">Start a conversation</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.sender !== 'Rima' && (msg.sender as User).id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] px-5 py-3 rounded-2xl ${isUser
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-card border border-subtle text-primary'
                        }`}
                    >
                      <p className="text-sm font-medium">{msg.content}</p>
                      <span className={`text-xs mt-1 block ${isUser ? 'text-white/70' : 'text-secondary'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-subtle bg-app/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder={`Message ${chatUser.name}...`}
                className="flex-1 h-14 bg-card border border-subtle rounded-2xl px-5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all font-medium text-primary"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`h-14 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all font-bold ${inputValue.trim()
                  ? 'bg-[var(--primary)] text-white hover:scale-[1.02] active:scale-95'
                  : 'bg-surface text-secondary cursor-not-allowed'
                  }`}
              >
                <PaperPlaneRight size={20} weight="fill" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

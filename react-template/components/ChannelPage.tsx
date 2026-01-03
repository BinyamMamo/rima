
import React, { useEffect, useRef, useState } from 'react';
import { Channel, User } from '../types.ts';
import ChatInput from './ChatInput.tsx';
import ParticipantsBar from './ParticipantsBar.tsx';
import ProfileCard from './ProfileCard.tsx';
import { Checks, Sparkle } from "@phosphor-icons/react";

interface ChannelPageProps {
  channel: Channel;
  onVoiceToggle: () => void;
  onSendMessage: (content: string) => void;
  onInvitePeople: () => void;
  isRimaTyping: boolean;
}

export default function ChannelPage({ 
  channel, onVoiceToggle, onSendMessage, onInvitePeople, isRimaTyping 
}: ChannelPageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channel.messages, isRimaTyping]);

  const formatMessage = (content: string, isTagged: boolean) => {
    const parts = content.split(/(@Rima)/gi);
    return parts.map((part, i) => 
      part.toLowerCase() === '@rima' 
        ? <span key={i} className={`font-black ${isTagged ? 'text-zinc-500' : 'text-zinc-600'}`}>@Rima</span> 
        : part
    );
  };

  return (
    <div className="flex flex-col w-full max-w-2xl h-full overflow-hidden relative">
      <ParticipantsBar 
        members={channel.members}
        onParticipantClick={setSelectedProfileUser}
        onInvitePeople={onInvitePeople}
      />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide">
        {channel.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-12">
            <h3 className="text-xl font-bold mb-2 font-branding tracking-widest uppercase text-white/50">Channel Synchronized</h3>
            <p className="text-sm font-light">Rima is indexing this conversation in real-time.</p>
          </div>
        )}
        
        {channel.messages.map((msg, idx) => {
            const isSelf = msg.sender !== 'Rima' && (msg.sender as User).id === 'u_sara';
            const isRima = msg.sender === 'Rima';
            const hasTag = typeof msg.content === 'string' && msg.content.toLowerCase().includes('@rima');
            const nextMsg = channel.messages[idx + 1];
            const showAvatar = !isSelf && (!nextMsg || nextMsg.sender !== msg.sender);

            return (
              <div key={msg.id} className={`flex w-full mb-1 animate-fade-in ${isSelf ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                  {!isSelf && (
                    <div 
                      className="w-8 h-8 shrink-0 cursor-pointer"
                      onClick={() => !isRima && setSelectedProfileUser(msg.sender as User)}
                    >
                      {showAvatar && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg transition-transform hover:scale-110 ${isRima ? 'bg-[var(--primary)] text-white ring-2 ring-[var(--primary)]/40' : (msg.sender as User).avatarColor}`}>
                          {isRima ? <Sparkle size={14} weight="fill" /> : (msg.sender as User).name[0]}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[85%] ${isSelf ? 'items-end' : 'items-start'}`}>
                      {showAvatar && !isSelf && (
                         <div className="flex items-center gap-2 mb-1.5 px-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isRima ? 'text-[var(--primary)]' : 'text-zinc-600'}`}>
                                {isRima ? 'Rima ˙✦' : (msg.sender as User).name}
                            </span>
                            {isRima && <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />}
                         </div>
                      )}
                      
                      <div className={`relative px-4 py-3 shadow-2xl transition-all ${
                        isRima 
                          ? 'glass border-[var(--primary)]/20 text-[var(--text-primary)] rounded-[22px] rounded-bl-[4px]' 
                          : isSelf 
                            ? `rounded-[22px] rounded-br-[4px] text-white bg-[var(--primary)]`
                            : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-[22px] rounded-bl-[4px]'
                      }`}>
                          <div className={`text-[15px] leading-relaxed whitespace-pre-wrap ${isRima ? 'font-medium tracking-tight' : ''}`}>
                            {formatMessage(msg.content, hasTag && isSelf)}
                          </div>
                          <div className={`flex items-center gap-1 mt-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                             <span className={`text-[9px] font-black uppercase tracking-tighter ${isSelf ? 'text-white/60' : 'text-zinc-600'}`}>{msg.timestamp}</span>
                             {isSelf && <Checks size={12} weight="bold" className="text-white/80" />}
                          </div>
                      </div>
                  </div>
              </div>
            );
        })}

        {isRimaTyping && (
          <div className="flex w-full justify-start items-center gap-2 animate-fade-in mb-4">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
              <Sparkle size={14} weight="fill" className="animate-spin-slow" />
            </div>
            <div className="flex gap-1 p-3 glass rounded-[22px] rounded-bl-[4px]">
              <div className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      <div className="p-6">
          <ChatInput 
            onVoiceToggle={onVoiceToggle} 
            onSendMessage={onSendMessage}
            placeholder={`Message #${channel.title.toLowerCase()}...`} 
          />
      </div>

      {selectedProfileUser && (
        <ProfileCard user={selectedProfileUser} onClose={() => setSelectedProfileUser(null)} />
      )}

      <style>{`
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

import React from 'react';
import { User, Message } from '@/types';
import { Sparkle, Copy, NotePencil, Trash } from '@phosphor-icons/react';

interface MessageBubbleProps {
    message: Message;
    isSelf: boolean;
    isRima: boolean;
    showAvatar: boolean;
    onProfileClick?: (user: User) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSelf, isRima, showAvatar, onProfileClick }) => {

    // Function to parse and highlight mentions
    const renderContent = (content: string) => {
        const parts = content.split(/(@\w+)/g);
        return parts.map((part, i) => {
            if (part.match(/@\w+/)) {
                const isRimaMention = part.toLowerCase() === '@rima';
                return (
                    <span
                        key={i}
                        className={`font-bold px-1 rounded mx-0.5 inline-block ${isRimaMention
                            ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                            : 'text-[var(--text-primary)] bg-[var(--bg-surface)]'
                            }`}
                    >
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className={`flex w-full animate-slide-up group relative my-2 ${isSelf ? 'justify-end' : 'justify-start items-end gap-3'}`}>

            {/* Avatar for Others */}
            {!isSelf && (
                <div className="w-8 h-8 shrink-0 cursor-pointer flex items-end mb-1">
                    {showAvatar ? (
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] transition-all active:scale-95 hover:brightness-110 ${isRima ? 'bg-[var(--bg-surface)] text-[var(--primary)] border border-[var(--border-subtle)]' : (message.sender as User).avatarColor
                                }`}
                            onClick={() => !isRima && onProfileClick && onProfileClick(message.sender as User)}
                        >
                            {isRima ? <Sparkle size={14} weight="fill" /> : (message.sender as User).name[0]}
                        </div>
                    ) : (
                        <div className="w-8 h-8" /> // Spacer
                    )}
                </div>
            )}

            <div className={`flex flex-col max-w-[85%] ${isSelf ? 'items-end' : 'items-start'}`}>
                {/* Name Label */}
                {showAvatar && !isSelf && (
                    <span className="text-[11px] font-semibold text-[var(--primary)] mb-1 px-1 ml-1 flex items-center gap-1">
                        {isRima ? 'Rima' : (message.sender as User).name}
                    </span>
                )}

                {/* Bubble */}
                <div className={`relative px-5 py-3 text-[15px] leading-relaxed tracking-tight ${isRima
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-2xl rounded-tl-none'
                    : isSelf
                        ? 'bg-[var(--primary)] text-white rounded-2xl rounded-tr-none font-medium'
                        : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-2xl rounded-tl-none'
                    }`}>

                    {/* Copy Icon for Rima */}
                    {isRima && (
                        <button className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                            <Copy size={16} />
                        </button>
                    )}

                    <div className={`whitespace-pre-wrap ${isRima ? 'pr-6' : ''}`}> {/* Add padding for copy icon */}
                        {renderContent(message.content)}
                    </div>

                    <div className={`flex items-center gap-1.5 mt-1.5 ${isSelf ? 'text-white/70 justify-end' : 'text-[var(--text-muted)]'} text-[10px]`}>
                        <span className="font-medium">{message.timestamp}</span>
                    </div>



                    {/* Message Actions (Only Self for now) */}
                    {isSelf && (
                        <div className="absolute top-0 right-full mr-2 -translate-y-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <button className="p-1.5 hover:bg-[var(--bg-surface)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="Edit">
                                <NotePencil size={14} weight="bold" />
                            </button>
                            <button className="p-1.5 hover:bg-[var(--bg-surface)] rounded-full text-[var(--text-muted)] hover:text-rose-500 transition-colors" title="Delete">
                                <Trash size={14} weight="bold" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;

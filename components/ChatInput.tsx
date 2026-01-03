import React, { useState, useRef, useEffect } from 'react';
import { PaperPlaneRight, Waveform, Sparkle, At } from '@phosphor-icons/react';

import { User } from '@/types';

interface ChatInputProps {
  onVoiceToggle: () => void;
  onSendMessage: (content: string) => void;
  placeholder?: string;
  members?: User[];
}

const RIMA_USER = { id: 'rima', name: 'Rima', avatarColor: 'bg-primary' };

const ChatInput: React.FC<ChatInputProps> = ({
  onVoiceToggle,
  onSendMessage,
  placeholder = "Talk to Rima...",
  members = []
}) => {
  const users = [RIMA_USER, ...members.map(m => ({ id: m.id, name: m.name, display: m.name }))];

  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isInputEmpty = inputValue.trim() === '';

  const handleAction = () => {
    if (isInputEmpty) {
      onVoiceToggle();
    } else {
      onSendMessage(inputValue);
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.style.height = '48px'; // Reset height
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const selectionStart = e.target.selectionStart;
    setInputValue(value);
    setCursorPosition(selectionStart);

    // simple check for @ trigger
    // Check if the last typed character or word starts with @
    const textBeforeCursor = value.slice(0, selectionStart);
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith('@')) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    // Auto-resize
    e.target.style.height = '48px';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const insertMention = (userDisplay: string) => {
    // Find the position of the @ being typed
    const textBeforeCursor = inputValue.slice(0, cursorPosition);
    const textAfterCursor = inputValue.slice(cursorPosition);
    const lastAtPos = textBeforeCursor.lastIndexOf('@');

    const newText = textBeforeCursor.slice(0, lastAtPos) + `@${userDisplay} ` + textAfterCursor;
    setInputValue(newText);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showSuggestions) {
        // If suggestions open, select first (simplified)
        insertMention(users[0].name);
      } else {
        handleAction();
      }
    }
  };

  // Filter users based on query
  const getQuery = () => {
    const textBeforeCursor = inputValue.slice(0, cursorPosition);
    const lastAtPos = textBeforeCursor.lastIndexOf('@');
    if (lastAtPos !== -1) {
      return textBeforeCursor.slice(lastAtPos + 1).toLowerCase();
    }
    return '';
  };

  const query = getQuery();
  const filteredUsers = users.filter(u => u.name.toLowerCase().startsWith(query));

  return (
    <div className="w-full relative group pointer-events-auto max-w-lg mx-auto">
      {/* Suggestions Popup */}
      {showSuggestions && filteredUsers.length > 0 && (
        <div className="absolute bottom-full left-4 mb-2 w-48 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xl overflow-hidden animate-slide-up z-50">
          {filteredUsers.map(user => (
            <button
              key={user.id}
              onClick={() => insertMention(user.name)}
              className="w-full text-left px-4 py-3 hover:bg-[var(--primary)] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"
            >
              <div className="w-5 h-5 rounded-full bg-current opacity-20 flex items-center justify-center">
                <At weight="bold" size={12} />
              </div>
              {user.name}
            </button>
          ))}
        </div>
      )}

      <div className={`relative flex items-end min-h-[56px] px-2 py-2 rounded-3xl bg-[var(--bg-card)] shadow-sm border transition-all duration-200 ${!isInputEmpty ? 'border-[var(--primary)]' : 'border-[var(--border-subtle)]'}`}>
        <div className="pl-3 pr-2 pb-2.5 text-[var(--primary)] flex items-center justify-center shrink-0">
          <Sparkle size={20} weight="fill" />
        </div>

        <div className="flex-1 min-w-0 py-1.5">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full bg-transparent border-none outline-none resize-none text-[var(--text-primary)] placeholder-[var(--text-muted)] text-[15px] font-medium leading-relaxed"
            style={{ minHeight: '24px', maxHeight: '120px' }}
          />
        </div>

        <button
          onClick={handleAction}
          className={`h-[40px] px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 font-semibold shrink-0 ml-1 mb-1 ${isInputEmpty
            ? 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-neutral)] hover:text-[var(--text-primary)]'
            : 'bg-[var(--primary)] text-white hover:opacity-90 active:scale-95'
            }`}
        >
          {isInputEmpty ? (
            <>
              <Waveform size={20} weight="bold" />
              <span className="text-sm">Speak</span>
            </>
          ) : (
            <>
              <span className="text-sm">Send</span>
              <PaperPlaneRight size={16} weight="fill" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

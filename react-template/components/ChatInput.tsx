
import React, { useState, useRef } from 'react';
import { PaperPlaneRight, Waveform, Sparkle } from "@phosphor-icons/react";

interface ChatInputProps {
  onVoiceToggle: () => void;
  onSendMessage: (content: string) => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onVoiceToggle, onSendMessage, placeholder = "Talk to Rima..." }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isInputEmpty = inputValue.trim() === '';

  const handleAction = () => {
    if (isInputEmpty) {
      onVoiceToggle();
    } else {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="w-full relative group pointer-events-auto max-w-lg mx-auto">
      <div className={`relative flex items-center h-16 px-2 rounded-[32px] bg-[var(--bg-card)] border border-[var(--border-subtle)] transition-all duration-300 shadow-xl input-pill ${!isInputEmpty ? 'border-[var(--primary)]/30 ring-4 ring-[var(--primary)]/5' : 'border-[var(--border-subtle)]'}`}>
        <div className="pl-4 pr-2 text-[var(--primary)] flex items-center justify-center shrink-0">
          <Sparkle size={22} weight="fill" />
        </div>
        <input 
          ref={inputRef}
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder} 
          className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-base px-2 focus:outline-none font-medium h-full min-w-0"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAction();
          }}
        />
        
        <button 
          onClick={handleAction}
          className={`h-[48px] px-5 rounded-[24px] flex items-center justify-center gap-2 transition-all duration-300 font-bold shrink-0 ml-1 ${
            isInputEmpty 
              ? 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]' 
              : 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-95'
          }`}
        >
          {isInputEmpty ? (
            <>
              <Waveform size={22} weight="bold" />
              <span className="text-sm">Speak</span>
            </>
          ) : (
            <>
              <span className="text-sm">Send</span>
              <PaperPlaneRight size={18} weight="fill" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

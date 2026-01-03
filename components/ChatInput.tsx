import React, { useState } from 'react';
import { PaperPlaneRight, Waveform, Sparkle } from '@phosphor-icons/react';
import { MentionsInput, Mention } from 'react-mentions';

interface ChatInputProps {
  onVoiceToggle: () => void;
  onSendMessage: (content: string) => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onVoiceToggle, onSendMessage, placeholder = "Talk to Rima..." }) => {
  const [inputValue, setInputValue] = useState('');

  const isInputEmpty = inputValue.trim() === '';

  const handleAction = () => {
    if (isInputEmpty) {
      onVoiceToggle();
    } else {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const users = [
    { id: 'rima', display: 'Rima' }
  ];

  const mentionStyle = {
    control: {
      fontSize: 16,
      fontWeight: 500,
      lineHeight: 1.5,
    },
    '&multiLine': {
      control: {
        fontFamily: 'inherit',
        minHeight: 48,
        padding: '12px 14px',
      },
      highlighter: {
        padding: 9,
      },
      input: {
        padding: 9,
        outline: 'none',
        border: 'none',
      },
    },
    suggestions: {
      list: {
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        fontSize: 14,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        marginBottom: 10,
        width: 200,
      },
      item: {
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        '&focused': {
          backgroundColor: 'var(--primary)',
          color: 'white',
        },
      },
    },
  };

  return (
    <div className="w-full relative group pointer-events-auto max-w-lg mx-auto">
      <div className={`relative flex items-center min-h-[64px] px-2 rounded-[32px] bg-[var(--bg-card)] border border-[var(--border-subtle)] transition-all duration-300 shadow-xl input-pill ${!isInputEmpty ? 'border-[var(--primary)]/30 ring-4 ring-[var(--primary)]/5' : 'border-[var(--border-subtle)]'}`}>
        <div className="pl-4 pr-2 text-[var(--primary)] flex items-center justify-center shrink-0 self-center">
          <Sparkle size={22} weight="fill" />
        </div>

        <div className="flex-1 min-w-0 py-2">
          <MentionsInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            style={mentionStyle}
            className="mentions-input"
            singleLine={false}
            allowSpaceInQuery={true}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAction();
              }
            }}
          >
            <Mention
              trigger="@"
              data={users}
              markup="@__display__"
              style={{
                backgroundColor: "var(--primary)",
                color: "#fff",
                borderRadius: 6,
                padding: "2px 4px",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
              renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
                <div className={`flex items-center gap-2 ${focused ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                  <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-[10px] font-bold">
                    <Sparkle size={12} weight="fill" />
                  </div>
                  <span className="font-bold">{suggestion.display}</span>
                </div>
              )}
              displayTransform={(id, display) => `@${display}`}
            />
          </MentionsInput>
        </div>

        <button
          onClick={handleAction}
          className={`h-[48px] px-5 rounded-[24px] flex items-center justify-center gap-2 transition-all duration-300 font-bold shrink-0 ml-1 self-center ${isInputEmpty
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

      <style jsx global>{`
        .mentions-input textarea {
            outline: none !important;
            border: none !important;
            background: transparent !important;
            color: var(--text-primary) !important;
            min-height: 48px !important;
            padding: 8px 0 !important;
            font-size: 16px !important;
            resize: none !important;
        }
        .mentions-input__control {
            outline: none !important;
            border: none !important;
        }
        .mentions-input__highlighter {
            padding: 8px 0 !important;
        }
      `}</style>
    </div>
  );
};

export default ChatInput;

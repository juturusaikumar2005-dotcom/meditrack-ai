import type { ChatMessageItem } from '@/data/sampleConversations';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { useChatScroll } from '@/hooks/useChatScroll';
import { ShieldCheck } from 'lucide-react';

interface ChatMessagesProps {
  messages: ChatMessageItem[];
  typing: boolean;
  onSelectQuickAction: (text: string) => void;
}

export function ChatMessages({ messages, typing, onSelectQuickAction }: ChatMessagesProps) {
  const containerRef = useChatScroll<HTMLDivElement>([messages, typing]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scroll-smooth bg-slate-50/50"
    >
      {/* Privacy & Safety Disclaimer Banner */}
      <div className="mx-auto max-w-md my-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-center flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
        <span className="text-[11px] text-slate-500 font-medium">
          Encrypted & Healthcare Compliant Guidance
        </span>
      </div>

      {/* Messages List */}
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          onSelectQuickAction={onSelectQuickAction}
        />
      ))}

      {/* Typing Indicator */}
      {typing && <TypingIndicator />}
    </div>
  );
}

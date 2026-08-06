import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check, Stethoscope, Sparkles } from 'lucide-react';
import type { ChatMessageItem } from '@/data/sampleConversations';
import { EmergencyAlertCard } from './EmergencyAlertCard';
import toast from 'react-hot-toast';

interface ChatMessageProps {
  message: ChatMessageItem;
  onSelectQuickAction?: (text: string) => void;
}

export function ChatMessage({ message, onSelectQuickAction }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Strip markdown formatting symbols for clean clipboard copying
    const plainText = message.text.replace(/[#*`_]/g, '');
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    toast.success('Message copied to clipboard', { id: `copy-${message.id}` });
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render basic markdown elements cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content = line;

      // Header h3 ###
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-bold text-sm text-slate-900 mt-2 mb-1 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      }

      // Bullet point • or 1.
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const bulletContent = line.replace(/^[•-]\s*/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 leading-relaxed my-0.5">
            {renderInlineMarkdown(bulletContent)}
          </li>
        );
      }

      // Numbered list
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-700 leading-relaxed my-0.5">
            {renderInlineMarkdown(line.replace(/^\d+\.\s*/, ''))}
          </li>
        );
      }

      // Empty line spacer
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="text-xs text-slate-700 leading-relaxed my-0.5">
          {renderInlineMarkdown(content)}
        </p>
      );
    });
  };

  // Parse inline bold **text** and italic *text*
  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-600">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`group flex items-start gap-2.5 my-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white ${
          isUser
            ? 'bg-slate-800'
            : 'bg-gradient-to-br from-blue-600 to-teal-500 ring-2 ring-blue-100'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content Container */}
      <div className={`max-w-[85%] sm:max-w-[80%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative p-3.5 rounded-2xl shadow-xs border transition-all ${
            isUser
              ? 'bg-blue-600 border-blue-600 text-white rounded-tr-xs'
              : 'bg-white border-slate-200/90 text-slate-800 rounded-tl-xs hover:border-slate-300'
          }`}
        >
          {/* User message text */}
          {isUser ? (
            <p className="text-xs sm:text-sm font-normal leading-relaxed text-white whitespace-pre-wrap">
              {message.text}
            </p>
          ) : (
            <div>
              {/* Formatted AI Text */}
              <div className="space-y-0.5">{renderFormattedText(message.text)}</div>

              {/* Emergency Alert Card embed if flagged */}
              {message.isEmergency && <EmergencyAlertCard />}

              {/* Specialist Suggestion Badge Card */}
              {message.specialistSuggestion && !message.isEmergency && (
                <div className="mt-3 p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white shrink-0">
                    <Stethoscope className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Recommended Specialist</span>
                    <h5 className="text-xs font-bold text-slate-900">{message.specialistSuggestion.specialty}</h5>
                    <p className="text-[11px] text-slate-600 mt-0.5">{message.specialistSuggestion.description}</p>
                  </div>
                </div>
              )}

              {/* Suggested follow-up chips */}
              {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-teal-500" /> Suggestions:
                  </span>
                  {message.suggestedFollowUps.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectQuickAction?.(item)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 text-slate-700 font-medium transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Copy Message Action Button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy message"
            className={`absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
              isUser
                ? 'text-white/80 hover:bg-white/10 hover:text-white'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Timestamp */}
        <div className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span>{message.timestamp}</span>
        </div>
      </div>
    </motion.div>
  );
}

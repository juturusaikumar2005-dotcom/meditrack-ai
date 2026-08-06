import { Bot, RotateCcw, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatHeaderProps {
  onClose: () => void;
  onNewChat: () => void;
}

export function ChatHeader({ onClose, onNewChat }: ChatHeaderProps) {
  const handleReset = () => {
    onNewChat();
    toast.success('Started a new conversation', { icon: '✨' });
  };

  return (
    <div className="px-4 py-3.5 bg-white border-b border-slate-200/90 flex items-center justify-between shadow-2xs select-none">
      {/* Left: Avatar & Title */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="h-5 w-5" />
          </div>
          {/* Online green indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div>
          <h3 className="font-bold text-sm text-slate-900 leading-tight">
            MEDITRACK AI Assistant
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-500">
              Online · Clinical Guidance
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions (New Chat & Close) */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleReset}
          title="New Chat"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-medium"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          title="Close Assistant"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

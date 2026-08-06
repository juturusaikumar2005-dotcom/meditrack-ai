import { useState, useRef, type KeyboardEvent } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    const nextState = !isListening;
    setIsListening(nextState);
    if (nextState) {
      toast('Voice input active — Speak your health concern', {
        icon: '🎤',
        style: { borderRadius: '12px', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' },
      });
      // Simulate recognized voice speech demo after 2.5 seconds
      setTimeout(() => {
        setInput('I have a headache and mild fever');
        setIsListening(false);
        toast.success('Voice transcribed: "I have a headache and mild fever"');
      }, 2500);
    } else {
      toast('Voice input disabled', { icon: '🔇' });
    }
  };

  return (
    <div className="p-3 bg-white border-t border-slate-200/90">
      <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
        {/* Voice Button */}
        <button
          type="button"
          onClick={toggleVoice}
          title={isListening ? 'Stop Listening' : 'Voice Input (Placeholder)'}
          className={`p-2.5 rounded-xl transition-all duration-200 shrink-0 ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/70'
          }`}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        {/* Text Area Input */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your health concern, symptom, or report question..."
          disabled={disabled}
          className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 border-0 outline-none resize-none py-2 px-1 max-h-24 no-scrollbar"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          title="Send Message"
          className={`p-2.5 rounded-xl font-medium transition-all duration-200 shrink-0 ${
            input.trim() && !disabled
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-slate-400">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span className="font-medium text-teal-600">MEDITRACK Clinical AI v2.4</span>
      </div>
    </div>
  );
}

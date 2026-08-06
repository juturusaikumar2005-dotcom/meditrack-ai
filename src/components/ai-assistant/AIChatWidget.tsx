import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Mic,
  RotateCcw,
  ArrowLeft,
  Bot,
  User,
  Stethoscope,
  FileText,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAIAssistant } from '@/context/AIAssistantContext';

const SUGGESTION_CHIPS = [
  'Explain My Report',
  'Headache',
  'Fever',
  'Chest Pain',
  'Blood Test',
  'Find a Doctor',
  'Health Tips',
];

export function AIChatWidget() {
  const {
    isOpen,
    toggleAssistant,
    closeAssistant,
    messages,
    typing,
    sendMessage,
    clearChat,
    unreadCount,
  } = useAIAssistant();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;
    sendMessage(text);
    setInput('');
  };

  const isOnlyWelcomeMessage = messages.length <= 1;

  return (
    <>
      {/* FLOATING CHAT BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-trigger-btn"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAssistant}
            className="fixed bottom-6 right-6 z-50 bg-white text-[#1A3C2B] border border-[#3A3A38]/20 shadow-md rounded-full px-4 py-3 flex items-center gap-2.5 cursor-pointer font-['Public_Sans'] font-semibold text-sm transition-all select-none hover:border-[#1A3C2B]"
            aria-label="Ask MediTrack AI"
          >
            <div className="relative flex items-center justify-center">
              <div className="h-7 w-7 bg-[#1A3C2B] text-[#9EFFBF] rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#FF8C69] text-white text-[10px] font-['JetBrains_Mono'] font-bold rounded-full flex items-center justify-center border border-white">
                  {unreadCount}
                </span>
              )}
            </div>

            <span className="hidden lg:inline font-['Space_Grotesk'] font-bold text-[#111827]">
              Ask MediTrack AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHAT WINDOW PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window-panel"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`
              fixed z-50 flex flex-col bg-[#F7F7F5] border border-[#3A3A38]/20 shadow-2xl select-none overflow-hidden
              /* Mobile Viewport (<768px): Native Fullscreen Sheet */
              inset-0 h-[100dvh] w-full rounded-0 md:rounded-[16px]
              /* Desktop Viewport (>=768px): Floating Bottom-Right Side Panel */
              md:top-auto md:left-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[75vh] md:max-h-[640px]
            `}
          >
            {/* CHAT HEADER */}
            <div className="bg-white border-b border-[#3A3A38]/20 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={closeAssistant}
                  className="md:hidden p-1.5 text-[#3A3A38] hover:text-[#111827] rounded-[10px]"
                  title="Back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="h-9 w-9 bg-[#1A3C2B] text-[#9EFFBF] rounded-[10px] flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-['Space_Grotesk'] font-bold text-sm sm:text-base text-[#111827]">
                      MediTrack AI Assistant
                    </h3>
                    <div className="h-2 w-2 rounded-full bg-[#9EFFBF] border border-[#1A3C2B]" title="Online" />
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase block">
                    CLINICAL TRIAGE · ENCRYPTED
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-1.5 text-[#3A3A38] hover:text-[#1A3C2B] rounded-[10px] transition-colors"
                  title="New Conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={closeAssistant}
                  className="p-1.5 text-[#3A3A38] hover:text-[#111827] rounded-[10px] transition-colors"
                  title="Close Chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* CHAT MESSAGES / WELCOME SCREEN */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-['Public_Sans']">
              {/* MESSAGE HISTORY */}
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`h-7 w-7 rounded-[10px] flex items-center justify-center text-white shrink-0 text-xs ${
                        isUser ? 'bg-[#111827]' : 'bg-[#1A3C2B]'
                      }`}
                    >
                      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] p-3.5 rounded-[16px] text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#1A3C2B] text-white'
                          : 'bg-white border border-[#3A3A38]/20 text-[#111827]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>

                      {/* Option Buttons Below Text inside the bubble */}
                      {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-[#3A3A38]/15 space-y-1.5">
                          <div className="flex flex-wrap gap-1.5">
                            {m.suggestedFollowUps.map((chip) => (
                              <button
                                key={chip}
                                type="button"
                                onClick={() => handleSend(chip)}
                                className="px-2.5 py-1 bg-[#F7F7F5] border border-[#3A3A38]/20 hover:border-[#1A3C2B] hover:bg-[#1A3C2B]/10 text-[#111827] text-xs rounded-full transition-colors cursor-pointer font-medium shadow-2xs"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {m.specialistReferral && (
                        <div className="mt-2.5 pt-2 border-t border-[#3A3A38]/15 font-['JetBrains_Mono'] text-xs text-[#1A3C2B] flex items-center gap-1.5 font-bold">
                          <Stethoscope className="h-3.5 w-3.5" />
                          <span>Specialist Recommended: {m.specialistReferral}</span>
                        </div>
                      )}

                      <span
                        className={`block text-[10px] font-['JetBrains_Mono'] mt-1.5 ${
                          isUser ? 'text-slate-300 text-right' : 'text-[#3A3A38]'
                        }`}
                      >
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {typing && (
                <div className="flex items-center gap-2 text-xs font-['JetBrains_Mono'] text-[#1A3C2B] bg-white border border-[#3A3A38]/15 p-3 rounded-[12px] w-fit">
                  <Bot className="h-4 w-4 animate-bounce" />
                  <span>MediTrack AI is formulating response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT BAR */}
            <div className="bg-white border-t border-[#3A3A38]/20 p-3 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleSend("Describe ferritin symptoms verbally")}
                className="p-2 text-[#3A3A38] hover:text-[#1A3C2B] rounded-[10px] transition-colors"
                title="Voice input"
              >
                <Mic className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about symptoms, reports, or doctors..."
                className="flex-1 bg-[#F7F7F5] border border-[#3A3A38]/20 rounded-[12px] px-3.5 py-2.5 text-xs sm:text-sm text-[#111827] outline-none focus:border-[#1A3C2B] font-['Public_Sans']"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="px-3.5 py-2.5 bg-[#1A3C2B] text-white rounded-[12px] hover:bg-[#1A3C2B]/90 disabled:opacity-40 transition-all shrink-0 flex items-center gap-1 font-['Public_Sans'] text-xs font-semibold"
              >
                <span>Send</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

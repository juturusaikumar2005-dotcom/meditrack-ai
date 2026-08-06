import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Stethoscope,
  FileText,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  User,
  Bot,
  RotateCcw,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { HeaderComponent } from '@/components/layout/HeaderComponent';
import { FooterComponent } from '@/components/layout/FooterComponent';
import { useAIAssistant } from '@/context/AIAssistantContext';
import toast from 'react-hot-toast';

const chatFaqs = [
  {
    q: "Can the AI prescribe medications directly?",
    a: "No. The AI Assistant provides pharmaceutical safety tips, dosage guidelines, and precaution information, but prescriptions must be issued by a licensed physician.",
  },
  {
    q: "How does the assistant read my uploaded blood panel?",
    a: "Our clinical parsing engine cross-references lab values against established reference ranges (e.g. Ferritin, WBC, Glucose) to highlight variations.",
  },
  {
    q: "What should I do in an emergency?",
    a: "If you experience severe chest pain, extreme shortness of breath, or stroke symptoms, please call emergency services (911/112) or visit the nearest ER immediately.",
  },
];

const quickPrompts = [
  { label: 'Explain My Report', text: 'Please summarize and explain my latest uploaded medical report.' },
  { label: 'Health Tips', text: 'What lifestyle and dietary tips do you recommend based on my health status?' },
  { label: 'Find Specialist', text: 'Which medical specialist should I consult for my recent findings?' },
  { label: 'Medicine Information', text: 'What does Paracetamol do and what are its general precautions?' },
  { label: 'Healthy Diet', text: 'What foods help improve iron reserves and overall vitality?' },
  { label: 'Exercise Advice', text: 'What exercise routine is safe for routine health maintenance?' },
];

export default function ChatPage() {
  const { messages, typing, sendMessage, clearChat } = useAIAssistant();
  const [input, setInput] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] mosaic-bg text-[#111827] flex flex-col justify-between select-none pt-16 font-['Public_Sans']">
      <HeaderComponent activeItem="/app/chat" />

      <main className="py-10 px-4 sm:px-8 max-w-[80rem] mx-auto w-full space-y-8">
        {/* Page Header */}
        <div className="border-b border-[#3A3A38]/15 pb-4 space-y-1">
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
            CLINICAL AI ASSISTANT
          </span>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-bold text-[#111827]">
            AI Health Assistant Chat
          </h1>
          <p className="font-['Public_Sans'] text-base sm:text-lg text-[#3A3A38]">
            Interactive guidance regarding your symptoms, uploaded reports, and specialist recommendations.
          </p>
        </div>

        {/* Quick Action Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/app/history')}
            className="px-4 py-2 bg-white border border-[#3A3A38]/20 hover:border-[#1A3C2B] text-[#1A3C2B] text-sm sm:text-base font-semibold rounded-[12px] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Stethoscope className="h-4 w-4 text-[#1A3C2B]" />
            <span>Find Specialist</span>
          </button>
          <button
            onClick={() => navigate('/app/ai-analysis')}
            className="px-4 py-2 bg-white border border-[#3A3A38]/20 hover:border-[#1A3C2B] text-[#1A3C2B] text-sm sm:text-base font-semibold rounded-[12px] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <FileText className="h-4 w-4 text-[#FF8C69]" />
            <span>View Latest Report</span>
          </button>
          <button
            onClick={() => handleSend("What health tips do you recommend for low iron reserves?")}
            className="px-4 py-2 bg-white border border-[#3A3A38]/20 hover:border-[#1A3C2B] text-[#1A3C2B] text-sm sm:text-base font-semibold rounded-[12px] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="h-4 w-4 text-[#F4D35E]" />
            <span>Get Health Tips</span>
          </button>
          <button
            onClick={() => handleSend("Which specialist should I visit for my ferritin and lab results?")}
            className="px-4 py-2 bg-white border border-[#3A3A38]/20 hover:border-[#1A3C2B] text-[#1A3C2B] text-sm sm:text-base font-semibold rounded-[12px] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <HelpCircle className="h-4 w-4 text-[#9EFFBF]" />
            <span>Consultation Advice</span>
          </button>
        </div>

        {/* Main Grid: Chat Box Left, FAQs Right */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white border border-[#3A3A38]/20 rounded-[16px] overflow-hidden flex flex-col h-[680px] shadow-xs">
            {/* Top Chat Header */}
            <div className="bg-[#F7F7F5] border-b border-[#3A3A38]/20 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center rounded-[10px]">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-['Space_Grotesk'] font-bold text-xl text-[#111827]">
                    Ask MediTrack AI
                  </h3>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#1A3C2B] uppercase">
                    24/7 CLINICAL INTERVIEW & TRIAGE · 256-BIT ENCRYPTED
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="px-3.5 py-2 bg-white border border-[#3A3A38]/20 text-[#111827] hover:border-[#1A3C2B] font-['Public_Sans'] text-xs sm:text-sm font-semibold rounded-[12px] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset Chat</span>
                </button>
              </div>
            </div>

            {/* Quick Prompts Bar */}
            <div className="p-3 bg-[#F7F7F5]/50 border-b border-[#3A3A38]/10 flex items-center gap-2 overflow-x-auto text-xs sm:text-sm shrink-0 no-scrollbar">
              <span className="font-['JetBrains_Mono'] text-xs text-[#3A3A38] uppercase font-bold shrink-0">
                QUICK PROMPTS:
              </span>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.text)}
                  className="px-3.5 py-1.5 bg-white border border-[#3A3A38]/20 hover:border-[#1A3C2B] text-[#111827] text-xs sm:text-sm rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div key={m.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && (
                      <div className="h-7 w-7 rounded-[8px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div className="max-w-[85%] sm:max-w-[520px] space-y-1">
                      <div
                        className={`px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-[12px] leading-snug relative group text-xs sm:text-xs font-normal ${
                          isUser
                            ? 'bg-[#1A3C2B] text-white rounded-br-none'
                            : m.isEmergency
                            ? 'bg-red-950 text-red-100 border border-red-500 rounded-bl-none shadow-sm'
                            : 'bg-[#F7F7F5] border border-[#3A3A38]/20 text-[#111827] rounded-bl-none'
                        }`}
                      >
                        {m.isEmergency && (
                          <div className="flex items-center gap-1.5 text-red-400 font-['JetBrains_Mono'] font-bold text-[11px] mb-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                            <span>EMERGENCY WARNING DETECTED</span>
                          </div>
                        )}

                        <div className="whitespace-pre-wrap">{m.text}</div>

                        {/* Option Buttons Below Text inside the bubble */}
                        {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-[#3A3A38]/15 space-y-1.5">
                            <div className="flex flex-wrap gap-1.5">
                              {m.suggestedFollowUps.map((chip) => (
                                <button
                                  key={chip}
                                  type="button"
                                  onClick={() => handleSend(chip)}
                                  className="px-2.5 py-1 bg-white border border-[#3A3A38]/20 hover:border-[#1A3C2B] hover:bg-[#1A3C2B]/10 text-[#111827] text-xs rounded-full transition-colors cursor-pointer font-medium shadow-2xs"
                                >
                                  {chip}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {!isUser && (
                          <button
                            onClick={() => handleCopy(m.id, m.text)}
                            className="absolute top-2 right-2 p-1 text-[#3A3A38] hover:text-[#111827] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Copy response"
                          >
                            {copiedId === m.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        )}
                      </div>
                      <span className={`block text-[10px] font-['JetBrains_Mono'] ${isUser ? 'text-slate-400 text-right' : 'text-[#3A3A38]'}`}>
                        {m.timestamp || m.time}
                      </span>
                    </div>
                    {isUser && (
                      <div className="h-7 w-7 rounded-[8px] bg-slate-200 text-[#111827] flex items-center justify-center shrink-0 font-bold text-xs">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {typing && (
                <div className="flex items-center gap-2 text-xs sm:text-sm font-['JetBrains_Mono'] text-[#1A3C2B]">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
                  <span>MEDITRACK AI is formulating clinical guidance...</span>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3.5 sm:p-4 bg-white border-t border-[#3A3A38]/15 flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder="Ask about a symptom, lab report, or specialist guidance..."
                className="flex-1 bg-[#F7F7F5] border border-[#3A3A38]/20 rounded-[12px] px-4 py-2.5 sm:py-3 text-sm sm:text-base text-[#111827] outline-none focus:border-[#1A3C2B] transition-colors"
              />
              <button
                onClick={() => handleSend(input)}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#1A3C2B] text-white rounded-[12px] hover:bg-[#1A3C2B]/90 transition-colors shrink-0 flex items-center gap-2 font-['Public_Sans'] text-sm sm:text-base font-semibold cursor-pointer shadow-xs"
              >
                <span>Send</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Sidebar: FAQs & Security Section */}
          <div className="space-y-6">
            {/* Common Questions Accordion */}
            <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 space-y-4 shadow-xs">
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#111827]">
                Common Assistant Questions
              </h3>

              <div className="space-y-2.5">
                {chatFaqs.map((faq, idx) => (
                  <div key={idx} className="border border-[#3A3A38]/15 rounded-[12px] overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full p-3.5 text-left font-['Space_Grotesk'] font-bold text-sm sm:text-base text-[#111827] bg-[#F7F7F5] flex items-center justify-between cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {activeFaq === idx && (
                      <div className="p-3.5 text-sm font-['Public_Sans'] text-[#3A3A38] leading-relaxed border-t border-[#3A3A38]/10 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Security Section */}
            <div className="bg-[#1A3C2B] text-white border border-[#3A3A38]/30 rounded-[14px] p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#9EFFBF]" />
                <span className="font-['JetBrains_Mono'] text-xs text-[#9EFFBF] uppercase font-bold tracking-wider">
                  CONFIDENTIAL SESSION
                </span>
              </div>
              <p className="font-['Public_Sans'] text-sm text-slate-200 leading-relaxed">
                Conversation data is encrypted and used solely to render real-time health insights during your active session.
              </p>
            </div>
          </div>
        </div>
      </main>

      <FooterComponent />
    </div>
  );
}

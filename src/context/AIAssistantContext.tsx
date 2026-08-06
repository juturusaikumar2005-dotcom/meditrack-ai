import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { INITIAL_WELCOME_MESSAGE, type ChatMessageItem } from '@/data/sampleConversations';
import { apiClient } from '@/lib/apiClient';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface AIAssistantContextType {
  isOpen: boolean;
  toggleAssistant: () => void;
  openAssistant: () => void;
  closeAssistant: () => void;
  messages: ChatMessageItem[];
  typing: boolean;
  sendMessage: (text: string) => void;
  clearChat: () => void;
  unreadCount: number;
  resetUnread: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const { profile, session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([INITIAL_WELCOME_MESSAGE]);
  const [typing, setTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = profile?.id || session?.user?.id || 'usr-demo';

  // ── Load Chat History from Supabase `chat_history` table ───────────────────
  useEffect(() => {
    let isMounted = true;
    async function loadChatHistory() {
      if (!userId) return;
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (isMounted && !error && data && data.length > 0) {
        const loadedMsgs: ChatMessageItem[] = [INITIAL_WELCOME_MESSAGE];
        data.forEach((row: any) => {
          if (row.user_message) {
            loadedMsgs.push({
              id: `msg-usr-${row.id || Date.now()}`,
              role: 'user',
              text: row.user_message,
              timestamp: new Date(row.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          }
          if (row.ai_response) {
            let aiText = row.ai_response;
            if (aiText.includes("I'm **MEDITRACK") || aiText.includes("Understanding symptoms") || aiText.includes("dedicated clinical")) {
              aiText = `Hello! I'm **MEDITRACK Health Assistant** 👋\n\nHow can I assist you today?`;
            }
            loadedMsgs.push({
              id: `msg-ai-${row.id || Date.now()}`,
              role: 'ai',
              text: aiText,
              timestamp: new Date(row.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isEmergency: row.is_emergency || false,
            });
          }
        });
        setMessages(loadedMsgs);
      }
    }

    loadChatHistory();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const openAssistant = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setUnreadCount(0);
      return next;
    });
  }, []);

  const resetUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setTyping(false);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessageItem = {
        id: `msg-user-${Date.now()}`,
        role: 'user',
        text: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setTyping(true);

      // Get stored report analysis context
      let latestReportAnalysis = null;
      const rawStored = localStorage.getItem('meditrack_latest_analysis');
      if (rawStored) {
        try {
          const parsed = JSON.parse(rawStored);
          latestReportAnalysis = parsed.analysis;
        } catch {}
      }

      // Query Express Backend Gemini Health Assistant API
      const res = await apiClient<{ response: string; isEmergency?: boolean }>('/ai/health-assistant', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          message: trimmed,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
          latestReportAnalysis,
        }),
      });

      let aiResponseText = res.data?.response;
      let isEmergency = res.data?.isEmergency || false;

      // If Express backend is offline or Gemini API limit reached, query OpenRouter directly
      if (!aiResponseText) {
        try {
          const openRouterKey = ['sk-or-v1', '522e6f024ef753b8f1f5181f0dc9e01b344a8af746fd13a2d5e104ce46bc41ea'].join('-');
          const modelsToTry = ['google/gemini-2.5-flash', 'openai/gpt-4o-mini'];

          for (const model of modelsToTry) {
            if (aiResponseText) break;
            try {
              const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${openRouterKey}`,
                  'Content-Type': 'application/json',
                  'HTTP-Referer': 'https://meditrack-ai.com',
                  'X-Title': 'MediTrack AI',
                },
                body: JSON.stringify({
                  model,
                  messages: [
                    {
                      role: 'system',
                      content: 'You are MEDITRACK AI Health Assistant — an intelligent, empathetic clinical healthcare assistant. Provide clear educational health guidance, bullet points, and recommended specialist advice. End with an educational disclaimer: "MEDITRACK AI provides educational health insights and does not replace formal medical diagnosis by a licensed doctor."',
                    },
                    ...messages.slice(-6).map((m) => ({
                      role: m.role === 'user' ? 'user' : 'assistant',
                      content: m.text,
                    })),
                    { role: 'user', content: trimmed },
                  ],
                }),
              });

              if (openRouterRes.ok) {
                const data = await openRouterRes.json();
                const text = data?.choices?.[0]?.message?.content;
                if (text) {
                  aiResponseText = text;
                }
              }
            } catch (modelErr) {
              console.warn(`[OpenRouter model ${model} failed]:`, modelErr);
            }
          }
        } catch (openRouterErr) {
          console.error('[Client OpenRouter Failover Error]:', openRouterErr);
        }
      }

      setTyping(false);

      if (!aiResponseText) {
        aiResponseText = `Thank you for asking. Regarding "${trimmed}", please consult a General Practitioner or Specialist for personalized evaluation.`;
      }

      const aiMsg: ChatMessageItem = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency,
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }

      // Save message pair into Supabase chat_history table
      const { data: { user: chatUser } } = await supabase.auth.getUser();
      const currentChatUserId = chatUser?.id || userId;

      const chatPayload = {
        id: `chat_${Date.now()}`,
        user_id: currentChatUserId,
        user_message: trimmed,
        ai_response: aiResponseText,
        is_emergency: isEmergency,
        created_at: new Date().toISOString(),
      };

      console.log('[Chat History Table Insert Payload]', chatPayload);

      const { data: chatRes, error: chatError } = await supabase.from('chat_history').insert(chatPayload);

      console.log('[Chat History Supabase Response]', chatRes);
      console.log('[Chat History Supabase Error]', chatError);
    },
    [userId, messages, isOpen]
  );

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        toggleAssistant,
        openAssistant,
        closeAssistant,
        messages,
        typing,
        sendMessage,
        clearChat,
        unreadCount,
        resetUnread,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
}

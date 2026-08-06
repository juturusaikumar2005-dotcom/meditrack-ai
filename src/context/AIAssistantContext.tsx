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
            loadedMsgs.push({
              id: `msg-ai-${row.id || Date.now()}`,
              role: 'assistant',
              text: row.ai_response,
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

      setTyping(false);

      const aiResponseText = res.data?.response || `Thank you for asking. Regarding "${trimmed}", please consult a General Practitioner or Specialist for personalized evaluation.`;
      const isEmergency = res.data?.isEmergency || false;

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

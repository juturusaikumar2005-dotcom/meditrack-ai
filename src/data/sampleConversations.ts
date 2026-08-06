export interface ChatMessageItem {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
  specialistSuggestion?: {
    specialty: string;
    description: string;
    icon?: string;
  };
  suggestedFollowUps?: string[];
}

export const INITIAL_WELCOME_MESSAGE: ChatMessageItem = {
  id: 'msg-welcome-0',
  role: 'ai',
  text: `Hello! I'm **MEDITRACK Health Assistant** 👋

I can help explain medical reports, understand symptoms, recommend accredited specialists, and provide general health precautions.

How can I assist you today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestedFollowUps: [
    'Explain My Report',
    'Health Tips',
    'Find Specialist',
  ],
};

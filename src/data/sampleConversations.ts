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
  text: `Hello! I'm **MEDITRACK AI Health Assistant**, your dedicated clinical guidance assistant.

I can assist you with:
• **Understanding symptoms** and potential causes
• **Explaining lab reports** and medical terms
• **Recommending the right specialist** (Cardiologist, Dermatologist, ENT, etc.)
• **Medication & precaution tips**

*Note: I provide health guidance and education. I do not provide a final medical diagnosis or replace a emergency doctor.*

How can I help you today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestedFollowUps: [
    'I have a headache',
    'My chest hurts',
    'Explain My Report',
    'Which doctor should I visit?',
  ],
};

import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistant } from '@/context/AIAssistantContext';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { QuickActions } from './QuickActions';
import { MessageInput } from './MessageInput';

export function AIAssistantPanel() {
  const { isOpen, closeAssistant, messages, typing, sendMessage, clearChat } = useAIAssistant();

  const handleSelectQuickAction = (text: string) => {
    sendMessage(text);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAssistant}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-[55] lg:hidden"
          />

          {/* Assistant Panel Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="fixed z-[60] bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden 
              bottom-0 inset-x-0 top-12 rounded-t-3xl 
              lg:top-auto lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[420px] lg:h-[85vh] lg:max-h-[700px] lg:rounded-2xl"
          >
            {/* Header */}
            <ChatHeader onClose={closeAssistant} onNewChat={clearChat} />

            {/* Scrollable Message List */}
            <ChatMessages
              messages={messages}
              typing={typing}
              onSelectQuickAction={handleSelectQuickAction}
            />

            {/* Quick Action Suggestion Chips */}
            <QuickActions onSelectAction={handleSelectQuickAction} />

            {/* Input Footer */}
            <MessageInput onSend={sendMessage} disabled={typing} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

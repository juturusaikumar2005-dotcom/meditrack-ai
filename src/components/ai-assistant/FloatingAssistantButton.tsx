import { motion } from 'framer-motion';
import { useAIAssistant } from '@/context/AIAssistantContext';
import { AIAssistantLogo } from '@/components/common/AIAssistantLogo';

export function FloatingAssistantButton() {
  const { isOpen, toggleAssistant, unreadCount } = useAIAssistant();

  // If the panel is open, we can hide the floating button on mobile or render close state
  if (isOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[50]"
    >
      <motion.button
        type="button"
        onClick={toggleAssistant}
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.94 }}
        className="relative group h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white border border-[#1A3C2B]/30 shadow-lg flex items-center justify-center transition-colors cursor-pointer select-none"
        aria-label="Open MEDITRACK AI Health Assistant"
      >
        {/* Soft Breathing Ambient Ring */}
        <span className="absolute inset-0 rounded-full bg-[#9EFFBF]/30 animate-ping pointer-events-none opacity-40" />

        <AIAssistantLogo size="lg" showSparkles={true} className="shadow-md" />

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 z-20 h-5 min-w-[20px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-bounce">
            {unreadCount}
          </span>
        )}

        {/* Tooltip on hover for desktop */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Ask MEDITRACK AI</span>
        </div>
      </motion.button>
    </motion.div>
  );
}

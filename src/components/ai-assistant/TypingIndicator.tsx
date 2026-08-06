import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex items-end gap-2.5 my-2"
    >
      <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-sm shrink-0">
        <Bot className="h-4 w-4 animate-pulse" />
      </div>
      <div className="bg-slate-100 border border-slate-200/80 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-xs">
        <span className="text-xs text-slate-500 font-medium mr-1">MEDITRACK AI is thinking</span>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-blue-600"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, ShieldCheck } from 'lucide-react';

const LOADING_MESSAGES = [
  'Preparing your health workspace...',
  'Loading your secure dashboard...',
  'Analyzing your healthcare experience...',
  'Initializing MediTrack AI...',
  'Almost ready...',
];

export function LoadingScreen() {
  const [messageIdx, setMessageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#F7F7F5] mosaic-bg text-[#111827] select-none p-6 min-h-[100dvh] w-full"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full my-auto space-y-8 sm:space-y-10">
        {/* Brand Logo Box with Gentle Breathing & Floating Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: 1,
            scale: [1, 1.03, 1],
            y: [0, -6, 0],
          }}
          transition={{
            opacity: { duration: 0.4 },
            scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-[14px] bg-[#1A3C2B] text-[#9EFFBF] flex items-center justify-center border border-[#1A3C2B] shrink-0 shadow-none"
        >
          <HeartHandshake className="h-8 w-8 sm:h-9 sm:w-9 lg:h-11 lg:w-11" />
        </motion.div>

        {/* Application Name & Rotating Subtitle */}
        <div className="space-y-3 sm:space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight leading-tight"
          >
            MEDITRACK <span className="text-[#1A3C2B]">AI</span>
          </motion.h1>

          {/* Rotating Message Container */}
          <div className="h-7 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="font-['Public_Sans'] text-xs sm:text-sm lg:text-base text-[#3A3A38] font-medium"
              >
                {LOADING_MESSAGES[messageIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Premium Minimal Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full flex flex-col items-center space-y-4"
        >
          <div className="h-1.5 w-52 sm:w-72 overflow-hidden rounded-full bg-[#3A3A38]/15 relative">
            <motion.div
              className="h-full bg-[#1A3C2B] rounded-full absolute inset-y-0"
              initial={{ left: '-100%', right: '100%' }}
              animate={{ left: '0%', right: '0%' }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Soft Healthcare Privacy & Trust Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="pt-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-['Public_Sans'] font-medium text-[#3A3A38]"
        >
          <ShieldCheck className="h-4 w-4 text-[#1A3C2B] shrink-0" />
          <span>🔒 Privacy First. AI Powered. Secure & Private Healthcare Experience</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

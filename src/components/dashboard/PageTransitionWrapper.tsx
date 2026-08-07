import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// Route-specific clean 2D animation definitions (no layout breaks or transformOrigin shifts)
const routeVariants: Record<string, Variants> = {
  // 1. Dashboard: Vital Command Center Scale Pop
  '/app/dashboard': {
    initial: { opacity: 0, scale: 0.97, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -12 },
  },

  // 2. Upload Reports: Document Scanner Drop
  '/app/upload': {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 25 },
  },

  // 4. AI Analysis: Cyber Neural Hologram Scale
  '/app/ai-analysis': {
    initial: { opacity: 0, scale: 0.93 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  },

  // 5. Report History: Vault Archive Drawer Slide
  '/app/history': {
    initial: { opacity: 0, x: -45 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },

  // 6. Health Timeline: Chronological Horizon Shift
  '/app/timeline': {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },

  // 7. AI Health Assistant: Interactive Chat Portal Pop
  '/app/chat': {
    initial: { opacity: 0, y: 30, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.98 },
  },

  // 8. Profile: Patient ID Badge Rise
  '/app/profile': {
    initial: { opacity: 0, y: 25 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  },

  // 9. Settings: System Gear Scale & Fade
  '/app/settings': {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  },
};

// Route-specific transitions with distinct physics / springs
const routeTransitions: Record<string, any> = {
  '/app/dashboard': { type: 'spring', stiffness: 300, damping: 24 },
  '/app/upload': { type: 'spring', stiffness: 340, damping: 28 },
  '/app/ai-analysis': { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  '/app/history': { type: 'spring', stiffness: 320, damping: 26 },
  '/app/timeline': { type: 'spring', stiffness: 280, damping: 24 },
  '/app/chat': { type: 'spring', stiffness: 350, damping: 26 },
  '/app/profile': { type: 'spring', stiffness: 300, damping: 24 },
  '/app/settings': { duration: 0.3, ease: 'easeOut' },
};

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const variants = routeVariants[currentPath] || {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  const transition = routeTransitions[currentPath] || { duration: 0.25, ease: 'easeOut' };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPath}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
        className="w-full"
      >
        {/* Scanner Laser Beam Sweep Overlay specifically for Upload Reports page entrance */}
        {currentPath === '/app/upload' && (
          <motion.div
            initial={{ top: '0%', opacity: 0.8 }}
            animate={{ top: '100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="pointer-events-none fixed inset-x-0 h-1 z-50 bg-gradient-to-r from-transparent via-[#9EFFBF] to-transparent shadow-[0_0_16px_4px_rgba(158,255,191,0.8)]"
          />
        )}

        {children}
      </motion.div>
    </AnimatePresence>
  );
}

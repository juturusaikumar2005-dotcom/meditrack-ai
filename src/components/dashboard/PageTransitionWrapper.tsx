import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// Route-specific animation definitions
const routeVariants: Record<string, Variants> = {
  // 1. Dashboard: Vital Command Center Grid Pop & 3D Tilt
  '/app/dashboard': {
    initial: { opacity: 0, scale: 0.94, y: 24, rotateX: 6 },
    animate: { opacity: 1, scale: 1, y: 0, rotateX: 0 },
    exit: { opacity: 0, scale: 0.96, y: -16 },
  },

  // 2. Upload Reports: Document Scanner Drop
  '/app/upload': {
    initial: { opacity: 0, y: -45, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 40 },
  },

  // 3. Rx Engine: Prescription Pill Cascade
  '/app/prescription': {
    initial: { opacity: 0, x: -55, rotate: -3 },
    animate: { opacity: 1, x: 0, rotate: 0 },
    exit: { opacity: 0, x: 55, rotate: 3 },
  },

  // 4. AI Analysis: Cyber Neural Hologram Unfold
  '/app/ai-analysis': {
    initial: { opacity: 0, scale: 0.88, filter: 'blur(10px)', rotateY: -8 },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)', rotateY: 0 },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(6px)' },
  },

  // 5. Report History: Vault Archive Drawer Slide
  '/app/history': {
    initial: { opacity: 0, x: -65, filter: 'blur(6px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: -45 },
  },

  // 6. Health Timeline: Chronological Horizon Shift
  '/app/timeline': {
    initial: { opacity: 0, x: 75, scale: 0.97 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -75 },
  },

  // 7. AI Health Assistant: Interactive Chat Portal Pop
  '/app/chat': {
    initial: { opacity: 0, y: 50, scale: 0.91, transformOrigin: 'bottom right' },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 35, scale: 0.95 },
  },

  // 8. Profile: Patient ID Badge Rise
  '/app/profile': {
    initial: { opacity: 0, y: 30, rotateX: 12 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    exit: { opacity: 0, y: -20 },
  },

  // 9. Settings: System Gear Blur Slide
  '/app/settings': {
    initial: { opacity: 0, scale: 0.95, rotate: -2, filter: 'blur(8px)' },
    animate: { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.95, rotate: 2 },
  },
};

// Route-specific transitions with distinct physics / springs
const routeTransitions: Record<string, any> = {
  '/app/dashboard': { type: 'spring', stiffness: 260, damping: 22 },
  '/app/upload': { type: 'spring', stiffness: 320, damping: 26 },
  '/app/prescription': { type: 'spring', stiffness: 280, damping: 20 },
  '/app/ai-analysis': { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  '/app/history': { type: 'spring', stiffness: 300, damping: 24 },
  '/app/timeline': { type: 'spring', stiffness: 250, damping: 22 },
  '/app/chat': { type: 'spring', stiffness: 340, damping: 24 },
  '/app/profile': { type: 'spring', stiffness: 280, damping: 22 },
  '/app/settings': { duration: 0.35, ease: 'easeOut' },
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
    <AnimatePresence mode="popLayout">
      <motion.div
        key={currentPath}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
        className="relative w-full"
      >
        {/* Scanner Laser Beam Sweep Overlay specifically for Upload Reports page entrance */}
        {currentPath === '/app/upload' && (
          <motion.div
            initial={{ top: '0%', opacity: 0.8 }}
            animate={{ top: '100%', opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
            className="pointer-events-none fixed inset-x-0 h-1 z-50 bg-gradient-to-r from-transparent via-[#9EFFBF] to-transparent shadow-[0_0_16px_4px_rgba(158,255,191,0.8)]"
          />
        )}

        {children}
      </motion.div>
    </AnimatePresence>
  );
}

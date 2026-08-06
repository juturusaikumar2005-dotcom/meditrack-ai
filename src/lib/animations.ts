import { Variants, TargetAndTransition, Transition } from 'framer-motion';

// Strongly typed cubic bezier easing curves (4-tuple)
export const EASING = {
  custom: [0.22, 1, 0.36, 1] as const,
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  swift: [0.16, 1, 0.3, 1] as const,
  standard: [0.4, 0, 0.2, 1] as const,
};

// Reusable Variants matching Framer Motion v12 / Motion v13 strict typing
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0): TargetAndTransition => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASING.custom,
      delay: i * 0.08,
    },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0): TargetAndTransition => ({
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: EASING.custom,
      delay: i * 0.05,
    },
  }),
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number = 0): TargetAndTransition => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: EASING.custom,
      delay: i * 0.05,
    },
  }),
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number = 0): TargetAndTransition => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: EASING.custom,
      delay: i * 0.05,
    },
  }),
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: EASING.custom,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
      ease: EASING.standard,
    },
  },
};

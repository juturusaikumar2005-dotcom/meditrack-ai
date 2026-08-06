import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  glass?: boolean;
  hover?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, glass, hover, glow, className, ...rest }, ref) => (
    <motion.div
      ref={ref}
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={clsx(
        'rounded-[14px] p-6 bg-white border border-[#3A3A38]/20 text-[#111827] shadow-none',
        hover && 'hover:border-[#1A3C2B]',
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  )
);
Card.displayName = 'Card';

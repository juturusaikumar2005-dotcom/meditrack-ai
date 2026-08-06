import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#1A3C2B] text-white hover:bg-[#1A3C2B]/90 border border-[#1A3C2B]',
  secondary: 'bg-[#F7F7F5] text-[#111827] border border-[#3A3A38]/20 hover:bg-[#3A3A38]/10',
  ghost: 'text-[#1A3C2B] hover:bg-[#1A3C2B]/10',
  glass: 'bg-white text-[#111827] border border-[#3A3A38]/20 hover:bg-[#F7F7F5]',
  danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-600',
  outline: 'border border-[#3A3A38]/30 text-[#111827] hover:border-[#1A3C2B] hover:text-[#1A3C2B] bg-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs font-semibold rounded-[12px] gap-1.5',
  md: 'h-11 px-6 text-sm font-semibold rounded-[12px] gap-2',
  lg: 'h-14 px-8 text-base font-semibold rounded-[12px] gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, leftIcon, rightIcon, fullWidth, className, ...rest }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={clsx(
        'inline-flex items-center justify-center font-["Public_Sans"] transition-all cursor-pointer select-none relative overflow-hidden shadow-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </motion.button>
  )
);
Button.displayName = 'Button';

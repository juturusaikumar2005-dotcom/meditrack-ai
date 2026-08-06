import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor?: 'coral' | 'mint' | 'gold' | 'forest';
  isVisible?: boolean;
  showDescription?: boolean;
  className?: string;
}

const accentBorderMap: Record<string, string> = {
  coral: 'border-l-4 border-l-[#FF8C69]',
  mint: 'border-l-4 border-l-[#9EFFBF]',
  gold: 'border-l-4 border-l-[#F4D35E]',
  forest: 'border-l-4 border-l-[#1A3C2B]',
};

export function FeatureCard({
  icon,
  title,
  description,
  accentColor = 'forest',
  isVisible = true,
  showDescription = true,
  className = '',
}: FeatureCardProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`h-full flex flex-col justify-between bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 text-left ${accentBorderMap[accentColor]} transition-colors hover:border-[#1A3C2B] cursor-pointer shadow-xs ${className}`}
    >
      <div>
        {/* Icon Display (3xl size) */}
        <div className="mb-4 text-3xl text-[#1A3C2B] flex items-center justify-start p-2.5 bg-[#F7F7F5] w-fit rounded-[10px] border border-[#3A3A38]/15">
          {icon}
        </div>

        {/* Title */}
        <h3 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-[#111827] tracking-tight mb-2">
          {title}
        </h3>

        {/* Description */}
        {showDescription && (
          <p className="font-['Public_Sans'] text-sm sm:text-base text-[#3A3A38] leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

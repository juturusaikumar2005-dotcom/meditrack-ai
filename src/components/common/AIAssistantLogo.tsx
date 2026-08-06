import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface AIAssistantLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSparkles?: boolean;
  showGlow?: boolean;
  iconClassName?: string;
}

export function AIAssistantLogo({
  className = '',
  size = 'md',
  showSparkles = true,
  showGlow = true,
  iconClassName = '',
}: AIAssistantLogoProps) {
  const sizeMap = {
    xs: { container: 'h-6 w-6 rounded-[6px]', bot: 'h-3.5 w-3.5', sparkle: 'h-2 w-2 -top-0.5 -right-0.5' },
    sm: { container: 'h-7 w-7 rounded-[8px]', bot: 'h-4 w-4', sparkle: 'h-2.5 w-2.5 -top-0.5 -right-0.5' },
    md: { container: 'h-9 w-9 rounded-[10px]', bot: 'h-5 w-5', sparkle: 'h-3 w-3 -top-1 -right-1' },
    lg: { container: 'h-11 w-11 rounded-[14px]', bot: 'h-6 w-6', sparkle: 'h-3.5 w-3.5 -top-1 -right-1' },
    xl: { container: 'h-14 w-14 rounded-[18px]', bot: 'h-7 w-7', sparkle: 'h-4 w-4 -top-1.5 -right-1.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center bg-[#1A3C2B] text-[#9EFFBF] border border-[#9EFFBF]/40 shadow-xs shrink-0 ${
        currentSize.container
      } ${showGlow ? 'shadow-[0_0_12px_rgba(158,255,191,0.25)]' : ''} ${className}`}
    >
      <Bot className={`${currentSize.bot} ${iconClassName}`} />
      {showSparkles && (
        <Sparkles
          className={`absolute text-[#9EFFBF] animate-pulse ${currentSize.sparkle}`}
        />
      )}
    </div>
  );
}

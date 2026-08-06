import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface BrandIntroScreenProps {
  onComplete: () => void;
}

const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

export function BrandIntroScreen({ onComplete }: BrandIntroScreenProps) {
  useEffect(() => {
    // Auto complete after 3.2 seconds
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: LUXURY_EASE } }}
      className="fixed inset-0 z-100 min-h-[100dvh] w-full bg-[#F7F7F5] flex flex-col items-center justify-center p-4 sm:p-8 select-none overflow-hidden text-center"
    >
      {/* Background Technical Grid with Crosshair Dots */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(58, 58, 56, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(58, 58, 56, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Intersection Crosshair (+) Dots */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(26, 60, 43, 0.25) 1.5px, transparent 1.5px)`,
            backgroundSize: '48px 48px',
            backgroundPosition: '-0.75px -0.75px',
          }}
        />
      </div>

      {/* Floating Soft Ambient Green Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: (i * 12 - 45) + 'vw',
              y: (i * 10 - 30) + 'vh',
              opacity: 0.2,
              scale: 0.8,
            }}
            animate={{
              y: [(i * 10 - 30) + 'vh', (i * 10 - 45) + 'vh', (i * 10 - 30) + 'vh'],
              opacity: [0.2, 0.5, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute h-2.5 w-2.5 rounded-full bg-[#10B981]/40 blur-[1px]"
          />
        ))}
      </div>

      {/* Main Single Centered Vertical Stack */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
        {/* 1. LOGO — Significant Responsive Scale (0.0s Start) */}
        {/* Mobile: 120px | Tablet: 150px | Laptop: 180px | Desktop: 200px | XL Desktop: 220px */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)', y: 10 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 2.2,
            delay: 0.0,
            ease: LUXURY_EASE,
          }}
          className="relative group mb-8"
        >
          {/* Ambient Glowing Aura Behind Squircle */}
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.45, 0.7, 0.45],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -inset-3 bg-[#10B981]/35 rounded-[44px] blur-2xl"
          />

          {/* Squircle App Icon matching website brand asset */}
          <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] xl:w-[220px] xl:h-[220px] rounded-[32px] sm:rounded-[40px] md:rounded-[48px] bg-gradient-to-b from-[#0F5338] via-[#0A3D29] to-[#05291B] flex items-center justify-center border border-[#9EFFBF]/30 shadow-[0_16px_50px_rgba(16,185,129,0.45)] overflow-hidden shrink-0">
            {/* Top Edge Glass Specular Glare */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-[48px]" />

            {/* Glowing Heart + ECG Line Vector */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3/5 h-3/5 drop-shadow-[0_0_18px_rgba(158,255,191,0.95)]"
            >
              {/* Outer Neon Heart Outline */}
              <path
                d="M50 84 C50 84 14 60 14 35 C14 22 24 13 36 13 C44 13 48 17 50 21 C52 17 56 13 64 13 C76 13 86 22 86 35 C86 60 50 84 50 84 Z"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Internal ECG Pulse Rhythm Line */}
              <path
                d="M26 48 H36 L41 34 L48 62 L54 40 L59 50 H74"
                stroke="#9EFFBF"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* 2. BRAND NAME — Significantly Increased Responsive Sizing (0.3s Start) */}
        {/* Mobile: text-5xl | Tablet: text-6xl | Laptop: text-7xl | Desktop: text-8xl | XL Desktop: text-9xl */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{
            duration: 2.0,
            delay: 0.3,
            ease: LUXURY_EASE,
          }}
          className="mb-5 leading-none"
        >
          <h1 className="font-['Space_Grotesk'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-[#0F172A]">
            MEDITRACK{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669] drop-shadow-[0_4px_16px_rgba(16,185,129,0.35)]">
              AI
            </span>
          </h1>
        </motion.div>

        {/* 3. TAGLINE — Responsive Sizing & Max-Width 700px (0.8s Start) */}
        {/* Mobile: 18px | Tablet: 20px | Desktop: 24px */}
        <motion.p
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.8,
            delay: 0.8,
            ease: LUXURY_EASE,
          }}
          className="font-['Public_Sans'] text-[18px] sm:text-[20px] md:text-[24px] font-normal text-[#334155] tracking-wide leading-relaxed max-w-[700px] mx-auto"
        >
          Your health,{' '}
          <span className="text-[#059669] font-medium">explained simply.</span>
        </motion.p>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';

export function AnimatedBackground({ dense }: { dense?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40 dark:opacity-15" />
      <motion.div
        className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.06), transparent 70%)' }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute ${dense ? 'top-1/4' : 'top-1/3'} -right-40 h-[36rem] w-[36rem] rounded-full blur-3xl`}
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.05), transparent 70%)' }}
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

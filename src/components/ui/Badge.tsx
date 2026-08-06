import clsx from 'clsx';
import type { ReactNode } from 'react';

type Tone = 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'accent';

const tones: Record<Tone, string> = {
  primary: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 ring-blue-600/20',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 ring-amber-600/20',
  error: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300 ring-red-600/20',
  neutral: 'bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-300 ring-slate-500/20',
  accent: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300 ring-cyan-600/20',
};

export function Badge({ tone = 'neutral', children, className, dot }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', tones[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

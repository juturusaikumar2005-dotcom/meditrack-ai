import { motion } from 'framer-motion';
import { Loader2, Inbox, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import type { ReactNode } from 'react';

export function Spinner({ size = 24, className }: { size?: number; className?: string }) {
  return <Loader2 className={`animate-spin text-blue-600 ${className ?? ''}`} style={{ width: size, height: size }} />;
}

type StateType = 'loading' | 'empty' | 'error' | 'success' | 'no-data';

interface StateDisplayProps {
  type: StateType;
  title?: string;
  message?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const config: Record<StateType, { icon: ReactNode; defaultTitle: string; tone: string }> = {
  loading: { icon: <Spinner size={32} />, defaultTitle: 'Loading…', tone: 'text-blue-600' },
  empty: { icon: <Inbox className="h-10 w-10" />, defaultTitle: 'Nothing here yet', tone: 'text-slate-300' },
  error: { icon: <AlertCircle className="h-10 w-10" />, defaultTitle: 'Something went wrong', tone: 'text-red-400' },
  success: { icon: <CheckCircle2 className="h-10 w-10" />, defaultTitle: 'All done', tone: 'text-emerald-500' },
  'no-data': { icon: <Inbox className="h-10 w-10" />, defaultTitle: 'No data available', tone: 'text-slate-300' },
};

export function StateDisplay({ type, title, message, action, icon, className }: StateDisplayProps) {
  const c = config[type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className ?? ''}`}
    >
      <div className={c.tone}>{icon ?? c.icon}</div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{title ?? c.defaultTitle}</h3>
      {message && <p className="mt-1.5 text-sm text-slate-500 max-w-sm">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <StateDisplay
      type="error"
      message={message ?? 'We could not load this content. Please try again.'}
      action={onRetry && (
        <Button variant="outline" size="sm" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={onRetry}>
          Retry
        </Button>
      )}
    />
  );
}

export function EmptyState({ title, message, action }: { title?: string; message?: string; action?: ReactNode }) {
  return <StateDisplay type="empty" title={title} message={message} action={action} />;
}

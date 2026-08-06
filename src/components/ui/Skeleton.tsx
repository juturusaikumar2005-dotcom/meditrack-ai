import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton rounded-lg', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-white/5 bg-white dark:bg-slate-900 p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

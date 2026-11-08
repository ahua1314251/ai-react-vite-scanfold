export interface SkeletonProps { className?: string; label?: string; }
export function Skeleton({ className = 'h-4 w-full', label = '加载中' }: SkeletonProps) { return <div role="status" aria-label={label} className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700 ${className}`} />; }

import type { ReactNode } from 'react';
import { secondaryButtonClass } from './classes';
export interface AlertProps { children: ReactNode; variant?: 'info' | 'success' | 'warning' | 'error'; onClose?: () => void; }
const colors = { info: 'border-blue-300 bg-blue-50 text-blue-800', success: 'border-green-300 bg-green-50 text-green-800', warning: 'border-amber-300 bg-amber-50 text-amber-800', error: 'border-red-300 bg-red-50 text-red-800' };
export function Alert({ children, variant = 'info', onClose }: AlertProps) { return <div role={variant === 'error' ? 'alert' : 'status'} className={`flex items-start justify-between gap-3 rounded-xl border p-4 text-sm ${colors[variant]}`}><div>{children}</div>{onClose && <button type="button" aria-label="关闭提示" onClick={onClose}>×</button>}</div>; }
export interface StateProps { title?: string; description?: ReactNode; }
export function EmptyState({ title = '暂无数据', description }: StateProps) { return <div className="px-4 py-10 text-center"><p className="font-medium">{title}</p>{description && <div className="mt-2 text-sm text-slate-500">{description}</div>}</div>; }
export function LoadingState({ title = '加载中…' }: StateProps) { return <div role="status" className="px-4 py-10 text-center text-sm text-slate-500">{title}</div>; }
export function ErrorState({ title = '加载失败', description, onRetry }: StateProps & { onRetry?: () => void }) { return <div role="alert" className="px-4 py-10 text-center"><p className="font-medium">{title}</p>{description && <div className="mt-2 text-sm text-slate-500">{description}</div>}{onRetry && <button type="button" className={`${secondaryButtonClass} mt-4`} onClick={onRetry}>重试</button>}</div>; }

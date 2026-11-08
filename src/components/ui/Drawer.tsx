import { useEffect, useId, useRef, type ReactNode } from 'react';
import { secondaryButtonClass } from './classes';
export interface DrawerProps { open: boolean; title: string; onClose: () => void; children: ReactNode; side?: 'left' | 'right'; }
export function Drawer({ open, title, onClose, children, side = 'right' }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null); const titleId = useId();
  useEffect(() => { const dialog = ref.current; if (!dialog) return; if (open && !dialog.open) dialog.showModal(); else if (!open && dialog.open) dialog.close(); }, [open]);
  return <dialog ref={ref} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClose={() => { if (open) onClose(); }} className={`fixed inset-y-0 ${side === 'right' ? 'left-auto right-0' : 'left-0 right-auto'} m-0 h-full max-h-full w-[min(28rem,100%)] border-0 bg-white p-6 text-slate-800 shadow-xl backdrop:bg-black/50 dark:bg-slate-900 dark:text-slate-100`}><div className="mb-4 flex items-center justify-between gap-3"><h2 id={titleId} className="text-lg font-semibold">{title}</h2><button type="button" className={secondaryButtonClass} aria-label="关闭" onClick={onClose}>×</button></div><div className="overflow-auto">{children}</div></dialog>;
}

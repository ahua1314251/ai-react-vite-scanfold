import { useEffect, useId, useRef, type ReactNode } from 'react';
import { dangerButtonClass, secondaryButtonClass } from './classes';

export interface ModalProps { open: boolean; title: string; onClose: () => void; children: ReactNode; closable?: boolean; }
export function Modal({ open, title, onClose, children, closable = true }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => { const dialog = ref.current; if (!dialog) return; if (open && !dialog.open) dialog.showModal(); else if (!open && dialog.open) dialog.close(); }, [open]);
  return <dialog ref={ref} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); if (closable) onClose(); }} onClose={() => { if (open) onClose(); }} className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-xl backdrop:bg-black/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"><div className="mb-4 flex items-center justify-between gap-4"><h2 id={titleId} className="text-lg font-semibold">{title}</h2><button type="button" aria-label="关闭" className={secondaryButtonClass} disabled={!closable} onClick={onClose}>×</button></div>{children}</dialog>;
}
export interface ConfirmDialogProps { open: boolean; title: string; description?: ReactNode; confirmLabel?: string; cancelLabel?: string; pending?: boolean; onConfirm: () => void; onClose: () => void; }
export function ConfirmDialog({ open, title, description, confirmLabel = '确认', cancelLabel = '取消', pending = false, onConfirm, onClose }: ConfirmDialogProps) {
  return <Modal open={open} title={title} onClose={onClose} closable={!pending}><div className="space-y-5">{description && <div className="text-sm">{description}</div>}<div className="flex justify-end gap-2"><button type="button" className={secondaryButtonClass} disabled={pending} onClick={onClose}>{cancelLabel}</button><button type="button" className={dangerButtonClass} disabled={pending} onClick={onConfirm}>{confirmLabel}</button></div></div></Modal>;
}

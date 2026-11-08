import { useEffect } from 'react';
import { Alert, type AlertProps } from './Feedback';
export interface ToastProps extends AlertProps { open: boolean; duration?: number; onClose: () => void; }
/** Controlled toast; pass duration={0} to keep it open until dismissed. */
export function Toast({ open, duration = 4000, onClose, children, variant }: ToastProps) { useEffect(() => { if (!open || duration <= 0) return; const timer = window.setTimeout(onClose, duration); return () => window.clearTimeout(timer); }, [open, duration, onClose]); return open ? <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100%-2rem))] shadow-lg"><Alert variant={variant} onClose={onClose}>{children}</Alert></div> : null; }

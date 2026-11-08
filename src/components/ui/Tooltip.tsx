import { useId, type ReactNode } from 'react';
export interface TooltipProps { label: string; children: ReactNode; }
/** A focusable wrapper exposes the same description to keyboard and pointer users. */
export function Tooltip({ label, children }: TooltipProps) { const id = useId(); return <span tabIndex={0} aria-describedby={id} className="group relative inline-flex rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">{children}<span id={id} role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-max max-w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-xs text-white group-hover:block group-focus:block">{label}</span></span>; }

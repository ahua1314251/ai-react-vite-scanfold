import React from 'react';

/** SectionCard — { title, hint?, children } */
export interface SectionCardProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, hint, children }: SectionCardProps) {
  return (
    <div className="section-card relative focus-within:z-10 bg-white/80 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="mb-3 flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-medium text-slate-900">{title}</h3>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

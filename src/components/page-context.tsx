import React from 'react';

/** PageContext — page header strip used by business pages and gallery. */
export interface PageContextProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

export default function PageContext({ title, description, eyebrow, actions }: PageContextProps) {
  return (
    <div className="mb-4 flex min-h-8 flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        {eyebrow && (
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
            {eyebrow}
          </span>
        )}
        <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">{title}</h1>
        {description && <p className="truncate text-xs text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

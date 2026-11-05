import React from 'react';

/** Field — { label, error?, children, controlId?, required?, className? } */
export interface FieldProps {
  label: string;
  error?: React.ReactNode;
  children: React.ReactNode;
  controlId?: string;
  required?: boolean;
  className?: string;
}

export function Field({ label, error, children, controlId, required, className }: FieldProps) {
  const labelTextClass = `text-xs text-slate-500${required ? " after:ml-0.5 after:text-red-500 after:content-['*']" : ''}`;
  const rootClass = `flex flex-col gap-1.5 ${className ?? 'min-w-[160px] flex-1'}`;
  if (controlId) {
    return (
      <div className={rootClass}>
        <label htmlFor={controlId} className={labelTextClass}>
          {label}
        </label>
        {children}
        {error}
      </div>
    );
  }
  return (
    <div className={rootClass}>
      <label className="flex flex-col gap-1.5">
        <span className={labelTextClass}>{label}</span>
        {children}
      </label>
      {error}
    </div>
  );
}


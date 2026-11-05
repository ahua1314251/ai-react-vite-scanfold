import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

/** EntryCard — { icon: LucideIcon, label, description?, onClick? } */
export interface EntryCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
}

export function EntryCard({ icon: Icon, label, description, onClick }: EntryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-2 p-3.5 bg-white border border-black/[0.07] rounded-xl text-left hover:border-blue-300 hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
          <Icon size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-800">{label}</div>
          {description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>}
        </div>
        <ArrowRight
          size={14}
          className="flex-shrink-0 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all mt-1"
        />
      </div>
    </button>
  );
}


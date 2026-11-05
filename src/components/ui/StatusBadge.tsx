import React from 'react';

export interface StatusBadgeProps {
  status: string;
}

const STATUS_META: Record<string, { label: string; textClass: string; dotClass: string }> = {
  ACTIVE: { label: '已生效', textClass: 'text-emerald-600', dotClass: 'bg-emerald-500' },
  REVIEWING: { label: '审批中', textClass: 'text-blue-600', dotClass: 'bg-blue-500' },
  DRAFT: { label: '草稿', textClass: 'text-slate-500', dotClass: 'bg-slate-400' },
  DEPRECATED: { label: '已废弃', textClass: 'text-slate-400', dotClass: 'bg-slate-300' },
};

/** StatusBadge — { status }. ACTIVE/REVIEWING/DRAFT/DEPRECATED; unknown → DRAFT */
export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = STATUS_META[status] ?? STATUS_META.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.textClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  );
}


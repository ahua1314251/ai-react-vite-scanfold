import type { ReactNode } from 'react';
export interface BreadcrumbItem { label: ReactNode; href?: string; }
export interface BreadcrumbProps { items: BreadcrumbItem[]; label?: string; }
export function Breadcrumb({ items, label = '面包屑' }: BreadcrumbProps) { return <nav aria-label={label}><ol className="flex flex-wrap items-center gap-2 text-sm">{items.map((item, index) => <li key={index} className="flex items-center gap-2">{index > 0 && <span aria-hidden="true" className="text-slate-400">/</span>}{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : item.href ? <a className="text-blue-600 hover:underline" href={item.href}>{item.label}</a> : <span>{item.label}</span>}</li>)}</ol></nav>; }

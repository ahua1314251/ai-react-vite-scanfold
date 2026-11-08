import { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { inputClass } from './classes';

export interface DatePickerProps { value: string; onChange: (value: string) => void; label: string; min?: string; max?: string; disabled?: boolean; includeTime?: boolean; }

/** Accepts ISO dates or local datetimes. Partially entered text stays local until valid. */
export function DatePicker({ value, onChange, label, min, max, disabled, includeTime = false }: DatePickerProps) {
  const id = useId();
  const picker = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(value);
  const [invalid, setInvalid] = useState(false);
  useEffect(() => { setDraft(value); setInvalid(false); }, [value]);
  const commit = () => {
    const text = draft.trim();
    if (!text) { setInvalid(false); onChange(''); return; }
    const probe = document.createElement('input');
    probe.type = includeTime ? 'datetime-local' : 'date';
    if (min) probe.min = min;
    if (max) probe.max = max;
    probe.value = text;
    if (!probe.value || !probe.validity.valid) { setInvalid(true); return; }
    setInvalid(false); setDraft(probe.value); onChange(probe.value);
  };
  return <div>
    <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
    <div className="flex items-center gap-2">
      <input id={id} type="text" className={inputClass} value={draft} disabled={disabled} placeholder={includeTime ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD'} aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} onChange={event => { setDraft(event.target.value); setInvalid(false); }} onClick={() => { const input = picker.current; if (!input || input.disabled) return; try { if (typeof input.showPicker === 'function') input.showPicker(); } catch { /* The text field remains editable when the native picker cannot open. */ } }} onBlur={commit} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); commit(); } }} />
      <div className="relative h-9 w-9 shrink-0 rounded-lg border border-black/[0.09] bg-white text-slate-500 focus-within:ring-2 focus-within:ring-blue-400 dark:bg-slate-800">
        <CalendarDays size={17} className="pointer-events-none absolute inset-0 m-auto" aria-hidden="true" />
        <input ref={picker} type={includeTime ? 'datetime-local' : 'date'} aria-label={`打开${label}日历`} className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed" value={value} min={min} max={max} disabled={disabled} onClick={event => { try { event.currentTarget.showPicker?.(); } catch { /* Fall back to the native input. */ } }} onChange={event => { setDraft(event.target.value); setInvalid(false); onChange(event.target.value); }} />
      </div>
    </div>
    {invalid && <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600">请输入有效日期{includeTime ? '和时间（YYYY-MM-DDTHH:mm）' : '（YYYY-MM-DD）'}，并符合日期范围。</p>}
  </div>;
}

import { useId } from 'react';
import { inputClass } from './classes';
export interface DatePickerProps { value: string; onChange: (value: string) => void; label: string; min?: string; max?: string; disabled?: boolean; includeTime?: boolean; }
/** Native local date or datetime input; the value uses the browser's ISO input format. */
export function DatePicker({ value, onChange, label, min, max, disabled, includeTime = false }: DatePickerProps) { const id = useId(); return <div><label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label><input id={id} type={includeTime ? 'datetime-local' : 'date'} className={inputClass} value={value} min={min} max={max} disabled={disabled} onChange={event => onChange(event.target.value)} /></div>; }

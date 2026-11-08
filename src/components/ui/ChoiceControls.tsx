import { useId } from 'react';

export interface ChoiceProps { label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean; name?: string; value?: string; }
function Choice({ label, checked, onChange, disabled, name, value, type }: ChoiceProps & { type: 'checkbox' | 'radio' }) {
  return <label className="inline-flex items-center gap-2 text-sm"><input type={type} checked={checked} onChange={event => onChange(event.target.checked)} disabled={disabled} name={name} value={value} className="h-4 w-4 accent-blue-600" />{label}</label>;
}
export function Checkbox(props: ChoiceProps) { return <Choice {...props} type="checkbox" />; }
export function Radio(props: ChoiceProps) { return <Choice {...props} type="radio" />; }
export function Switch({ label, checked, onChange, disabled, name, value }: ChoiceProps) {
  const id = useId();
  return <label htmlFor={id} className="inline-flex items-center gap-2 text-sm"><input id={id} type="checkbox" role="switch" className="peer sr-only" checked={checked} onChange={event => onChange(event.target.checked)} disabled={disabled} name={name} value={value} /><span aria-hidden="true" className="relative h-6 w-11 rounded-full bg-slate-400 transition-colors peer-checked:bg-blue-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />{label}</label>;
}

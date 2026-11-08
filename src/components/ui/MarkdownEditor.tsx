import { useId, useState } from 'react';
import { inputClass, secondaryButtonClass } from './classes';
import { MarkdownPreview } from './MarkdownPreview';

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

/** Controlled Markdown textarea with an optional preview. */
export function MarkdownEditor({ value, onChange, id, label = 'Markdown 内容', placeholder, rows = 12, disabled = false, className = '' }: MarkdownEditorProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [preview, setPreview] = useState(false);
  return <div className={className}>
    <div className="mb-2 flex items-center justify-between gap-2">
      <label htmlFor={inputId} className="text-sm font-medium">{label}</label>
      <button type="button" className={secondaryButtonClass} aria-pressed={preview} onClick={() => setPreview(current => !current)}>{preview ? '继续编辑' : '预览'}</button>
    </div>
    <textarea id={inputId} className={`${inputClass} w-full font-mono`} rows={rows} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} disabled={disabled} hidden={preview} />
    {preview && <div className="min-h-32 rounded-xl border border-slate-200 p-4 dark:border-slate-700" aria-label="Markdown 预览"><MarkdownPreview value={value} />{!value.trim() && <p className="text-sm text-slate-500">暂无内容</p>}</div>}
  </div>;
}

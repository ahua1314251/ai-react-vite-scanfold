import { useId, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { secondaryButtonClass } from './classes';
export interface ImageUploadProps { value?: string; onChange: (file: File | null) => void; label?: string; accept?: string; disabled?: boolean; }
/** The caller owns upload and value; no object URLs or network requests are created. */
export function ImageUpload({ value, onChange, label = '选择图片', accept = 'image/*', disabled = false }: ImageUploadProps) {
  const id = useId(); const ref = useRef<HTMLInputElement>(null); const [name, setName] = useState('');
  return <div className="space-y-2">
    <span id={id} className="block text-sm font-medium">{label}</span>
    {value && <img src={value} alt="已选图片预览" className="max-h-48 max-w-full rounded-lg object-contain" />}
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      <input ref={ref} type="file" accept={accept} disabled={disabled} hidden onChange={event => { const file = event.target.files?.[0]; if (file) { setName(file.name); onChange(file); } }} />
      <button type="button" aria-labelledby={`${id} ${id}-button`} className={secondaryButtonClass} disabled={disabled} onClick={() => ref.current?.click()}><ImagePlus size={15} aria-hidden="true" /><span id={`${id}-button`}>选择图片</span></button>
      <span className="min-w-0 break-all text-sm text-slate-500" aria-live="polite">{name || (value ? '已选择图片' : '未选择图片')}</span>
      {(value || name) && <button type="button" className={secondaryButtonClass} disabled={disabled} onClick={() => { if (ref.current) ref.current.value = ''; setName(''); onChange(null); }}>移除</button>}
    </div>
  </div>;
}

import { useId, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { secondaryButtonClass } from './classes';

export interface FileUploadProps { label: string; onChange: (files: File[]) => void; accept?: string; multiple?: boolean; disabled?: boolean; progress?: number; error?: string; }
export function FileUpload({ label, onChange, accept, multiple, disabled, progress, error }: FileUploadProps) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const [names, setNames] = useState<string[]>([]);
  return <div className="space-y-2">
    <span id={id} className="block text-sm font-medium">{label}</span>
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      <input ref={ref} type="file" accept={accept} multiple={multiple} disabled={disabled} hidden onChange={event => { const files = Array.from(event.target.files || []); setNames(files.map(file => file.name)); onChange(files); }} />
      <button type="button" aria-labelledby={`${id} ${id}-button`} className={secondaryButtonClass} disabled={disabled} onClick={() => ref.current?.click()}><Upload size={15} aria-hidden="true" /><span id={`${id}-button`}>选择文件</span></button>
      <span className="min-w-0 break-all text-sm text-slate-500" aria-live="polite">{names.length ? names.join('、') : '未选择文件'}</span>
      {names.length > 0 && <button type="button" className={secondaryButtonClass} disabled={disabled} onClick={() => { if (ref.current) ref.current.value = ''; setNames([]); onChange([]); }}>清除</button>}
    </div>
    {progress !== undefined && <progress aria-label="上传进度" max={100} value={Math.max(0, Math.min(100, progress))} />}
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
  </div>;
}

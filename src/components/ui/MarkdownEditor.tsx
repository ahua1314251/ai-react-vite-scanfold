import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { inputClass, secondaryButtonClass } from './classes';
import { MarkdownPreview } from './MarkdownPreview';

export interface MarkdownEditorProps {
  value: string; onChange: (value: string) => void; id?: string; label?: string; placeholder?: string; rows?: number; disabled?: boolean; className?: string;
  /** Caller supplies a URL, e.g. after uploading the file. */
  onUploadImage?: (file: File) => Promise<string>;
}
export function MarkdownEditor({ value, onChange, id, label = 'Markdown 内容', placeholder, rows = 12, disabled = false, className = '', onUploadImage }: MarkdownEditorProps) {
  const generatedId = useId(); const inputId = id || generatedId; const [preview, setPreview] = useState(false); const [uploading, setUploading] = useState(false); const [error, setError] = useState(''); const textarea = useRef<HTMLTextAreaElement>(null); const latestValue = useRef(value); latestValue.current = value; const fileInput = useRef<HTMLInputElement>(null);
  const insert = (before: string, after = '', fallback = '') => {
    const el = textarea.current; if (!el) return;
    const current = latestValue.current; const start = Math.min(el.selectionStart, current.length); const end = Math.min(el.selectionEnd, current.length); const selected = current.slice(start, end) || fallback;
    onChange(current.slice(0, start) + before + selected + after + current.slice(end));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + before.length, start + before.length + selected.length); });
  };
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey) {
      const key = event.key.toLowerCase();
      if (key === 'b' || key === 'i') { event.preventDefault(); insert(key === 'b' ? '**' : '*', key === 'b' ? '**' : '*', '文本'); }
    }
  };
  const upload = async (file: File) => {
    if (!onUploadImage) return; setUploading(true); setError('');
    try { const url = await onUploadImage(file); if (!url.trim() || /[\s()<>]/.test(url)) throw new Error('invalid URL'); insert(`![图片](${url})`); }
    catch { setError('图片插入失败，请检查上传结果后重试。'); }
    finally { setUploading(false); if (fileInput.current) fileInput.current.value = ''; }
  };
  return <div className={className}>
    <div className="mb-2 flex items-center justify-between gap-2"><label htmlFor={inputId} className="text-sm font-medium">{label}</label><button type="button" className={secondaryButtonClass} aria-pressed={preview} onClick={() => setPreview(current => !current)}>{preview ? '继续编辑' : '预览'}</button></div>
    {!preview && <div role="group" aria-label="Markdown 格式" className="mb-2 flex flex-wrap gap-2"><button type="button" className={secondaryButtonClass} disabled={disabled || uploading} onClick={() => insert('**', '**', '文本')}>粗体</button><button type="button" className={secondaryButtonClass} disabled={disabled || uploading} onClick={() => insert('*', '*', '文本')}>斜体</button><button type="button" className={secondaryButtonClass} disabled={disabled || uploading} onClick={() => insert('## ', '', '标题')}>标题</button><button type="button" className={secondaryButtonClass} disabled={disabled || uploading} onClick={() => insert('[', '](https://example.com)', '链接文字')}>链接</button>{onUploadImage && <><button type="button" className={secondaryButtonClass} disabled={disabled || uploading} onClick={() => fileInput.current?.click()}>{uploading ? '上传中…' : '插入图片'}</button><input ref={fileInput} type="file" accept="image/*" aria-label="选择要插入的图片" className="sr-only" disabled={disabled || uploading} onChange={event => { const file = event.target.files?.[0]; if (file) void upload(file); }} /></>}</div>}
    <textarea ref={textarea} id={inputId} className={`${inputClass} w-full font-mono`} rows={rows} value={value} onChange={event => onChange(event.target.value)} onKeyDown={keyDown} placeholder={placeholder} disabled={disabled || uploading} hidden={preview} />
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {preview && <div className="min-h-32 rounded-xl border border-slate-200 p-4 dark:border-slate-700" aria-label="Markdown 预览"><MarkdownPreview value={value} />{!value.trim() && <p className="text-sm text-slate-500">暂无内容</p>}</div>}
  </div>;
}

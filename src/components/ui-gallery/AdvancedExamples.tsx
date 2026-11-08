import { useCallback, useState } from 'react';
import { Alert, ConfirmDialog, DataTable, DatePicker, FileUpload, Skeleton, DropdownMenu, EmptyState, ErrorState, Field, ImageUpload, LoadingState, SectionCard, Tabs, TagInput, Toast, inputClass, secondaryButtonClass, validateFields } from '../ui';
import DemoSection from './DemoSection';

export default function AdvancedExamples() {
  const [confirm, setConfirm] = useState(false);
  const [toast, setToast] = useState(false);
  const [tags, setTags] = useState(['设计', '开发']);
  const [tab, setTab] = useState('first');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const closeToast = useCallback(() => setToast(false), []);
  return <DemoSection id="advanced" title="通用交互组件" description="对话框、反馈、表格、上传、标签和表单校验示例">
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard title="对话框与反馈"><div className="space-y-3"><Alert>这是一条提示信息。</Alert><div className="flex gap-2"><button className={secondaryButtonClass} onClick={() => setConfirm(true)}>确认对话框</button><button className={secondaryButtonClass} onClick={() => setToast(true)}>显示 Toast</button><DropdownMenu label="更多操作" items={[{ label: '显示提示', onSelect: () => setToast(true) }, { label: '确认操作', onSelect: () => setConfirm(true) }]} /></div><ConfirmDialog open={confirm} title="确认操作" description="这是演示，不会删除数据。" onClose={() => setConfirm(false)} onConfirm={() => { setConfirm(false); setToast(true); }} /><Toast open={toast} onClose={closeToast}>操作已完成</Toast></div></SectionCard>
      <SectionCard title="标签与图片"><div className="space-y-4"><TagInput value={tags} onChange={setTags} /><ImageUpload onChange={file => setFileName(file?.name || '')} />{fileName && <p className="text-sm text-slate-500">演示选择：{fileName}（未上传）</p>}</div></SectionCard>
      <SectionCard title="数据表格"><DataTable rows={[{ id: '1', name: '示例 A' }, { id: '2', name: '示例 B' }]} rowKey={row => row.id} columns={[{ key: 'name', title: '名称', render: row => row.name }, { key: 'id', title: '编号', render: row => row.id }]} /></SectionCard>
      <SectionCard title="状态与选项卡"><Tabs label="状态示例" value={tab} onChange={setTab} items={[{ value: 'first', label: '空状态', content: <EmptyState /> }, { value: 'loading', label: '加载中', content: <LoadingState /> }, { value: 'error', label: '失败', content: <ErrorState onRetry={() => setToast(true)} /> }]} /></SectionCard>
      <SectionCard title="日期、文件和骨架屏"><div className="space-y-4"><DatePicker label="选择日期" value={date} onChange={setDate} /><FileUpload label="选择附件（演示，不上传）" onChange={() => {}} /><Skeleton label="示例加载占位" /></div></SectionCard>
      <SectionCard title="表单校验"><form onSubmit={event => { event.preventDefault(); const errors = validateFields({ name }, { name: value => value.trim() ? undefined : '请输入名称' }); setError(errors.name || ''); if (!errors.name) setToast(true); }} className="space-y-3"><Field label="名称" controlId="validation-demo" required error={error && <span role="alert" className="text-red-600">{error}</span>}><input id="validation-demo" className={inputClass} value={name} aria-invalid={Boolean(error)} onChange={event => setName(event.target.value)} /></Field><button className={secondaryButtonClass} type="submit">验证</button></form></SectionCard>
    </div>
  </DemoSection>;
}

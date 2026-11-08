import { useEffect, useMemo, useState } from 'react';
import PageContext from '../../components/page-context';
import { SectionCard, MarkdownEditor, MarkdownPreview, inputClass, primaryButtonClass, secondaryButtonClass } from '../../components/ui';

type Article = { id: string; title: string; summary: string; content: string; category: string; tags: string; status: 'draft' | 'published'; updatedAt: string };
const STORAGE_KEY = 'scaffold-blog-articles-v1';
const emptyArticle = (): Article => ({ id: '', title: '', summary: '', content: '', category: '', tags: '', status: 'draft', updatedAt: '' });

function readArticles(): { articles: Article[]; error: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { articles: [], error: '' };
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(item => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.content === 'string' && typeof item.summary === 'string' && typeof item.category === 'string' && typeof item.tags === 'string' && typeof item.updatedAt === 'string' && (item.status === 'draft' || item.status === 'published'))) throw new Error('invalid');
    return { articles: parsed as Article[], error: '' };
  } catch {
    return { articles: [], error: '无法读取本地数据。请检查浏览器存储，避免覆盖原有数据。' };
  }
}

export default function Blog() {
  const [initial] = useState(readArticles);
  const [articles, setArticles] = useState<Article[]>(initial.articles);
  const [storageError, setStorageError] = useState(initial.error);
  const [view, setView] = useState<'manage' | 'edit' | 'read'>('manage');
  const [article, setArticle] = useState<Article>(emptyArticle);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const filtered = useMemo(() => articles.filter(item => (status === 'all' || item.status === status) && `${item.title} ${item.summary} ${item.category} ${item.tags}`.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [articles, query, status]);
  const change = (key: keyof Article, value: string) => { setArticle(current => ({ ...current, [key]: value })); setDirty(true); };
  const leave = () => !dirty || window.confirm('当前修改尚未保存，确定离开吗？');
  const persist = (next: Article[]) => {
    if (storageError) return false;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setArticles(next); return true; }
    catch { setStorageError('保存失败：浏览器存储不可用或空间不足，请复制内容后检查存储设置。'); return false; }
  };
  const save = (nextStatus: Article['status']) => {
    if (!article.title.trim() || !article.content.trim()) { setMessage('请填写文章标题和正文。'); return; }
    const now = new Date().toISOString();
    const saved = { ...article, title: article.title.trim(), id: article.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`, status: nextStatus, updatedAt: now };
    if (persist([saved, ...articles.filter(item => item.id !== saved.id)])) { setArticle(saved); setDirty(false); setMessage(nextStatus === 'published' ? '文章已发布到本地阅读列表。' : '草稿已保存。'); setView('manage'); }
  };
  const startEdit = (item: Article) => { if (!leave()) return; setArticle({ ...item }); setDirty(false); setMessage(''); setView('edit'); };
  const back = () => { if (leave()) { setDirty(false); setView('manage'); setMessage(''); } };
  const remove = (item: Article) => { if (window.confirm(`确定删除“${item.title}”？此操作无法撤销。`) && persist(articles.filter(entry => entry.id !== item.id))) setMessage('文章已删除。'); };
  const date = (value: string) => { const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleString('zh-CN'); };
  const label = 'mb-1 block text-sm font-medium';
  return <div className="h-full overflow-auto"><div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
    <PageContext title="博客管理" description="本地版本：文章仅保存在当前浏览器，不会同步或公开到互联网。清除浏览器数据可能丢失文章。" />
    {storageError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{storageError}</div>}
    {message && <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">{message}</div>}
    {view === 'manage' && <>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500">共 {articles.length} 篇 · 已发布 {articles.filter(item => item.status === 'published').length} 篇</p><button type="button" className={primaryButtonClass} onClick={() => startEdit(emptyArticle())}>新建文章</button></div>
      <SectionCard title="文章列表"><div className="flex flex-wrap gap-3"><input className={`${inputClass} flex-1`} aria-label="搜索文章" placeholder="搜索标题、摘要、分类或标签" value={query} onChange={e => setQuery(e.target.value)} /><select className={inputClass} aria-label="文章状态" value={status} onChange={e => setStatus(e.target.value as typeof status)}><option value="all">全部状态</option><option value="draft">草稿</option><option value="published">已发布</option></select></div>
        {filtered.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">{articles.length ? '没有找到匹配的文章。' : '还没有文章，点击“新建文章”开始写作。'}</p> : <ul className="divide-y divide-slate-200">{filtered.map(item => <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 py-5"><div className="min-w-0"><h3 className="break-words font-semibold">{item.title} <span className="ml-2 text-xs font-normal text-slate-500">{item.status === 'published' ? '已发布' : '草稿'}</span></h3>{item.summary && <p className="mt-1 text-sm text-slate-500">{item.summary}</p>}<p className="mt-2 text-xs text-slate-500">{[item.category, item.tags, date(item.updatedAt)].filter(Boolean).join(' · ')}</p></div><div className="flex gap-2"><button type="button" className={secondaryButtonClass} onClick={() => { setArticle(item); setView('read'); setMessage(''); }}>阅读</button><button type="button" className={secondaryButtonClass} onClick={() => startEdit(item)}>编辑</button><button type="button" className={secondaryButtonClass} onClick={() => remove(item)}>删除</button></div></li>)}</ul>}
      </SectionCard></>}
    {view === 'edit' && <SectionCard title={article.id ? '编辑文章' : '新建文章'}><div className="space-y-4"><div><label className={label} htmlFor="blog-title">标题 *</label><input id="blog-title" className={`${inputClass} w-full`} value={article.title} onChange={e => change('title', e.target.value)} /></div><div><label className={label} htmlFor="blog-summary">摘要</label><textarea id="blog-summary" className={`${inputClass} w-full`} rows={2} value={article.summary} onChange={e => change('summary', e.target.value)} /></div><div className="grid gap-4 sm:grid-cols-2"><div><label className={label} htmlFor="blog-category">分类</label><input id="blog-category" className={`${inputClass} w-full`} value={article.category} onChange={e => change('category', e.target.value)} /></div><div><label className={label} htmlFor="blog-tags">标签（用逗号分隔）</label><input id="blog-tags" className={`${inputClass} w-full`} value={article.tags} onChange={e => change('tags', e.target.value)} /></div></div><MarkdownEditor id="blog-content" label="正文 *" value={article.content} onChange={value => change('content', value)} rows={14} /><div className="flex flex-wrap gap-2"><button type="button" className={primaryButtonClass} onClick={() => save('draft')}>保存草稿</button><button type="button" className={primaryButtonClass} onClick={() => save('published')}>发布到本地</button><button type="button" className={secondaryButtonClass} onClick={back}>返回</button></div></div></SectionCard>}
    {view === 'read' && <SectionCard title={article.title}><div className="space-y-5"><p className="text-sm text-slate-500">{[article.status === 'draft' ? '草稿' : '已发布', article.category, article.tags, date(article.updatedAt)].filter(Boolean).join(' · ')}</p>{article.summary && <p className="text-slate-500">{article.summary}</p>}<MarkdownPreview value={article.content} /><button type="button" className={secondaryButtonClass} onClick={back}>返回列表</button></div></SectionCard>}
  </div></div>;
}

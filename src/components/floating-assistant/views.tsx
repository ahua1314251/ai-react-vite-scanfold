import {
ArrowLeft,
ArrowUp,
Check,
ChevronRight,
Circle,
Clock3,
History,
ListTree,
Loader2,
RefreshCw,
Sparkles,
Trash2
} from 'lucide-react';
import React,{ useCallback,useEffect,useMemo,useState } from 'react';
import {
deleteConversation,
fetchConversations,
type ConversationSummary
} from '../../api/assistant';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  /** 流式过程中的状态文案（思考中 / 执行工具等） */
  status?: string;
}

export interface ActivityStep {
  id: string;
  label: string;
  detail: string;
  status: 'done' | 'running' | 'queued';
}

interface Suggestion {
  title: string;
  description: string;
  prompt: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    title: '总结当前页面',
    description: '快速梳理页面结构与相关操作建议',
    prompt: '帮我总结一下当前页面的主要模块和用法',
  },
  {
    title: '生成示例文案',
    description: '按场景产出一段可直接使用的说明文字',
    prompt: '帮我写一段产品功能介绍，语气简洁专业',
  },
]

function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} 天前`;
  return `${date.getMonth() + 1}-${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function groupConversationsByDate(items: ConversationSummary[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400 * 1000;
  const startOfWeek = startOfToday - 6 * 86400 * 1000;
  const buckets: Record<'today' | 'yesterday' | 'week' | 'earlier', ConversationSummary[]> = {
    today: [],
    yesterday: [],
    week: [],
    earlier: [],
  };
  items.forEach(item => {
    const t = new Date(item.lastMessageAt || item.gmtCreate || now).getTime();
    if (t >= startOfToday) buckets.today.push(item);
    else if (t >= startOfYesterday) buckets.yesterday.push(item);
    else if (t >= startOfWeek) buckets.week.push(item);
    else buckets.earlier.push(item);
  });
  return (
    [
      { key: 'today', label: '今天', items: buckets.today },
      { key: 'yesterday', label: '昨天', items: buckets.yesterday },
      { key: 'week', label: '本周', items: buckets.week },
      { key: 'earlier', label: '更早', items: buckets.earlier },
    ] as const
  ).filter(group => group.items.length > 0);
}

function InlineText({ children }: { children: string }) {
  const parts = children.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={`${part}-${index}`} className="font-semibold text-slate-950">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

function RichMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-2 text-[13px] leading-6 text-slate-700">
      {lines.map((line, index) => {
        if (!line.trim()) return <div key={`space-${index}`} className="h-1" />;
        if (line.startsWith('## ')) {
          return (
            <h4 key={`heading-${index}`} className="pt-1 text-[15px] font-semibold tracking-[-0.01em] text-slate-950">
              {line.slice(3)}
            </h4>
          );
        }
        const ordered = line.match(/^(\d+)\.\s+(.+)$/);
        if (ordered) {
          return (
            <div key={`ordered-${index}`} className="grid grid-cols-[20px_minmax(0,1fr)] gap-1.5">
              <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-500">
                {ordered[1]}
              </span>
              <p><InlineText>{ordered[2]}</InlineText></p>
            </div>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <div key={`bullet-${index}`} className="grid grid-cols-[12px_minmax(0,1fr)] gap-1.5">
              <span className="mt-[10px] h-1 w-1 rounded-full bg-slate-400" />
              <p><InlineText>{line.slice(2)}</InlineText></p>
            </div>
          );
        }
        return <p key={`paragraph-${index}`}><InlineText>{line}</InlineText></p>;
      })}
    </div>
  );
}

export function AgentMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`${compact ? 'h-8 w-8 rounded-[10px] text-xs' : 'h-[68px] w-[68px] rounded-[21px] text-2xl'} grid flex-shrink-0 place-items-center border border-blue-100 bg-gradient-to-br from-blue-50 to-slate-100 font-semibold text-blue-700 shadow-[0_10px_28px_rgba(37,99,235,0.1)] dark:from-blue-500/20 dark:to-slate-800`}
    >
      <Sparkles size={compact ? 16 : 28} />
    </div>
  );
}

export function Welcome({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[590px] flex-col justify-center px-5 py-9 sm:px-8">
      <div className="text-center">
        <div className="flex justify-center"><AgentMark /></div>
        <p className="mt-5 text-xs font-semibold text-blue-600">Hello</p>
        <h2 className="mt-1.5 text-[28px] font-semibold tracking-[-0.035em] text-slate-950 sm:text-[32px]">今天想聊点什么？</h2>
        <p className="mt-2 text-[13px] leading-5 text-slate-500">问答 · 总结 · 文案辅助</p>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map(item => (
          <button
            key={item.title}
            type="button"
            onClick={() => onSelect(item.prompt)}
            className="group min-h-[82px] rounded-2xl border border-black/[0.07] bg-white/80 px-4 py-3.5 text-left shadow-[0_1px_0_rgba(255,255,255,0.8),0_8px_26px_rgba(15,23,42,0.035)] transition-all hover:-translate-y-0.5 hover:border-black/[0.1] hover:bg-white hover:shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
          >
            <span className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 transition-colors group-hover:bg-blue-500" />
              <strong className="text-[13px] font-semibold text-slate-900">{item.title}</strong>
              <ChevronRight size={13} className="ml-auto text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
            </span>
            <span className="mt-2 block text-[11px] leading-4.5 text-slate-500">{item.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Conversation({ messages, typing, typingLabel, endRef }: {
  messages: Message[];
  typing: boolean;
  typingLabel: string;
  endRef: React.RefObject<HTMLDivElement>;
}) {
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
  const showStandaloneTyping = typing && (!lastAssistant || Boolean(lastAssistant.content));

  return (
    <div className="mx-auto w-full max-w-[610px] px-5 py-7 sm:px-8">
      {messages.map(message =>
        message.role === 'user' ? (
          <article key={message.id} className="mb-7 flex justify-end">
            <div className="max-w-[84%]">
              <div className="mb-1.5 flex items-center justify-end gap-2 text-[10px] text-slate-400">
                <span>{formatTime(message.createdAt)}</span>
                <span className="font-medium text-slate-600">你</span>
              </div>
              <div className="rounded-[18px] rounded-tr-[5px] bg-black/[0.055] px-4 py-2.5 text-[13px] leading-5.5 text-slate-800">
                {message.content}
              </div>
            </div>
          </article>
        ) : (
          <article key={message.id} className="mb-8 grid grid-cols-[32px_minmax(0,1fr)] gap-3">
            <AgentMark compact />
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <strong className="text-xs font-semibold text-slate-900">助手</strong>
                <span className="text-[10px] text-slate-400">{formatTime(message.createdAt)}</span>
              </div>
              {message.content ? (
                <RichMessage content={message.content} />
              ) : message.status ? (
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                  </span>
                  {message.status}
                </div>
              ) : null}
            </div>
          </article>
        ),
      )}

      {showStandaloneTyping && (
        <article className="mb-7 grid grid-cols-[32px_minmax(0,1fr)] gap-3">
          <AgentMark compact />
          <div className="pt-1">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              {typingLabel}
            </div>
          </div>
        </article>
      )}
      <div ref={endRef} />
    </div>
  );
}

export function ActivityView({
  messages,
  activities,
  typing,
  onBack,
}: {
  messages: Message[];
  activities: Record<string, ActivityStep[]>;
  typing: boolean;
  onBack: () => void;
}) {
  const turns = useMemo(() => messages.filter(message => message.role === 'user'), [messages]);
  return (
    <div className="h-full overflow-y-auto px-5 py-5 sm:px-7">
      <div className="mx-auto max-w-[610px]">
        <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900">
          <ArrowLeft size={14} /> 返回对话
        </button>
        <p className="text-[10px] font-semibold tracking-[0.16em] text-blue-600">RUNTIME</p>
        <h3 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-slate-950">执行轨迹</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">按轮次展示上下文装配、工具调用与回答生成状态。</p>

        {turns.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white/60 px-5 py-9 text-center">
            <ListTree size={22} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-700">尚无执行记录</p>
            <p className="mt-1 text-xs text-slate-400">发送问题后，Agent 的处理过程会显示在这里。</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {turns.map((turn, index) => {
              const isCurrent = index === turns.length - 1;
              const running = isCurrent && typing;
              const steps = activities[turn.id] || [];
              return (
                <details key={turn.id} open={isCurrent} className="group overflow-hidden rounded-2xl border border-black/[0.07] bg-white/80">
                  <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                    <span className={`grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg text-[10px] font-semibold ${running ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {running ? <Clock3 size={13} /> : <Check size={13} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-xs font-semibold text-slate-800">Turn {String(index + 1).padStart(2, '0')}</strong>
                      <span className="mt-0.5 block truncate text-[11px] text-slate-500">{turn.content}</span>
                    </span>
                    <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${running ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {running ? '运行中' : '已完成'}
                    </span>
                    <ChevronRight size={14} className="text-slate-300 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="border-t border-black/[0.055] px-4 py-4">
                    {steps.length === 0 ? (
                      <p className="text-[11px] text-slate-400">本轮暂无步骤记录</p>
                    ) : (
                      steps.map((step, stepIndex) => (
                        <div key={step.id} className="relative grid grid-cols-[18px_minmax(0,1fr)_auto] gap-2.5 pb-4 last:pb-0">
                          {stepIndex < steps.length - 1 && <span className="absolute left-[7px] top-4 h-[calc(100%-8px)] w-px bg-slate-200" />}
                          <span className="relative z-10 mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-white">
                            {step.status === 'done' ? <Check size={11} className="text-emerald-500" /> : step.status === 'running' ? <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" /> : <Circle size={9} className="text-slate-300" />}
                          </span>
                          <span className="text-[11px] font-medium text-slate-700">{step.label}</span>
                          <code className="text-[9px] text-slate-400">{step.detail}</code>
                        </div>
                      ))
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function HistoryView({
  activeId,
  onBack,
  onPick,
  onDeleted,
}: {
  activeId: number | null;
  onBack: () => void;
  onPick: (item: ConversationSummary) => void;
  onDeleted: (id: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [filter, setFilter] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [openingId, setOpeningId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchConversations({ scope: 'PERSONAL', page: 1, size: 100 });
      setItems(result.items || []);
    } catch (err) {
      setItems([]);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!filter.trim()) return items;
    const q = filter.trim().toLowerCase();
    return items.filter(item => (item.title || '').toLowerCase().includes(q));
  }, [items, filter]);

  const groups = useMemo(() => groupConversationsByDate(filtered), [filtered]);

  const handleDelete = async (item: ConversationSummary, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm(`删除会话「${item.title || '无标题'}」？`)) return;
    setDeletingId(item.id);
    try {
      await deleteConversation(item.id);
      setItems(previous => previous.filter(row => row.id !== item.id));
      onDeleted(item.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setDeletingId(null);
    }
  };

  const handlePick = async (item: ConversationSummary) => {
    setOpeningId(item.id);
    setError('');
    try {
      await onPick(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto px-5 py-5 sm:px-7">
      <div className="mx-auto max-w-[610px]">
        <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900">
          <ArrowLeft size={14} /> 返回对话
        </button>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-blue-600">HISTORY</p>
            <h3 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-slate-950">会话历史</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">选择一条历史会话继续排查，或删除不再需要的记录。</p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition-colors hover:bg-black/[0.055] hover:text-slate-900 disabled:opacity-50"
            title="刷新"
            aria-label="刷新会话历史"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="mt-5">
          <input
            value={filter}
            onChange={event => setFilter(event.target.value)}
            placeholder="按标题搜索"
            className="w-full rounded-xl border border-black/[0.08] bg-white/80 px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-600">
            {error}
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-slate-400">
            <Loader2 size={22} className="animate-spin" />
            <p className="mt-3 text-xs">加载会话历史…</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white/60 px-5 py-9 text-center">
            <History size={22} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-700">还没有历史会话</p>
            <p className="mt-1 text-xs text-slate-400">发送问题后，会话会出现在这里。</p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {groups.map(group => (
              <section key={group.key}>
                <p className="mb-2 px-1 text-[10px] font-semibold tracking-[0.14em] text-slate-400">{group.label}</p>
                <div className="space-y-2">
                  {group.items.map(item => {
                    const active = activeId === item.id;
                    const busy = openingId === item.id || deletingId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`group flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all ${
                          active
                            ? 'border-blue-200 bg-blue-50/80 shadow-sm'
                            : 'border-black/[0.07] bg-white/80 hover:border-black/[0.12] hover:bg-white'
                        } ${busy ? 'opacity-70' : ''}`}
                      >
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void handlePick(item)}
                          className="flex min-w-0 flex-1 items-start gap-3 text-left"
                        >
                          <span className={`mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            {openingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <History size={14} />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <strong className="block truncate text-[13px] font-semibold text-slate-900">{item.title || '(无标题)'}</strong>
                            <span className="mt-1 block text-[11px] text-slate-500">
                              {formatRelativeTime(item.lastMessageAt || item.gmtCreate)}
                              {item.messageCount != null ? ` · ${item.messageCount} 条` : ''}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          title="删除会话"
                          aria-label="删除会话"
                          disabled={busy}
                          onClick={event => void handleDelete(item, event)}
                          className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500 disabled:opacity-50"
                        >
                          {deletingId === item.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Composer({
  input,
  typing,
  inputRef,
  onChange,
  onSend,
}: {
  input: string;
  typing: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex-shrink-0 bg-gradient-to-b from-transparent via-[#f5f5f7]/95 to-[#f5f5f7] px-4 pb-4 pt-3 dark:via-[#151922]/95 dark:to-[#151922] sm:px-6 sm:pb-5">
      <div className="mx-auto max-w-[610px] rounded-[20px] border border-black/[0.09] bg-white/90 px-3.5 pb-2.5 pt-3 shadow-[0_12px_38px_rgba(15,23,42,0.09),inset_0_1px_0_white] backdrop-blur-2xl transition-shadow focus-within:border-blue-300 focus-within:shadow-[0_14px_42px_rgba(15,23,42,0.1),0_0_0_3px_rgba(37,99,235,0.06)]">
        <div className="flex items-end gap-2.5">
          <textarea
            ref={inputRef}
            value={input}
            rows={1}
            maxLength={8000}
            onChange={event => onChange(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            placeholder="给助手发消息"
            aria-label="给助手发消息"
            className="max-h-28 min-h-[38px] flex-1 resize-none overflow-y-auto border-0 bg-transparent px-0.5 py-2 text-sm leading-5.5 text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!input.trim() || typing}
            aria-label="发送消息"
            className="mb-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-blue-600 text-white shadow-sm transition-all hover:scale-[1.03] hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200"
          >
            <ArrowUp size={17} strokeWidth={2.3} />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3 px-0.5 text-[9px] text-slate-400">
          <span>Enter 发送 · Shift + Enter 换行</span>
          <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Assistant</span>
        </div>
      </div>
    </div>
  );
}


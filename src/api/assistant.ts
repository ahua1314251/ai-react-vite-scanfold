/**
 * 助手 mock API：本地模拟流式回复与会话历史，便于演示 FloatingAssistant。
 */

export type StreamEventType =
  | 'start'
  | 'thinking'
  | 'text'
  | 'tool'
  | 'tool_result'
  | 'raw'
  | 'done'
  | 'error';

export interface StreamEvent {
  type: StreamEventType;
  content?: string;
  message?: string;
  name?: string;
  input?: unknown;
  tool_use_id?: string;
  duration?: number;
  instanceAddress?: string;
}

export interface AskStreamParams {
  prompt: string;
  conversationId?: string | number | null;
  debug?: boolean;
  instanceAddress?: string | null;
  signal?: AbortSignal;
}

export interface AskStreamHandlers {
  onEvent?: (event: StreamEvent) => void;
  onConversationId?: (id: number) => void;
  onInstanceAddress?: (address: string) => void;
}

export interface ConversationSummary {
  id: number;
  title?: string;
  scope?: string;
  configId?: number | string;
  messageCount?: number;
  lastMessageAt?: string;
  gmtCreate?: string;
}

export interface ConversationEvent {
  role?: string;
  eventType?: string;
  payload?: string;
}

export interface ConversationTurn {
  userText: string | null;
  assistantEvents: ConversationEvent[];
}

interface StoredConversation {
  summary: ConversationSummary;
  events: ConversationEvent[];
}

const STORAGE_KEY = 'scaffold-assistant-conversations';

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = window.setTimeout(resolve, ms);
    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function loadStore(): StoredConversation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredConversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStore(items: StoredConversation[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function buildDemoReply(prompt: string): string {
  return [
    '## Demo 回复',
    '',
    `收到问题：**${prompt.slice(0, 80)}${prompt.length > 80 ? '…' : ''}**`,
    '',
    '这是手脚架内置的模拟回复，可替换为真实流式接口。',
    '',
    '1. 已完成上下文装配',
    '2. 模拟工具调用并汇总结果',
    '3. 生成可继续追问的示例回答',
    '',
    '- 侧栏「会话历史」会保存本轮对话（localStorage）',
    '- 执行轨迹可查看本轮处理步骤',
  ].join('\n');
}

function emitChunks(text: string): string[] {
  const size = 18;
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
  return chunks;
}

export async function askStream(params: AskStreamParams, handlers: AskStreamHandlers = {}): Promise<void> {
  const store = loadStore();
  let conversationId =
    params.conversationId != null && Number.isFinite(Number(params.conversationId))
      ? Number(params.conversationId)
      : null;

  if (!conversationId) {
    conversationId = Date.now();
    handlers.onConversationId?.(conversationId);
  } else {
    handlers.onConversationId?.(conversationId);
  }

  const existing = store.find(item => item.summary.id === conversationId);
  const events: ConversationEvent[] = existing?.events ? [...existing.events] : [];
  const now = new Date().toISOString();

  events.push({
    role: 'user',
    eventType: 'user',
    payload: JSON.stringify({ type: 'user', content: params.prompt }),
  });

  const pushAssistant = (type: string, payload: Record<string, unknown>) => {
    events.push({
      role: 'assistant',
      eventType: type,
      payload: JSON.stringify({ type, ...payload }),
    });
  };

  const emit = async (event: StreamEvent, delay = 280) => {
    await sleep(delay, params.signal);
    handlers.onEvent?.(event);
  };

  await emit({ type: 'start', instanceAddress: 'demo-local' }, 180);
  pushAssistant('start', {});

  await emit({ type: 'thinking' }, 360);
  pushAssistant('thinking', {});

  await emit({ type: 'tool', name: 'demo_lookup' }, 320);
  pushAssistant('tool', { name: 'demo_lookup' });

  await emit({ type: 'tool_result', duration: 86 }, 360);
  pushAssistant('tool_result', { duration: 86 });

  const reply = buildDemoReply(params.prompt);
  for (const chunk of emitChunks(reply)) {
    await emit({ type: 'text', content: chunk }, 40);
  }
  pushAssistant('text', { content: reply });

  await emit({ type: 'done' }, 120);
  pushAssistant('done', {});

  const title = params.prompt.trim().slice(0, 36) || '新会话';
  const summary: ConversationSummary = {
    id: conversationId,
    title,
    scope: 'PERSONAL',
    messageCount: Math.ceil(events.length / 2),
    lastMessageAt: now,
    gmtCreate: existing?.summary.gmtCreate || now,
  };

  const nextStore = store.filter(item => item.summary.id !== conversationId);
  nextStore.unshift({ summary, events });
  saveStore(nextStore.slice(0, 40));
}

export async function fetchConversations(options?: {
  scope?: 'PERSONAL' | 'DOMAIN';
  configId?: string | number;
  page?: number;
  size?: number;
  signal?: AbortSignal;
}): Promise<{ items: ConversationSummary[]; total?: number }> {
  await sleep(120, options?.signal);
  const items = loadStore().map(item => item.summary);
  const page = options?.page ?? 1;
  const size = options?.size ?? 50;
  const start = (page - 1) * size;
  return { items: items.slice(start, start + size), total: items.length };
}

export async function fetchConversationEvents(
  id: string | number,
  signal?: AbortSignal,
): Promise<ConversationEvent[]> {
  await sleep(100, signal);
  const found = loadStore().find(item => item.summary.id === Number(id));
  return found?.events || [];
}

export async function deleteConversation(id: string | number, signal?: AbortSignal): Promise<void> {
  await sleep(80, signal);
  saveStore(loadStore().filter(item => item.summary.id !== Number(id)));
}

export function groupEventsIntoTurns(events: ConversationEvent[]): ConversationTurn[] {
  const turns: ConversationTurn[] = [];
  let current: ConversationTurn | null = null;

  for (const ev of events || []) {
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(ev.payload || '{}') as Record<string, unknown>;
    } catch {
      continue;
    }
    const isUser = ev.role === 'user' || payload.type === 'user';
    if (isUser) {
      if (current) turns.push(current);
      current = { userText: String(payload.content || ''), assistantEvents: [] };
    } else {
      if (!current) current = { userText: null, assistantEvents: [] };
      current.assistantEvents.push(ev);
    }
  }
  if (current) turns.push(current);
  return turns;
}

export function extractAssistantText(events: ConversationEvent[]): string {
  const parts: string[] = [];
  for (const ev of events || []) {
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(ev.payload || '{}') as Record<string, unknown>;
    } catch {
      continue;
    }
    const type = String(payload.type || ev.eventType || '');
    if (type === 'text' && payload.content) parts.push(String(payload.content));
    if (type === 'error' && payload.message) parts.push(String(payload.message));
  }
  return parts.join('');
}

export function extractActivitySteps(events: ConversationEvent[]): Array<{
  label: string;
  detail: string;
  status: 'done';
}> {
  const steps: Array<{ label: string; detail: string; status: 'done' }> = [
    { label: '装配当前页面与会话上下文', detail: 'Context', status: 'done' },
  ];

  for (const ev of events || []) {
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(ev.payload || '{}') as Record<string, unknown>;
    } catch {
      continue;
    }
    const type = String(payload.type || ev.eventType || '');
    switch (type) {
      case 'start':
        steps.push({ label: '已连接，准备处理', detail: 'Start', status: 'done' });
        break;
      case 'thinking':
        steps.push({ label: '分析问题与回答路径', detail: 'Thinking', status: 'done' });
        break;
      case 'tool':
        steps.push({ label: `执行工具 ${String(payload.name || '工具')}`, detail: 'Tool', status: 'done' });
        break;
      case 'tool_result': {
        const duration = typeof payload.duration === 'number' ? ` · ${payload.duration}ms` : '';
        steps.push({ label: `工具返回结果${duration}`, detail: 'Result', status: 'done' });
        break;
      }
      case 'text':
        if (!steps.some(step => step.detail === 'Response')) {
          steps.push({ label: '生成回复', detail: 'Response', status: 'done' });
        }
        break;
      case 'error':
        steps.push({ label: String(payload.message || '请求失败'), detail: 'Error', status: 'done' });
        break;
      default:
        break;
    }
  }

  if (!steps.some(step => step.detail === 'Response' || step.detail === 'Error')) {
    steps.push({ label: '生成回复', detail: 'Response', status: 'done' });
  }
  return steps;
}

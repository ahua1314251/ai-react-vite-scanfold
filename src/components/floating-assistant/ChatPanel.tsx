import { AnimatePresence,motion } from 'framer-motion';
import {
History,
ListTree,
Plus,
X
} from 'lucide-react';
import { useCallback,useEffect,useRef,useState } from 'react';
import {
askStream,
extractActivitySteps,
extractAssistantText,
fetchConversationEvents,
groupEventsIntoTurns,
type ConversationSummary
} from '../../api/assistant';

import { ActivityView,AgentMark,Composer,Conversation,HistoryView,Welcome,type ActivityStep,type Message } from './views';

export default function ChatPanel({
  open,
  onClose,
  initialPrompt,
  autoSend,
  onPromptConsumed,
}: {
  open: boolean;
  onClose: () => void;
  initialPrompt?: string;
  autoSend?: boolean;
  onPromptConsumed?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activities, setActivities] = useState<Record<string, ActivityStep[]>>({});
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingLabel, setTypingLabel] = useState('连接中…');
  const [view, setView] = useState<'chat' | 'activity' | 'history'>('chat');
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const consumedRef = useRef('');
  const typingRef = useRef(false);
  const conversationIdRef = useRef<number | null>(null);
  const instanceAddressRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stepSeqRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, open]);

  useEffect(() => {
    const field = inputRef.current;
    if (!field) return;
    field.style.height = 'auto';
    field.style.height = `${Math.min(field.scrollHeight, 112)}px`;
  }, [input]);

  useEffect(() => () => {
    abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typingRef.current) return;

    const debugPattern = /(?:^|\s)#debug(?:\s|$)/i;
    const isDebug = debugPattern.test(trimmed);
    const displayPrompt = isDebug
      ? trimmed.replace(/#debug/gi, '').replace(/\s+/g, ' ').trim()
      : trimmed;

    typingRef.current = true;
    const userId = `u-${Date.now()}`;
    const assistantId = `a-${Date.now()}`;
    let responded = false;

    const nextStepId = (suffix: string) => {
      stepSeqRef.current += 1;
      return `${userId}-${suffix}-${stepSeqRef.current}`;
    };

    const setTurnSteps = (updater: (steps: ActivityStep[]) => ActivityStep[]) => {
      setActivities(previous => ({
        ...previous,
        [userId]: updater(previous[userId] || []),
      }));
    };

    const markRunningDone = () => {
      setTurnSteps(steps => steps.map(step => (step.status === 'running' ? { ...step, status: 'done' } : step)));
    };

    const pushRunning = (label: string, detail: string) => {
      setTurnSteps(steps => [
        ...steps.map(step => (step.status === 'running' ? { ...step, status: 'done' as const } : step)),
        { id: nextStepId(detail.toLowerCase()), label, detail, status: 'running' },
      ]);
    };

    setMessages(previous => [
      ...previous,
      {
        id: userId,
        role: 'user',
        content: displayPrompt + (isDebug ? '  #debug' : ''),
        createdAt: new Date(),
      },
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        status: '连接中…',
        createdAt: new Date(),
      },
    ]);
    setActivities(previous => ({
      ...previous,
      [userId]: [
        { id: nextStepId('ctx'), label: '装配当前页面与会话上下文', detail: 'Context', status: 'done' },
        { id: nextStepId('start'), label: '连接助手', detail: 'Start', status: 'running' },
      ],
    }));
    setInput('');
    setTyping(true);
    setTypingLabel('连接中…');
    setView('chat');

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const patchAssistant = (patch: Partial<Message>) => {
      setMessages(previous =>
        previous.map(message => (message.id === assistantId ? { ...message, ...patch } : message)),
      );
    };

    const finish = () => {
      markRunningDone();
      typingRef.current = false;
      setTyping(false);
      setTypingLabel('连接中…');
      abortRef.current = null;
      window.setTimeout(() => inputRef.current?.focus(), 30);
    };

    askStream(
      {
        prompt: displayPrompt,
        conversationId: conversationIdRef.current,
        debug: isDebug,
        instanceAddress: instanceAddressRef.current,
        signal: controller.signal,
      },
      {
        onConversationId: id => {
          if (!conversationIdRef.current) {
            conversationIdRef.current = id;
            setActiveConversationId(id);
          }
        },
        onInstanceAddress: address => {
          instanceAddressRef.current = address;
        },
        onEvent: event => {
          switch (event.type) {
            case 'start':
              setTypingLabel('已连接');
              patchAssistant({ status: '已连接' });
              pushRunning('已连接，准备处理', 'Start');
              break;
            case 'thinking':
              setTypingLabel('思考中…');
              patchAssistant({ status: '思考中…' });
              pushRunning('分析问题与回答路径', 'Thinking');
              break;
            case 'text':
              if (event.content) {
                setTypingLabel('正在回复…');
                if (!responded) {
                  responded = true;
                  pushRunning('生成回复', 'Response');
                }
                setMessages(previous =>
                  previous.map(message => {
                    if (message.id !== assistantId) return message;
                    return {
                      ...message,
                      content: message.content + event.content,
                      status: undefined,
                    };
                  }),
                );
              }
              break;
            case 'tool':
              setTypingLabel(`正在执行 ${event.name || '工具'}`);
              patchAssistant({ status: `正在执行 ${event.name || '工具'}` });
              pushRunning(`执行工具 ${event.name || '工具'}`, 'Tool');
              break;
            case 'tool_result': {
              const duration = typeof event.duration === 'number' ? ` · ${event.duration}ms` : '';
              setTypingLabel('处理中…');
              patchAssistant({ status: '处理中…' });
              setTurnSteps(steps => {
                const next = steps.map(step => (step.status === 'running' ? { ...step, status: 'done' as const } : step));
                return [
                  ...next,
                  {
                    id: nextStepId('tool-result'),
                    label: `工具返回结果${duration}`,
                    detail: 'Result',
                    status: 'done',
                  },
                ];
              });
              break;
            }
            case 'done':
              if (!responded) {
                pushRunning('生成回复', 'Response');
              }
              patchAssistant({ status: undefined });
              finish();
              break;
            case 'error':
              setTurnSteps(steps => [
                ...steps.map(step => (step.status === 'running' ? { ...step, status: 'done' as const } : step)),
                {
                  id: nextStepId('error'),
                  label: event.message || '请求失败',
                  detail: 'Error',
                  status: 'done',
                },
              ]);
              patchAssistant({
                content: event.message || '请求失败',
                status: undefined,
              });
              finish();
              break;
            default:
              break;
          }
        },
      },
    ).catch(error => {
      if (error?.name === 'AbortError') {
        finish();
        return;
      }
      setTurnSteps(steps => [
        ...steps.map(step => (step.status === 'running' ? { ...step, status: 'done' as const } : step)),
        {
          id: nextStepId('error'),
          label: error instanceof Error ? error.message : String(error),
          detail: 'Error',
          status: 'done',
        },
      ]);
      patchAssistant({
        content: error instanceof Error ? error.message : String(error),
        status: undefined,
      });
      finish();
    });
  }, []);

  useEffect(() => {
    if (!open || !initialPrompt || consumedRef.current === initialPrompt) return;
    consumedRef.current = initialPrompt;
    onPromptConsumed?.();
    if (autoSend) send(initialPrompt);
    else {
      setInput(initialPrompt);
      inputRef.current?.focus();
    }
  }, [open, initialPrompt, autoSend, onPromptConsumed, send]);

  const resetConversation = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    typingRef.current = false;
    conversationIdRef.current = null;
    instanceAddressRef.current = null;
    stepSeqRef.current = 0;
    consumedRef.current = '';
    setActiveConversationId(null);
    setMessages([]);
    setActivities({});
    setInput('');
    setTyping(false);
    setTypingLabel('连接中…');
    setView('chat');
    window.setTimeout(() => inputRef.current?.focus(), 50);
  };

  const selectSuggestion = (prompt: string) => {
    setInput(prompt);
    window.setTimeout(() => inputRef.current?.focus(), 30);
  };

  const loadConversation = async (item: ConversationSummary) => {
    abortRef.current?.abort();
    abortRef.current = null;
    typingRef.current = false;
    setTyping(false);
    setTypingLabel('连接中…');
    setInput('');

    const events = await fetchConversationEvents(item.id);
    const turns = groupEventsIntoTurns(events);
    const nextMessages: Message[] = [];
    const nextActivities: Record<string, ActivityStep[]> = {};

    turns.forEach((turn, index) => {
      const stamp = Date.now() + index;
      const userId = `hist-u-${item.id}-${index}-${stamp}`;
      const assistantId = `hist-a-${item.id}-${index}-${stamp}`;
      if (turn.userText != null) {
        nextMessages.push({
          id: userId,
          role: 'user',
          content: turn.userText,
          createdAt: new Date(),
        });
        nextActivities[userId] = extractActivitySteps(turn.assistantEvents).map((step, stepIndex) => ({
          id: `${userId}-step-${stepIndex}`,
          ...step,
        }));
      }
      const assistantText = extractAssistantText(turn.assistantEvents);
      nextMessages.push({
        id: assistantId,
        role: 'assistant',
        content: assistantText || (turn.assistantEvents.length ? '（本轮无文本回复）' : ''),
        createdAt: new Date(),
      });
    });

    conversationIdRef.current = item.id;
    setActiveConversationId(item.id);
    setMessages(nextMessages);
    setActivities(nextActivities);
    setView('chat');
    window.setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }, 50);
  };

  const handleHistoryDeleted = (id: number) => {
    if (conversationIdRef.current === id) {
      resetConversation();
      setView('history');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.button
          key="assistant-backdrop"
          type="button"
          aria-label="关闭助手"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9997] cursor-default bg-slate-950/10 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}
      {open && (
          <motion.section
            key="assistant-panel"
            role="dialog"
            aria-modal="true"
            aria-label="助手"
            initial={{ opacity: 0, x: 42, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 42, scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 390, damping: 34 }}
            className="fixed bottom-3 right-3 top-3 z-[9998] flex w-[min(680px,calc(100vw-24px))] flex-col overflow-hidden rounded-[24px] border border-white/70 bg-[#f5f5f7]/95 shadow-[-22px_18px_70px_rgba(15,23,42,0.16)] backdrop-blur-2xl"
            onClick={event => event.stopPropagation()}
          >
            <header className="flex h-[66px] flex-shrink-0 items-center gap-3 border-b border-black/[0.07] bg-white/75 px-4 backdrop-blur-xl sm:px-5">
              <AgentMark compact />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-sm font-semibold tracking-[-0.015em] text-slate-950">助手</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 在线
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[10px] text-slate-500">通用对话助手 · 支持流式回复与会话历史</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={resetConversation} title="新建对话" aria-label="新建对话" className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition-colors hover:bg-black/[0.055] hover:text-slate-900">
                  <Plus size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setView(value => (value === 'history' ? 'chat' : 'history'))}
                  title="会话历史"
                  aria-label="查看会话历史"
                  className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${view === 'history' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-black/[0.055] hover:text-slate-900'}`}
                >
                  <History size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setView(value => (value === 'activity' ? 'chat' : 'activity'))}
                  title="执行轨迹"
                  aria-label="查看执行轨迹"
                  className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${view === 'activity' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-black/[0.055] hover:text-slate-900'}`}
                >
                  <ListTree size={16} />
                </button>
                <button type="button" onClick={onClose} title="关闭" aria-label="关闭" className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition-colors hover:bg-black/[0.055] hover:text-slate-900">
                  <X size={17} />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1">
              {view === 'history' ? (
                <HistoryView
                  activeId={activeConversationId}
                  onBack={() => setView('chat')}
                  onPick={loadConversation}
                  onDeleted={handleHistoryDeleted}
                />
              ) : view === 'activity' ? (
                <ActivityView messages={messages} activities={activities} typing={typing} onBack={() => setView('chat')} />
              ) : messages.length === 0 && !typing ? (
                <Welcome onSelect={selectSuggestion} />
              ) : (
                <div className="h-full overflow-y-auto overscroll-contain"><Conversation messages={messages} typing={typing} typingLabel={typingLabel} endRef={endRef} /></div>
              )}
            </div>

            {view === 'chat' && (
              <Composer input={input} typing={typing} inputRef={inputRef} onChange={setInput} onSend={() => send(input)} />
            )}
          </motion.section>
      )}
    </AnimatePresence>
  );
}


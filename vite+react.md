# App Scaffold

通用前端手脚架：顶栏导航、可折叠侧栏菜单、主布局、主题切换、组件 Demo 首页、可拖拽悬浮助手。

技术栈：React 18 + TypeScript + Webpack + Tailwind CSS + React Router + Lucide + Framer Motion。

## 快速开始

```bash
# 按本文档创建文件后：
npm install
npm run dev
```

默认访问 `http://localhost:3015`。

## 目录结构

```
app-scaffold/
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── webpack.config.js
├── index.html
└── src/
    ├── index.tsx
    ├── App.tsx
    ├── styles/index.css
    ├── api/assistant.ts
    ├── contexts/
    │   ├── theme.tsx
    │   └── floating-assistant.tsx
    └── components/
        ├── page-context.tsx
        ├── ui/index.tsx
        ├── layout/
        │   ├── index.tsx
        │   └── menu-config.ts
        ├── home/index.tsx
        └── floating-assistant/index.tsx
```

## 能力概览

| 模块 | 说明 |
|------|------|
| Layout | 顶栏品牌/搜索/主题/头像 + 可折叠多级侧栏 |
| Menu | `menu-config.ts` 配置导航，叶子可滚动到首页 Demo 锚点 |
| Theme | 亮/暗色，localStorage 持久化 |
| UI | Button 样式、Field、EnumSelect、Combobox、Pagination、SectionCard、StatusBadge、EntryCard |
| Home | 单页组件 Demo 展示 |
| Assistant | 右下角悬浮球 + 对话面板；本地 mock 流式与会话历史 |

## 源码

以下按路径给出完整文件内容，复制即可还原项目。

### `.gitignore`

```gitignore
/node_modules/
/dist/
.idea
.DS_Store
```

### `package.json`

```json
{
  "name": "app-scaffold",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "framer-motion": "^11.18.2",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.5",
    "@babel/preset-env": "^7.23.5",
    "@babel/preset-react": "^7.23.5",
    "@babel/preset-typescript": "^7.23.5",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "babel-loader": "^9.1.3",
    "css-loader": "^6.8.1",
    "html-webpack-plugin": "^5.5.3",
    "postcss": "^8.4.31",
    "postcss-loader": "^7.3.3",
    "style-loader": "^3.3.3",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.3.3",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

### `tailwind.config.js`

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
    },
  },
  plugins: [],
};
```

### `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### `webpack.config.js`

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode !== 'production';

  return {
    mode: isDev ? 'development' : 'production',
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[contenthash:8].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-react',
                  {
                    runtime: 'automatic',
                    development: isDev,
                  },
                ],
                '@babel/preset-env',
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    watchOptions: {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    },
    devServer: {
      port: 3015,
      hot: true,
      historyApiFallback: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'body',
      }),
    ],
  };
};
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Scaffold</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }
    html.light, html.light body {
      background-color: #f5f5f7;
      color: #0f172a;
    }
    html.dark, html.dark body {
      background-color: #151922;
      color: #e7eaf0;
    }
  </style>
  <script>
    (function() {
      function applyThemeToDOM(theme) {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
      }
      var savedTheme = 'light';
      try {
        savedTheme = window.localStorage.getItem('scaffold-theme') === 'dark' ? 'dark' : 'light';
      } catch (error) {}
      applyThemeToDOM(savedTheme);
    })();
  </script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### `src/index.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### `src/App.tsx`

```tsx
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/theme';
import { FloatingAssistantProvider } from './contexts/floating-assistant';
import Layout from './components/layout/index';
import HomePage from './components/home/index';

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <FloatingAssistantProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </FloatingAssistantProvider>
      </HashRouter>
    </ThemeProvider>
  );
}
```

### `src/styles/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg-color: #f5f5f7;
  --text-color: #0f172a;
  --text-secondary: #64748b;
  --surface: rgba(255, 255, 255, 0.88);
  --surface-solid: #ffffff;
  --surface-muted: #f8fafc;
  --border-color: rgba(15, 23, 42, 0.08);
  color-scheme: light;
}

:root.dark,
[data-theme='dark'] {
  --bg-color: #151922;
  --text-color: #e7eaf0;
  --text-secondary: #9da7b7;
  --surface: rgba(31, 37, 48, 0.9);
  --surface-solid: #1f2530;
  --surface-muted: #252c38;
  --border-color: rgba(203, 213, 225, 0.12);
  color-scheme: dark;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-color);
  color: var(--text-color);
  letter-spacing: -0.006em;
  transition: background-color 180ms ease, color 180ms ease;
}

.lucide {
  stroke-width: 1.75;
  vector-effect: non-scaling-stroke;
}

/* Dark mode uses charcoal-blue surfaces and soft text instead of pure black/white. */
.dark [class~="bg-[#f5f5f7]"],
.dark [class~="bg-[#f8f8fa]"],
.dark [class~="bg-[#fbfbfc]"],
.dark [class~="bg-[#f5f5f7]/95"],
.dark [class~="bg-[#f8f8fa]/95"] {
  background-color: #151922 !important;
}

.dark .bg-white,
.dark [class~="bg-white/95"],
.dark [class~="bg-white/90"],
.dark [class~="bg-white/80"],
.dark [class~="bg-white/75"],
.dark [class~="bg-white/70"],
.dark [class~="bg-white/60"] {
  background-color: var(--surface) !important;
}

.dark .bg-slate-50,
.dark [class~="bg-slate-50/70"],
.dark [class~="bg-slate-50/40"] {
  background-color: #252c38 !important;
}

.dark .bg-slate-100,
.dark .bg-slate-200,
.dark .bg-slate-300 {
  background-color: #303846 !important;
}

.dark [class~="bg-black/[0.025]"],
.dark [class~="bg-black/[0.035]"],
.dark [class~="bg-black/[0.045]"],
.dark [class~="bg-black/[0.055]"] {
  background-color: rgba(226, 232, 240, 0.06) !important;
}

.dark .bg-blue-50,
.dark [class~="bg-blue-50/70"],
.dark [class~="bg-blue-50/40"] {
  background-color: rgba(59, 130, 246, 0.14) !important;
}

.dark .bg-blue-100 {
  background-color: rgba(59, 130, 246, 0.2) !important;
}

.dark .bg-red-50,
.dark [class~="bg-red-50/25"] {
  background-color: rgba(239, 68, 68, 0.12) !important;
}

.dark .bg-red-100 {
  background-color: rgba(239, 68, 68, 0.18) !important;
}

.dark .bg-amber-50 {
  background-color: rgba(245, 158, 11, 0.12) !important;
}

.dark .bg-emerald-50 {
  background-color: rgba(16, 185, 129, 0.12) !important;
}

.dark .text-slate-950,
.dark .text-slate-900,
.dark .text-slate-800 {
  color: #e7eaf0 !important;
}

.dark .text-slate-700,
.dark .text-slate-600 {
  color: #c2c9d4 !important;
}

.dark .text-slate-500 {
  color: #9da7b7 !important;
}

.dark .text-slate-400,
.dark .text-slate-300 {
  color: #7f8999 !important;
}

.dark .text-blue-700,
.dark .text-blue-600,
.dark .text-blue-500 {
  color: #78a9ff !important;
}

.dark .border-slate-100,
.dark .border-slate-200,
.dark .border-slate-300,
.dark [class*="border-black/["] {
  border-color: var(--border-color) !important;
}

.dark [class~="placeholder-slate-400"]::placeholder {
  color: #707b8b !important;
}

.dark [class~="hover:bg-slate-50"]:hover,
.dark [class~="hover:bg-slate-100"]:hover,
.dark [class~="hover:bg-slate-200"]:hover,
.dark [class~="hover:bg-white"]:hover,
.dark [class~="hover:bg-white/70"]:hover,
.dark [class~="hover:bg-black/[0.04]"]:hover,
.dark [class~="hover:bg-black/[0.055]"]:hover {
  background-color: #2a3240 !important;
}

.dark [class~="hover:text-slate-900"]:hover,
.dark [class~="hover:text-slate-800"]:hover,
.dark [class~="hover:text-slate-700"]:hover,
.dark [class~="hover:text-slate-600"]:hover {
  color: #eef1f5 !important;
}

.dark .recharts-cartesian-grid line {
  stroke: rgba(148, 163, 184, 0.12);
}

.dark .recharts-cartesian-axis-tick-value {
  fill: #8994a5;
}

.platform-overview-diagram svg {
  transition: filter 180ms ease;
}

.dark .platform-overview-diagram svg {
  filter: invert(0.82) hue-rotate(180deg) saturate(0.9);
}

button,
input,
select,
textarea {
  font: inherit;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
[role='button']:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.65);
  outline-offset: 2px;
}

::selection {
  background: rgba(59, 130, 246, 0.18);
}

* {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.dark * {
  scrollbar-color: #465164 transparent;
}

*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: padding-box;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark *::-webkit-scrollbar-thumb,
.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: #465164;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #5b687c;
}
```

### `src/contexts/theme.tsx`

```tsx
import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'scaffold-theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(readInitialTheme);

  useBrowserLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(current => (current === 'light' ? 'dark' : 'light')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used within ThemeProvider');
  return value;
}
```

### `src/contexts/floating-assistant.tsx`

```tsx
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface FloatingAssistantContextValue {
  chatOpen: boolean;
  pendingPrompt: string;
  pendingAutoSend: boolean;
  openChat: (prompt?: string, autoSend?: boolean) => void;
  closeChat: () => void;
  clearPendingPrompt: () => void;
}

const FloatingAssistantContext = createContext<FloatingAssistantContextValue | null>(null);

export function FloatingAssistantProvider({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState('');
  const [pendingAutoSend, setPendingAutoSend] = useState(false);

  const openChat = useCallback((prompt?: string, autoSend = false) => {
    if (prompt) setPendingPrompt(prompt);
    setPendingAutoSend(Boolean(prompt && autoSend));
    setChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  const clearPendingPrompt = useCallback(() => {
    setPendingPrompt('');
    setPendingAutoSend(false);
  }, []);

  const value = useMemo(
    () => ({ chatOpen, pendingPrompt, pendingAutoSend, openChat, closeChat, clearPendingPrompt }),
    [chatOpen, pendingPrompt, pendingAutoSend, openChat, closeChat, clearPendingPrompt],
  );

  return (
    <FloatingAssistantContext.Provider value={value}>
      {children}
    </FloatingAssistantContext.Provider>
  );
}

export function useFloatingAssistant(): FloatingAssistantContextValue {
  const ctx = useContext(FloatingAssistantContext);
  if (!ctx) {
    throw new Error('useFloatingAssistant must be used within FloatingAssistantProvider');
  }
  return ctx;
}
```

### `src/api/assistant.ts`

```typescript
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
```

### `src/components/page-context.tsx`

```tsx
import React from 'react';

interface PageContextProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

export default function PageContext({ title, description, eyebrow, actions }: PageContextProps) {
  return (
    <div className="mb-4 flex min-h-8 flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        {eyebrow && (
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
            {eyebrow}
          </span>
        )}
        <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">{title}</h1>
        {description && <p className="truncate text-xs text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
```

### `src/components/ui/index.tsx`

```tsx
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronDown, LucideIcon, X } from 'lucide-react';

export const inputClass =
  'bg-white/90 border border-black/[0.09] rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-[0_1px_1px_rgba(15,23,42,0.02)] transition-all focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/[0.08]';

export const secondaryButtonClass =
  'inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-slate-600 bg-white border border-black/[0.09] hover:border-blue-300 hover:text-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export const primaryButtonClass =
  'inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed';

export const dangerButtonClass =
  'inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export interface FieldProps {
  label: string;
  error?: React.ReactNode;
  children: React.ReactNode;
  controlId?: string;
  required?: boolean;
  className?: string;
}

export function Field({ label, error, children, controlId, required, className }: FieldProps) {
  const labelTextClass = `text-xs text-slate-500${required ? " after:ml-0.5 after:text-red-500 after:content-['*']" : ''}`;
  const rootClass = `flex flex-col gap-1.5 ${className ?? 'min-w-[160px] flex-1'}`;
  if (controlId) {
    return (
      <div className={rootClass}>
        <label htmlFor={controlId} className={labelTextClass}>
          {label}
        </label>
        {children}
        {error}
      </div>
    );
  }
  return (
    <div className={rootClass}>
      <label className="flex flex-col gap-1.5">
        <span className={labelTextClass}>{label}</span>
        {children}
      </label>
      {error}
    </div>
  );
}

const STATUS_META: Record<string, { label: string; textClass: string; dotClass: string }> = {
  ACTIVE: { label: '已生效', textClass: 'text-emerald-600', dotClass: 'bg-emerald-500' },
  REVIEWING: { label: '审批中', textClass: 'text-blue-600', dotClass: 'bg-blue-500' },
  DRAFT: { label: '草稿', textClass: 'text-slate-500', dotClass: 'bg-slate-400' },
  DEPRECATED: { label: '已废弃', textClass: 'text-slate-400', dotClass: 'bg-slate-300' },
};

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.textClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </span>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface EnumSelectProps {
  id?: string;
  ariaLabel?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  compact?: boolean;
}

export function EnumSelect({
  id,
  ariaLabel,
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled,
  clearable = false,
  compact = false,
}: EnumSelectProps) {
  const generatedId = useId();
  const listboxId = `${generatedId.replace(/:/g, '')}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedIndex = options.findIndex(option => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const triggerBase = compact
    ? 'flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-black/[0.09] bg-white/90 px-2.5 text-left text-xs text-slate-700 shadow-[0_1px_1px_rgba(15,23,42,0.02)] transition-all focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/[0.08]'
    : `${inputClass} flex w-full items-center justify-between gap-2 text-left`;

  const closePanel = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const openPanel = () => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(selectedIndex);
    buttonRef.current?.focus();
  };

  const commitValue = (next: string) => {
    onChange(next);
    closePanel();
  };

  useEffect(() => {
    if (!open) return undefined;
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const root = rootRef.current;
      if (!root || !(event.target instanceof Node) || root.contains(event.target)) return;
      closePanel();
    };
    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openPanel();
        return;
      }
      if (options.length === 0) return;
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex(prev =>
        prev < 0 ? (delta > 0 ? 0 : options.length - 1) : (prev + delta + options.length) % options.length,
      );
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      if (!open) return;
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < options.length) commitValue(options[activeIndex].value);
      return;
    }
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      closePanel();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        disabled={disabled}
        className={`${triggerBase} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        onClick={() => (open ? closePanel() : openPanel())}
        onKeyDown={handleKeyDown}
      >
        <span className={`truncate ${selected ? '' : 'text-slate-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {clearable && !disabled && value !== '' && (
            <span
              role="button"
              tabIndex={0}
              aria-label="清除已选"
              className="flex h-4 w-4 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
              onClick={event => {
                event.stopPropagation();
                onChange('');
              }}
              onKeyDown={event => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                event.stopPropagation();
                onChange('');
              }}
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown size={14} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 max-h-56 w-max min-w-full max-w-[calc(100vw-2rem)] overflow-auto rounded-xl border border-black/[0.09] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.10)]"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-sm ${
                index === activeIndex ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-blue-50'
              }`}
              onMouseDown={event => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => commitValue(option.value)}
            >
              <span className="whitespace-nowrap">{option.label}</span>
              {option.value === value ? <Check size={14} className="shrink-0 text-blue-600" /> : null}
            </li>
          ))}
          {options.length === 0 && <li className="px-3 py-1.5 text-sm text-slate-400">无可选项</li>}
        </ul>
      )}
    </div>
  );
}

export interface ComboboxProps {
  id?: string;
  ariaLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  autoUppercase?: boolean;
  error?: string;
  onBlur?: () => void;
  className?: string;
}

export function Combobox({
  id,
  ariaLabel,
  value,
  onChange,
  options,
  placeholder,
  readOnly,
  disabled,
  autoUppercase = true,
  error,
  onBlur,
  className,
}: ComboboxProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId.replace(/:/g, '');
  const listboxId = `${baseId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const locked = readOnly === true || disabled === true;
  const normalized = autoUppercase ? value.toUpperCase() : value;

  const filtered = useMemo(() => {
    if (keyword === null) return options;
    const needle = keyword.trim().toLowerCase();
    if (!needle) return options;
    return options.filter(option => option.toLowerCase().includes(needle));
  }, [options, keyword]);

  const itemCount = filtered.length;

  const closePanel = () => {
    setOpen(false);
    setKeyword(null);
    setActiveIndex(-1);
  };

  const openPanel = () => {
    if (locked) return;
    setOpen(true);
    setKeyword(null);
    setActiveIndex(options.findIndex(option => option === normalized));
  };

  const commitValue = (next: string) => {
    onChange(autoUppercase ? next.trim().toUpperCase() : next.trim());
    closePanel();
    onBlur?.();
  };

  useEffect(() => {
    if (!open) return undefined;
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const root = rootRef.current;
      if (!root || !(event.target instanceof Node) || root.contains(event.target)) return;
      closePanel();
    };
    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, [open]);

  useEffect(() => {
    setActiveIndex(prev => (prev >= itemCount ? -1 : prev));
  }, [itemCount]);

  const showPanel = open && !locked;

  return (
    <div ref={rootRef} className={`relative ${className ?? ''}`}>
      <input
        id={id}
        type="text"
        role="combobox"
        className={`${inputClass} w-full font-mono ${
          error ? 'border-red-300 focus:border-red-400 focus:ring-red-500/[0.08]' : ''
        } ${locked ? 'cursor-not-allowed opacity-60' : ''}`}
        value={normalized}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        autoComplete="off"
        aria-label={ariaLabel}
        aria-expanded={showPanel}
        aria-controls={listboxId}
        onChange={event => {
          const next = event.target.value;
          onChange(autoUppercase ? next.toUpperCase() : next);
          setKeyword(next);
          if (!open) setOpen(true);
        }}
        onKeyDown={event => {
          if (locked) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) {
              openPanel();
              return;
            }
            if (itemCount === 0) return;
            const delta = event.key === 'ArrowDown' ? 1 : -1;
            setActiveIndex(prev =>
              prev < 0 ? (delta > 0 ? 0 : itemCount - 1) : (prev + delta + itemCount) % itemCount,
            );
            return;
          }
          if (event.key === 'Enter') {
            if (!open || activeIndex < 0 || activeIndex >= itemCount) return;
            event.preventDefault();
            commitValue(filtered[activeIndex]);
            return;
          }
          if (event.key === 'Escape' && open) {
            event.preventDefault();
            closePanel();
          }
        }}
        onBlur={() => onBlur?.()}
        onClick={() => {
          if (!showPanel) openPanel();
        }}
        onFocus={() => {
          if (!showPanel) openPanel();
        }}
      />
      {showPanel && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-xl border border-black/[0.09] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.10)]"
        >
          {filtered.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={index === activeIndex}
              className={`cursor-pointer px-3 py-1.5 font-mono text-sm ${
                index === activeIndex ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-blue-50'
              }`}
              onMouseDown={event => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => commitValue(option)}
            >
              {option}
            </li>
          ))}
          {itemCount === 0 && (
            <li className="px-3 py-1.5 text-sm text-slate-400">无匹配建议，可直接输入新值</li>
          )}
        </ul>
      )}
    </div>
  );
}

export interface PaginationProps {
  pageNo: number;
  pageSize: number;
  total: number;
  onChange: (pageNo: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export function Pagination({
  pageNo,
  pageSize,
  total,
  onChange,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationProps) {
  if (total <= 0) return null;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const showSizeSwitcher =
    Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0 && typeof onPageSizeChange === 'function';

  return (
    <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
      <span>共 {total} 条</span>
      <div className="flex items-center gap-2">
        {showSizeSwitcher ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs">每页</span>
            <div className="w-20">
              <EnumSelect
                compact
                ariaLabel="每页条数"
                options={pageSizeOptions!.map(size => ({ value: String(size), label: `${size} 条` }))}
                value={String(pageSize)}
                onChange={next => onPageSizeChange!(Number(next))}
              />
            </div>
          </div>
        ) : null}
        <button
          type="button"
          className="h-8 px-3 rounded-lg border border-black/[0.09] bg-white/90 text-xs text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={pageNo <= 1}
          onClick={() => onChange(pageNo - 1)}
        >
          上一页
        </button>
        <span className="text-xs">
          第 {pageNo} / {totalPages} 页
        </span>
        <button
          type="button"
          className="h-8 px-3 rounded-lg border border-black/[0.09] bg-white/90 text-xs text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={pageNo >= totalPages}
          onClick={() => onChange(pageNo + 1)}
        >
          下一页
        </button>
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative focus-within:z-10 bg-white/80 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="mb-3 flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-medium text-slate-900">{title}</h3>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export function EntryCard({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-2 p-3.5 bg-white border border-black/[0.07] rounded-xl text-left hover:border-blue-300 hover:shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
          <Icon size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-800">{label}</div>
          {description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>}
        </div>
        <ArrowRight
          size={14}
          className="flex-shrink-0 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all mt-1"
        />
      </div>
    </button>
  );
}
```

### `src/components/layout/menu-config.ts`

```typescript
import {
  Activity,
  Boxes,
  FormInput,
  Home,
  LayoutDashboard,
  LucideIcon,
  MousePointerClick,
  Sparkles,
  Table2,
} from 'lucide-react';

export interface MenuNode {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  hidden?: boolean;
  url?: string;
  path?: string;
  /** 首页内 Demo 区块 id，点击后平滑滚动 */
  section?: string;
  children?: MenuNode[];
}

/** 菜单叶子通过 section 滚动到首页 Demo 区块 */
export const NAV_MENUS: MenuNode[] = [
  { id: 'home', label: '首页', icon: Home, description: '组件 Demo 总览', path: '/' },
  {
    id: 'basics',
    label: '基础控件',
    icon: MousePointerClick,
    description: '按钮、徽标、卡片等',
    section: 'buttons',
    children: [
      { id: 'buttons', label: '按钮', icon: MousePointerClick, description: '主/次/危险按钮', section: 'buttons' },
      { id: 'badges', label: '状态徽标', icon: Activity, description: 'StatusBadge 示例', section: 'badges' },
      { id: 'cards', label: '卡片', icon: Boxes, description: 'SectionCard / 入口卡片', section: 'cards' },
    ],
  },
  {
    id: 'forms',
    label: '表单组件',
    icon: FormInput,
    description: '输入框、下拉、Combobox',
    section: 'forms',
    children: [
      { id: 'fields', label: 'Field / Input', icon: FormInput, description: '表单字段容器', section: 'forms' },
      { id: 'selects', label: 'EnumSelect', icon: LayoutDashboard, description: '枚举下拉', section: 'selects' },
      { id: 'combobox', label: 'Combobox', icon: FormInput, description: '可搜索组合框', section: 'combobox' },
    ],
  },
  {
    id: 'data',
    label: '数据展示',
    icon: Table2,
    description: '表格与分页',
    section: 'table',
    children: [
      { id: 'table', label: '表格', icon: Table2, description: '列表示例', section: 'table' },
      { id: 'pagination', label: '分页', icon: LayoutDashboard, description: 'Pagination', section: 'pagination' },
    ],
  },
  {
    id: 'assistant',
    label: '助手',
    icon: Sparkles,
    description: '右下角悬浮助手',
    section: 'assistant',
  },
];

export interface MenuMatch {
  node: MenuNode;
  trail: string[];
  path: string;
}

function firstLeafPath(node: MenuNode): string | undefined {
  if (node.path) return node.path;
  if (node.section) return `/#${node.section}`;
  for (const child of node.children ?? []) {
    const found = firstLeafPath(child);
    if (found) return found;
  }
  return undefined;
}

export function firstActionableLeaf(node: MenuNode): MenuNode | undefined {
  if (node.path || node.url || node.section) return node;
  for (const child of node.children ?? []) {
    const found = firstActionableLeaf(child);
    if (found) return found;
  }
  return undefined;
}

export function activateMenuNode(node: MenuNode, navigate: (path: string) => void): void {
  if (node.url) {
    window.open(node.url, '_blank', 'noopener,noreferrer');
    return;
  }
  navigate(node.path || '/');
  if (node.section) {
    window.requestAnimationFrame(() => {
      document.getElementById(node.section!)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else if (node.path === '/') {
    window.requestAnimationFrame(() => {
      document.querySelector('main .overflow-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

export function searchMenus(keyword: string, limit = 8): MenuMatch[] {
  const key = keyword.trim().toLowerCase();
  if (!key) return [];

  const matches: MenuMatch[] = [];
  const walk = (nodes: MenuNode[], trail: string[]) => {
    for (const node of nodes) {
      if (node.hidden) continue;
      const path = firstLeafPath(node);
      if (path && node.label.toLowerCase().includes(key)) {
        matches.push({ node, trail, path });
      }
      if (node.children) walk(node.children, [...trail, node.label]);
    }
  };
  walk(NAV_MENUS, []);

  return matches.slice(0, limit);
}

export function expandedIdsForPath(pathname: string): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  const walk = (nodes: MenuNode[], trail: string[]): boolean => {
    let hit = false;
    for (const node of nodes) {
      const selfHit = Boolean(node.path && node.path === pathname);
      const childHit = node.children ? walk(node.children, [...trail, node.id]) : false;
      if (selfHit || childHit) {
        trail.forEach(id => {
          result[id] = true;
        });
        if (childHit) result[node.id] = true;
        hit = true;
      }
    }
    return hit;
  };
  walk(NAV_MENUS, []);
  return result;
}
```

### `src/components/layout/index.tsx`

```tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Moon,
  Orbit,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  Sun,
  X,
} from 'lucide-react';
import {
  MenuNode,
  MenuMatch,
  NAV_MENUS,
  activateMenuNode,
  expandedIdsForPath,
  firstActionableLeaf,
  searchMenus,
} from './menu-config';
import { useTheme } from '../../contexts/theme';
import FloatingAssistant from '../floating-assistant';

const SIDEBAR_STORAGE_KEY = 'scaffold-sidebar-collapsed';

function defaultExpandedMenus(pathname: string): Record<string, boolean> {
  const defaults: Record<string, boolean> = {};
  NAV_MENUS.forEach(node => {
    if (!node.hidden && node.children?.length) defaults[node.id] = true;
  });
  return { ...defaults, ...expandedIdsForPath(pathname) };
}

function TopSearch() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<MenuMatch[]>(() => {
    const key = keyword.trim();
    if (!key) return [];
    return searchMenus(key, 8);
  }, [keyword]);

  useEffect(() => {
    setHighlight(0);
  }, [keyword]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activate = (match: MenuMatch) => {
    activateMenuNode(match.node, navigate);
    setKeyword('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(results[highlight]);
    }
  };

  const showPanel = open && Boolean(keyword.trim());

  return (
    <div className="relative w-full max-w-2xl" ref={rootRef}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        ref={inputRef}
        value={keyword}
        onChange={e => {
          setKeyword(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="搜索菜单或组件"
        className="w-full h-9 pl-9 pr-14 rounded-xl bg-black/[0.035] border border-black/[0.04] text-[13px] text-slate-700 placeholder-slate-400 transition-all focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/[0.08]"
      />
      {keyword ? (
        <button
          type="button"
          onClick={() => {
            setKeyword('');
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600"
        >
          <X size={13} />
        </button>
      ) : (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 border border-slate-300 rounded px-1 py-px pointer-events-none">
          ⌘K
        </span>
      )}

      {showPanel && (
        <div className="absolute left-0 right-0 top-11 z-50 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_20px_55px_rgba(15,23,42,0.14)] overflow-hidden max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-slate-400">未匹配到菜单</div>
          ) : (
            results.map((match, index) => {
              const Icon = match.node.icon;
              return (
                <button
                  key={`menu-${match.path}`}
                  type="button"
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => activate(match)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    index === highlight ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} className="flex-shrink-0 text-slate-400" />
                  <span className="text-sm text-slate-700 truncate">{match.node.label}</span>
                  {match.trail.length > 0 && (
                    <span className="ml-auto text-xs text-slate-400 truncate">{match.trail.join(' / ')}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function containsPath(node: MenuNode, pathname: string): boolean {
  if (node.path === pathname) return true;
  return (node.children ?? []).some(child => containsPath(child, pathname));
}

function SidebarNode({
  node,
  depth,
  pathname,
  expanded,
  onToggle,
  collapsed = false,
}: {
  node: MenuNode;
  depth: number;
  pathname: string;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  collapsed?: boolean;
}) {
  const navigate = useNavigate();
  const Icon = node.icon;
  const visibleChildren = (node.children ?? []).filter(child => !child.hidden);
  const hasChildren = visibleChildren.length > 0;
  const isOpen = Boolean(expanded[node.id]);
  const isActive = Boolean(node.path) && node.path === pathname && !hasChildren;
  const subtreeActive = hasChildren && containsPath(node, pathname);
  const visuallyActive = isActive || (collapsed && subtreeActive);

  const indent = collapsed ? 'px-0 justify-center' : ['px-3', 'pl-8 pr-3', 'pl-11 pr-3'][Math.min(depth, 2)];
  const textSize = depth === 0 ? 'text-sm font-medium' : 'text-sm';

  return (
    <div>
      <button
        type="button"
        title={collapsed ? node.label : undefined}
        aria-label={collapsed ? node.label : undefined}
        onClick={() => {
          if (hasChildren) {
            if (collapsed) {
              if (node.path) activateMenuNode(node, navigate);
              else {
                const target = firstActionableLeaf(node);
                if (target) activateMenuNode(target, navigate);
              }
              return;
            }
            onToggle(node.id);
            if (!subtreeActive && node.path) activateMenuNode(node, navigate);
            return;
          }
          activateMenuNode(node, navigate);
        }}
        className={`relative w-full flex items-center gap-2.5 ${indent} py-2 text-left rounded-lg ${textSize} transition-all ${
          visuallyActive
            ? 'text-slate-950 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
            : subtreeActive
              ? 'text-slate-800 hover:bg-white/70'
              : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'
        }`}
      >
        {visuallyActive && <span className="absolute left-0 w-0.5 h-4 rounded-full bg-blue-500" />}
        <Icon size={depth === 0 ? 16 : 14} className={`flex-shrink-0 ${visuallyActive ? 'text-blue-500' : ''}`} />
        {!collapsed && <span className="truncate flex-1">{node.label}</span>}
        {!collapsed && hasChildren && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
      </button>
      {!collapsed &&
        hasChildren &&
        isOpen &&
        visibleChildren.map(child => (
          <SidebarNode
            key={child.path ?? child.id}
            node={child}
            depth={depth + 1}
            pathname={pathname}
            expanded={expanded}
            onToggle={onToggle}
            collapsed={false}
          />
        ))}
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => defaultExpandedMenus(pathname));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setExpanded(prev => ({ ...prev, ...expandedIdsForPath(pathname) }));
  }, [pathname]);

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleSidebar = () => {
    setSidebarCollapsed(current => {
      const next = !current;
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f7] text-slate-800">
      <header className="flex-shrink-0 z-20">
        <div
          className={`grid grid-cols-[minmax(0,1fr)_auto] items-center h-16 bg-white border-b border-black/[0.06] px-3 sm:px-4 gap-3 lg:gap-5 transition-[grid-template-columns] duration-200 ${
            sidebarCollapsed
              ? 'lg:grid-cols-[68px_minmax(280px,672px)_1fr]'
              : 'lg:grid-cols-[240px_minmax(280px,672px)_1fr]'
          }`}
        >
          <div className="hidden lg:flex items-center min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 shadow-sm">
                <Orbit size={18} className="text-blue-600" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <span className="block text-[13px] leading-4 font-semibold tracking-tight text-slate-900 whitespace-nowrap">
                    App Scaffold
                  </span>
                  <span className="block text-[10px] leading-4 text-slate-400">Layout · Menu · Components</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-start w-full min-w-0">
            <TopSearch />
          </div>
          <div className="flex items-center justify-end gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
              aria-label={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
              aria-pressed={theme === 'dark'}
              className="group grid h-9 w-9 place-items-center rounded-xl border border-black/[0.06] bg-white/70 text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button type="button" className="hidden sm:block relative p-2 rounded-xl hover:bg-black/[0.04] transition-colors">
              <Bell size={16} className="text-slate-500" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button type="button" className="hidden sm:block p-2 rounded-xl hover:bg-black/[0.04] transition-colors">
              <Settings2 size={16} className="text-slate-500" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-black/[0.08] shadow-sm">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=scaffold"
                alt="用户头像"
                className="w-full h-full object-cover bg-slate-100"
              />
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        <aside
          className={`hidden md:flex flex-shrink-0 bg-[#f8f8fa] border-r border-black/[0.06] flex-col transition-[width] duration-200 ${
            sidebarCollapsed ? 'w-[68px]' : 'w-60'
          }`}
        >
          <div
            className={`flex h-11 flex-shrink-0 items-center border-b border-black/[0.05] ${
              sidebarCollapsed ? 'justify-center' : 'justify-end px-2.5'
            }`}
          >
            <button
              type="button"
              onClick={toggleSidebar}
              title={sidebarCollapsed ? '展开菜单' : '收起菜单'}
              aria-label={sidebarCollapsed ? '展开菜单' : '收起菜单'}
              aria-expanded={!sidebarCollapsed}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-2.5 space-y-0.5">
            {NAV_MENUS.filter(node => !node.hidden).map(node => (
              <SidebarNode
                key={node.id}
                node={node}
                depth={0}
                pathname={pathname}
                expanded={expanded}
                onToggle={toggle}
                collapsed={sidebarCollapsed}
              />
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0 min-h-0 overflow-hidden bg-[#f5f5f7]">
          <Outlet />
        </main>
      </div>
      <FloatingAssistant />
    </div>
  );
}
```

### `src/components/home/index.tsx`

```tsx
import React, { useState } from 'react';
import { Download, FileText, Plus, Save, Sparkles } from 'lucide-react';
import PageContext from '../page-context';
import { useFloatingAssistant } from '../../contexts/floating-assistant';
import {
  Combobox,
  EntryCard,
  EnumSelect,
  Field,
  Pagination,
  SectionCard,
  StatusBadge,
  dangerButtonClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '../ui';

const DEMO_ROWS = [
  { code: 'TASK-1001', category: '设计', status: 'ACTIVE', owner: '张三' },
  { code: 'TASK-1002', category: '开发', status: 'REVIEWING', owner: '李四' },
  { code: 'TASK-1003', category: '测试', status: 'DRAFT', owner: '王五' },
  { code: 'TASK-1004', category: '文档', status: 'DEPRECATED', owner: '赵六' },
  { code: 'TASK-1005', category: '发布', status: 'ACTIVE', owner: '钱七' },
];

function DemoSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  const { openChat } = useFloatingAssistant();
  const [name, setName] = useState('');
  const [region, setRegion] = useState('east');
  const [category, setCategory] = useState('设计');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-8 pb-16">
        <PageContext
          title="组件 Demo"
          description="布局、菜单与可复用控件样式示例"
          actions={
            <button
              type="button"
              className={primaryButtonClass}
              onClick={() => openChat('帮我总结一下当前页面有哪些组件示例', true)}
            >
              <Sparkles size={14} />
              打开助手
            </button>
          }
        />

        <DemoSection id="buttons" title="按钮" description="主按钮 / 次按钮 / 危险按钮">
          <SectionCard title="Button" hint="primaryButtonClass / secondaryButtonClass / dangerButtonClass">
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className={primaryButtonClass}>
                <Save size={14} />
                保存
              </button>
              <button type="button" className={secondaryButtonClass}>
                <Download size={14} />
                导出
              </button>
              <button type="button" className={dangerButtonClass}>
                删除
              </button>
              <button type="button" className={primaryButtonClass} disabled>
                禁用主按钮
              </button>
              <button type="button" className={secondaryButtonClass} disabled>
                禁用次按钮
              </button>
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="badges" title="状态徽标" description="StatusBadge 生命周期状态">
          <SectionCard title="StatusBadge">
            <div className="flex flex-wrap items-center gap-5">
              {(['ACTIVE', 'REVIEWING', 'DRAFT', 'DEPRECATED'] as const).map(status => (
                <StatusBadge key={status} status={status} />
              ))}
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="cards" title="卡片" description="SectionCard 与入口卡片 EntryCard">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
            <EntryCard icon={FileText} label="文档中心" description="查看项目说明与使用指南" />
            <EntryCard icon={Plus} label="新建条目" description="演示入口卡片的 hover 与箭头动效" />
            <EntryCard icon={Download} label="导出报告" description="白底圆角边框的可点击入口样式" />
          </div>
        </DemoSection>

        <DemoSection id="forms" title="表单字段" description="Field + 标准 inputClass">
          <SectionCard title="Field / Input" hint="校验错误通过 Field.error 插槽展示">
            <div className="flex flex-wrap gap-3">
              <Field label="名称" required>
                <input
                  className={`${inputClass} w-full`}
                  placeholder="请输入名称"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Field>
              <Field
                label="备注"
                error={<span className="text-xs text-red-500">示例校验错误文案</span>}
              >
                <input className={`${inputClass} w-full border-red-300`} placeholder="带错误态" defaultValue="" />
              </Field>
              <Field label="只读">
                <input className={`${inputClass} w-full opacity-60`} readOnly value="只读示例" />
              </Field>
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="selects" title="枚举下拉" description="EnumSelect 手写 listbox">
          <SectionCard title="EnumSelect" hint="支持 clearable / compact">
            <div className="flex flex-wrap gap-3 max-w-xl">
              <Field label="区域" controlId="demo-region" className="w-56 flex-none">
                <EnumSelect
                  id="demo-region"
                  ariaLabel="区域"
                  clearable
                  options={[
                    { value: 'east', label: '华东' },
                    { value: 'north', label: '华北' },
                    { value: 'south', label: '华南' },
                  ]}
                  value={region}
                  onChange={setRegion}
                />
              </Field>
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="combobox" title="组合框" description="Combobox 可搜索 + 自由输入">
          <SectionCard title="Combobox" hint="默认自动转大写可按需关闭">
            <div className="max-w-sm">
              <Field label="分类" controlId="demo-category" required>
                <Combobox
                  id="demo-category"
                  ariaLabel="分类"
                  value={category}
                  onChange={setCategory}
                  options={['设计', '开发', '测试', '文档', '发布']}
                  placeholder="输入或选择分类"
                  autoUppercase={false}
                />
              </Field>
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="table" title="表格" description="列表容器与行样式">
          <SectionCard title="Table" hint="圆角边框 + 表头分割线">
            <div className="overflow-x-auto rounded-xl border border-black/[0.07]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">编号</th>
                    <th className="px-4 py-2.5 font-medium">分类</th>
                    <th className="px-4 py-2.5 font-medium">状态</th>
                    <th className="px-4 py-2.5 font-medium">负责人</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_ROWS.slice(0, pageSize).map(row => (
                    <tr key={row.code} className="border-t border-black/[0.05] hover:bg-slate-50/60">
                      <td className="px-4 py-2.5 font-mono text-slate-800">{row.code}</td>
                      <td className="px-4 py-2.5 text-slate-600">{row.category}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{row.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </DemoSection>

        <DemoSection id="pagination" title="分页" description="Pagination 含每页条数切换">
          <SectionCard title="Pagination">
            <Pagination
              pageNo={pageNo}
              pageSize={pageSize}
              total={48}
              onChange={setPageNo}
              pageSizeOptions={[5, 10, 20]}
              onPageSizeChange={size => {
                setPageSize(size);
                setPageNo(1);
              }}
            />
          </SectionCard>
        </DemoSection>

        <DemoSection id="alerts" title="提示条" description="信息 / 警告 / 错误反馈">
          <div className="space-y-2.5">
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-700">
              信息提示：这是一条普通操作反馈。
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              警告提示：请确认后再继续操作。
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              错误提示：提交失败，请稍后重试。
            </div>
          </div>
        </DemoSection>

        <DemoSection id="assistant" title="助手" description="右下角可拖拽悬浮球，点击打开对话面板">
          <SectionCard title="FloatingAssistant" hint="对话走本地 mock 流式接口，历史存 localStorage">
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className={primaryButtonClass} onClick={() => openChat()}>
                <Sparkles size={14} />
                打开空白会话
              </button>
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={() => openChat('请用三句话介绍这个前端手脚架', true)}
              >
                带提示词并自动发送
              </button>
              <p className="text-xs text-slate-400">也可直接点页面右下角悬浮球</p>
            </div>
          </SectionCard>
        </DemoSection>
      </div>
    </div>
  );
}
```

### `src/components/floating-assistant/index.tsx`

```tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  GripVertical,
  History,
  ListTree,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  askStream,
  deleteConversation,
  extractActivitySteps,
  extractAssistantText,
  fetchConversationEvents,
  fetchConversations,
  groupEventsIntoTurns,
  type ConversationSummary,
} from '../../api/assistant';
import { useFloatingAssistant } from '../../contexts/floating-assistant';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  /** 流式过程中的状态文案（思考中 / 执行工具等） */
  status?: string;
}

interface ActivityStep {
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

const FAB_SIZE = 50;
const EDGE_MARGIN = 12;
const STORAGE_KEY = 'scaffold-assistant-float-y';
const DRAG_THRESHOLD = 5;

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

function clampFloatY(value: number): number {
  return Math.max(EDGE_MARGIN, Math.min(value, window.innerHeight - FAB_SIZE - EDGE_MARGIN));
}

function loadFloatY(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const stored = raw ? Number(raw) : Number.NaN;
    if (Number.isFinite(stored)) return clampFloatY(stored);
  } catch {
    // localStorage 不可用时使用默认位置。
  }
  return clampFloatY(window.innerHeight * 0.56);
}

function saveFloatY(value: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // 不影响助手使用。
  }
}

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

function AgentMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`${compact ? 'h-8 w-8 rounded-[10px] text-xs' : 'h-[68px] w-[68px] rounded-[21px] text-2xl'} grid flex-shrink-0 place-items-center border border-blue-100 bg-gradient-to-br from-blue-50 to-slate-100 font-semibold text-blue-700 shadow-[0_10px_28px_rgba(37,99,235,0.1)] dark:from-blue-500/20 dark:to-slate-800`}
    >
      <Sparkles size={compact ? 16 : 28} />
    </div>
  );
}

function Welcome({ onSelect }: { onSelect: (prompt: string) => void }) {
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

function Conversation({ messages, typing, typingLabel, endRef }: {
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

function ActivityView({
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

function HistoryView({
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

function Composer({
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

function ChatPanel({
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

export default function FloatingAssistant() {
  const { chatOpen, pendingPrompt, pendingAutoSend, openChat, closeChat, clearPendingPrompt } = useFloatingAssistant();
  const [floatY, setFloatY] = useState(loadFloatY);
  const [dragY, setDragY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  /** 首次打开后保持 ChatPanel 挂载，关闭只隐藏 UI，会话与 conversationId 不丢 */
  const [sessionMounted, setSessionMounted] = useState(false);
  const dragRef = useRef<{ startY: number; originY: number; moved: boolean } | null>(null);

  useEffect(() => {
    if (chatOpen) setSessionMounted(true);
  }, [chatOpen]);

  useEffect(() => {
    const handleResize = () => {
      setFloatY(previous => {
        const next = clampFloatY(previous);
        saveFloatY(next);
        return next;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startY: event.clientY, originY: floatY, moved: false };
    setIsDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const delta = event.clientY - dragRef.current.startY;
    if (Math.abs(delta) > DRAG_THRESHOLD) dragRef.current.moved = true;
    setDragY(clampFloatY(dragRef.current.originY + delta));
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const { moved, startY, originY } = dragRef.current;
    dragRef.current = null;
    setIsDragging(false);
    if (moved) {
      const next = clampFloatY(originY + event.clientY - startY);
      setFloatY(next);
      setDragY(null);
      saveFloatY(next);
    } else {
      setDragY(null);
      openChat();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: isHovered || isDragging ? 0 : 15, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="fixed right-3 z-[9999] touch-none select-none"
            style={{ top: dragY ?? floatY }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              className="group relative grid h-[50px] w-[50px] cursor-grab place-items-center rounded-2xl border border-blue-100 bg-white/95 text-blue-700 shadow-[0_10px_28px_rgba(37,99,235,0.16),inset_0_1px_0_white] backdrop-blur-xl active:cursor-grabbing"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label="打开助手"
            >
              {isDragging ? <GripVertical size={19} className="text-blue-600" /> : <Sparkles size={20} />}
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              <span className={`pointer-events-none absolute right-[58px] whitespace-nowrap rounded-xl border border-black/[0.07] bg-white/95 px-3 py-2 text-xs font-medium text-slate-800 shadow-lg backdrop-blur-xl transition-all ${isHovered && !isDragging ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}>
                助手
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {sessionMounted && (
        <ChatPanel
          open={chatOpen}
          onClose={closeChat}
          initialPrompt={pendingPrompt}
          autoSend={pendingAutoSend}
          onPromptConsumed={clearPendingPrompt}
        />
      )}
    </>
  );
}
```


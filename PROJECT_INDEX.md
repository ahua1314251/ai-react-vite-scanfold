# 项目概览

本文件用于快速定位，不替代源码；开发时随实际改动更新，未变化的条目保持不动。

## 项目与命令

- 当前状态：React 业务脚手架，尚未创建业务模块；项目用途按实际需求填写。
- 技术栈：React 18、TypeScript、Vite、Tailwind CSS、HashRouter。
- 环境：Node.js 20.19+ 或 22.12+；安装 `npm install`，开发 `npm run dev`，验证 `npm run check`。

## 入口和模块

| 功能 | 入口或目录 | 说明 |
| --- | --- | --- |
| 应用入口与路由 | `src/index.tsx`、`src/App.tsx`、`src/pages/routes.ts` | `/` 为占位首页；业务页面在路由表注册 |
| 首页占位 | `src/components/home/` | 按业务需求替换 |
| 布局和菜单 | `src/components/layout/` | 管理布局和特殊菜单 |
| 通用组件 | `src/components/ui/index.ts` | 使用接口参见 `docs/components.md` |
| 组件演示 | `src/components/ui-gallery/` | 模板示例，非业务页面 |
| 可选悬浮助手 | `src/components/floating-assistant/`、`src/api/assistant.ts` | 默认关闭；数据为本地 mock |

新增业务模块时，在此表记录功能、路由、入口、目录、主要依赖与状态；需要时链接模块内的 `INDEX.md`。不要在此复制源码或大段示例数据。

## 共享数据和依赖

当前无业务实体或共享业务数据。多个模块共同读写的实体按需放在 `src/shared/<实体>/`，此处记录唯一数据源、公开接口、使用模块和必要依赖；模块私有 mock 留在对应 `src/pages/<模块>/`。

## 已知限制

首页、Gallery、账户和消息均为模板占位或演示；悬浮助手默认关闭。项目集成时按实际保留、替换或移除，并同步本文件。

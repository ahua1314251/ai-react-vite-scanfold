# React + TypeScript 业务脚手架

本项目使用 **Vite**、React 18、TypeScript 和 Tailwind CSS。

## 开始

需要 Node.js 20.19+ 或 22.12+（Vite 8 的运行要求）。

```bash
npm install
npm run dev       # http://localhost:3015
npm run build     # 生产构建输出到 dist/
npm run typecheck # TypeScript 类型检查
npm run check     # 类型检查和生产构建
```

构建资源默认使用相对路径，支持部署到子路径；如果需要固定资源根路径，可在 `vite.config.mts` 配置 `base`。

图标使用 lucide-react 0.294.0；选用该版本存在的名称（例如 `PenSquare`）。

## Markdown 通用组件

`MarkdownEditor` 是受控编辑器，通过 `value` 和 `onChange` 管理内容，支持格式工具栏、快捷键和由调用方提供上传回调的图片插入；`MarkdownPreview` 可以独立渲染 Markdown。两者均从 `src/components/ui` 导出，可在组件 Gallery 查看示例。预览支持表格、任务列表等 GFM 语法，不渲染原始 HTML。

## 通用交互组件

组件 Gallery 展示对话框、抽屉、提示、可排序表格、状态、文件选择、日期、标签输入、选项卡、选择控件和同步表单校验。通用组件和类型从 `src/components/ui` 导出；文件选择组件返回所选文件，上传和持久化由调用方管理。`DatePicker` 支持输入日期及调用浏览器原生日历。`DataTable` 提供受控排序、筛选和分页接口，数据处理由调用方实现。组件用途和限制详见 [通用组件说明](docs/components.md)。

## 开发业务页面

1. 在 `src/pages/` 新建页面；列表组件可参考 `#/gallery`。
2. 在 `src/pages/routes.ts` 注册路径、标题、图标和组件，路由和菜单由它生成。路径必须以 `/` 开头。
3. 替换示例数据；接入真实异步接口时实现加载、失败、重试和空状态。
4. 运行 `npm run check`，并检查相关页面交互。

业务页面注册表初始为空；Gallery 中的数据仅供演示。页面一般使用 `PageContext` 和 `SectionCard`。组件导出清单见 `src/components/ui/index.ts`，实现按需查看。`#/gallery` 展示组件；`src/components/home/` 是首页占位。未匹配的路由显示 404。

菜单的 Gallery 等特殊项位于 `src/components/layout/menu-config.ts`。悬浮助手在 `src/config.ts` 默认关闭，数据来自本地 mock。其他入口见 [文档索引](docs/INDEX.md)。

## 维护约定

- 路由和菜单：业务页面在 `src/pages/routes.ts` 注册；特殊菜单在 `src/components/layout/menu-config.ts` 配置。
- 通用组件和控件样式放在 `src/components/ui/`，优先复用；页面专属代码留在对应页面目录。
- 全局基础样式在 `src/styles/index.css`，暗色主题变量和兼容样式在 `src/styles/dark.css`。调整主题时优先修改变量，新增组件时同时检查亮色和暗色状态。
- 顶栏账户与消息目前是明确标注的演示占位，接入服务时替换 `src/components/layout/HeaderAccount.tsx` 中的数据和交互。悬浮助手默认关闭，在 `src/config.ts` 开启，当前对话接口是本地 mock。
- 修改后运行 `npm run check`，并在浏览器验证受影响的页面和交互。

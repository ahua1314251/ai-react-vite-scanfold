# 文档索引

源码以 `src/` 为准，不维护源码镜像。

- 页面注册：`src/pages/routes.ts`（初始无业务页面）。
- 构建配置：`vite.config.mts`；启动和校验命令见 [README](../README.md)。
- 布局和菜单：`src/components/layout/`，搜索与侧栏节点各有独立文件。
- 组件使用说明：[components.md](components.md)。
- 组件清单：`src/components/ui/index.ts`；具体实现按需读取对应文件。
- 组件示例：应用内 `#/gallery`，源码 `src/components/ui-gallery/` 按基础、表单、表格、通用交互和助手拆分。
- 可选悬浮助手：`src/components/floating-assistant/`，API 为本地 mock，默认关闭。

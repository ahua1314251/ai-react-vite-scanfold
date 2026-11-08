# Agent 工作约定

- 项目使用 React、TypeScript、Webpack 和 Tailwind；入口见 README.md。
- 先查看本文件和当前任务相关源码，按需搜索；不要读取 node_modules、dist 或 lock 文件全文。
- 业务页面注册在 src/pages/routes.ts；列表页可参考 src/pages/example-list/。
- 通用组件清单见 src/components/ui/index.ts，使用说明见 docs/components.md；新增或调整组件时同步更新示例和相关说明。
- 优先复用现有组件；仅在任务需要时修改布局、主题或悬浮助手。
- 模拟数据须明确标记；不要将 mock 当作真实接口。
- 完成后运行 npm run check；如失败，报告原因并区分已有问题和本次改动。

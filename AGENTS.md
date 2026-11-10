# Agent 工作约定

- 项目使用 React、TypeScript、Vite 和 Tailwind；入口见 README.md。
- 先查看本文件和当前任务相关源码，按需搜索；不要读取 node_modules、dist 或 lock 文件全文。
- 新建业务代码按功能或页面放在 src/pages/<模块>/；页面、专属组件、类型、数据访问与 mock 就近组织，按需建文件。业务页面仍在 src/pages/routes.ts 注册；列表组件可参考组件 Gallery。
- 仅单个模块使用的数据放在该模块；多功能共同读写的实体使用 src/shared/<实体>/ 共享数据模块和唯一数据源，避免跨页面复制状态。按模块划分写入范围，明确共享接口及其负责人。
- 已有项目沿用原有结构，除非用户要求或任务必要，不进行无关迁移。
- 通用组件清单见 src/components/ui/index.ts，使用说明见 docs/components.md；新增或调整组件时同步更新示例和相关说明。
- 优先复用现有组件；仅在任务需要时修改布局、主题或悬浮助手。
- 完成后运行 npm run check；如失败，报告原因并区分已有问题和本次改动。

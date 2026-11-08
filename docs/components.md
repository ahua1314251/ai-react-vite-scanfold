# 通用组件

组件和类型由 `src/components/ui/index.ts` 导出，交互示例见 `#/gallery`。具体 props 和默认值以组件源码为准。组件不包含业务接口或持久化逻辑。

## 内容编辑

- `MarkdownEditor`：受控输入，通过 `value`、`onChange` 管理文本，支持切换预览、标签、占位文字、行数和禁用状态。支持格式工具栏、粗体/斜体快捷键和通过调用方的 `onUploadImage` 回调插入图片；组件不自行上传文件。
- `MarkdownPreview`：独立渲染 Markdown 和 GFM（如表格、任务列表）；不启用原始 HTML。Markdown 样式位于 `src/styles/index.css`。

```tsx
import { useState } from 'react';
import { MarkdownEditor, MarkdownPreview } from './components/ui';

function Example() {
  const [content, setContent] = useState('# 标题');
  return <>
    <MarkdownEditor value={content} onChange={setContent} label="正文" />
    <MarkdownPreview value={content} />
  </>;
}
```

示例导入路径以业务文件所在目录为准。

## 反馈、数据和导航

- `Modal`、`ConfirmDialog`：通过 `open` 和 `onClose` 控制，确认操作由调用方实现；`Modal` 可通过 `closable={false}` 禁止关闭，`ConfirmDialog` 在 `pending` 时禁止关闭。
- `Alert`、`Toast`：展示提示；Toast 由调用方控制打开状态，`duration={0}` 时不会自动关闭。
- `EmptyState`、`LoadingState`、`ErrorState`、`Skeleton`：展示数据和加载状态；重试逻辑由调用方提供。
- `DataTable`：通过 `columns`、`rows`、`rowKey` 定义列和数据，提供行悬停、加载及空状态。将列的 `sortable` 设为 `true` 并提供 `sort` / `onSortChange` 后，可点击表头切换升序或降序；实际排序由调用方对 `rows` 执行。`filter` 和 `pagination` 也由调用方控制，可用于本地或服务端数据。Gallery 表格使用本地模拟数据。
- `Breadcrumb`、`Drawer`、`Tooltip`、`Popover`：页面导航、抽屉和辅助说明。
- `Tabs`：受控选项卡，支持左右方向键、Home 和 End。
- `DropdownMenu`：操作项通过回调执行，支持键盘打开和 Escape 关闭。

## 表单和文件

- `Checkbox`、`Radio`、`Switch`、`SearchInput`：受控选择和搜索输入。
- `Field`、`EnumSelect`、`Combobox`：表单字段和选择输入。
- `TagInput`：受控字符串数组，输入后按 Enter、逗号或移出输入框添加标签。
- `DatePicker`：支持直接输入 `YYYY-MM-DD`；启用 `includeTime` 时使用本地日期时间格式，如 `2026-11-07T14:30`。失焦或按 Enter 时校验日期及 `min` / `max` 范围，有效值通过 `onChange` 提交；无效内容保留在输入框并显示错误，清空时提交空字符串。点击文本框或日历按钮可在支持的浏览器中打开原生选择器；不支持时仍可手动输入。
- `ImageUpload`：选择图片后显示文件名并通过 `onChange` 返回文件，移除时返回 `null`；预览地址由调用方通过 `value` 提供。
- `FileUpload`：选择文件后显示文件名并通过 `onChange` 返回文件数组，清除时返回空数组；上传进度和错误信息由调用方传入。
- `validateFields`：执行同步字段校验并返回错误对象；展示错误、异步校验和提交由调用方处理。

文件选择组件不会自行上传、保存文件或生成预览地址。使用对象 URL 时，调用方应在不再使用时释放它。

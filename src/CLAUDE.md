# src/

> L2 | 父级: /CLAUDE.md

## 成员清单

| 文件        | 职责                                                       |
| ----------- | ---------------------------------------------------------- |
| `main.jsx`  | 应用入口，挂载 React 根节点到 DOM                          |
| `App.jsx`   | 主应用组件，管理 theme + markdownStyle 状态，编辑→预览→导出 |
| `index.css` | Tailwind v4 入口 + typography 插件 + github-markdown-css + 三套 Markdown 排版样式 |

## 子目录

| 目录          | 职责                                      |
| ------------- | ----------------------------------------- |
| `assets/`     | 静态资源（SVG、图片等）                   |
| `components/` | UI 组件（MarkdownEditor, ImagePreview, Toolbar, ui/） |
| `config/`     | 配置文件（themes, markdownStyles, defaults） |
| `lib/`        | 工具函数（cn 等）                          |

## 依赖关系

```text
main.jsx
  └── App.jsx
        ├── config/themes.js
        ├── config/markdownStyles.js
        ├── config/defaults.js
        ├── components/Toolbar.jsx
        ├── components/MarkdownEditor.jsx
        └── components/ImagePreview.jsx
```

---

**PROTOCOL**: 文件增删时更新此清单，然后检查 /CLAUDE.md

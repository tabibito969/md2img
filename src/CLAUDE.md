# src/

> L2 | 父级: /CLAUDE.md

## 成员清单

| 文件        | 职责                                                                           |
| ----------- | ------------------------------------------------------------------------------ |
| `main.jsx`  | 应用入口，挂载 React 根节点到 DOM                                              |
| `App.jsx`   | 主应用组件，四区布局 + 多卡片状态 + 导出逻辑                                    |
| `index.css` | Tailwind v4 入口 + typography 插件 + github-markdown-css + 四套 Markdown 排版样式 |

## 子目录

| 目录          | 职责                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| `assets/`     | 静态资源（SVG、图片等）                                                        |
| `components/` | UI 组件（IconSidebar, ContentSidebar, TopBar, PropertiesPanel, ImagePreview 等） |
| `config/`     | 配置文件（themes, shadows, templates, markdownStyles, defaults）               |
| `lib/`        | 工具函数（cn 等）                                                              |

## 依赖关系

```text
main.jsx
  └── App.jsx
        ├── config/themes.js
        ├── config/markdownStyles.js
        ├── config/defaults.js
        ├── components/IconSidebar.jsx
        ├── components/ContentSidebar.jsx
        │     ├── components/TemplatePanel.jsx
        │     │     └── config/templates.js
        │     └── components/BackgroundPanel.jsx
        │           ├── config/themes.js (backgroundCategories)
        │           └── components/ShadowPanel.jsx
        │                 └── config/shadows.js
        ├── components/TopBar.jsx
        │     └── config/markdownStyles.js
        ├── components/PropertiesPanel.jsx
        └── components/ImagePreview.jsx
              └── config/shadows.js
```

---

**PROTOCOL**: 文件增删时更新此清单，然后检查 /CLAUDE.md

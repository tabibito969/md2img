# src/

> L2 | 父级: /CLAUDE.md

## 成员清单

| 文件        | 职责                                              |
| ----------- | ------------------------------------------------- |
| `main.jsx`  | 应用入口，挂载 React 根节点到 DOM                 |
| `App.jsx`   | 主应用组件，页面路由与布局容器                    |
| `App.css`   | 应用级样式（Vite 模板遗留，待清理迁移至 Tailwind）|
| `index.css` | Tailwind v4 入口，`@import "tailwindcss"`         |

## 子目录

| 目录      | 职责                     |
| --------- | ------------------------ |
| `assets/` | 静态资源（SVG、图片等）  |

## 依赖关系

```text
main.jsx
  └── App.jsx
        └── App.css
```

---

**PROTOCOL**: 文件增删时更新此清单，然后检查 /CLAUDE.md

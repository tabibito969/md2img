# markdown2imge - Markdown 转图片工具

React 19 + Vite 7 + TailwindCSS 4 + Framer Motion

## 目录结构

```text
markdown2imge/
├── src/                    # 源代码根目录
│   ├── assets/             # 静态资源（SVG/图片）
│   ├── components/         # UI 组件
│   │   ├── ImagePreview.jsx   # Markdown 预览 + 图片导出
│   │   ├── MarkdownEditor.jsx # Markdown 编辑器
│   │   ├── Toolbar.jsx        # 顶部工具栏（主题 + CSS 样式 + 导出）
│   │   └── ui/                # shadcn/ui 基础组件
│   ├── config/             # 配置
│   │   ├── themes.js          # 背景主题（渐变/纯色 × 明暗）
│   │   ├── markdownStyles.js  # Markdown CSS 排版风格（Prose/GitHub/Classic）
│   │   └── defaults.js        # 默认 Markdown 示例
│   ├── lib/                # 工具函数
│   ├── main.jsx            # 应用入口，挂载 React 根节点
│   ├── App.jsx             # 主应用组件
│   └── index.css           # Tailwind 入口 + Typography 插件 + 三套排版样式
├── public/                 # 公共静态资源
├── index.html              # HTML 入口
├── vite.config.js          # Vite 配置（含 Tailwind 插件）
├── eslint.config.js        # ESLint 配置
└── package.json            # 项目依赖清单
```

## 技术栈

| 层级     | 技术                    | 版本    |
| -------- | ----------------------- | ------- |
| 框架     | React                   | 19.2.0  |
| 构建     | Vite                    | 7.3.0   |
| 样式     | TailwindCSS             | 4.1.18  |
| 排版     | @tailwindcss/typography | latest  |
| Markdown | github-markdown-css     | latest  |
| 动效     | Framer Motion           | 12.x    |
| 图标     | Lucide + RIcons         | latest  |
| 工具     | clsx + tv               | latest  |

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run lint     # 代码检查
npm run preview  # 预览生产构建
```

## 架构约定

- **样式系统**: TailwindCSS v4 原生模式，入口 `@import "tailwindcss"`
- **排版系统**: 三套 Markdown CSS 排版可切换 — Prose（@tailwindcss/typography）、GitHub（github-markdown-css）、Classic（自定义）
- **动效约定**: framer-motion 处理过渡/滑入动效
- **图标约定**: lucide-react 系统图标，react-icons/si 社媒图标

---

**PROTOCOL**: 架构变更时更新此文档，保持代码与文档同构

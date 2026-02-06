# markdown2imge - Markdown 转图片工具

React 19 + Vite 7 + TailwindCSS 4 + Framer Motion

## 目录结构

```text
markdown2imge/
├── src/                    # 源代码根目录
│   ├── assets/             # 静态资源（SVG/图片）
│   ├── main.jsx            # 应用入口，挂载 React 根节点
│   ├── App.jsx             # 主应用组件
│   ├── App.css             # 应用级样式（待清理）
│   └── index.css           # Tailwind 入口
├── public/                 # 公共静态资源
├── index.html              # HTML 入口
├── vite.config.js          # Vite 配置（含 Tailwind 插件）
├── eslint.config.js        # ESLint 配置
└── package.json            # 项目依赖清单
```

## 技术栈

| 层级 | 技术             | 版本    |
| ---- | ---------------- | ------- |
| 框架 | React            | 19.2.0  |
| 构建 | Vite             | 7.3.0   |
| 样式 | TailwindCSS      | 4.1.18  |
| 动效 | Framer Motion    | 12.x    |
| 图标 | Lucide + RIcons  | latest  |
| 工具 | clsx + tv        | latest  |

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run lint     # 代码检查
npm run preview  # 预览生产构建
```

## 架构约定

- **样式系统**: TailwindCSS v4 原生模式，入口 `@import "tailwindcss"`
- **动效约定**: framer-motion 处理过渡/滑入动效
- **图标约定**: lucide-react 系统图标，react-icons/si 社媒图标

---

**PROTOCOL**: 架构变更时更新此文档，保持代码与文档同构

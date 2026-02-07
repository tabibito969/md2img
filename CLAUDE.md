# markdown2imge - Markdown 转图片工具

React 19 + Vite 7 + TailwindCSS 4 + Framer Motion

## 目录结构

```text
markdown2imge/
├── src/                    # 源代码根目录
│   ├── assets/             # 静态资源（SVG/图片）
│   ├── components/         # UI 组件
│   │   ├── IconSidebar.jsx     # 最左侧图标导航栏
│   │   ├── ContentSidebar.jsx  # 内容侧栏容器（根据选中图标切换面板）
│   │   ├── TemplatePanel.jsx   # 模板选择面板
│   │   ├── BackgroundPanel.jsx # 背景选择面板（颜色 + 阴影 Tab）
│   │   ├── ShadowPanel.jsx     # 阴影/纹理选择面板
│   │   ├── TopBar.jsx          # 顶栏（卡片名 + 样式 + 导出按钮）
│   │   ├── PropertiesPanel.jsx # 右侧属性面板（尺寸/内边距/圆角等）
│   │   ├── ImagePreview.jsx    # 卡片预览 + 图片导出（forwardRef）
│   │   ├── MarkdownEditor.jsx  # Markdown 编辑器（内联覆盖模式）
│   │   └── ui/                 # shadcn/ui 基础组件
│   ├── config/             # 配置
│   │   ├── themes.js          # 40+ 背景主题（渐变/纯色 × 5 分类）
│   │   ├── shadows.js         # 阴影预设 + 纹理叠加效果
│   │   ├── templates.js       # 模板预设（配置组合 × 10 模板）
│   │   ├── markdownStyles.js  # Markdown CSS 排版风格（Prose/GitHub/Emerald/Classic）
│   │   └── defaults.js        # 默认 Markdown 示例
│   ├── lib/                # 工具函数
│   ├── main.jsx            # 应用入口，挂载 React 根节点
│   ├── App.jsx             # 主应用组件，四区布局 + 状态管理
│   └── index.css           # Tailwind 入口 + Typography 插件 + 四套排版样式
├── public/                 # 公共静态资源
├── index.html              # HTML 入口（dark class 默认启用）
├── vite.config.js          # Vite 配置（含 Tailwind 插件）
├── eslint.config.js        # ESLint 配置
└── package.json            # 项目依赖清单
```

## 布局架构

```text
App (flex-row, h-screen, dark)
├── IconSidebar (w-50px, 图标导航)
│   ├── Logo (Sparkles)
│   ├── 模板 Tab
│   └── 背景 Tab
├── ContentSidebar (w-240px, 动态面板)
│   ├── TemplatePanel (模板 / 布局 Tab)
│   └── BackgroundPanel (颜色 / 阴影 Tab)
├── MainArea (flex-1)
│   ├── TopBar (卡片名 + 样式切换 + 导出)
│   ├── CardCanvas (居中预览卡片)
│   │   └── ImagePreview (ref → 导出)
│   ├── AddCardButton
│   └── CardCounter + Navigation
└── PropertiesPanel (w-280px)
    ├── 同步/水印 Switch
    ├── 模板尺寸 (W/H)
    ├── 背景色显示
    ├── 尺寸比例 (6 预设)
    └── 容器 (内边距 / 圆角半径)
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

- **布局系统**: 四区暗色布局（仿流光卡片），图标栏 | 内容侧栏 | 画布 | 属性面板
- **样式系统**: TailwindCSS v4 原生模式，入口 `@import "tailwindcss"`，暗色主题默认
- **排版系统**: 四套 Markdown CSS 排版可切换 — Prose / GitHub / Emerald / Classic
- **背景系统**: 40+ 主题按 5 分类组织（渐变/自然/暗色/网格渐变/纯色），支持自定义上传
- **阴影系统**: 12 种 box-shadow 预设 + 12 种纹理叠加效果
- **模板系统**: 10 个预设模板，一键应用配置组合
- **多卡片**: 支持添加/删除/导航多张卡片
- **内联编辑**: 点击卡片弹出 Markdown 编辑器覆盖层
- **状态管理**: App.jsx 内 useState，props 向下传递
- **导出**: html-to-image (toBlob) → PNG download / clipboard
- **动效约定**: framer-motion 处理过渡/滑入动效
- **图标约定**: lucide-react 系统图标，react-icons/si 社媒图标

---

**PROTOCOL**: 架构变更时更新此文档，保持代码与文档同构

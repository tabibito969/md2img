# Md2Img — Markdown 转图片

将 Markdown 快速转为高质视觉卡片：40+ 渐变背景、多套排版模板、多卡片管理，一键导出 PNG。

## 功能亮点

- 实时 Markdown 预览与样式切换
- 多卡片创作与管理
- 一键复制当前卡片为新卡片
- 一键导出 PNG / 复制图片到剪贴板
- 本地自动保存草稿（刷新后自动恢复）
- 一键重置工作区（清空本地草稿并恢复初始状态）
- 快捷键支持：
  - `Ctrl/Cmd + S`：导出 PNG
  - `Ctrl/Cmd + Shift + S`：复制图片
  - `Ctrl/Cmd + E`：打开/关闭编辑器弹层

- **技术栈**: React 19 + Vite 7 + TailwindCSS 4 + Framer Motion
- **路由**: `/` 落地页，`/app` 编辑器

## 开发

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173/ 查看落地页，点击「立即开始创作」进入编辑器。

## 构建与预览

```bash
npm run build
npm run preview
```

## 部署

构建产物在 `dist/`。已配置 SPA 回退：

- **Vercel**: 使用项目根目录的 `vercel.json`，直接 `vercel` 部署即可，`/app` 直链与刷新正常。
- **Netlify**: 使用根目录的 `netlify.toml`，发布目录设为 `dist`，`/app` 直链与刷新正常。
- **其他静态托管**: 将未匹配路径回退到 `index.html`（例如 Nginx `try_files $uri $uri/ /index.html`）。

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建结果 |
| `npm run lint` | ESLint 检查 |

## 项目结构

见 [CLAUDE.md](./CLAUDE.md)。

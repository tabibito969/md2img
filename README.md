# Md2Img — Markdown 转图片

将 Markdown 快速转为高质视觉卡片：40+ 渐变背景、多套排版模板、多卡片管理，一键导出 PNG。

## 功能亮点i

- 实时 Markdown 预览与样式切换
- 多卡片创作与管理
- 拖拽卡片快速排序（桌面与触摸端）
- 一键复制当前卡片为新卡片
- 一键导出 PNG / 复制图片到剪贴板 / 批量导出全部卡片
- 工作台中心：可分享 / 可协作 / 可管理 / 可复用
- 邮箱注册与登录（Cloudflare Worker + Neon Postgres）
- 分享链接：
  - 只读预览链接：`/share?data=...`
  - 可协作编辑链接：`/app?share=...`
- 协作能力：成员管理、按卡片评论、评论状态（待处理/已解决）
- 管理能力：本地项目保存、打开、复制、删除
- 复用能力：将当前卡片保存为模板，并一键应用或插入新卡片
- 本地自动保存草稿（刷新后自动恢复）
- 一键重置工作区（清空本地草稿并恢复初始状态）
- 快捷键支持：
  - `Ctrl/Cmd + Z`：撤销（编辑输入框外）
  - `Ctrl/Cmd + Shift + Z` / `Ctrl/Cmd + Y`：重做（编辑输入框外）
  - `Ctrl/Cmd + S`：导出 PNG
  - `Ctrl/Cmd + Shift + S`：复制图片
  - `Ctrl/Cmd + E`：打开/关闭编辑器弹层

- **技术栈**: React 19 + Vite 7 + TailwindCSS 4 + Framer Motion
- **路由**: 多语言落地页子目录（`/en/`、`/zh-cn/`、`/zh-tw/`、`/ja/`、`/ko/`），关键词页（如 `/en/markdown-to-image`），`/app` 编辑器，`/share` 只读分享页

## 开发

```bash
npm install
npm run dev
```

可选 SEO 配置（建议）：

```bash
cp .env.example .env
# 设置你的线上站点域名，例如 https://md2img.com
VITE_SITE_URL=...
```

浏览器打开 http://localhost:5173/ 查看落地页，点击「立即开始创作」进入编辑器。

## 鉴权后端（Neon + Cloudflare Worker）

鉴权 API 位于 `api/`，提供以下接口：

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### 1) 初始化 Neon 数据库

在 Neon SQL Editor 执行：

- `api/sql/001_auth.sql`

### 2) 配置 Worker 环境变量

在 `api/` 目录下配置：

```bash
cd api
npm install
npx wrangler secret put DATABASE_URL
```

可选变量（在 `api/wrangler.toml`）：

- `SESSION_TTL_SECONDS`：会话有效期秒数，默认 `604800`（7天）
- `COOKIE_NAME`：会话 Cookie 名称，默认 `md2img_session`
- `COOKIE_SECURE`：是否仅 HTTPS 发送，默认 `true`
- `ALLOWED_ORIGIN`：跨域来源，开发可设 `http://localhost:5173`

### 3) 本地联调

终端 A（前端）：

```bash
npm run dev
```

终端 B（Worker）：

```bash
cd api
npm run dev
```

默认已在 `vite.config.js` 配置代理：`/api -> http://127.0.0.1:8787`。

如果 API 部署在独立域名，可在前端设置 `VITE_AUTH_API_BASE` 指向该域名。

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
| `npm run seo:files` | 生成 `robots.txt` 与 `sitemap.xml` |
| `npm run prerender:routes` | 生成多语言预渲染静态页面 |
| `npm run build` | 生产构建（含 sitemap/robots + 多语言预渲染） |
| `npm run preview` | 预览构建结果 |
| `npm run lint` | ESLint 检查 |

## 项目结构

见 [CLAUDE.md](./CLAUDE.md)。

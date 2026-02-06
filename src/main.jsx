/**
 * ============================================================================
 * [INPUT]: 依赖 react/react-dom 的 StrictMode/createRoot
 *          依赖 ./index.css 的全局样式，依赖 ./App.jsx 的根组件
 * [OUTPUT]: 无对外导出，副作用入口文件
 * [POS]: 应用入口点，将 React 应用挂载到 DOM #root 节点
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/**
 * ============================================================================
 * [INPUT]: 依赖 react/react-dom, react-router, 页面组件
 * [OUTPUT]: 无对外导出，副作用入口文件
 * [POS]: 应用入口点，BrowserRouter + 路由分发
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import LandingPage from './pages/LandingPage'

/* 编辑器按需加载，落地页不载入重量级 markdown/syntax-highlighter */
const EditorPage = lazy(() => import('./pages/EditorPage'))

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/app"
                    element={
                        <Suspense
                            fallback={
                                <div className="h-screen w-screen flex items-center justify-center bg-[#111118] text-white/40 text-sm">
                                    加载编辑器...
                                </div>
                            }
                        >
                            <EditorPage />
                        </Suspense>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppRouter />
    </StrictMode>,
)

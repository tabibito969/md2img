/* eslint-disable react-refresh/only-export-components */
/**
 * ============================================================================
 * [INPUT]: 依赖 react/react-dom, react-router, 页面组件
 * [OUTPUT]: 无对外导出，副作用入口文件
 * [POS]: 应用入口点，BrowserRouter + 路由分发
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { StrictMode, lazy, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import './i18n'
import './index.css'
import LandingPage from './pages/LandingPage'
import {
    DEFAULT_LOCALE_SEGMENT,
    KEYWORD_PAGE_SLUG,
    LOCALE_CONFIGS,
    getLocalePath,
} from './config/locales'

/* 编辑器按需加载，落地页不载入重量级 markdown/syntax-highlighter */
const EditorPage = lazy(() => import('./pages/EditorPage'))
const SharePage = lazy(() => import('./pages/SharePage'))

function AppRouter() {
    const { i18n, t } = useTranslation()

    /* 语言切换时更新 html lang 属性 */
    useEffect(() => {
        document.documentElement.lang = i18n.language
    }, [i18n.language])

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to={getLocalePath(DEFAULT_LOCALE_SEGMENT)} replace />}
                />
                <Route
                    path={`/${KEYWORD_PAGE_SLUG}`}
                    element={
                        <Navigate
                            to={getLocalePath(DEFAULT_LOCALE_SEGMENT, true)}
                            replace
                        />
                    }
                />
                <Route
                    path="/md-to-image"
                    element={
                        <Navigate
                            to={getLocalePath(DEFAULT_LOCALE_SEGMENT, true)}
                            replace
                        />
                    }
                />
                {LOCALE_CONFIGS.map((locale) => (
                    <Route
                        key={`${locale.segment}-home`}
                        path={`/${locale.segment}`}
                        element={
                            <LandingPage
                                localeSegment={locale.segment}
                                localeCode={locale.i18n}
                            />
                        }
                    />
                ))}
                {LOCALE_CONFIGS.map((locale) => (
                    <Route
                        key={`${locale.segment}-keyword`}
                        path={`/${locale.segment}/${KEYWORD_PAGE_SLUG}`}
                        element={
                            <LandingPage
                                localeSegment={locale.segment}
                                localeCode={locale.i18n}
                                isKeywordLanding
                            />
                        }
                    />
                ))}
                <Route
                    path="/app"
                    element={
                        <Suspense
                            fallback={
                                <div className="h-screen w-screen flex items-center justify-center bg-[#111118] text-white/40 text-sm">
                                    {t('editor.loadingEditor')}
                                </div>
                            }
                        >
                            <EditorPage />
                        </Suspense>
                    }
                />
                <Route
                    path="/share"
                    element={
                        <Suspense
                            fallback={
                                <div className="h-screen w-screen flex items-center justify-center bg-[#111118] text-white/40 text-sm">
                                    {t('editor.loadingEditor')}
                                </div>
                            }
                        >
                            <SharePage />
                        </Suspense>
                    }
                />
                <Route
                    path="*"
                    element={<Navigate to={getLocalePath(DEFAULT_LOCALE_SEGMENT)} replace />}
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

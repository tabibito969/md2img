/**
 * ============================================================================
 * [INPUT]: 依赖 html-to-image 导出能力
 *          依赖 MarkdownEditor、ImagePreview、Toolbar 组件
 *          依赖 themes/defaults 配置
 * [OUTPUT]: 对外提供 App 组件（默认导出）
 * [POS]: 主应用组件，单页工具：编辑 → 预览 → 导出
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useState, useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'
import MarkdownEditor from '@/components/MarkdownEditor'
import ImagePreview from '@/components/ImagePreview'
import Toolbar from '@/components/Toolbar'
import { themes, defaultThemeId } from '@/config/themes'
import { defaultMarkdown } from '@/config/defaults'

/* ========================================================================== */
/*                                    APP                                     */
/* ========================================================================== */

function App() {
    const [markdown, setMarkdown] = useState(defaultMarkdown)
    const [theme, setTheme] = useState(
        themes.find((t) => t.id === defaultThemeId),
    )
    const [copied, setCopied] = useState(false)
    const previewRef = useRef(null)

    /* ------------------------------ EXPORT ------------------------------ */

    const handleDownload = useCallback(async () => {
        if (!previewRef.current) return
        try {
            const dataUrl = await toPng(previewRef.current, {
                pixelRatio: 2,
                cacheBust: true,
            })
            const link = document.createElement('a')
            link.download = 'markdown-image.png'
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error('导出失败:', err)
        }
    }, [])

    const handleCopy = useCallback(async () => {
        if (!previewRef.current) return
        try {
            const dataUrl = await toPng(previewRef.current, {
                pixelRatio: 2,
                cacheBust: true,
            })
            const res = await fetch(dataUrl)
            const blob = await res.blob()
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob }),
            ])
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('复制失败:', err)
        }
    }, [])

    /* ------------------------------ RENDER ------------------------------ */

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
            {/* ========================= TOOLBAR ========================= */}
            <Toolbar
                currentTheme={theme}
                onThemeChange={setTheme}
                onDownload={handleDownload}
                onCopy={handleCopy}
                copied={copied}
            />

            {/* ====================== MAIN PANELS ====================== */}
            <div className="flex flex-col md:flex-row flex-1 min-h-0">
                {/* ---------- EDITOR (Left) ---------- */}
                <div className="w-full md:w-[45%] h-1/2 md:h-full bg-[#1e1e2e] border-b md:border-b-0 md:border-r border-white/6">
                    <MarkdownEditor value={markdown} onChange={setMarkdown} />
                </div>

                {/* ---------- PREVIEW (Right) ---------- */}
                <div className="w-full md:w-[55%] h-1/2 md:h-full overflow-auto bg-[#f8f9fb] dark:bg-[#111118]">
                    <div className="flex items-start justify-center p-6 md:p-10 min-h-full">
                        <ImagePreview
                            ref={previewRef}
                            markdown={markdown}
                            theme={theme}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App

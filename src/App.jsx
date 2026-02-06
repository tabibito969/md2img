/**
 * ============================================================================
 * [INPUT]: 依赖 html-to-image 导出能力
 *          依赖 MarkdownEditor、ImagePreview、Toolbar 组件
 *          依赖 themes/defaults 配置
 *          依赖 sonner 的 toast 通知
 * [OUTPUT]: 对外提供 App 组件（默认导出）
 * [POS]: 主应用组件，单页工具：编辑 → 预览 → 导出
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useState, useRef, useCallback, useEffect } from 'react'
import { toBlob } from 'html-to-image'
import { Toaster, toast } from 'sonner'
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
    const [isExporting, setIsExporting] = useState(false)
    const previewRef = useRef(null)
    const editorRef = useRef(null)
    const previewScrollRef = useRef(null)
    const isSyncing = useRef(false)
    const copiedTimer = useRef(null)

    /* -------------------- cleanup timer on unmount -------------------- */

    useEffect(() => {
        return () => clearTimeout(copiedTimer.current)
    }, [])

    /* -------------------------- SCROLL SYNC -------------------------- */

    const handleEditorScroll = useCallback(() => {
        if (isSyncing.current) return
        isSyncing.current = true
        const editor = editorRef.current
        const preview = previewScrollRef.current
        if (editor && preview) {
            const maxScroll = editor.scrollHeight - editor.clientHeight
            const ratio = maxScroll > 0 ? editor.scrollTop / maxScroll : 0
            preview.scrollTop =
                ratio * (preview.scrollHeight - preview.clientHeight)
        }
        requestAnimationFrame(() => {
            isSyncing.current = false
        })
    }, [])

    const handlePreviewScroll = useCallback(() => {
        if (isSyncing.current) return
        isSyncing.current = true
        const editor = editorRef.current
        const preview = previewScrollRef.current
        if (editor && preview) {
            const maxScroll = preview.scrollHeight - preview.clientHeight
            const ratio = maxScroll > 0 ? preview.scrollTop / maxScroll : 0
            editor.scrollTop =
                ratio * (editor.scrollHeight - editor.clientHeight)
        }
        requestAnimationFrame(() => {
            isSyncing.current = false
        })
    }, [])

    /* ----------------------- SHARED CAPTURE ----------------------- */

    const captureImage = useCallback(
        () =>
            toBlob(previewRef.current, {
                pixelRatio: 2,
                cacheBust: true,
            }),
        [],
    )

    /* ------------------------------ EXPORT ------------------------------ */

    const handleDownload = useCallback(async () => {
        if (!previewRef.current) return
        setIsExporting(true)
        try {
            const blob = await captureImage()
            if (!blob) throw new Error('生成图片为空')
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = 'markdown-image.png'
            link.href = url
            link.click()
            URL.revokeObjectURL(url)
            toast.success('图片已下载')
        } catch (err) {
            console.error('导出失败:', err)
            toast.error('导出失败，请重试')
        } finally {
            setIsExporting(false)
        }
    }, [captureImage])

    const handleCopy = useCallback(async () => {
        if (!previewRef.current) return
        setIsExporting(true)
        try {
            const blob = await captureImage()
            if (!blob) throw new Error('生成图片为空')
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob }),
            ])
            setCopied(true)
            clearTimeout(copiedTimer.current)
            copiedTimer.current = setTimeout(() => setCopied(false), 2000)
            toast.success('已复制到剪贴板')
        } catch (err) {
            console.error('复制失败:', err)
            toast.error('复制失败，请重试')
        } finally {
            setIsExporting(false)
        }
    }, [captureImage])

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
                isExporting={isExporting}
            />

            {/* ====================== MAIN PANELS ====================== */}
            <div className="flex flex-col md:flex-row flex-1 min-h-0">
                {/* ---------- EDITOR (Left) ---------- */}
                <div className="w-full md:w-[45%] h-1/2 md:h-full bg-[#1e1e2e] border-b md:border-b-0 md:border-r border-white/6">
                    <MarkdownEditor
                        ref={editorRef}
                        value={markdown}
                        onChange={setMarkdown}
                        onScroll={handleEditorScroll}
                    />
                </div>

                {/* ---------- PREVIEW (Right) ---------- */}
                <div
                    ref={previewScrollRef}
                    onScroll={handlePreviewScroll}
                    className="w-full md:w-[55%] h-1/2 md:h-full overflow-auto bg-[#f8f9fb] dark:bg-[#111118]"
                >
                    <div className="flex items-start justify-center p-6 md:p-10 min-h-full">
                        <ImagePreview
                            ref={previewRef}
                            markdown={markdown}
                            theme={theme}
                        />
                    </div>
                </div>
            </div>

            {/* ========================= TOAST ========================= */}
            <Toaster position="bottom-center" richColors />
        </div>
    )
}

export default App

/**
 * ============================================================================
 * [INPUT]: 依赖 html-to-image 导出能力
 *          依赖所有子组件和配置
 *          依赖 sonner 的 toast 通知
 * [OUTPUT]: 对外提供 App 组件（默认导出）
 * [POS]: 主应用组件，四区布局：图标栏 | 内容侧栏 | 画布 | 属性面板
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useState, useRef, useCallback, useEffect } from 'react'
import { toBlob } from 'html-to-image'
import { Toaster, toast } from 'sonner'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import IconSidebar from '@/components/IconSidebar'
import ContentSidebar from '@/components/ContentSidebar'
import TopBar from '@/components/TopBar'
import PropertiesPanel from '@/components/PropertiesPanel'
import ImagePreview from '@/components/ImagePreview'
import { themes, defaultThemeId } from '@/config/themes'
import { markdownStyles, defaultStyleId } from '@/config/markdownStyles'
import { defaultMarkdown } from '@/config/defaults'

/* ========================================================================== */
/*                                    APP                                     */
/* ========================================================================== */

let cardIdCounter = 1

function App() {
    /* ----------------------- SIDEBAR STATE ----------------------- */
    const [sidebarTab, setSidebarTab] = useState('template')

    /* ----------------------- CARD STATE ----------------------- */
    const [cards, setCards] = useState([
        { id: cardIdCounter, name: '', markdown: defaultMarkdown },
    ])
    const [activeIndex, setActiveIndex] = useState(0)
    const activeCard = cards[activeIndex]

    /* ----------------------- STYLE STATE ----------------------- */
    const [theme, setTheme] = useState(
        themes.find((t) => t.id === defaultThemeId),
    )
    const [mdStyle, setMdStyle] = useState(
        markdownStyles.find((s) => s.id === defaultStyleId),
    )

    /* ----------------------- CARD CONFIG ----------------------- */
    const [cardConfig, setCardConfig] = useState({
        padding: 33,
        borderRadius: 15,
        width: 540,
        height: 0, // 0 = auto
        watermark: false,
        syncAll: false,
    })

    /* ----------------------- SHADOW STATE ----------------------- */
    const [shadow, setShadow] = useState('soft')
    const [overlay, setOverlay] = useState('none')

    /* ----------------------- EXPORT STATE ----------------------- */
    const [copied, setCopied] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    /* ----------------------- REFS ----------------------- */
    const previewRef = useRef(null)
    const copiedTimer = useRef(null)

    /* -------------------- cleanup timer on unmount -------------------- */
    useEffect(() => {
        return () => clearTimeout(copiedTimer.current)
    }, [])

    /* ----------------------- CARD MANAGEMENT ----------------------- */
    const updateActiveCard = useCallback(
        (updates) => {
            setCards((prev) =>
                prev.map((card, i) =>
                    i === activeIndex ? { ...card, ...updates } : card,
                ),
            )
        },
        [activeIndex],
    )

    const addCard = useCallback(() => {
        cardIdCounter++
        const newCard = {
            id: cardIdCounter,
            name: '',
            markdown: defaultMarkdown,
        }
        setCards((prev) => [...prev, newCard])
        setActiveIndex((prev) => prev + 1)
    }, [])

    const deleteCard = useCallback(
        (index) => {
            if (cards.length <= 1) return
            setCards((prev) => prev.filter((_, i) => i !== index))
            setActiveIndex((prev) => {
                if (prev >= cards.length - 1) return Math.max(0, cards.length - 2)
                if (prev > index) return prev - 1
                return prev
            })
        },
        [cards.length],
    )

    const goToPrevCard = useCallback(() => {
        setActiveIndex((prev) => Math.max(0, prev - 1))
    }, [])

    const goToNextCard = useCallback(() => {
        setActiveIndex((prev) => Math.min(cards.length - 1, prev + 1))
    }, [cards.length])

    /* ----------------------- MARKDOWN ----------------------- */
    const setMarkdown = useCallback(
        (md) => updateActiveCard({ markdown: md }),
        [updateActiveCard],
    )

    const setCardName = useCallback(
        (name) => updateActiveCard({ name }),
        [updateActiveCard],
    )

    /* ----------------------- TEMPLATE APPLY ----------------------- */
    const handleApplyTemplate = useCallback(
        (templateConfig) => {
            if (templateConfig.theme) {
                const t = themes.find((th) => th.id === templateConfig.theme)
                if (t) setTheme(t)
            }
            if (templateConfig.mdStyle) {
                const s = markdownStyles.find(
                    (st) => st.id === templateConfig.mdStyle,
                )
                if (s) setMdStyle(s)
            }
            setCardConfig((prev) => ({
                ...prev,
                ...(templateConfig.padding !== undefined && {
                    padding: templateConfig.padding,
                }),
                ...(templateConfig.borderRadius !== undefined && {
                    borderRadius: templateConfig.borderRadius,
                }),
                ...(templateConfig.width !== undefined && {
                    width: templateConfig.width,
                }),
            }))
            if (templateConfig.shadow) setShadow(templateConfig.shadow)
        },
        [],
    )

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
            link.download = `${activeCard.name || 'markdown-image'}.png`
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
    }, [captureImage, activeCard.name])

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
        <div className="flex h-screen bg-[#111118] text-white overflow-hidden">
            {/* ========================= ICON SIDEBAR ========================= */}
            <IconSidebar
                activeTab={sidebarTab}
                onTabChange={setSidebarTab}
            />

            {/* ========================= CONTENT SIDEBAR ========================= */}
            <ContentSidebar
                activeTab={sidebarTab}
                currentTheme={theme}
                onThemeChange={setTheme}
                currentShadow={shadow}
                onShadowChange={setShadow}
                currentOverlay={overlay}
                onOverlayChange={setOverlay}
                onApplyTemplate={handleApplyTemplate}
            />

            {/* ========================= MAIN AREA ========================= */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TopBar */}
                <TopBar
                    cardName={activeCard.name}
                    onCardNameChange={setCardName}
                    currentStyle={mdStyle}
                    onStyleChange={setMdStyle}
                    onDownload={handleDownload}
                    onCopy={handleCopy}
                    copied={copied}
                    isExporting={isExporting}
                />

                {/* Card Canvas */}
                <div className="flex-1 overflow-auto bg-[#111118]">
                    <div className="flex items-start justify-center p-6 md:p-10 min-h-full">
                        {/* Card Navigation */}
                        <div className="flex items-start gap-2">
                            {/* Left Arrow (hidden if first) */}
                            {cards.length > 1 && (
                                <button
                                    type="button"
                                    onClick={goToPrevCard}
                                    disabled={activeIndex === 0}
                                    className="mt-20 p-1.5 rounded-full bg-white/[0.06] text-white/40 hover:text-white/80 hover:bg-white/[0.1] transition-colors disabled:opacity-20 disabled:pointer-events-none"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                            )}

                            {/* Card */}
                            <div
                                className="cursor-pointer"
                                onClick={() => setIsEditing(true)}
                            >
                                <ImagePreview
                                    ref={previewRef}
                                    markdown={activeCard.markdown}
                                    theme={theme}
                                    markdownStyle={mdStyle.id}
                                    padding={cardConfig.padding}
                                    borderRadius={cardConfig.borderRadius}
                                    cardWidth={cardConfig.width}
                                    cardHeight={cardConfig.height}
                                    shadowId={shadow}
                                    overlayId={overlay}
                                />
                            </div>

                            {/* Right Arrow (hidden if last) */}
                            {cards.length > 1 && (
                                <button
                                    type="button"
                                    onClick={goToNextCard}
                                    disabled={
                                        activeIndex === cards.length - 1
                                    }
                                    className="mt-20 p-1.5 rounded-full bg-white/[0.06] text-white/40 hover:text-white/80 hover:bg-white/[0.1] transition-colors disabled:opacity-20 disabled:pointer-events-none"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Add Card Button */}
                    <div className="flex justify-center pb-6 -mt-2">
                        <button
                            type="button"
                            onClick={addCard}
                            className="flex items-center gap-2 px-6 py-2 border border-dashed border-white/20 rounded-lg text-sm text-white/40 hover:text-white/70 hover:border-white/40 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            添加卡片
                        </button>
                    </div>

                    {/* Card Counter & Controls */}
                    <div className="flex items-center justify-center gap-3 pb-4">
                        <span className="text-xs text-white/30">
                            卡片 {activeIndex + 1}/{cards.length}
                        </span>
                        {cards.length > 1 && (
                            <button
                                type="button"
                                onClick={() => deleteCard(activeIndex)}
                                className="text-xs text-red-400/50 hover:text-red-400 transition-colors"
                            >
                                删除当前
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ========================= PROPERTIES PANEL ========================= */}
            <PropertiesPanel
                cardConfig={cardConfig}
                onConfigChange={setCardConfig}
                currentTheme={theme}
            />

            {/* ========================= INLINE EDITOR OVERLAY ========================= */}
            {isEditing && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsEditing(false)
                    }}
                >
                    <div className="w-[640px] max-h-[85vh] bg-[#1e1e2e] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-4 h-10 border-b border-white/[0.06] shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] uppercase tracking-widest text-white/30 font-mono">
                                    Markdown 编辑器
                                </span>
                                <span className="text-[10px] text-white/20">
                                    {activeCard.markdown.length} 字符
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <kbd className="text-[10px] text-white/30 px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04]">
                                    ESC
                                </kbd>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="text-xs text-white/40 hover:text-white/80 px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
                                >
                                    完成
                                </button>
                            </div>
                        </div>

                        {/* Editor Textarea */}
                        <textarea
                            value={activeCard.markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') setIsEditing(false)
                                // Tab indent support
                                if (e.key === 'Tab') {
                                    e.preventDefault()
                                    const start = e.target.selectionStart
                                    const end = e.target.selectionEnd
                                    const val = e.target.value
                                    setMarkdown(
                                        val.substring(0, start) +
                                            '  ' +
                                            val.substring(end),
                                    )
                                    requestAnimationFrame(() => {
                                        e.target.selectionStart =
                                            e.target.selectionEnd = start + 2
                                    })
                                }
                            }}
                            className="flex-1 min-h-[450px] w-full resize-none bg-transparent p-5 text-[14px] text-white/85 font-mono leading-relaxed outline-none placeholder:text-white/20 selection:bg-indigo-500/30 scrollbar-thin"
                            placeholder="在这里输入或粘贴 Markdown..."
                            spellCheck={false}
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {/* ========================= TOAST ========================= */}
            <Toaster position="bottom-center" richColors theme="dark" />
        </div>
    )
}

export default App

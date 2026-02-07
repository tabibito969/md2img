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
import { useTranslation } from 'react-i18next'
import IconSidebar from '@/components/IconSidebar'
import ContentSidebar from '@/components/ContentSidebar'
import TopBar from '@/components/TopBar'
import PropertiesPanel from '@/components/PropertiesPanel'
import ImagePreview from '@/components/ImagePreview'
import { themes, defaultThemeId } from '@/config/themes'
import { markdownStyles, defaultStyleId } from '@/config/markdownStyles'
import { getDefaultMarkdown } from '@/config/defaults'

const DEFAULT_DOWNLOAD_NAME = 'markdown-image'

const stripControlChars = (value) =>
    Array.from(value)
        .filter((ch) => {
            const code = ch.charCodeAt(0)
            return code >= 32 && code !== 127
        })
        .join('')

const sanitizeFilename = (name) => {
    const raw = typeof name === 'string' ? name : ''
    const trimmed = raw.trim()
    if (!trimmed) return DEFAULT_DOWNLOAD_NAME
    const withoutControls = stripControlChars(trimmed)
    const withoutReserved = withoutControls.replace(/[<>:"/\\|?*]+/g, '')
    const normalized = withoutReserved.replace(/\s+/g, ' ').trim()
    const strippedTrailing = normalized.replace(/[. ]+$/g, '')
    const safe = strippedTrailing.slice(0, 80)
    return safe || DEFAULT_DOWNLOAD_NAME
}

const getDownloadFilename = (name) => {
    const base = sanitizeFilename(name)
    return base.toLowerCase().endsWith('.png') ? base : `${base}.png`
}

const canCopyImage = (t) => {
    if (!window.isSecureContext || !navigator?.clipboard) {
        toast.error(t('toast.clipboardNotSupported'))
        return false
    }
    if (typeof ClipboardItem === 'undefined') {
        toast.error(t('toast.imageCopyNotSupported'))
        return false
    }
    return true
}

const ensureClipboardPermission = async (t) => {
    if (!navigator.permissions?.query) return true
    try {
        const result = await navigator.permissions.query({
            name: 'clipboard-write',
        })
        if (result.state === 'denied') {
            toast.error(t('toast.clipboardDenied'))
            return false
        }
    } catch {
        return true
    }
    return true
}

/* ========================================================================== */
/*                                    APP                                     */
/* ========================================================================== */

function App() {
    const { t } = useTranslation()

    /* ----------------------- SIDEBAR STATE ----------------------- */
    const [sidebarTab, setSidebarTab] = useState('template')

    /* ----------------------- CARD STATE ----------------------- */
    const [cards, setCards] = useState([
        { id: 1, name: '', markdown: getDefaultMarkdown() },
    ])
    const [activeIndex, setActiveIndex] = useState(0)
    const activeCard = cards[activeIndex] ?? cards[0]

    /* ----------------------- TEMPLATE ID STATE ----------------------- */
    const [activeTemplateId, setActiveTemplateId] = useState(null)

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
    const canvasRef = useRef(null)
    const copiedTimer = useRef(null)
    const cardIdCounterRef = useRef(1)
    const cardsRef = useRef(cards)
    cardsRef.current = cards

    /* ----------------------- CANVAS SCALE ----------------------- */
    const [canvasWidth, setCanvasWidth] = useState(600)

    useEffect(() => {
        const el = canvasRef.current
        if (!el) return
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setCanvasWidth(entry.contentRect.width)
            }
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const cardTotalWidth = (cardConfig.width || 540) + cardConfig.padding * 2
    const canvasPadding = 48
    const availableWidth = canvasWidth - canvasPadding * 2
    const scale = availableWidth > 0 && cardTotalWidth > availableWidth
        ? availableWidth / cardTotalWidth
        : 1

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
        cardIdCounterRef.current++
        const newCard = {
            id: cardIdCounterRef.current,
            name: '',
            markdown: getDefaultMarkdown(),
        }
        setCards((prev) => {
            setActiveIndex(prev.length)
            return [...prev, newCard]
        })
    }, [])

    const deleteCard = useCallback((index) => {
        setCards((prev) => {
            if (prev.length <= 1) return prev
            const newCards = prev.filter((_, i) => i !== index)
            setActiveIndex((prevIdx) => {
                if (prevIdx >= newCards.length) return Math.max(0, newCards.length - 1)
                if (prevIdx > index) return prevIdx - 1
                return prevIdx
            })
            return newCards
        })
    }, [])

    const goToPrevCard = useCallback(() => {
        setActiveIndex((prev) => Math.max(0, prev - 1))
    }, [])

    const goToNextCard = useCallback(() => {
        setActiveIndex((prev) => Math.min(cardsRef.current.length - 1, prev + 1))
    }, [])

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
        (templateId, templateConfig) => {
            setActiveTemplateId(templateId)
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
            if (templateConfig.overlay) setOverlay(templateConfig.overlay)
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
            if (!blob) throw new Error(t('toast.imageEmpty'))
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = getDownloadFilename(activeCard?.name)
            link.href = url
            link.click()
            URL.revokeObjectURL(url)
            toast.success(t('toast.downloaded'))
        } catch (err) {
            console.error('导出失败:', err)
            toast.error(t('toast.exportFailed'))
        } finally {
            setIsExporting(false)
        }
    }, [captureImage, activeCard?.name, t])

    const handleCopy = useCallback(async () => {
        if (!previewRef.current) return
        if (!canCopyImage(t)) return
        if (!(await ensureClipboardPermission(t))) return
        setIsExporting(true)
        try {
            const blob = await captureImage()
            if (!blob) throw new Error(t('toast.imageEmpty'))
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob }),
            ])
            setCopied(true)
            clearTimeout(copiedTimer.current)
            copiedTimer.current = setTimeout(() => setCopied(false), 2000)
            toast.success(t('toast.copiedToClipboard'))
        } catch (err) {
            console.error('复制失败:', err)
            toast.error(t('toast.copyFailed'))
        } finally {
            setIsExporting(false)
        }
    }, [captureImage, t])

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
                activeTemplateId={activeTemplateId}
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
                <div
                    ref={canvasRef}
                    className="flex-1 overflow-auto bg-gradient-to-br from-[#0e0e1a] via-[#111120] to-[#0d0d18]"
                >
                    <div className="flex flex-col items-center justify-start p-6 md:p-8 min-h-full">
                        {/* Card + Navigation */}
                        <div className="flex items-center gap-3">
                            {/* Left Arrow */}
                            {cards.length > 1 && (
                                <button
                                    type="button"
                                    onClick={goToPrevCard}
                                    disabled={activeIndex === 0}
                                    aria-label={t('editor.prevCard')}
                                    className="p-2 rounded-full bg-white/[0.03] text-white/25 hover:text-white/60 hover:bg-white/[0.06] disabled:opacity-0 disabled:pointer-events-none"
                                >
                                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                                </button>
                            )}

                            {/* Card - scaled to fit canvas */}
                            <div
                                className="cursor-pointer group relative"
                                onClick={() => setIsEditing(true)}
                                style={{
                                    transform: scale < 1 ? `scale(${scale})` : undefined,
                                    transformOrigin: 'top center',
                                }}
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

                            {/* Right Arrow */}
                            {cards.length > 1 && (
                                <button
                                    type="button"
                                    onClick={goToNextCard}
                                    disabled={activeIndex === cards.length - 1}
                                    aria-label={t('editor.nextCard')}
                                    className="p-2 rounded-full bg-white/[0.03] text-white/25 hover:text-white/60 hover:bg-white/[0.06] disabled:opacity-0 disabled:pointer-events-none"
                                >
                                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                                </button>
                            )}
                        </div>

                        {/* Add Card Button */}
                        <div className="flex justify-center mt-5">
                            <button
                                type="button"
                                onClick={addCard}
                                aria-label={t('editor.addNewCard')}
                                className="flex items-center gap-1.5 px-5 py-1.5 border border-dashed border-white/10 rounded-lg text-[12px] text-white/25 hover:text-white/55 hover:border-white/25 hover:bg-white/[0.02]"
                            >
                                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                                {t('editor.addCard')}
                            </button>
                        </div>

                        {/* Card Counter & Controls */}
                        <div className="flex items-center justify-center gap-3 mt-2.5 mb-4">
                            <span className="text-[11px] text-white/20 font-mono">
                                {t('editor.cardCounter', { current: activeIndex + 1, total: cards.length })}
                            </span>
                            {cards.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => deleteCard(activeIndex)}
                                    aria-label={t('editor.deleteCard')}
                                    className="text-[11px] text-red-400/30 hover:text-red-400/70"
                                >
                                    {t('editor.delete')}
                                </button>
                            )}
                        </div>
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
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-150"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsEditing(false)
                    }}
                >
                    <div className="w-[620px] max-h-[82vh] bg-gradient-to-b from-[#1e1e34] to-[#1a1a2e] rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-4 h-11 border-b border-white/[0.05] shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-medium">
                                    {t('editor.markdown')}
                                </span>
                                <span className="text-[10px] text-white/15 font-mono">
                                    {t('editor.chars', { count: activeCard.markdown.length })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <kbd className="text-[9px] text-white/25 px-1.5 py-[2px] rounded border border-white/[0.06] bg-white/[0.03] font-mono">
                                    ESC
                                </kbd>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="text-[11px] text-white/50 hover:text-white/90 px-2.5 py-1 rounded-md bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/20 font-medium"
                                >
                                    {t('editor.finishEditing')}
                                </button>
                            </div>
                        </div>

                        {/* Editor Textarea */}
                        <textarea
                            aria-label={t('editor.editorLabel')}
                            value={activeCard.markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') setIsEditing(false)
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
                            className="flex-1 min-h-[420px] w-full resize-none bg-transparent p-5 text-[13px] text-white/80 font-mono leading-[1.8] outline-none placeholder:text-white/15 selection:bg-indigo-500/25 sidebar-scroll"
                            placeholder={t('editor.editorPlaceholder')}
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

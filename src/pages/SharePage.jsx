import { useMemo, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import { Copy, ChevronLeft, ChevronRight } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import ImagePreview from '@/components/ImagePreview'
import { themes, defaultThemeId } from '@/config/themes'
import { markdownStyles, defaultStyleId } from '@/config/markdownStyles'
import { decodeSharePayload } from '@/lib/sharePayload'
import { usePageSeo } from '@/lib/seo'

const DEFAULT_CARD_CONFIG = {
    padding: 33,
    borderRadius: 15,
    width: 540,
    height: 0,
    watermark: false,
}

const FALLBACK_THEME =
    themes.find((item) => item.id === defaultThemeId) ||
    themes[0] || {
        id: 'fallback-theme',
        name: 'Default',
        dot: '#111118',
        background: '#111118',
        variant: 'dark',
    }

const FALLBACK_STYLE =
    markdownStyles.find((item) => item.id === defaultStyleId) ||
    markdownStyles[0] || {
        id: 'prose',
        name: 'Prose',
    }

const resolveTheme = (value) => {
    if (value && typeof value === 'object' && value.background) return value
    if (typeof value === 'string') {
        const match = themes.find((item) => item.id === value)
        if (match) return match
    }
    return FALLBACK_THEME
}

const resolveMdStyle = (value) => {
    if (value && typeof value === 'object' && value.id) return value
    if (typeof value === 'string') {
        const match = markdownStyles.find((item) => item.id === value)
        if (match) return match
    }
    return FALLBACK_STYLE
}

const normalizeWorkspace = (value) => {
    if (!value || !Array.isArray(value.cards) || value.cards.length === 0) return null
    const cards = value.cards.map((card, index) => ({
        id: Number.isFinite(Number(card?.id)) ? Number(card.id) : index + 1,
        name: typeof card?.name === 'string' ? card.name : '',
        markdown: typeof card?.markdown === 'string' ? card.markdown : '',
        theme: resolveTheme(card?.theme),
        mdStyle: resolveMdStyle(card?.mdStyle),
        shadow: typeof card?.shadow === 'string' ? card.shadow : 'soft',
        config: {
            ...DEFAULT_CARD_CONFIG,
            ...(card?.config || {}),
        },
    }))
    const rawIndex = Number(value.activeIndex)
    const activeIndex = Number.isInteger(rawIndex)
        ? Math.max(0, Math.min(cards.length - 1, rawIndex))
        : 0
    return {
        projectName:
            typeof value.projectName === 'string' && value.projectName.trim()
                ? value.projectName.trim()
                : 'Shared Workspace',
        cards,
        activeIndex,
        comments: Array.isArray(value.comments) ? value.comments : [],
    }
}

export default function SharePage() {
    const seoConfig = useMemo(
        () => ({
            title: 'Md2Img Shared Card',
            description: 'Shared read-only preview page for Md2Img cards.',
            path: '/share',
            robots: 'noindex,nofollow',
        }),
        [],
    )

    usePageSeo(seoConfig)

    const location = useLocation()
    const dataParam = useMemo(
        () => new URLSearchParams(location.search).get('data'),
        [location.search],
    )
    const workspace = useMemo(
        () => normalizeWorkspace(decodeSharePayload(dataParam)),
        [dataParam],
    )
    const [activeIndex, setActiveIndex] = useState(workspace?.activeIndex || 0)

    const copyShareUrl = useCallback(async () => {
        if (!dataParam) return
        const url = `${window.location.origin}/share?data=${encodeURIComponent(dataParam)}`
        try {
            await navigator.clipboard.writeText(url)
            toast.success('分享链接已复制')
        } catch {
            toast.error('复制失败，请手动复制地址栏链接')
        }
    }, [dataParam])

    if (!workspace) {
        return (
            <div className="dark min-h-screen bg-[#0f1018] text-white flex items-center justify-center p-6">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <h1 className="text-lg font-semibold">分享链接无效或已损坏</h1>
                    <p className="text-sm text-white/55 mt-2">
                        请让分享者重新生成链接，或直接打开编辑器创建新项目。
                    </p>
                    <Link
                        to="/app"
                        className="inline-flex mt-5 px-3 py-1.5 rounded-lg bg-indigo-500/80 hover:bg-indigo-500 text-sm"
                    >
                        打开编辑器
                    </Link>
                </div>
            </div>
        )
    }

    const activeCard = workspace.cards[activeIndex] ?? workspace.cards[0]
    const cardComments = workspace.comments.filter(
        (item) => Number(item.cardId) === Number(activeCard?.id),
    )

    return (
        <div className="dark min-h-screen bg-[#0f1018] text-white">
            <div className="max-w-[1120px] mx-auto px-5 py-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                            Shared Workspace
                        </p>
                        <h1 className="text-xl font-semibold text-white/90">
                            {workspace.projectName}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={copyShareUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/12 bg-white/[0.03] text-sm text-white/75 hover:text-white"
                        >
                            <Copy className="h-3.5 w-3.5" strokeWidth={1.6} />
                            复制分享链接
                        </button>
                        <Link
                            to={`/app?share=${encodeURIComponent(dataParam || '')}`}
                            className="inline-flex px-3 py-1.5 rounded-lg bg-indigo-500/85 hover:bg-indigo-500 text-sm"
                        >
                            进入协作编辑
                        </Link>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                    <div className="rounded-2xl border border-white/10 bg-[#10131f] p-4">
                        <div className="flex items-center justify-between mb-3">
                            <button
                                type="button"
                                disabled={activeIndex === 0}
                                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                                className="p-2 rounded-md bg-white/[0.03] text-white/45 hover:text-white/75 disabled:opacity-30"
                            >
                                <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />
                            </button>
                            <span className="text-xs font-mono text-white/35">
                                卡片 {activeIndex + 1}/{workspace.cards.length}
                            </span>
                            <button
                                type="button"
                                disabled={activeIndex >= workspace.cards.length - 1}
                                onClick={() =>
                                    setActiveIndex((prev) =>
                                        Math.min(workspace.cards.length - 1, prev + 1),
                                    )
                                }
                                className="p-2 rounded-md bg-white/[0.03] text-white/45 hover:text-white/75 disabled:opacity-30"
                            >
                                <ChevronRight className="h-4 w-4" strokeWidth={1.6} />
                            </button>
                        </div>
                        <div className="overflow-auto">
                            <ImagePreview
                                markdown={activeCard.markdown}
                                theme={activeCard.theme}
                                markdownStyle={activeCard.mdStyle.id}
                                padding={activeCard.config.padding}
                                borderRadius={activeCard.config.borderRadius}
                                cardWidth={activeCard.config.width}
                                cardHeight={activeCard.config.height}
                                shadowId={activeCard.shadow}
                                watermark={activeCard.config.watermark}
                            />
                        </div>
                    </div>

                    <aside className="rounded-2xl border border-white/10 bg-[#10131f] p-4">
                        <h2 className="text-sm font-semibold text-white/85 mb-2">
                            协作评论（只读）
                        </h2>
                        <p className="text-xs text-white/40 mb-3">
                            当前卡片：{activeCard.name || `卡片 ${activeIndex + 1}`}
                        </p>
                        <div className="space-y-2.5 max-h-[520px] overflow-auto pr-1">
                            {cardComments.length === 0 && (
                                <p className="text-xs text-white/38">
                                    暂无评论。点击“进入协作编辑”可继续讨论。
                                </p>
                            )}
                            {cardComments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-white/80">
                                            {comment.author || '匿名成员'}
                                        </span>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded ${
                                                comment.resolved
                                                    ? 'bg-emerald-500/20 text-emerald-300'
                                                    : 'bg-amber-500/20 text-amber-300'
                                            }`}
                                        >
                                            {comment.resolved ? '已解决' : '待处理'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-white/65 leading-relaxed mt-1.5 whitespace-pre-wrap">
                                        {comment.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
            <Toaster position="bottom-center" richColors theme="dark" />
        </div>
    )
}

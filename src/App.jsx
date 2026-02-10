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
import { useState, useRef, useCallback, useEffect, useMemo, createRef } from 'react'
import { toBlob } from 'html-to-image'
import { createRoot } from 'react-dom/client'
import { Toaster, toast } from 'sonner'
import { Plus, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import IconSidebar from '@/components/IconSidebar'
import ContentSidebar from '@/components/ContentSidebar'
import TopBar from '@/components/TopBar'
import PropertiesPanel from '@/components/PropertiesPanel'
import WorkspaceHub from '@/components/WorkspaceHub'
import ImagePreview from '@/components/ImagePreview'
import { themes, defaultThemeId } from '@/config/themes'
import { markdownStyles, defaultStyleId } from '@/config/markdownStyles'
import { getDefaultMarkdown } from '@/config/defaults'
import { encodeSharePayload, decodeSharePayload } from '@/lib/sharePayload'

const DEFAULT_DOWNLOAD_NAME = 'markdown-image'
const WORKSPACE_STORAGE_KEY = 'md2img:workspace:v1'
const PROJECTS_STORAGE_KEY = 'md2img:projects:v1'
const CUSTOM_TEMPLATES_STORAGE_KEY = 'md2img:templates:v1'
const AUTOSAVE_DELAY = 350
const MAX_HISTORY_ENTRIES = 80
const MAX_PROJECT_ENTRIES = 60
const MAX_TEMPLATE_ENTRIES = 120
const DEFAULT_CARD_CONFIG = {
    padding: 33,
    borderRadius: 15,
    width: 540,
    height: 0, // 0 = auto
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
        description: '',
    }

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

const getBatchDownloadFilename = (name, index, total) => {
    const base = sanitizeFilename(name)
    const digits = String(total).length
    const sequence = String(index + 1).padStart(digits, '0')
    return `${sequence}-${base}.png`
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

const createCard = ({
    id,
    name = '',
    markdown = getDefaultMarkdown(),
    theme = defaultThemeId,
    mdStyle = defaultStyleId,
    shadow = 'soft',
    templateId = null,
    config = {},
} = {}) => ({
    id,
    name,
    markdown,
    theme: resolveTheme(theme),
    mdStyle: resolveMdStyle(mdStyle),
    shadow,
    templateId,
    config: { ...DEFAULT_CARD_CONFIG, ...config },
})

const serializeCard = (card) => ({
    id: card.id,
    name: typeof card.name === 'string' ? card.name : '',
    markdown: typeof card.markdown === 'string' ? card.markdown : '',
    theme: resolveTheme(card.theme).id,
    mdStyle: resolveMdStyle(card.mdStyle).id,
    shadow: typeof card.shadow === 'string' ? card.shadow : 'soft',
    templateId: typeof card.templateId === 'string' ? card.templateId : null,
    config: {
        ...DEFAULT_CARD_CONFIG,
        ...(card.config || {}),
    },
})

const createDefaultWorkspace = () => ({
    projectName: '未命名项目',
    cards: [createCard({ id: 1 })],
    activeIndex: 0,
    syncAll: false,
    members: ['我'],
    comments: [],
    nextCardId: 1,
})

const normalizeMembers = (members) => {
    if (!Array.isArray(members) || members.length === 0) return ['我']
    const unique = Array.from(
        new Set(
            members
                .map((item) => (typeof item === 'string' ? item.trim() : ''))
                .filter(Boolean),
        ),
    )
    return unique.length > 0 ? unique.slice(0, 30) : ['我']
}

const normalizeComments = (comments, cards) => {
    if (!Array.isArray(comments) || comments.length === 0) return []
    const validCardIds = new Set(cards.map((item) => Number(item.id)))
    return comments
        .map((item) => {
            const cardId = Number(item?.cardId)
            return {
                id: typeof item?.id === 'string' ? item.id : '',
                cardId,
                author: typeof item?.author === 'string' ? item.author.trim() : '',
                text: typeof item?.text === 'string' ? item.text.trim() : '',
                resolved: Boolean(item?.resolved),
                createdAt: Number(item?.createdAt) || Date.now(),
            }
        })
        .filter((item) => item.id && item.text && validCardIds.has(item.cardId))
        .slice(0, 2000)
}

const createUniqueId = (prefix) =>
    `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

const loadCollection = (key) => {
    if (typeof window === 'undefined') return []
    try {
        const raw = window.localStorage.getItem(key)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

const loadProjects = () => loadCollection(PROJECTS_STORAGE_KEY)
const loadCustomTemplates = () => loadCollection(CUSTOM_TEMPLATES_STORAGE_KEY)

const normalizeWorkspaceSnapshot = (snapshot) => {
    if (!snapshot || !Array.isArray(snapshot.cards) || snapshot.cards.length === 0) {
        return createDefaultWorkspace()
    }

    const cards = snapshot.cards.map((rawCard, index) => {
        const rawId = Number(rawCard?.id)
        const id = Number.isFinite(rawId) && rawId > 0
            ? Math.trunc(rawId)
            : index + 1
        return createCard({
            id,
            name: typeof rawCard?.name === 'string' ? rawCard.name : '',
            markdown:
                typeof rawCard?.markdown === 'string'
                    ? rawCard.markdown
                    : getDefaultMarkdown(),
            theme: rawCard?.theme,
            mdStyle: rawCard?.mdStyle,
            shadow: typeof rawCard?.shadow === 'string' ? rawCard.shadow : 'soft',
            templateId:
                typeof rawCard?.templateId === 'string'
                    ? rawCard.templateId
                    : null,
            config:
                rawCard?.config && typeof rawCard.config === 'object'
                    ? rawCard.config
                    : {},
        })
    })

    const maxCardId = cards.reduce((max, card) => Math.max(max, card.id), 1)
    const rawActiveIndex = Number(snapshot.activeIndex)
    const activeIndex = Number.isInteger(rawActiveIndex)
        ? Math.max(0, Math.min(cards.length - 1, rawActiveIndex))
        : 0
    const rawNextCardId = Number(snapshot.nextCardId)
    const nextCardId = Number.isInteger(rawNextCardId) && rawNextCardId > 0
        ? Math.max(rawNextCardId, maxCardId)
        : maxCardId
    const projectName =
        typeof snapshot.projectName === 'string' && snapshot.projectName.trim()
            ? snapshot.projectName.trim().slice(0, 120)
            : '未命名项目'
    const members = normalizeMembers(snapshot.members)
    const comments = normalizeComments(snapshot.comments, cards)

    return {
        projectName,
        cards,
        activeIndex,
        syncAll: Boolean(snapshot.syncAll),
        members,
        comments,
        nextCardId,
    }
}

const loadWorkspace = () => {
    if (typeof window === 'undefined') return createDefaultWorkspace()
    try {
        const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY)
        if (!raw) return createDefaultWorkspace()
        const parsed = JSON.parse(raw)
        return normalizeWorkspaceSnapshot(parsed)
    } catch {
        return createDefaultWorkspace()
    }
}

const isEditableTarget = (target) => {
    if (!(target instanceof HTMLElement)) return false
    const tag = target.tagName
    return (
        target.isContentEditable ||
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT'
    )
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

const waitForFontsReady = async () => {
    if (typeof document === 'undefined') return
    const fonts = document.fonts
    if (!fonts?.ready) return
    try {
        await fonts.ready
    } catch {
        // Ignore font readiness failures and continue exporting.
    }
}

const waitForNextPaint = () =>
    new Promise((resolve) => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(resolve)
        })
    })

const waitForImageReady = (img) =>
    new Promise((resolve) => {
        if (img.complete) {
            resolve()
            return
        }
        const onDone = () => resolve()
        img.addEventListener('load', onDone, { once: true })
        img.addEventListener('error', onDone, { once: true })
        window.setTimeout(onDone, 3000)
    })

const waitForImagesInNode = async (node) => {
    const images = Array.from(node.querySelectorAll('img'))
    if (images.length === 0) return
    await Promise.all(images.map((img) => waitForImageReady(img)))
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
    const initialWorkspace = useMemo(() => loadWorkspace(), [])
    const initialProjects = useMemo(() => loadProjects(), [])
    const initialTemplates = useMemo(() => loadCustomTemplates(), [])

    /* ----------------------- SIDEBAR STATE ----------------------- */
    const [sidebarTab, setSidebarTab] = useState('template')

    /* ----------------------- CARD STATE ----------------------- */
    const [cards, setCards] = useState(initialWorkspace.cards)
    const [activeIndex, setActiveIndex] = useState(initialWorkspace.activeIndex)
    const activeCard = cards[activeIndex] ?? cards[0]
    const activeTheme = resolveTheme(activeCard?.theme)
    const activeStyle = resolveMdStyle(activeCard?.mdStyle)
    const activeConfig = useMemo(
        () => ({
            ...DEFAULT_CARD_CONFIG,
            ...(activeCard?.config || {}),
        }),
        [activeCard],
    )
    const activeShadow = activeCard?.shadow || 'soft'
    const activeTemplateId = activeCard?.templateId || null
    const activeCardName = activeCard?.name || ''
    const activeMarkdown = activeCard?.markdown || ''

    /* ----------------------- CARD OPTIONS ----------------------- */
    const [syncAll, setSyncAll] = useState(initialWorkspace.syncAll)
    const [projectName, setProjectName] = useState(initialWorkspace.projectName || '未命名项目')
    const [members, setMembers] = useState(initialWorkspace.members || ['我'])
    const [comments, setComments] = useState(initialWorkspace.comments || [])
    const [currentProjectId, setCurrentProjectId] = useState(null)

    /* ----------------------- EXPORT STATE ----------------------- */
    const [copied, setCopied] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [canUndo, setCanUndo] = useState(false)
    const [canRedo, setCanRedo] = useState(false)
    const [draggingIndex, setDraggingIndex] = useState(null)
    const [dragOverIndex, setDragOverIndex] = useState(null)
    const [isWorkspaceHubOpen, setIsWorkspaceHubOpen] = useState(false)
    const [projects, setProjects] = useState(initialProjects)
    const [customTemplates, setCustomTemplates] = useState(initialTemplates)
    const [shareLinks, setShareLinks] = useState({ view: '', edit: '' })

    /* ----------------------- REFS ----------------------- */
    const previewRef = useRef(null)
    const canvasRef = useRef(null)
    const copiedTimer = useRef(null)
    const cardIdCounterRef = useRef(initialWorkspace.nextCardId)
    const cardsRef = useRef(cards)
    const touchDragPointerIdRef = useRef(null)
    const suppressCardSelectRef = useRef(false)
    const undoStackRef = useRef([])
    const redoStackRef = useRef([])
    const lastSnapshotRef = useRef(null)
    const historyBootstrappedRef = useRef(false)
    const replayingHistoryRef = useRef(false)
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

    const cardTotalWidth = (activeConfig.width || 540) + activeConfig.padding * 2
    const canvasPadding = 48
    const availableWidth = canvasWidth - canvasPadding * 2
    const scale = availableWidth > 0 && cardTotalWidth > availableWidth
        ? availableWidth / cardTotalWidth
        : 1

    /* -------------------- cleanup timer on unmount -------------------- */
    useEffect(() => {
        return () => clearTimeout(copiedTimer.current)
    }, [])

    const buildSnapshot = useCallback(
        () => ({
            projectName: projectName.trim() || '未命名项目',
            cards: cards.map(serializeCard),
            activeIndex,
            syncAll,
            members: normalizeMembers(members),
            comments,
            nextCardId: cardIdCounterRef.current,
        }),
        [cards, activeIndex, syncAll, members, comments, projectName],
    )

    const applyWorkspaceSnapshot = useCallback((snapshot) => {
        const normalized = normalizeWorkspaceSnapshot(snapshot)
        setProjectName(normalized.projectName)
        setCards(normalized.cards)
        setActiveIndex(normalized.activeIndex)
        setSyncAll(normalized.syncAll)
        setMembers(normalized.members)
        setComments(normalized.comments)
        cardIdCounterRef.current = normalized.nextCardId
    }, [])

    /* ----------------------- PERSISTENCE ----------------------- */
    useEffect(() => {
        if (typeof window === 'undefined') return undefined
        const timer = window.setTimeout(() => {
            try {
                window.localStorage.setItem(
                    WORKSPACE_STORAGE_KEY,
                    JSON.stringify(buildSnapshot()),
                )
            } catch (error) {
                console.warn('保存草稿失败:', error)
            }
        }, AUTOSAVE_DELAY)
        return () => window.clearTimeout(timer)
    }, [buildSnapshot])

    useEffect(() => {
        if (typeof window === 'undefined') return
        try {
            window.localStorage.setItem(
                PROJECTS_STORAGE_KEY,
                JSON.stringify(projects.slice(0, MAX_PROJECT_ENTRIES)),
            )
        } catch (error) {
            console.warn('保存项目列表失败:', error)
        }
    }, [projects])

    useEffect(() => {
        if (typeof window === 'undefined') return
        try {
            window.localStorage.setItem(
                CUSTOM_TEMPLATES_STORAGE_KEY,
                JSON.stringify(customTemplates.slice(0, MAX_TEMPLATE_ENTRIES)),
            )
        } catch (error) {
            console.warn('保存模板库失败:', error)
        }
    }, [customTemplates])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const params = new URLSearchParams(window.location.search)
        const encoded = params.get('share')
        if (!encoded) return

        const imported = decodeSharePayload(encoded)
        if (!imported) {
            toast.error('分享数据无效，无法导入')
            return
        }

        applyWorkspaceSnapshot(imported)
        setCurrentProjectId(null)
        setIsEditing(false)
        setIsWorkspaceHubOpen(false)

        undoStackRef.current = []
        redoStackRef.current = []
        lastSnapshotRef.current = null
        historyBootstrappedRef.current = false
        replayingHistoryRef.current = false
        setCanUndo(false)
        setCanRedo(false)

        params.delete('share')
        const query = params.toString()
        const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
        window.history.replaceState(null, '', nextUrl)
        toast.success('已导入协作工作区')
    }, [applyWorkspaceSnapshot])

    /* ----------------------- HISTORY ----------------------- */
    useEffect(() => {
        const serialized = JSON.stringify(buildSnapshot())
        if (!historyBootstrappedRef.current) {
            historyBootstrappedRef.current = true
            lastSnapshotRef.current = serialized
            return
        }
        if (replayingHistoryRef.current) {
            replayingHistoryRef.current = false
            lastSnapshotRef.current = serialized
            return
        }
        if (serialized === lastSnapshotRef.current) return

        if (lastSnapshotRef.current) {
            undoStackRef.current.push(lastSnapshotRef.current)
            if (undoStackRef.current.length > MAX_HISTORY_ENTRIES) {
                undoStackRef.current.shift()
            }
        }
        redoStackRef.current = []
        lastSnapshotRef.current = serialized
        setCanUndo(undoStackRef.current.length > 0)
        setCanRedo(false)
    }, [buildSnapshot])

    const handleUndo = useCallback(() => {
        if (undoStackRef.current.length === 0) return
        const previousSerialized = undoStackRef.current.pop()
        if (!previousSerialized) return

        const currentSerialized = JSON.stringify(buildSnapshot())
        redoStackRef.current.push(currentSerialized)
        if (redoStackRef.current.length > MAX_HISTORY_ENTRIES) {
            redoStackRef.current.shift()
        }

        try {
            replayingHistoryRef.current = true
            lastSnapshotRef.current = previousSerialized
            applyWorkspaceSnapshot(JSON.parse(previousSerialized))
            setCanUndo(undoStackRef.current.length > 0)
            setCanRedo(redoStackRef.current.length > 0)
        } catch {
            replayingHistoryRef.current = false
        }
    }, [applyWorkspaceSnapshot, buildSnapshot])

    const handleRedo = useCallback(() => {
        if (redoStackRef.current.length === 0) return
        const nextSerialized = redoStackRef.current.pop()
        if (!nextSerialized) return

        const currentSerialized = JSON.stringify(buildSnapshot())
        undoStackRef.current.push(currentSerialized)
        if (undoStackRef.current.length > MAX_HISTORY_ENTRIES) {
            undoStackRef.current.shift()
        }

        try {
            replayingHistoryRef.current = true
            lastSnapshotRef.current = nextSerialized
            applyWorkspaceSnapshot(JSON.parse(nextSerialized))
            setCanUndo(undoStackRef.current.length > 0)
            setCanRedo(redoStackRef.current.length > 0)
        } catch {
            replayingHistoryRef.current = false
        }
    }, [applyWorkspaceSnapshot, buildSnapshot])

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

    const updateCardsWithSync = useCallback(
        (updater) => {
            setCards((prev) =>
                prev.map((card, i) =>
                    syncAll || i === activeIndex ? updater(card) : card,
                ),
            )
        },
        [activeIndex, syncAll],
    )

    const addCard = useCallback(() => {
        cardIdCounterRef.current++
        const newCard = createCard({
            id: cardIdCounterRef.current,
            theme: activeTheme,
            mdStyle: activeStyle,
            shadow: activeShadow,
            templateId: activeTemplateId,
            config: activeConfig,
        })
        setCards((prev) => {
            setActiveIndex(prev.length)
            return [...prev, newCard]
        })
    }, [activeConfig, activeShadow, activeStyle, activeTemplateId, activeTheme])

    const duplicateActiveCard = useCallback(() => {
        if (!activeCard) return
        cardIdCounterRef.current++
        const duplicatedCard = createCard({
            id: cardIdCounterRef.current,
            name: activeCard.name,
            markdown: activeCard.markdown,
            theme: activeTheme,
            mdStyle: activeStyle,
            shadow: activeShadow,
            templateId: activeTemplateId,
            config: activeConfig,
        })
        setCards((prev) => {
            const insertAt = Math.min(activeIndex + 1, prev.length)
            const nextCards = [
                ...prev.slice(0, insertAt),
                duplicatedCard,
                ...prev.slice(insertAt),
            ]
            setActiveIndex(insertAt)
            return nextCards
        })
        toast.success(t('toast.cardDuplicated'))
    }, [
        activeCard,
        activeConfig,
        activeIndex,
        activeShadow,
        activeStyle,
        activeTemplateId,
        activeTheme,
        t,
    ])

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

    const reorderCards = useCallback((fromIndex, toIndex) => {
        setCards((prev) => {
            if (
                fromIndex === toIndex ||
                fromIndex < 0 ||
                toIndex < 0 ||
                fromIndex >= prev.length ||
                toIndex >= prev.length
            ) {
                return prev
            }

            const nextCards = [...prev]
            const [moved] = nextCards.splice(fromIndex, 1)
            nextCards.splice(toIndex, 0, moved)

            setActiveIndex((prevActive) => {
                if (prevActive === fromIndex) return toIndex
                if (fromIndex < toIndex && prevActive > fromIndex && prevActive <= toIndex) {
                    return prevActive - 1
                }
                if (fromIndex > toIndex && prevActive >= toIndex && prevActive < fromIndex) {
                    return prevActive + 1
                }
                return prevActive
            })

            return nextCards
        })
    }, [])

    const handleCardDragStart = useCallback((index, event) => {
        setDraggingIndex(index)
        setDragOverIndex(index)
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', String(index))
    }, [])

    const handleCardDragOver = useCallback((index, event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        if (dragOverIndex !== index) {
            setDragOverIndex(index)
        }
    }, [dragOverIndex])

    const handleCardDrop = useCallback((index, event) => {
        event.preventDefault()
        const data = event.dataTransfer.getData('text/plain')
        const fromIndex = draggingIndex ?? Number.parseInt(data, 10)
        if (!Number.isInteger(fromIndex)) return
        reorderCards(fromIndex, index)
        setDraggingIndex(null)
        setDragOverIndex(null)
    }, [draggingIndex, reorderCards])

    const handleCardDragEnd = useCallback(() => {
        setDraggingIndex(null)
        setDragOverIndex(null)
    }, [])

    const getSortItemIndexFromPoint = useCallback((x, y) => {
        if (typeof document === 'undefined') return null
        const el = document.elementFromPoint(x, y)
        const target = el?.closest?.('[data-sort-item-index]')
        if (!target) return null
        const value = Number.parseInt(target.getAttribute('data-sort-item-index') || '', 10)
        return Number.isInteger(value) ? value : null
    }, [])

    const handleSortItemPointerDown = useCallback((index, event) => {
        if (event.pointerType !== 'touch') return
        touchDragPointerIdRef.current = event.pointerId
        setDraggingIndex(index)
        setDragOverIndex(index)
        event.currentTarget.setPointerCapture?.(event.pointerId)
    }, [])

    const handleSortItemPointerMove = useCallback((event) => {
        if (touchDragPointerIdRef.current !== event.pointerId) return
        const nextIndex = getSortItemIndexFromPoint(event.clientX, event.clientY)
        if (nextIndex !== null && nextIndex !== dragOverIndex) {
            setDragOverIndex(nextIndex)
        }
        event.preventDefault()
    }, [dragOverIndex, getSortItemIndexFromPoint])

    const handleSortItemPointerUp = useCallback((event) => {
        if (touchDragPointerIdRef.current !== event.pointerId) return
        event.currentTarget.releasePointerCapture?.(event.pointerId)

        const fromIndex = draggingIndex
        const toIndex = dragOverIndex
        if (Number.isInteger(fromIndex) && Number.isInteger(toIndex)) {
            if (fromIndex !== toIndex) {
                reorderCards(fromIndex, toIndex)
                suppressCardSelectRef.current = true
            }
        }

        touchDragPointerIdRef.current = null
        setDraggingIndex(null)
        setDragOverIndex(null)
    }, [draggingIndex, dragOverIndex, reorderCards])

    const handleSortItemPointerCancel = useCallback((event) => {
        if (touchDragPointerIdRef.current !== event.pointerId) return
        touchDragPointerIdRef.current = null
        setDraggingIndex(null)
        setDragOverIndex(null)
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

    const handleThemeChange = useCallback(
        (nextTheme) => {
            const resolved = resolveTheme(nextTheme)
            updateCardsWithSync((card) => ({ ...card, theme: resolved }))
        },
        [updateCardsWithSync],
    )

    const handleStyleChange = useCallback(
        (nextStyle) => {
            const resolved = resolveMdStyle(nextStyle)
            updateCardsWithSync((card) => ({ ...card, mdStyle: resolved }))
        },
        [updateCardsWithSync],
    )

    const handleShadowChange = useCallback(
        (nextShadow) => {
            updateCardsWithSync((card) => ({ ...card, shadow: nextShadow }))
        },
        [updateCardsWithSync],
    )

    const handleConfigChange = useCallback(
        (key, value) => {
            if (key === 'syncAll') {
                const nextValue = Boolean(value)
                setSyncAll(nextValue)
                if (nextValue && activeCard) {
                    setCards((prev) =>
                        prev.map((card, i) =>
                            i === activeIndex
                                ? card
                                : {
                                    ...card,
                                    theme: activeTheme,
                                    mdStyle: activeStyle,
                                    shadow: activeShadow,
                                    templateId: activeTemplateId,
                                    config: { ...activeConfig },
                                },
                        ),
                    )
                }
                return
            }
            updateCardsWithSync((card) => ({
                ...card,
                config: {
                    ...DEFAULT_CARD_CONFIG,
                    ...(card.config || {}),
                    [key]: value,
                },
            }))
        },
        [
            activeCard,
            activeConfig,
            activeIndex,
            activeShadow,
            activeStyle,
            activeTemplateId,
            activeTheme,
            updateCardsWithSync,
        ],
    )

    /* ----------------------- TEMPLATE APPLY ----------------------- */
    const handleApplyTemplate = useCallback(
        (templateId, templateConfig) => {
            updateCardsWithSync((card) => {
                const nextConfig = { ...card.config }
                if (templateConfig.padding !== undefined) {
                    nextConfig.padding = templateConfig.padding
                }
                if (templateConfig.borderRadius !== undefined) {
                    nextConfig.borderRadius = templateConfig.borderRadius
                }
                if (templateConfig.width !== undefined) {
                    nextConfig.width = templateConfig.width
                }
                return {
                    ...card,
                    templateId,
                    theme: templateConfig.theme
                        ? resolveTheme(templateConfig.theme)
                        : card.theme,
                    mdStyle: templateConfig.mdStyle
                        ? resolveMdStyle(templateConfig.mdStyle)
                        : card.mdStyle,
                    shadow: templateConfig.shadow || card.shadow,
                    config: nextConfig,
                }
            })
        },
        [updateCardsWithSync],
    )

    /* ----------------------- SHARED CAPTURE ----------------------- */
    const captureImage = useCallback(
        async () => {
            await waitForFontsReady()
            return toBlob(previewRef.current, {
                pixelRatio: 2,
                cacheBust: true,
            })
        },
        [],
    )

    const captureCardImage = useCallback(async (card) => {
        if (typeof document === 'undefined') {
            throw new Error('Document is not available')
        }
        await waitForFontsReady()

        const theme = resolveTheme(card.theme)
        const mdStyle = resolveMdStyle(card.mdStyle)
        const config = {
            ...DEFAULT_CARD_CONFIG,
            ...(card.config || {}),
        }
        const host = document.createElement('div')
        host.style.position = 'fixed'
        host.style.left = '-10000px'
        host.style.top = '0'
        host.style.pointerEvents = 'none'
        host.style.opacity = '0'
        host.style.zIndex = '-1'
        document.body.appendChild(host)

        const isolatedRoot = createRoot(host)
        const isolatedPreviewRef = createRef()
        try {
            isolatedRoot.render(
                <ImagePreview
                    ref={isolatedPreviewRef}
                    markdown={card.markdown || ''}
                    theme={theme}
                    markdownStyle={mdStyle.id}
                    padding={config.padding}
                    borderRadius={config.borderRadius}
                    cardWidth={config.width}
                    cardHeight={config.height}
                    shadowId={card.shadow || 'soft'}
                    watermark={Boolean(config.watermark)}
                />,
            )
            await waitForNextPaint()
            const node = isolatedPreviewRef.current
            if (!node) throw new Error('Offscreen render failed')
            await waitForImagesInNode(node)
            await waitForNextPaint()
            return toBlob(node, {
                pixelRatio: 2,
                cacheBust: true,
            })
        } finally {
            isolatedRoot.unmount()
            host.remove()
        }
    }, [])

    /* ------------------------------ EXPORT ------------------------------ */
    const handleDownload = useCallback(async () => {
        if (!previewRef.current) return
        setIsExporting(true)
        try {
            const blob = await captureImage()
            if (!blob) throw new Error(t('toast.imageEmpty'))
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = getDownloadFilename(activeCardName)
            link.href = url
            link.click()
            setTimeout(() => URL.revokeObjectURL(url), 1000)
            toast.success(t('toast.downloaded'))
        } catch (err) {
            console.error('导出失败:', err)
            toast.error(t('toast.exportFailed'))
        } finally {
            setIsExporting(false)
        }
    }, [captureImage, activeCardName, t])

    const handleDownloadAll = useCallback(async () => {
        if (cards.length === 0) return
        setIsExporting(true)
        try {
            for (const [index, card] of cards.entries()) {
                const blob = await captureCardImage(card)
                if (!blob) throw new Error(t('toast.imageEmpty'))
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.download = getBatchDownloadFilename(
                    card.name,
                    index,
                    cards.length,
                )
                link.href = url
                link.click()
                setTimeout(() => URL.revokeObjectURL(url), 1000)
                await new Promise((resolve) => setTimeout(resolve, 80))
            }
            toast.success(t('toast.exportedAll', { count: cards.length }))
        } catch (err) {
            console.error('批量导出失败:', err)
            toast.error(t('toast.exportAllFailed'))
        } finally {
            setIsExporting(false)
        }
    }, [cards, captureCardImage, t])

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

    const activeCardComments = useMemo(
        () =>
            comments
                .filter((item) => Number(item.cardId) === Number(activeCard?.id))
                .sort((a, b) => b.createdAt - a.createdAt),
        [comments, activeCard],
    )
    const unresolvedCommentsCount = useMemo(
        () => comments.filter((item) => !item.resolved).length,
        [comments],
    )
    const activeCardLabel = (activeCardName || `卡片 ${activeIndex + 1}`).trim()

    const handleGenerateShareLinks = useCallback(async () => {
        const encoded = encodeSharePayload(buildSnapshot())
        const origin = window.location.origin
        const nextLinks = {
            view: `${origin}/share?data=${encodeURIComponent(encoded)}`,
            edit: `${origin}/app?share=${encodeURIComponent(encoded)}`,
        }
        setShareLinks(nextLinks)
        try {
            await navigator.clipboard.writeText(nextLinks.view)
            toast.success('已生成分享链接，并复制到剪贴板')
        } catch {
            toast.success('已生成分享链接')
        }
        return nextLinks
    }, [buildSnapshot])

    const handleSaveCurrentProject = useCallback(() => {
        const cleanName = (projectName || '').trim() || `项目 ${new Date().toLocaleDateString()}`
        const nextSnapshot = { ...buildSnapshot(), projectName: cleanName }
        const now = Date.now()
        const nextId = currentProjectId || createUniqueId('project')
        const nextProject = {
            id: nextId,
            name: cleanName,
            updatedAt: now,
            snapshot: nextSnapshot,
        }
        setProjects((prev) => {
            const withoutCurrent = prev.filter((item) => item.id !== nextId)
            return [nextProject, ...withoutCurrent].slice(0, MAX_PROJECT_ENTRIES)
        })
        setCurrentProjectId(nextId)
        setProjectName(cleanName)
        toast.success(currentProjectId ? '项目已更新' : '项目已保存')
    }, [buildSnapshot, currentProjectId, projectName])

    const handleLoadProject = useCallback((projectId) => {
        const target = projects.find((item) => item.id === projectId)
        if (!target?.snapshot) return
        applyWorkspaceSnapshot(target.snapshot)
        setCurrentProjectId(target.id)
        setIsWorkspaceHubOpen(false)
        toast.success(`已打开项目：${target.name}`)
    }, [applyWorkspaceSnapshot, projects])

    const handleDuplicateProject = useCallback((projectId) => {
        const target = projects.find((item) => item.id === projectId)
        if (!target?.snapshot) return
        const duplicated = {
            id: createUniqueId('project'),
            name: `${target.name} 副本`,
            updatedAt: Date.now(),
            snapshot: {
                ...target.snapshot,
                projectName: `${target.name} 副本`,
            },
        }
        setProjects((prev) => [duplicated, ...prev].slice(0, MAX_PROJECT_ENTRIES))
        toast.success('已复制项目')
    }, [projects])

    const handleDeleteProject = useCallback((projectId) => {
        const target = projects.find((item) => item.id === projectId)
        if (!target) return
        const confirmed = window.confirm(`确认删除项目「${target.name}」吗？`)
        if (!confirmed) return
        setProjects((prev) => prev.filter((item) => item.id !== projectId))
        if (currentProjectId === projectId) {
            setCurrentProjectId(null)
        }
        toast.success('项目已删除')
    }, [currentProjectId, projects])

    const handleAddMember = useCallback((rawValue) => {
        const value = typeof rawValue === 'string' ? rawValue.trim() : ''
        if (!value) return false
        if (members.includes(value)) return false
        setMembers((prev) => [...prev, value].slice(0, 30))
        toast.success('已添加协作成员')
        return true
    }, [members])

    const handleRemoveMember = useCallback((member) => {
        setMembers((prev) => {
            if (prev.length <= 1) {
                toast.error('至少保留 1 位协作成员')
                return prev
            }
            return prev.filter((item) => item !== member)
        })
    }, [])

    const handleAddComment = useCallback((author, rawText) => {
        if (!activeCard) return false
        const text = typeof rawText === 'string' ? rawText.trim() : ''
        if (!text) return false
        const safeAuthor = members.includes(author) ? author : (members[0] || '我')
        const nextComment = {
            id: createUniqueId('comment'),
            cardId: Number(activeCard.id),
            author: safeAuthor,
            text,
            resolved: false,
            createdAt: Date.now(),
        }
        setComments((prev) => [nextComment, ...prev].slice(0, 2000))
        return true
    }, [activeCard, members])

    const handleToggleCommentResolved = useCallback((commentId) => {
        setComments((prev) =>
            prev.map((item) =>
                item.id === commentId ? { ...item, resolved: !item.resolved } : item,
            ),
        )
    }, [])

    const handleDeleteComment = useCallback((commentId) => {
        setComments((prev) => prev.filter((item) => item.id !== commentId))
    }, [])

    const handleSaveAsTemplate = useCallback((rawName) => {
        if (!activeCard) return false
        const fallbackName = activeCard.name || `模板 ${customTemplates.length + 1}`
        const name = (rawName || fallbackName).trim()
        if (!name) return false
        const nextTemplate = {
            id: createUniqueId('template'),
            name: name.slice(0, 120),
            createdAt: Date.now(),
            card: serializeCard(activeCard),
        }
        setCustomTemplates((prev) => [nextTemplate, ...prev].slice(0, MAX_TEMPLATE_ENTRIES))
        toast.success('模板已保存')
        return true
    }, [activeCard, customTemplates.length])

    const handleApplyTemplateToCurrent = useCallback((templateId) => {
        const target = customTemplates.find((item) => item.id === templateId)
        if (!target?.card) return
        const card = target.card
        updateActiveCard({
            markdown: card.markdown || getDefaultMarkdown(),
            theme: resolveTheme(card.theme),
            mdStyle: resolveMdStyle(card.mdStyle),
            shadow: card.shadow || 'soft',
            templateId: target.id,
            config: {
                ...DEFAULT_CARD_CONFIG,
                ...(card.config || {}),
            },
        })
        toast.success('模板已应用到当前卡片')
    }, [customTemplates, updateActiveCard])

    const handleInsertTemplateAsCard = useCallback((templateId) => {
        const target = customTemplates.find((item) => item.id === templateId)
        if (!target?.card) return
        cardIdCounterRef.current++
        const nextCard = createCard({
            id: cardIdCounterRef.current,
            name: target.card.name || '',
            markdown: target.card.markdown || '',
            theme: target.card.theme,
            mdStyle: target.card.mdStyle,
            shadow: target.card.shadow,
            templateId: target.id,
            config: target.card.config || {},
        })
        setCards((prev) => {
            const insertAt = Math.min(activeIndex + 1, prev.length)
            const nextCards = [
                ...prev.slice(0, insertAt),
                nextCard,
                ...prev.slice(insertAt),
            ]
            setActiveIndex(insertAt)
            return nextCards
        })
        toast.success('模板已插入为新卡片')
    }, [activeIndex, customTemplates])

    const handleDeleteTemplate = useCallback((templateId) => {
        setCustomTemplates((prev) => prev.filter((item) => item.id !== templateId))
    }, [])

    const handleResetWorkspace = useCallback(() => {
        const confirmed = window.confirm(t('topBar.resetWorkspaceConfirm'))
        if (!confirmed) return
        const freshWorkspace = createDefaultWorkspace()
        applyWorkspaceSnapshot(freshWorkspace)
        setCurrentProjectId(null)
        setShareLinks({ view: '', edit: '' })
        setIsEditing(false)
        setIsWorkspaceHubOpen(false)
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(WORKSPACE_STORAGE_KEY)
        }
        toast.success(t('toast.workspaceReset'))
    }, [applyWorkspaceSnapshot, t])

    /* ------------------------------ RENDER ------------------------------ */

    /* 编辑浮层打开时，支持全局 ESC 并锁定页面滚动，避免背景误滚动 */
    useEffect(() => {
        if (!isEditing) return undefined
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsEditing(false)
            }
        }
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)
        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [isEditing])

    /* 全局快捷键：Cmd/Ctrl + S 导出，Cmd/Ctrl + Shift + S 复制，Cmd/Ctrl + E 开关编辑器 */
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.defaultPrevented) return
            if (!(event.metaKey || event.ctrlKey)) return

            const key = event.key.toLowerCase()
            if (key === 'z' && !event.altKey) {
                if (isEditableTarget(event.target)) return
                event.preventDefault()
                if (event.shiftKey) {
                    handleRedo()
                } else {
                    handleUndo()
                }
                return
            }
            if (key === 'y' && !event.shiftKey && !event.altKey) {
                if (isEditableTarget(event.target)) return
                event.preventDefault()
                handleRedo()
                return
            }
            if (key === 's') {
                event.preventDefault()
                if (event.shiftKey) {
                    void handleCopy()
                } else {
                    void handleDownload()
                }
                return
            }
            if (key === 'e' && !event.shiftKey && !event.altKey) {
                event.preventDefault()
                setIsEditing((prev) => !prev)
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [handleCopy, handleDownload, handleRedo, handleUndo])

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
                currentTheme={activeTheme}
                onThemeChange={handleThemeChange}
                currentShadow={activeShadow}
                onShadowChange={handleShadowChange}
                onApplyTemplate={handleApplyTemplate}
                activeTemplateId={activeTemplateId}
            />

            {/* ========================= MAIN AREA ========================= */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TopBar */}
                <TopBar
                    cardName={activeCardName}
                    onCardNameChange={setCardName}
                    currentStyle={activeStyle}
                    onStyleChange={handleStyleChange}
                    onUndo={handleUndo}
                    canUndo={canUndo}
                    onRedo={handleRedo}
                    canRedo={canRedo}
                    onOpenWorkspaceHub={() => setIsWorkspaceHubOpen(true)}
                    pendingComments={unresolvedCommentsCount}
                    onDuplicateCard={duplicateActiveCard}
                    onResetWorkspace={handleResetWorkspace}
                    onDownloadAll={handleDownloadAll}
                    onDownload={handleDownload}
                    onCopy={handleCopy}
                    copied={copied}
                    isExporting={isExporting}
                />

                {/* Card Canvas */}
                <div
                    ref={canvasRef}
                    className="flex-1 overflow-auto bg-[#101010]"
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
                                    markdown={activeMarkdown}
                                    theme={activeTheme}
                                    markdownStyle={activeStyle.id}
                                    padding={activeConfig.padding}
                                    borderRadius={activeConfig.borderRadius}
                                    cardWidth={activeConfig.width}
                                    cardHeight={activeConfig.height}
                                    shadowId={activeShadow}
                                    watermark={activeConfig.watermark}
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
                        <div className="flex items-center justify-center gap-3 mt-2.5">
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

                        {/* Card Sort Strip */}
                        {cards.length > 1 && (
                            <div className="flex flex-col items-center gap-2 mt-2 mb-4 w-full">
                                <span className="text-[10px] text-white/18">
                                    {t('editor.dragToSort')}
                                </span>
                                <div className="flex flex-wrap justify-center gap-1.5 max-w-[560px]">
                                    {cards.map((card, index) => {
                                        const isActive = index === activeIndex
                                        const isDragging = index === draggingIndex
                                        const isDragOver = index === dragOverIndex && draggingIndex !== null
                                        return (
                                            <button
                                                key={card.id}
                                                type="button"
                                                draggable
                                                data-sort-item-index={index}
                                                onClick={() => {
                                                    if (suppressCardSelectRef.current) {
                                                        suppressCardSelectRef.current = false
                                                        return
                                                    }
                                                    setActiveIndex(index)
                                                }}
                                                onDragStart={(event) => handleCardDragStart(index, event)}
                                                onDragOver={(event) => handleCardDragOver(index, event)}
                                                onDrop={(event) => handleCardDrop(index, event)}
                                                onDragEnd={handleCardDragEnd}
                                                onPointerDown={(event) => handleSortItemPointerDown(index, event)}
                                                onPointerMove={handleSortItemPointerMove}
                                                onPointerUp={handleSortItemPointerUp}
                                                onPointerCancel={handleSortItemPointerCancel}
                                                aria-label={t('editor.cardSortItem', { number: index + 1 })}
                                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] max-w-[150px] ${
                                                    isActive
                                                        ? 'bg-indigo-500/18 border-indigo-400/35 text-indigo-200'
                                                        : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white/72 hover:bg-white/[0.05]'
                                                } ${
                                                    isDragging ? 'opacity-45' : ''
                                                } ${
                                                    isDragOver ? 'ring-1 ring-indigo-400/55' : ''
                                                } touch-none`}
                                            >
                                                <GripVertical className="h-3 w-3 shrink-0 text-white/35" strokeWidth={1.6} />
                                                <span className="font-mono shrink-0">{index + 1}</span>
                                                <span className="truncate">
                                                    {(card.name || t('topBar.cardNamePlaceholder')).trim()}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ========================= PROPERTIES PANEL ========================= */}
            <PropertiesPanel
                cardConfig={{ ...activeConfig, syncAll }}
                onConfigChange={handleConfigChange}
                currentTheme={activeTheme}
                onThemeChange={handleThemeChange}
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
                                    {t('editor.chars', { count: activeMarkdown.length })}
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
                            value={activeMarkdown}
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

            {/* ========================= WORKSPACE HUB ========================= */}
            <WorkspaceHub
                open={isWorkspaceHubOpen}
                onClose={() => setIsWorkspaceHubOpen(false)}
                activeCardLabel={activeCardLabel}
                shareLinks={shareLinks}
                onGenerateShareLinks={handleGenerateShareLinks}
                onSaveCurrentProject={handleSaveCurrentProject}
                currentProjectId={currentProjectId}
                projectName={projectName}
                onProjectNameChange={setProjectName}
                projects={projects}
                onLoadProject={handleLoadProject}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={handleDeleteProject}
                members={members}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                comments={activeCardComments}
                onAddComment={handleAddComment}
                onToggleCommentResolved={handleToggleCommentResolved}
                onDeleteComment={handleDeleteComment}
                templates={customTemplates}
                onSaveAsTemplate={handleSaveAsTemplate}
                onApplyTemplateToCurrent={handleApplyTemplateToCurrent}
                onInsertTemplateAsCard={handleInsertTemplateAsCard}
                onDeleteTemplate={handleDeleteTemplate}
            />

            {/* ========================= TOAST ========================= */}
            <Toaster position="bottom-center" richColors theme="dark" />
        </div>
    )
}

export default App

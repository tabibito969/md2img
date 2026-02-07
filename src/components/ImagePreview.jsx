/**
 * ============================================================================
 * [INPUT]: 接收 markdown、theme、padding、borderRadius、cardWidth、
 *          markdownStyle、shadowStyle、watermark props
 *          依赖 react-markdown + remark-gfm 渲染 Markdown
 *          依赖 react-syntax-highlighter 代码高亮
 * [OUTPUT]: 对外提供 ImagePreview 组件（forwardRef 默认导出）
 * [POS]: 卡片预览，ref 指向的 DOM 即为导出内容
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { forwardRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { shadowPresets } from '@/config/shadows'

/* ========================================================================== */
/*                              IMAGE PREVIEW                                  */
/* ========================================================================== */

const isRelativeUrl = (value) => {
    if (value.startsWith('//')) return false
    return !/^[a-z][a-z0-9+.-]*:/i.test(value)
}

const getSafeHref = (href) => {
    if (!href) return null
    const value = href.trim()
    if (isRelativeUrl(value)) return value
    if (value.startsWith('mailto:')) return value
    try {
        const url = new URL(value)
        if (url.protocol === 'http:' || url.protocol === 'https:') return value
    } catch {
        return null
    }
    return null
}

const getSafeImageSrc = (src) => {
    if (!src) return null
    const value = src.trim()
    if (value.startsWith('data:image/')) return value
    if (value.startsWith('blob:')) return value
    if (isRelativeUrl(value)) return value
    return null
}

/* ---------- 根据 markdownStyle + variant 计算容器 CSS 类名 ---------- */
const getBodyClassName = (styleId, isDark) => {
    switch (styleId) {
        case 'github':
            return 'markdown-body'
        case 'emerald':
            return 'md-emerald'
        case 'classic':
            return 'md-classic'
        case 'prose':
        default:
            return [
                'prose prose-lg max-w-none',
                isDark ? 'prose-invert' : 'prose-slate',
            ].join(' ')
    }
}

const ImagePreview = forwardRef(function ImagePreview(
    {
        markdown,
        theme,
        padding = 33,
        borderRadius = 15,
        cardWidth = 540,
        cardHeight = 0,
        markdownStyle = 'prose',
        shadowId = 'soft',
        watermark = false,
    },
    ref,
) {
    const { t } = useTranslation()
    const isDark = theme.variant === 'dark'
    const watermarkLabel = t('watermark.text', { defaultValue: 'markdown2imge' })

    /* ---------- Resolve shadow ---------- */
    const resolvedShadow = shadowPresets.find((s) => s.id === shadowId)

    /* ---------- 根据主题明暗动态切换代码高亮风格 ---------- */
    const markdownComponents = useMemo(
        () => ({
            code({ children, className }) {
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                    <SyntaxHighlighter
                        style={isDark ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                            margin: 0,
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                        }}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                ) : (
                    <code className={className}>{children}</code>
                )
            },
            a({ href, children }) {
                const safeHref = getSafeHref(href)
                if (!safeHref) {
                    return (
                        <span className="md-link-blocked">{children}</span>
                    )
                }
                const isExternal =
                    !isRelativeUrl(safeHref) && !safeHref.startsWith('mailto:')
                return (
                    <a
                        href={safeHref}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                    >
                        {children}
                    </a>
                )
            },
            img({ src, alt }) {
                const safeSrc = getSafeImageSrc(src)
                if (!safeSrc) {
                    return (
                        <div className="md-img-blocked">
                            {t('editor.externalImageBlocked')}
                            {alt ? `：${alt}` : ''}
                        </div>
                    )
                }
                return <img src={safeSrc} alt={alt || ''} loading="lazy" />
            },
        }),
        [isDark, t],
    )

    const bodyClassName = getBodyClassName(markdownStyle, isDark)

    /* ---------- Build outer style ---------- */
    const outerStyle = {
        background: theme.background,
        padding: `${padding}px`,
        width: cardWidth || 540,
        position: 'relative',
        overflow: 'hidden',
    }
    if (cardHeight > 0) {
        outerStyle.height = `${cardHeight}px`
    }

    return (
        <div ref={ref} style={outerStyle}>
            {/* Card */}
            <div
                className={`preview-card ${isDark ? 'variant-dark' : 'variant-light'}`}
                style={{
                    borderRadius: `${borderRadius}px`,
                    boxShadow: resolvedShadow?.boxShadow || 'none',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div className={bodyClassName}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {markdown}
                    </ReactMarkdown>
                </div>
                {watermark && (
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            right: '14px',
                            bottom: '12px',
                            fontSize: '10px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: isDark
                                ? 'rgba(255, 255, 255, 0.45)'
                                : 'rgba(0, 0, 0, 0.38)',
                            pointerEvents: 'none',
                            userSelect: 'none',
                        }}
                    >
                        {watermarkLabel}
                    </div>
                )}
            </div>
        </div>
    )
})

export default ImagePreview

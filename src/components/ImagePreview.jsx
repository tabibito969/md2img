/**
 * ============================================================================
 * [INPUT]: 接收 markdown、theme、padding props
 *          依赖 react-markdown + remark-gfm 渲染 Markdown
 *          依赖 react-syntax-highlighter 代码高亮
 * [OUTPUT]: 对外提供 ImagePreview 组件（forwardRef 默认导出）
 * [POS]: 右侧图片预览面板，ref 指向的 DOM 即为导出内容
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { forwardRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

/* ========================================================================== */
/*                          MARKDOWN COMPONENT MAP                            */
/* ========================================================================== */

const markdownComponents = {
    code(props) {
        const { children, className, ...rest } = props
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
            <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                }}
                {...rest}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code className={className} {...rest}>
                {children}
            </code>
        )
    },
}

/* ========================================================================== */
/*                              IMAGE PREVIEW                                 */
/* ========================================================================== */

const ImagePreview = forwardRef(function ImagePreview(
    { markdown, theme, padding = 48 },
    ref,
) {
    const isDark = theme.variant === 'dark'

    return (
        <div
            ref={ref}
            style={{
                background: theme.background,
                padding: `${padding}px`,
                width: 680,
            }}
        >
            <div
                className={`preview-card ${isDark ? 'dark' : 'light'}`}
            >
                <div className={`markdown-body ${isDark ? 'dark' : ''}`}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {markdown}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
})

export default ImagePreview

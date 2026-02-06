/**
 * ============================================================================
 * [OUTPUT]: 对外提供 markdownStyles 数组、defaultStyleId
 * [POS]: Markdown CSS 样式配置，定义可选的排版风格
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */

export const markdownStyles = [
    {
        id: 'prose',
        name: 'Prose',
        description: 'Tailwind Typography 排版',
    },
    {
        id: 'github',
        name: 'GitHub',
        description: 'GitHub 风格',
    },
    {
        id: 'emerald',
        name: 'Emerald',
        description: '翡翠暗色风格，绿色强调',
    },
    {
        id: 'classic',
        name: 'Classic',
        description: '经典自定义风格',
    },
]

export const defaultStyleId = 'prose'

/**
 * ============================================================================
 * [OUTPUT]: 对外提供 themes 数组、defaultThemeId
 * [POS]: 主题配置，定义所有可选的导出图片背景主题
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */

export const themes = [
    {
        id: 'ocean',
        name: 'Ocean',
        dot: 'linear-gradient(135deg, #38bdf8, #6366f1)',
        background: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 25%, #3b82f6 55%, #6366f1 85%, #4f46e5 100%)',
        variant: 'light',
    },
    {
        id: 'sunset',
        name: 'Sunset',
        dot: 'linear-gradient(135deg, #fbbf24, #ef4444)',
        background: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 20%, #f97316 50%, #ef4444 80%, #dc2626 100%)',
        variant: 'light',
    },
    {
        id: 'lavender',
        name: 'Lavender',
        dot: 'linear-gradient(135deg, #c4b5fd, #7c3aed)',
        background: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 25%, #a78bfa 55%, #7c3aed 85%, #6d28d9 100%)',
        variant: 'light',
    },
    {
        id: 'forest',
        name: 'Forest',
        dot: 'linear-gradient(135deg, #34d399, #059669)',
        background: 'linear-gradient(135deg, #a7f3d0 0%, #34d399 25%, #10b981 55%, #059669 85%, #047857 100%)',
        variant: 'light',
    },
    {
        id: 'rose',
        name: 'Rose',
        dot: 'linear-gradient(135deg, #fda4af, #e11d48)',
        background: 'linear-gradient(135deg, #fecdd3 0%, #fda4af 25%, #fb7185 55%, #e11d48 85%, #be123c 100%)',
        variant: 'light',
    },
    {
        id: 'midnight',
        name: 'Midnight',
        dot: 'linear-gradient(135deg, #475569, #0f172a)',
        background: 'linear-gradient(135deg, #475569 0%, #334155 25%, #1e293b 55%, #0f172a 85%, #020617 100%)',
        variant: 'dark',
    },
    {
        id: 'clean',
        name: 'Clean',
        dot: '#e2e8f0',
        background: '#e2e8f0',
        variant: 'light',
    },
    {
        id: 'noir',
        name: 'Noir',
        dot: '#18181b',
        background: '#09090b',
        variant: 'dark',
    },
]

export const defaultThemeId = 'ocean'

/**
 * ============================================================================
 * [OUTPUT]: 对外提供 shadowPresets, overlayTextures 数组
 * [POS]: 阴影和纹理叠加预设配置
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */

export const shadowPresets = [
    {
        id: 'none',
        name: '无',
        boxShadow: 'none',
    },
    {
        id: 'soft',
        name: '柔和',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    {
        id: 'medium',
        name: '中等',
        boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.3), 0 8px 16px -4px rgba(0, 0, 0, 0.1)',
    },
    {
        id: 'hard',
        name: '硬边',
        boxShadow: '8px 8px 0 rgba(0, 0, 0, 0.2)',
    },
    {
        id: 'elevated',
        name: '悬浮',
        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.35), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
    },
    {
        id: 'glow-blue',
        name: '蓝光',
        boxShadow: '0 0 40px 8px rgba(59, 130, 246, 0.3), 0 0 80px 16px rgba(59, 130, 246, 0.1)',
    },
    {
        id: 'glow-purple',
        name: '紫光',
        boxShadow: '0 0 40px 8px rgba(139, 92, 246, 0.3), 0 0 80px 16px rgba(139, 92, 246, 0.1)',
    },
    {
        id: 'glow-pink',
        name: '粉光',
        boxShadow: '0 0 40px 8px rgba(236, 72, 153, 0.3), 0 0 80px 16px rgba(236, 72, 153, 0.1)',
    },
    {
        id: 'inset',
        name: '内嵌',
        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    {
        id: 'sharp',
        name: '锐利',
        boxShadow: '4px 4px 0 #000',
    },
    {
        id: 'retro',
        name: '复古',
        boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.15), 12px 12px 0 rgba(0, 0, 0, 0.08)',
    },
    {
        id: 'ambient',
        name: '环境光',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
    },
]

export const overlayTextures = [
    {
        id: 'none',
        name: '无',
        css: null,
        preview: 'transparent',
    },
    {
        id: 'diagonal-lines',
        name: '斜线',
        css: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
        preview: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 6px)',
    },
    {
        id: 'diagonal-lines-dense',
        name: '密斜线',
        css: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.04) 4px, rgba(255,255,255,0.04) 8px)',
        preview: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.2) 2px, rgba(255,255,255,0.2) 4px)',
    },
    {
        id: 'crosshatch',
        name: '交叉线',
        css: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
        preview: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 6px), repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 6px)',
    },
    {
        id: 'dots',
        name: '圆点',
        css: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        cssSize: '20px 20px',
        preview: 'radial-gradient(circle, rgba(255,255,255,0.2) 1.5px, transparent 1.5px)',
        previewSize: '8px 8px',
    },
    {
        id: 'dots-dense',
        name: '密圆点',
        css: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        cssSize: '10px 10px',
        preview: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
        previewSize: '5px 5px',
    },
    {
        id: 'grid',
        name: '网格',
        css: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        cssSize: '24px 24px',
        preview: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
        previewSize: '8px 8px',
    },
    {
        id: 'grid-dense',
        name: '密网格',
        css: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        cssSize: '12px 12px',
        preview: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
        previewSize: '5px 5px',
    },
    {
        id: 'horizontal-lines',
        name: '横线',
        css: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px)',
        preview: 'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,255,255,0.2) 6px, rgba(255,255,255,0.2) 7px)',
    },
    {
        id: 'vertical-lines',
        name: '竖线',
        css: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px)',
        preview: 'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.2) 6px, rgba(255,255,255,0.2) 7px)',
    },
    {
        id: 'zigzag',
        name: '锯齿',
        css: 'linear-gradient(135deg, rgba(255,255,255,0.04) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.04) 25%, transparent 25%), linear-gradient(315deg, rgba(255,255,255,0.04) 25%, transparent 25%), linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%)',
        cssSize: '40px 40px',
        preview: 'linear-gradient(135deg, rgba(255,255,255,0.15) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.15) 25%, transparent 25%), linear-gradient(315deg, rgba(255,255,255,0.15) 25%, transparent 25%), linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%)',
        previewSize: '12px 12px',
    },
    {
        id: 'noise-light',
        name: '浅噪点',
        css: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        preview: `url("data:image/svg+xml,%3Csvg viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
    },
]

export const defaultShadowId = 'soft'
export const defaultOverlayId = 'none'

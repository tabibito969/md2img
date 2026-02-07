/**
 * ============================================================================
 * [OUTPUT]: 对外提供 templates 数组
 * [POS]: 模板预设配置，每个模板是一组配置的组合
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */

export const templates = [
    {
        id: 'default',
        name: '默认',
        description: '经典渐变背景 + 圆角卡片',
        config: {
            theme: 'radiant-1',
            mdStyle: 'prose',
            padding: 33,
            borderRadius: 15,
            shadow: 'soft',
            overlay: 'none',
            width: 540,
        },
        preview: {
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            cardBg: '#ffffff',
            textColor: '#1a1a2e',
        },
    },
    {
        id: 'transparent',
        name: '透明',
        description: '淡色背景 + 半透明卡片',
        config: {
            theme: 'solid-1',
            mdStyle: 'prose',
            padding: 33,
            borderRadius: 15,
            shadow: 'ambient',
            overlay: 'none',
            width: 540,
        },
        preview: {
            background: '#f8f9fa',
            cardBg: '#ffffff',
            textColor: '#1a1a2e',
        },
    },
    {
        id: 'quote',
        name: '金句',
        description: '温暖渐变 + 大字引言',
        config: {
            theme: 'radiant-5',
            mdStyle: 'classic',
            padding: 40,
            borderRadius: 20,
            shadow: 'elevated',
            overlay: 'none',
            width: 540,
        },
        preview: {
            background: 'linear-gradient(135deg, #fa709a, #fee140)',
            cardBg: '#ffffff',
            textColor: '#1a1a2e',
        },
    },
    {
        id: 'excerpt',
        name: '书摘',
        description: '淡雅风格 + 优雅排版',
        config: {
            theme: 'radiant-11',
            mdStyle: 'prose',
            padding: 36,
            borderRadius: 12,
            shadow: 'soft',
            overlay: 'none',
            width: 540,
        },
        preview: {
            background: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
            cardBg: '#ffffff',
            textColor: '#1a1a2e',
        },
    },
    {
        id: 'memo',
        name: '备忘录',
        description: '简洁白底 + GitHub 排版',
        config: {
            theme: 'solid-2',
            mdStyle: 'github',
            padding: 24,
            borderRadius: 10,
            shadow: 'medium',
            overlay: 'none',
            width: 540,
        },
        preview: {
            background: '#e2e8f0',
            cardBg: '#ffffff',
            textColor: '#1a1a2e',
        },
    },
    {
        id: 'bento',
        name: '便当',
        description: '鲜艳渐变 + 紧凑布局',
        config: {
            theme: 'radiant-9',
            mdStyle: 'classic',
            padding: 20,
            borderRadius: 16,
            shadow: 'hard',
            overlay: 'none',
            width: 540,
        },
        preview: {
            background: 'linear-gradient(135deg, #f6d365, #fda085)',
            cardBg: '#ffffff',
            textColor: '#1a1a2e',
        },
    },
    {
        id: 'noir',
        name: '黑日',
        description: '暗黑风格 + 翡翠排版',
        config: {
            theme: 'dark-1',
            mdStyle: 'emerald',
            padding: 33,
            borderRadius: 15,
            shadow: 'glow-purple',
            overlay: 'noise-light',
            width: 540,
        },
        preview: {
            background: 'linear-gradient(135deg, #0c0c1d, #1a1a3e)',
            cardBg: '#1e293b',
            textColor: '#e2e8f0',
        },
    },
    {
        id: 'frame',
        name: '框界',
        description: '网格纹理 + 方正布局',
        config: {
            theme: 'dark-3',
            mdStyle: 'classic',
            padding: 28,
            borderRadius: 8,
            shadow: 'sharp',
            overlay: 'grid',
            width: 540,
        },
        preview: {
            background: 'linear-gradient(135deg, #232526, #414345)',
            cardBg: '#1e293b',
            textColor: '#e2e8f0',
        },
    },
    {
        id: 'minimal',
        name: '简约',
        description: '极简白底 + 无阴影',
        config: {
            theme: 'solid-1',
            mdStyle: 'prose',
            padding: 40,
            borderRadius: 0,
            shadow: 'none',
            overlay: 'none',
            width: 540,
        },
        preview: {
            background: '#f8f9fa',
            cardBg: '#ffffff',
            textColor: '#1a1a2e',
        },
    },
    {
        id: 'story',
        name: '故事',
        description: '粉色渐变 + 柔和圆角',
        config: {
            theme: 'radiant-7',
            mdStyle: 'prose',
            padding: 36,
            borderRadius: 24,
            shadow: 'elevated',
            overlay: 'none',
            width: 540,
        },
        preview: {
            background: 'linear-gradient(135deg, #ff9a9e, #fecfef, #fdfcfb)',
            cardBg: '#ffffff',
            textColor: '#1a1a2e',
        },
    },
]

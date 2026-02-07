/**
 * ============================================================================
 * [OUTPUT]: 对外提供 themes 数组、backgroundCategories、defaultThemeId
 * [POS]: 主题配置，定义所有可选的导出图片背景主题，按分类组织
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */

/* ========================================================================== */
/*                            FLAT THEMES LIST                                 */
/* ========================================================================== */

export const themes = [
    /* ---- Radiant Gradients ---- */
    { id: 'radiant-1', name: '晨曦', dot: 'linear-gradient(135deg, #667eea, #764ba2)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', variant: 'dark' },
    { id: 'radiant-2', name: '暖阳', dot: 'linear-gradient(135deg, #f093fb, #f5576c)', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', variant: 'light' },
    { id: 'radiant-3', name: '翡翠', dot: 'linear-gradient(135deg, #4facfe, #00f2fe)', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', variant: 'light' },
    { id: 'radiant-4', name: '极光', dot: 'linear-gradient(135deg, #43e97b, #38f9d7)', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', variant: 'light' },
    { id: 'radiant-5', name: '落日', dot: 'linear-gradient(135deg, #fa709a, #fee140)', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', variant: 'light' },
    { id: 'radiant-6', name: '星河', dot: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', variant: 'light' },
    { id: 'radiant-7', name: '烈焰', dot: 'linear-gradient(135deg, #ff9a9e, #fecfef)', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fdfcfb 100%)', variant: 'light' },
    { id: 'radiant-8', name: '深海', dot: 'linear-gradient(135deg, #667eea, #4facfe)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 30%, #4facfe 70%, #00f2fe 100%)', variant: 'dark' },
    { id: 'radiant-9', name: '琥珀', dot: 'linear-gradient(135deg, #f6d365, #fda085)', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', variant: 'light' },
    { id: 'radiant-10', name: '葡萄', dot: 'linear-gradient(135deg, #a8edea, #fed6e3)', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', variant: 'light' },
    { id: 'radiant-11', name: '薰衣草', dot: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', variant: 'light' },
    { id: 'radiant-12', name: '珊瑚', dot: 'linear-gradient(135deg, #ffecd2, #fcb69f)', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', variant: 'light' },

    /* ---- Nature / Multi-stop ---- */
    { id: 'nature-1', name: '日出', dot: 'linear-gradient(135deg, #ff758c, #ff7eb3)', background: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', variant: 'light' },
    { id: 'nature-2', name: '森林', dot: 'linear-gradient(135deg, #0ba360, #3cba92)', background: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)', variant: 'dark' },
    { id: 'nature-3', name: '雪山', dot: 'linear-gradient(135deg, #e6e9f0, #eef1f5)', background: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)', variant: 'light' },
    { id: 'nature-4', name: '沙漠', dot: 'linear-gradient(135deg, #f2994a, #f2c94c)', background: 'linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)', variant: 'light' },
    { id: 'nature-5', name: '冰川', dot: 'linear-gradient(135deg, #89f7fe, #66a6ff)', background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', variant: 'light' },
    { id: 'nature-6', name: '樱花', dot: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', variant: 'light' },

    /* ---- Dark / Moody ---- */
    { id: 'dark-1', name: '暗夜', dot: 'linear-gradient(135deg, #0c0c1d, #1a1a3e)', background: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #0c0c1d 100%)', variant: 'dark' },
    { id: 'dark-2', name: '熔岩', dot: 'linear-gradient(135deg, #f12711, #f5af19)', background: 'linear-gradient(135deg, #200122 0%, #6f0000 50%, #f12711 100%)', variant: 'dark' },
    { id: 'dark-3', name: '深渊', dot: 'linear-gradient(135deg, #232526, #414345)', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)', variant: 'dark' },
    { id: 'dark-4', name: '碳黑', dot: '#1a1a1a', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', variant: 'dark' },
    { id: 'dark-5', name: '星空', dot: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', variant: 'dark' },
    { id: 'dark-6', name: '午夜蓝', dot: 'linear-gradient(135deg, #141e30, #243b55)', background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)', variant: 'dark' },

    /* ---- Mesh / Complex ---- */
    { id: 'mesh-1', name: '极彩', dot: 'linear-gradient(135deg, #f953c6, #b91d73)', background: 'linear-gradient(45deg, #f953c6 0%, #b91d73 25%, #e91e63 50%, #ff5722 75%, #ff9800 100%)', variant: 'dark' },
    { id: 'mesh-2', name: '虹光', dot: 'linear-gradient(135deg, #7f7fd5, #86a8e7, #91eae4)', background: 'linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)', variant: 'light' },
    { id: 'mesh-3', name: '棉花糖', dot: 'linear-gradient(135deg, #ffecd2, #fcb69f, #ff9a9e)', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 30%, #ff9a9e 60%, #fecfef 100%)', variant: 'light' },
    { id: 'mesh-4', name: '银河', dot: 'linear-gradient(135deg, #8e2de2, #4a00e0)', background: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', variant: 'dark' },
    { id: 'mesh-5', name: '海盐', dot: 'linear-gradient(135deg, #4568dc, #b06ab3)', background: 'linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)', variant: 'dark' },
    { id: 'mesh-6', name: '朝霞', dot: 'linear-gradient(135deg, #ff6a88, #ff99ac)', background: 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 50%, #fcb69f 100%)', variant: 'light' },

    /* ---- Solid Colors ---- */
    { id: 'solid-1', name: '纯白', dot: '#f8f9fa', background: '#f8f9fa', variant: 'light' },
    { id: 'solid-2', name: '浅灰', dot: '#e2e8f0', background: '#e2e8f0', variant: 'light' },
    { id: 'solid-3', name: '纯黑', dot: '#09090b', background: '#09090b', variant: 'dark' },
    { id: 'solid-4', name: '深灰', dot: '#1e293b', background: '#1e293b', variant: 'dark' },
    { id: 'solid-5', name: '淡蓝', dot: '#dbeafe', background: '#dbeafe', variant: 'light' },
    { id: 'solid-6', name: '淡粉', dot: '#fce7f3', background: '#fce7f3', variant: 'light' },
    { id: 'solid-7', name: '淡绿', dot: '#dcfce7', background: '#dcfce7', variant: 'light' },
    { id: 'solid-8', name: '淡紫', dot: '#f3e8ff', background: '#f3e8ff', variant: 'light' },
    { id: 'solid-9', name: '暗紫', dot: '#2d1b69', background: '#2d1b69', variant: 'dark' },
    { id: 'solid-10', name: '暗红', dot: '#450a0a', background: '#450a0a', variant: 'dark' },
]

/* ========================================================================== */
/*                          CATEGORIZED BACKGROUNDS                            */
/* ========================================================================== */

export const backgroundCategories = [
    {
        name: '渐变',
        items: themes.filter((t) => t.id.startsWith('radiant-')),
    },
    {
        name: '自然',
        items: themes.filter((t) => t.id.startsWith('nature-')),
    },
    {
        name: '暗色',
        items: themes.filter((t) => t.id.startsWith('dark-')),
    },
    {
        name: '网格渐变',
        items: themes.filter((t) => t.id.startsWith('mesh-')),
    },
    {
        name: '纯色',
        items: themes.filter((t) => t.id.startsWith('solid-')),
    },
]

export const defaultThemeId = 'radiant-1'

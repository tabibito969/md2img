/**
 * ============================================================================
 * [INPUT]: 接收 activeTab + 各面板需要的 props
 * [OUTPUT]: 对外提供 ContentSidebar 组件（默认导出）
 * [POS]: 左侧内容侧栏，根据 activeTab 动态渲染对应面板
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import TemplatePanel from './TemplatePanel'
import BackgroundPanel from './BackgroundPanel'

export default function ContentSidebar({
    activeTab,
    // Background props
    currentTheme,
    onThemeChange,
    currentShadow,
    onShadowChange,
    currentOverlay,
    onOverlayChange,
    // Template props
    onApplyTemplate,
    activeTemplateId,
}) {
    return (
        <div className="flex flex-col w-[232px] h-full bg-gradient-to-b from-[#1a1a30] to-[#18182c] border-r border-white/[0.04] shrink-0 overflow-hidden">
            {activeTab === 'template' && (
                <TemplatePanel
                    onApplyTemplate={onApplyTemplate}
                    activeTemplateId={activeTemplateId}
                />
            )}
            {activeTab === 'background' && (
                <BackgroundPanel
                    currentTheme={currentTheme}
                    onThemeChange={onThemeChange}
                    currentShadow={currentShadow}
                    onShadowChange={onShadowChange}
                    currentOverlay={currentOverlay}
                    onOverlayChange={onOverlayChange}
                />
            )}
        </div>
    )
}

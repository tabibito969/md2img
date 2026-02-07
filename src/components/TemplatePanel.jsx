/**
 * ============================================================================
 * [INPUT]: 接收 onApplyTemplate, activeTemplateId props
 * [OUTPUT]: 对外提供 TemplatePanel 组件（默认导出）
 * [POS]: 模板选择面板，嵌入 ContentSidebar
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useState } from 'react'
import { templates } from '@/config/templates'

/* ---------- Template Thumbnail Preview ---------- */
function TemplateThumbnail({ template, isActive, onClick }) {
    const { preview } = template
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative w-full rounded-xl overflow-hidden transition-all duration-200 ${
                isActive
                    ? 'ring-[1.5px] ring-indigo-400/70 ring-offset-2 ring-offset-[#1a1a30] shadow-lg shadow-indigo-500/10'
                    : 'ring-1 ring-white/[0.06] hover:ring-white/[0.12] opacity-85 hover:opacity-100'
            }`}
            title={`${template.name} — ${template.description}`}
        >
            {/* Preview card */}
            <div
                className="aspect-[3/4] flex items-start justify-center pt-4 px-3"
                style={{ background: preview.background }}
            >
                <div
                    className="w-full rounded-md p-3 shadow-md"
                    style={{
                        backgroundColor: preview.cardBg,
                        color: preview.textColor,
                    }}
                >
                    {/* Mini content preview — refined proportions */}
                    <div className="space-y-[5px]">
                        <div
                            className="h-[5px] rounded-full w-[70%]"
                            style={{
                                backgroundColor: preview.textColor,
                                opacity: 0.6,
                            }}
                        />
                        <div className="h-1.5" />
                        <div
                            className="h-[3px] rounded-full w-full"
                            style={{
                                backgroundColor: preview.textColor,
                                opacity: 0.15,
                            }}
                        />
                        <div
                            className="h-[3px] rounded-full w-[90%]"
                            style={{
                                backgroundColor: preview.textColor,
                                opacity: 0.15,
                            }}
                        />
                        <div
                            className="h-[3px] rounded-full w-[60%]"
                            style={{
                                backgroundColor: preview.textColor,
                                opacity: 0.12,
                            }}
                        />
                        <div className="h-1" />
                        <div
                            className="h-[3px] rounded-full w-full"
                            style={{
                                backgroundColor: preview.textColor,
                                opacity: 0.12,
                            }}
                        />
                        <div
                            className="h-[3px] rounded-full w-[75%]"
                            style={{
                                backgroundColor: preview.textColor,
                                opacity: 0.1,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Label — frosted glass */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent pt-5 pb-1.5 px-2">
                <span className="text-[10px] font-medium text-white/90 tracking-wide">
                    {template.name}
                </span>
            </div>
        </button>
    )
}

export default function TemplatePanel({ onApplyTemplate, activeTemplateId }) {
    const [activeTab, setActiveTab] = useState('template')

    return (
        <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex items-center gap-0 px-1.5 pt-1.5 pb-0 shrink-0">
                {[
                    { id: 'template', label: '模板' },
                    { id: 'layout', label: '布局' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2.5 text-[13px] font-medium text-center transition-colors relative ${
                            activeTab === tab.id
                                ? 'text-white/90'
                                : 'text-white/35 hover:text-white/55'
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-indigo-400" />
                        )}
                    </button>
                ))}
            </div>
            <div className="h-px bg-white/[0.06]" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto sidebar-scroll p-2.5">
                {activeTab === 'template' && (
                    <div className="grid grid-cols-2 gap-2">
                        {templates.map((tpl) => (
                            <TemplateThumbnail
                                key={tpl.id}
                                template={tpl}
                                isActive={activeTemplateId === tpl.id}
                                onClick={() => onApplyTemplate(tpl.id, tpl.config)}
                            />
                        ))}
                    </div>
                )}
                {activeTab === 'layout' && (
                    <div className="text-xs text-white/25 text-center py-12">
                        布局选项即将推出
                    </div>
                )}
            </div>
        </div>
    )
}

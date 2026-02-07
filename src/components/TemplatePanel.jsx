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
            className={`group relative w-full rounded-lg overflow-hidden transition-all duration-200 ${
                isActive
                    ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#1c1c30]'
                    : 'hover:ring-1 hover:ring-white/20 opacity-80 hover:opacity-100'
            }`}
            title={`${template.name} — ${template.description}`}
        >
            {/* Preview card */}
            <div
                className="aspect-[4/5] flex items-center justify-center p-3"
                style={{ background: preview.background }}
            >
                <div
                    className="w-full rounded-md p-2.5 shadow-lg"
                    style={{
                        backgroundColor: preview.cardBg,
                        color: preview.textColor,
                    }}
                >
                    {/* Mini content preview */}
                    <div className="space-y-1.5">
                        <div
                            className="h-1.5 rounded-full w-3/4"
                            style={{
                                backgroundColor: preview.textColor,
                                opacity: 0.7,
                            }}
                        />
                        <div
                            className="h-1 rounded-full w-full"
                            style={{
                                backgroundColor: preview.textColor,
                                opacity: 0.2,
                            }}
                        />
                        <div
                            className="h-1 rounded-full w-5/6"
                            style={{
                                backgroundColor: preview.textColor,
                                opacity: 0.2,
                            }}
                        />
                        <div
                            className="h-1 rounded-full w-2/3"
                            style={{
                                backgroundColor: preview.textColor,
                                opacity: 0.2,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm px-2 py-1">
                <span className="text-[11px] text-white/80">
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
            <div className="flex items-center border-b border-white/[0.06] shrink-0">
                <button
                    type="button"
                    onClick={() => setActiveTab('template')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                        activeTab === 'template'
                            ? 'text-white/90 border-b-2 border-indigo-400'
                            : 'text-white/40 hover:text-white/60'
                    }`}
                >
                    模板
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('layout')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                        activeTab === 'layout'
                            ? 'text-white/90 border-b-2 border-indigo-400'
                            : 'text-white/40 hover:text-white/60'
                    }`}
                >
                    布局
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3">
                {activeTab === 'template' && (
                    <div className="grid grid-cols-2 gap-2">
                        {templates.map((tpl) => (
                            <TemplateThumbnail
                                key={tpl.id}
                                template={tpl}
                                isActive={activeTemplateId === tpl.id}
                                onClick={() => onApplyTemplate(tpl.config)}
                            />
                        ))}
                    </div>
                )}
                {activeTab === 'layout' && (
                    <div className="text-xs text-white/30 text-center py-8">
                        布局选项 — 即将推出
                    </div>
                )}
            </div>
        </div>
    )
}

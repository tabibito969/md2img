/**
 * ============================================================================
 * [INPUT]: 接收 onApplyTemplate, activeTemplateId props
 * [OUTPUT]: 对外提供 TemplatePanel 组件（默认导出）
 * [POS]: 模板选择面板，嵌入 ContentSidebar
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { templates } from '@/config/templates'

/* ---------- Template Thumbnail Preview ---------- */
function TemplateThumbnail({ template, isActive, onClick, t }) {
    const { preview } = template
    return (
        <div className="flex flex-col">
            <button
                type="button"
                onClick={onClick}
                className={`group relative w-full rounded-xl overflow-hidden transition-all duration-200 ${
                    isActive
                        ? 'ring-[1.5px] ring-indigo-400/70 ring-offset-2 ring-offset-[#1a1a30] shadow-lg shadow-indigo-500/10'
                        : 'ring-1 ring-white/[0.06] hover:ring-white/[0.12] opacity-85 hover:opacity-100'
                }`}
                title={`${t(`config.templateName.${template.id}`)} — ${t(`config.templateDesc.${template.id}`)}`}
            >
                {/* Preview card */}
                <div
                    className="aspect-square flex items-center justify-center p-3"
                    style={{ background: preview.background }}
                >
                    <div
                        className="w-full h-full rounded-md p-3 shadow-md overflow-hidden"
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
            </button>

            {/* Label */}
            <div className="mt-1.5 px-1.5 pb-1 flex justify-center">
                <span className="text-[10px] font-medium text-white/80 tracking-wide text-center">
                    {t(`config.templateName.${template.id}`)}
                </span>
            </div>
        </div>
    )
}

export default function TemplatePanel({ onApplyTemplate, activeTemplateId }) {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('template')

    return (
        <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex items-center gap-0 px-1.5 pt-1.5 pb-0 shrink-0">
                {[
                    { id: 'template', label: t('templatePanel.template') },
                    { id: 'layout', label: t('templatePanel.layout') },
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
                                t={t}
                            />
                        ))}
                    </div>
                )}
                {activeTab === 'layout' && (
                    <div className="text-xs text-white/25 text-center py-12">
                        {t('templatePanel.layoutComingSoon')}
                    </div>
                )}
            </div>
        </div>
    )
}

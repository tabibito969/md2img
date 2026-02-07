/**
 * ============================================================================
 * [INPUT]: 接收 cardConfig, onConfigChange, currentTheme props
 * [OUTPUT]: 对外提供 PropertiesPanel 组件（默认导出）
 * [POS]: 右侧属性面板，控制卡片尺寸/内边距/圆角/水印等
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useState } from 'react'
import { Info, Minus, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/* ---------- Section Header ---------- */
function SectionLabel({ children, info }) {
    return (
        <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-[11px] text-white/35 font-medium tracking-wide">
                {children}
            </span>
            {info && <Info className="h-3 w-3 text-white/15" strokeWidth={1.5} />}
        </div>
    )
}

/* ---------- Number Input with +/- buttons ---------- */
function NumberInput({ label, value, onChange, min = 0, max = 200, step = 1, unit = 'px' }) {
    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center flex-1 bg-white/[0.04] rounded-lg border border-white/[0.04] overflow-hidden h-8">
                <span className="px-2 text-[11px] text-white/30 w-7 text-center shrink-0">
                    {label}
                </span>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const v = parseInt(e.target.value) || 0
                        onChange(Math.max(min, Math.min(max, v)))
                    }}
                    className="flex-1 bg-transparent text-white/75 text-[12px] py-1 px-0.5 outline-none text-center w-10 font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[10px] text-white/20 pr-1.5 shrink-0">{unit}</span>
            </div>
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - step))}
                className="p-1 text-white/20 hover:text-white/50 hover:bg-white/[0.04] rounded-md h-8 w-6 flex items-center justify-center"
            >
                <Minus className="h-3 w-3" strokeWidth={1.5} />
            </button>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + step))}
                className="p-1 text-white/20 hover:text-white/50 hover:bg-white/[0.04] rounded-md h-8 w-6 flex items-center justify-center"
            >
                <Plus className="h-3 w-3" strokeWidth={1.5} />
            </button>
        </div>
    )
}

/* ---------- Toggle Switch ---------- */
function ToggleSwitch({ checked, onChange }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative w-8 h-[18px] rounded-full transition-colors duration-200 ${
                checked ? 'bg-indigo-500' : 'bg-white/[0.10]'
            }`}
        >
            <span
                className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    checked ? 'translate-x-[14px]' : 'translate-x-0'
                }`}
            />
        </button>
    )
}

/* ---------- Aspect Ratio Presets ---------- */
const aspectRatios = [
    { labelKey: 'properties.adaptive', label: '自适应', value: 'auto' },
    { label: '1:1', value: '1:1' },
    { label: '3:4', value: '3:4' },
    { label: '4:3', value: '4:3' },
    { label: '9:16', value: '9:16' },
    { label: '16:9', value: '16:9' },
]

const resolveAspectRatio = (width, height) => {
    if (height === 0) return 'auto'
    const match = aspectRatios.find((ar) => {
        if (ar.value === 'auto') return false
        const [w, h] = ar.value.split(':').map(Number)
        return height === Math.round(width * (h / w))
    })
    return match ? match.value : 'auto'
}

export default function PropertiesPanel({ cardConfig, onConfigChange, currentTheme }) {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('properties')
    const activeAspectRatio = resolveAspectRatio(
        cardConfig.width,
        cardConfig.height,
    )

    const updateConfig = (key, value) => {
        onConfigChange((prev) => ({ ...prev, [key]: value }))
    }

    const handleAspectRatioChange = (ratio) => {
        if (ratio === 'auto') {
            updateConfig('height', 0)
        } else {
            const [w, h] = ratio.split(':').map(Number)
            if (w && h) {
                updateConfig('height', Math.round(cardConfig.width * (h / w)))
            }
        }
    }

    return (
        <div className="flex flex-col w-[268px] h-full bg-gradient-to-b from-[#1a1a30] to-[#18182c] border-l border-white/[0.04] shrink-0 overflow-hidden">
            {/* Header Tabs */}
            <div className="flex items-center gap-0 px-1.5 pt-1.5 pb-0 shrink-0">
                {[
                    { id: 'properties', label: t('properties.properties') },
                    { id: 'visibility', label: t('properties.visibility') },
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
            <div className="flex-1 overflow-y-auto sidebar-scroll">
                {activeTab === 'properties' && (
                    <div className="p-4 space-y-4">
                        {/* Sync All Cards */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] text-white/60">{t('properties.syncAll')}</span>
                                <Info className="h-3 w-3 text-white/15" strokeWidth={1.5} />
                            </div>
                            <ToggleSwitch
                                checked={cardConfig.syncAll}
                                onChange={(v) => updateConfig('syncAll', v)}
                                aria-label="同步所有卡片"
                            />
                        </div>

                        {/* Watermark */}
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] text-white/60">{t('properties.watermark')}</span>
                            <ToggleSwitch
                                checked={cardConfig.watermark}
                                onChange={(v) => updateConfig('watermark', v)}
                                aria-label="水印"
                            />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/[0.04]" />

                        {/* Template Section */}
                        <div>
                            <h3 className="text-[12px] text-white/60 font-medium mb-3">{t('properties.template')}</h3>

                            {/* Template Size */}
                            <div className="mb-3.5">
                                <SectionLabel info>{t('properties.templateSize')}</SectionLabel>
                                <div className="grid grid-cols-2 gap-2">
                                    <NumberInput
                                        label="W"
                                        value={cardConfig.width}
                                        onChange={(v) => updateConfig('width', v)}
                                        min={200}
                                        max={1200}
                                        step={10}
                                    />
                                    <NumberInput
                                        label="H"
                                        value={cardConfig.height}
                                        onChange={(v) => updateConfig('height', v)}
                                        min={0}
                                        max={2000}
                                        step={10}
                                    />
                                </div>
                            </div>

                            {/* Background Color Display */}
                            <div className="mb-3.5">
                                <SectionLabel info>{t('properties.bgColor')}</SectionLabel>
                                <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.04] rounded-lg px-3 py-2 h-8">
                                    <span
                                        className="w-4 h-4 rounded-full shrink-0 ring-1 ring-white/10"
                                        style={{ background: currentTheme.dot }}
                                    />
                                    <span className="text-[12px] text-white/50 truncate">
                                        {t(`config.theme.${currentTheme.id}`, currentTheme.name)}
                                    </span>
                                </div>
                            </div>

                            {/* Aspect Ratio */}
                            <div className="mb-3.5">
                                <SectionLabel>{t('properties.aspectRatio')}</SectionLabel>
                                <div className="grid grid-cols-3 gap-1">
                                    {aspectRatios.map((ar) => (
                                        <button
                                            key={ar.value}
                                            type="button"
                                            onClick={() => handleAspectRatioChange(ar.value)}
                                            className={`py-[5px] text-[11px] rounded-md ${
                                                activeAspectRatio === ar.value
                                                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                                                    : 'bg-white/[0.03] text-white/35 hover:text-white/55 border border-white/[0.04] hover:border-white/[0.08]'
                                            }`}
                                        >
                                            {ar.labelKey ? t(ar.labelKey) : ar.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/[0.04]" />

                        {/* Container Section */}
                        <div>
                            <h3 className="text-[12px] text-white/60 font-medium mb-3">{t('properties.container')}</h3>

                            {/* Padding */}
                            <div className="mb-3.5">
                                <SectionLabel>{t('properties.padding')}</SectionLabel>
                                <NumberInput
                                    label="↔"
                                    value={cardConfig.padding}
                                    onChange={(v) => updateConfig('padding', v)}
                                    min={0}
                                    max={100}
                                />
                            </div>

                            {/* Border Radius */}
                            <div className="mb-3.5">
                                <SectionLabel>{t('properties.borderRadius')}</SectionLabel>
                                <NumberInput
                                    label="⌒"
                                    value={cardConfig.borderRadius}
                                    onChange={(v) => updateConfig('borderRadius', v)}
                                    min={0}
                                    max={50}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'visibility' && (
                    <div className="p-4 text-[12px] text-white/25 text-center py-12">
                        {t('properties.visibilityComingSoon')}
                    </div>
                )}
            </div>
        </div>
    )
}

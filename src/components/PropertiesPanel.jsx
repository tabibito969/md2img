/**
 * ============================================================================
 * [INPUT]: 接收 cardConfig, onConfigChange, currentTheme, currentStyle,
 *          onStyleChange props
 * [OUTPUT]: 对外提供 PropertiesPanel 组件（默认导出）
 * [POS]: 右侧属性面板，控制卡片尺寸/内边距/圆角/水印等
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useState } from 'react'
import { Info, Minus, Plus } from 'lucide-react'

/* ---------- Number Input with +/- buttons ---------- */
function NumberInput({ label, value, onChange, min = 0, max = 200, step = 1, unit = 'px' }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center flex-1 bg-white/[0.06] rounded-lg overflow-hidden">
                <span className="px-2 text-xs text-white/40 w-8 text-center shrink-0">
                    {label}
                </span>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const v = parseInt(e.target.value) || 0
                        onChange(Math.max(min, Math.min(max, v)))
                    }}
                    className="flex-1 bg-transparent text-white/80 text-sm py-1.5 px-1 outline-none text-center w-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs text-white/30 pr-2 shrink-0">{unit}</span>
            </div>
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - step))}
                className="p-1 text-white/30 hover:text-white/60 hover:bg-white/[0.06] rounded transition-colors"
            >
                <Minus className="h-3 w-3" />
            </button>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + step))}
                className="p-1 text-white/30 hover:text-white/60 hover:bg-white/[0.06] rounded transition-colors"
            >
                <Plus className="h-3 w-3" />
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
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                checked ? 'bg-indigo-500' : 'bg-white/[0.12]'
            }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    checked ? 'translate-x-4' : 'translate-x-0'
                }`}
            />
        </button>
    )
}

/* ---------- Aspect Ratio Presets ---------- */
const aspectRatios = [
    { label: '自适应', value: 'auto' },
    { label: '1:1', value: '1:1' },
    { label: '3:4', value: '3:4' },
    { label: '4:3', value: '4:3' },
    { label: '9:16', value: '9:16' },
    { label: '16:9', value: '16:9' },
]

export default function PropertiesPanel({ cardConfig, onConfigChange, currentTheme }) {
    const [activeTab, setActiveTab] = useState('properties')
    const [aspectRatio, setAspectRatio] = useState('auto')

    const updateConfig = (key, value) => {
        onConfigChange((prev) => ({ ...prev, [key]: value }))
    }

    const handleAspectRatioChange = (ratio) => {
        setAspectRatio(ratio)
        if (ratio === 'auto') {
            updateConfig('height', 0)
        } else {
            const [w, h] = ratio.split(':').map(Number)
            updateConfig('height', Math.round(cardConfig.width * (h / w)))
        }
    }

    return (
        <div className="flex flex-col w-[280px] h-full bg-[#1c1c30] border-l border-white/[0.06] shrink-0 overflow-hidden">
            {/* Header Tabs */}
            <div className="flex items-center border-b border-white/[0.06] shrink-0">
                <button
                    type="button"
                    onClick={() => setActiveTab('properties')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                        activeTab === 'properties'
                            ? 'text-white/90 border-b-2 border-indigo-400'
                            : 'text-white/40 hover:text-white/60'
                    }`}
                >
                    属性
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('visibility')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                        activeTab === 'visibility'
                            ? 'text-white/90 border-b-2 border-indigo-400'
                            : 'text-white/40 hover:text-white/60'
                    }`}
                >
                    显示隐藏
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'properties' && (
                    <div className="p-4 space-y-5">
                        {/* Sync All Cards */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm text-white/70">同步所有卡片</span>
                                <Info className="h-3 w-3 text-white/30" />
                            </div>
                            <ToggleSwitch
                                checked={cardConfig.syncAll}
                                onChange={(v) => updateConfig('syncAll', v)}
                            />
                        </div>

                        {/* Watermark */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm text-white/70">水印</span>
                            </div>
                            <ToggleSwitch
                                checked={cardConfig.watermark}
                                onChange={(v) => updateConfig('watermark', v)}
                            />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/[0.06]" />

                        {/* Template Section */}
                        <div>
                            <h3 className="text-sm text-white/70 mb-3">模板</h3>

                            {/* Template Size */}
                            <div className="mb-3">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <span className="text-xs text-white/40">模板尺寸</span>
                                    <Info className="h-3 w-3 text-white/20" />
                                </div>
                                <div className="flex gap-2">
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
                            <div className="mb-3">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <span className="text-xs text-white/40">背景色</span>
                                    <Info className="h-3 w-3 text-white/20" />
                                </div>
                                <div className="flex items-center gap-2 bg-white/[0.06] rounded-lg px-3 py-2">
                                    <span
                                        className="w-5 h-5 rounded-full shrink-0"
                                        style={{ background: currentTheme.dot }}
                                    />
                                    <span className="text-sm text-white/60 truncate">
                                        {currentTheme.id}
                                    </span>
                                </div>
                            </div>

                            {/* Aspect Ratio */}
                            <div className="mb-3">
                                <span className="text-xs text-white/40 mb-2 block">尺寸比例</span>
                                <div className="grid grid-cols-3 gap-1">
                                    {aspectRatios.map((ar) => (
                                        <button
                                            key={ar.value}
                                            type="button"
                                            onClick={() => handleAspectRatioChange(ar.value)}
                                            className={`py-1.5 text-xs rounded-md transition-colors ${
                                                aspectRatio === ar.value
                                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                                    : 'bg-white/[0.06] text-white/40 hover:text-white/60 border border-transparent'
                                            }`}
                                        >
                                            {ar.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/[0.06]" />

                        {/* Container Section */}
                        <div>
                            <h3 className="text-sm text-white/70 mb-3">容器</h3>

                            {/* Padding */}
                            <div className="mb-3">
                                <span className="text-xs text-white/40 mb-2 block">内边距</span>
                                <NumberInput
                                    label="↔"
                                    value={cardConfig.padding}
                                    onChange={(v) => updateConfig('padding', v)}
                                    min={0}
                                    max={100}
                                />
                            </div>

                            {/* Border Radius */}
                            <div className="mb-3">
                                <span className="text-xs text-white/40 mb-2 block">圆角半径</span>
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
                    <div className="p-4 text-xs text-white/30">
                        显示隐藏设置 — 即将推出
                    </div>
                )}
            </div>
        </div>
    )
}

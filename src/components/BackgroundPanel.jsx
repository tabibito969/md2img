/**
 * ============================================================================
 * [INPUT]: 接收 currentTheme, onThemeChange, currentShadow, onShadowChange,
 *          currentOverlay, onOverlayChange props
 * [OUTPUT]: 对外提供 BackgroundPanel 组件（默认导出）
 * [POS]: 背景选择面板，含颜色和阴影两个 Tab
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { backgroundCategories } from '@/config/themes'
import ShadowPanel from './ShadowPanel'

export default function BackgroundPanel({
    currentTheme,
    onThemeChange,
    currentShadow,
    onShadowChange,
    currentOverlay,
    onOverlayChange,
}) {
    const [activeTab, setActiveTab] = useState('color')
    const [customBackgrounds, setCustomBackgrounds] = useState([])
    const fileInputRef = useRef(null)

    /* ---------- Upload handler ---------- */
    const handleUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const dataUrl = ev.target.result
            const customTheme = {
                id: `custom-${Date.now()}`,
                name: file.name,
                dot: dataUrl,
                background: `url(${dataUrl}) center/cover no-repeat`,
                variant: 'light',
                isImage: true,
            }
            setCustomBackgrounds((prev) => [...prev, customTheme])
            onThemeChange(customTheme)
        }
        reader.onerror = () => {
            console.error('背景图片读取失败')
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    return (
        <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex items-center gap-0 px-1.5 pt-1.5 pb-0 shrink-0">
                {[
                    { id: 'color', label: '颜色' },
                    { id: 'shadow', label: '阴影' },
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
                {activeTab === 'color' && (
                    <div className="p-2.5">
                        {/* Upload Button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 py-2 mb-3 border border-dashed border-white/10 rounded-lg text-[12px] text-white/30 hover:text-white/60 hover:border-white/25 hover:bg-white/[0.02]"
                        >
                            <Upload className="h-3.5 w-3.5" strokeWidth={1.5} />
                            上传背景
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                        />

                        {/* Custom Uploaded Backgrounds */}
                        {customBackgrounds.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-[11px] text-white/30 mb-2 font-medium tracking-wide">
                                    自定义
                                </h4>
                                <div className="grid grid-cols-5 gap-1.5">
                                    {customBackgrounds.map((bg) => (
                                        <button
                                            key={bg.id}
                                            type="button"
                                            onClick={() => onThemeChange(bg)}
                                            className={`aspect-square rounded-[8px] overflow-hidden transition-all duration-150 ${
                                                currentTheme.id === bg.id
                                                    ? 'ring-[1.5px] ring-indigo-400/70 ring-offset-1 ring-offset-[#1a1a30] scale-105'
                                                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                                            }`}
                                            title={bg.name}
                                        >
                                            <div
                                                className="w-full h-full"
                                                style={{
                                                    background: bg.isImage
                                                        ? `url(${bg.dot}) center/cover`
                                                        : bg.dot,
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Categorized Backgrounds */}
                        {backgroundCategories.map((category) => (
                            <div key={category.name} className="mb-4">
                                <h4 className="text-[11px] text-white/30 mb-2 font-medium tracking-wide">
                                    {category.name}
                                </h4>
                                <div className="grid grid-cols-5 gap-1.5">
                                    {category.items.map((bg) => (
                                        <button
                                            key={bg.id}
                                            type="button"
                                            onClick={() => onThemeChange(bg)}
                                            className={`aspect-square rounded-[8px] transition-all duration-150 ${
                                                currentTheme.id === bg.id
                                                    ? 'ring-[1.5px] ring-indigo-400/70 ring-offset-1 ring-offset-[#1a1a30] scale-105'
                                                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                                            }`}
                                            style={{ background: bg.dot }}
                                            title={bg.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'shadow' && (
                    <ShadowPanel
                        currentShadow={currentShadow}
                        onShadowChange={onShadowChange}
                        currentOverlay={currentOverlay}
                        onOverlayChange={onOverlayChange}
                    />
                )}
            </div>
        </div>
    )
}

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
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    return (
        <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="flex items-center border-b border-white/[0.06] shrink-0">
                <button
                    type="button"
                    onClick={() => setActiveTab('color')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                        activeTab === 'color'
                            ? 'text-white/90 border-b-2 border-indigo-400'
                            : 'text-white/40 hover:text-white/60'
                    }`}
                >
                    颜色
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('shadow')}
                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                        activeTab === 'shadow'
                            ? 'text-white/90 border-b-2 border-indigo-400'
                            : 'text-white/40 hover:text-white/60'
                    }`}
                >
                    阴影
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'color' && (
                    <div className="p-3">
                        {/* Upload Button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 py-2 mb-4 border border-dashed border-white/20 rounded-lg text-sm text-white/40 hover:text-white/70 hover:border-white/40 transition-colors"
                        >
                            <Upload className="h-4 w-4" />
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
                                <h4 className="text-xs text-white/40 mb-2 font-medium">
                                    自定义
                                </h4>
                                <div className="grid grid-cols-5 gap-2">
                                    {customBackgrounds.map((bg) => (
                                        <button
                                            key={bg.id}
                                            type="button"
                                            onClick={() => onThemeChange(bg)}
                                            className={`aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                                                currentTheme.id === bg.id
                                                    ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#1c1c30] scale-105'
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
                                <h4 className="text-xs text-white/40 mb-2 font-medium">
                                    {category.name}
                                </h4>
                                <div className="grid grid-cols-5 gap-2">
                                    {category.items.map((bg) => (
                                        <button
                                            key={bg.id}
                                            type="button"
                                            onClick={() => onThemeChange(bg)}
                                            className={`aspect-square rounded-lg transition-all duration-200 ${
                                                currentTheme.id === bg.id
                                                    ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#1c1c30] scale-105'
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

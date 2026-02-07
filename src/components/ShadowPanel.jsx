/**
 * ============================================================================
 * [INPUT]: 接收 currentShadow, onShadowChange, currentOverlay, onOverlayChange
 * [OUTPUT]: 对外提供 ShadowPanel 组件（默认导出）
 * [POS]: 阴影选择面板，含 box-shadow 和纹理叠加
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { shadowPresets, overlayTextures } from '@/config/shadows'

export default function ShadowPanel({
    currentShadow,
    onShadowChange,
    currentOverlay,
    onOverlayChange,
}) {
    return (
        <div className="p-3">
            {/* Shadow Presets */}
            <div className="mb-5">
                <h4 className="text-xs text-white/40 mb-2 font-medium">
                    选择阴影
                </h4>
                <div className="grid grid-cols-4 gap-2">
                    {shadowPresets.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => onShadowChange(preset.id)}
                            className={`group relative aspect-square rounded-lg bg-[#252540] flex items-center justify-center transition-all duration-200 ${
                                currentShadow === preset.id
                                    ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#1c1c30]'
                                    : 'hover:bg-[#2a2a48] opacity-80 hover:opacity-100'
                            }`}
                            title={preset.name}
                        >
                            {/* Shadow preview: a small white card with the shadow applied */}
                            <div
                                className="w-7 h-7 bg-white/90 rounded"
                                style={{
                                    boxShadow:
                                        preset.id === 'none'
                                            ? 'none'
                                            : preset.boxShadow,
                                }}
                            />
                            <span className="absolute bottom-0.5 left-0 right-0 text-[9px] text-white/30 text-center truncate px-0.5">
                                {preset.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Overlay Textures */}
            <div>
                <h4 className="text-xs text-white/40 mb-2 font-medium">
                    选择阴影
                </h4>
                <div className="grid grid-cols-4 gap-2">
                    {overlayTextures.map((texture) => (
                        <button
                            key={texture.id}
                            type="button"
                            onClick={() => onOverlayChange(texture.id)}
                            className={`group relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                                currentOverlay === texture.id
                                    ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#1c1c30]'
                                    : 'opacity-80 hover:opacity-100'
                            }`}
                            title={texture.name}
                        >
                            <div
                                className="w-full h-full bg-[#252540]"
                                style={{
                                    backgroundImage: texture.preview || 'none',
                                    backgroundSize:
                                        texture.previewSize || 'auto',
                                }}
                            />
                            <span className="absolute bottom-0.5 left-0 right-0 text-[9px] text-white/30 text-center truncate px-0.5">
                                {texture.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

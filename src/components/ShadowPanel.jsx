/**
 * ============================================================================
 * [INPUT]: 接收 currentShadow, onShadowChange, currentOverlay, onOverlayChange
 * [OUTPUT]: 对外提供 ShadowPanel 组件（默认导出）
 * [POS]: 阴影选择面板，含 box-shadow 和纹理叠加
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useTranslation } from 'react-i18next'
import { shadowPresets, overlayTextures } from '@/config/shadows'

export default function ShadowPanel({
    currentShadow,
    onShadowChange,
    currentOverlay,
    onOverlayChange,
}) {
    const { t } = useTranslation()

    return (
        <div className="p-2.5">
            {/* Shadow Presets */}
            <div className="mb-5">
                <h4 className="text-[11px] text-white/30 mb-2 font-medium tracking-wide">
                    {t('shadowPanel.selectShadow')}
                </h4>
                <div className="grid grid-cols-4 gap-1.5">
                    {shadowPresets.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => onShadowChange(preset.id)}
                            className={`group relative aspect-square rounded-lg bg-[#222240] flex items-center justify-center ${
                                currentShadow === preset.id
                                    ? 'ring-[1.5px] ring-indigo-400/70 ring-offset-1 ring-offset-[#1a1a30]'
                                    : 'ring-1 ring-white/[0.04] hover:ring-white/[0.1] opacity-80 hover:opacity-100'
                            }`}
                            title={t(`config.shadow.${preset.id}`)}
                        >
                            <div
                                className="w-6 h-6 bg-white/90 rounded-[4px]"
                                style={{
                                    boxShadow:
                                        preset.id === 'none'
                                            ? 'none'
                                            : preset.boxShadow,
                                }}
                            />
                            <span className="absolute bottom-[3px] left-0 right-0 text-[8px] text-white/25 text-center truncate px-0.5 leading-none">
                                {t(`config.shadow.${preset.id}`)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Overlay Textures */}
            <div>
                <h4 className="text-[11px] text-white/30 mb-2 font-medium tracking-wide">
                    {t('shadowPanel.overlayTexture')}
                </h4>
                <div className="grid grid-cols-4 gap-1.5">
                    {overlayTextures.map((texture) => (
                        <button
                            key={texture.id}
                            type="button"
                            onClick={() => onOverlayChange(texture.id)}
                            className={`group relative aspect-square rounded-lg overflow-hidden ${
                                currentOverlay === texture.id
                                    ? 'ring-[1.5px] ring-indigo-400/70 ring-offset-1 ring-offset-[#1a1a30]'
                                    : 'ring-1 ring-white/[0.04] hover:ring-white/[0.1] opacity-80 hover:opacity-100'
                            }`}
                            title={t(`config.overlay.${texture.id}`)}
                        >
                            <div
                                className="w-full h-full bg-[#222240]"
                                style={{
                                    backgroundImage: texture.preview || 'none',
                                    backgroundSize:
                                        texture.previewSize || 'auto',
                                }}
                            />
                            <span className="absolute bottom-[3px] left-0 right-0 text-[8px] text-white/25 text-center truncate px-0.5 leading-none">
                                {t(`config.overlay.${texture.id}`)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

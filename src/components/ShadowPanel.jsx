/**
 * ============================================================================
 * [INPUT]: 接收 currentShadow, onShadowChange
 * [OUTPUT]: 对外提供 ShadowPanel 组件（默认导出）
 * [POS]: 阴影选择面板
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useTranslation } from 'react-i18next'
import { shadowPresets } from '@/config/shadows'

export default function ShadowPanel({
    currentShadow,
    onShadowChange,
}) {
    const { t } = useTranslation()

    return (
        <div className="p-2.5">
            {/* Shadow Presets */}
            <div className="mb-5">
                <h4 className="text-[11px] text-white/30 mb-2 font-medium tracking-wide">
                    {t('shadowPanel.selectShadow')}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    {shadowPresets.map((preset) => (
                        <div key={preset.id} className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={() => onShadowChange(preset.id)}
                                className={`group relative aspect-square w-full rounded-lg border border-white/5 bg-[#101010] overflow-hidden flex items-center justify-center ${
                                    currentShadow === preset.id
                                        ? 'ring-[1.5px] ring-indigo-400/70 ring-offset-1 ring-offset-[#1a1a30]'
                                        : 'hover:ring-1 hover:ring-white/10 opacity-85 hover:opacity-100'
                                }`}
                                title={t(`config.shadow.${preset.id}`)}
                                aria-label={t(`config.shadow.${preset.id}`)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/6 to-transparent" />
                                <div
                                    className="relative w-9 h-9 rounded-[8px] bg-[#f5f5f5]"
                                    style={{
                                        boxShadow:
                                            preset.id === 'none'
                                                ? 'none'
                                                : preset.boxShadow,
                                    }}
                                />
                            </button>
                            <span className="mt-1 text-[10px] text-white/45 text-center">
                                {t(`config.shadow.${preset.id}`)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

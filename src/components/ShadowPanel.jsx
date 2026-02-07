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
                <div className="grid grid-cols-4 gap-2">
                    {shadowPresets.map((preset) => (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => onShadowChange(preset.id)}
                            className={`group relative aspect-square rounded-lg border border-black/10 ${
                                currentShadow === preset.id
                                    ? 'ring-[1.5px] ring-indigo-400/70 ring-offset-1 ring-offset-[#1a1a30]'
                                    : 'hover:ring-1 hover:ring-white/10 opacity-85 hover:opacity-100'
                            }`}
                            title={t(`config.shadow.${preset.id}`)}
                            aria-label={t(`config.shadow.${preset.id}`)}
                            style={{
                                background: '#f2f2f2',
                                boxShadow:
                                    preset.id === 'none' ? 'none' : preset.boxShadow,
                            }}
                        >
                            <span className="sr-only">
                                {t(`config.shadow.${preset.id}`)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

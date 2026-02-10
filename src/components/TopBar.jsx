/**
 * ============================================================================
 * [INPUT]: 接收卡片名称、导出、复制、样式切换等 props
 * [OUTPUT]: 对外提供 TopBar 组件（默认导出）
 * [POS]: 主区域顶栏，包含卡片名称 + 视图切换 + 导出按钮
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import {
    Download,
    Copy,
    Check,
    Loader2,
    Files,
    Share2,
    CopyPlus,
    Trash2,
    Undo2,
    Redo2,
    ChevronDown,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { markdownStyles } from '@/config/markdownStyles'

export default function TopBar({
    cardName,
    onCardNameChange,
    currentStyle,
    onStyleChange,
    onUndo,
    canUndo,
    onRedo,
    canRedo,
    onOpenWorkspaceHub,
    pendingComments = 0,
    onDuplicateCard,
    onResetWorkspace,
    onDownloadAll,
    onDownload,
    onCopy,
    copied,
    isExporting,
}) {
    const { t } = useTranslation()

    return (
        <div className="flex items-center px-3 h-[48px] border-b border-white/[0.04] bg-[#18181A] shrink-0 gap-3 overflow-hidden">
            {/* Left: Undo + Card Name */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
                <button
                    type="button"
                    onClick={onUndo}
                    disabled={!canUndo}
                    aria-label={t('topBar.undo')}
                    className="p-1.5 text-white/35 rounded-md shrink-0 hover:bg-white/[0.04] hover:text-white/65 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white/35"
                    title={t('topBar.undo')}
                >
                    <Undo2 className="h-[14px] w-[14px]" strokeWidth={1.5} />
                </button>
                <button
                    type="button"
                    onClick={onRedo}
                    disabled={!canRedo}
                    aria-label={t('topBar.redo')}
                    className="p-1.5 text-white/35 rounded-md shrink-0 hover:bg-white/[0.04] hover:text-white/65 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white/35"
                    title={t('topBar.redo')}
                >
                    <Redo2 className="h-[14px] w-[14px]" strokeWidth={1.5} />
                </button>
                <input
                    type="text"
                    value={cardName}
                    onChange={(e) => onCardNameChange(e.target.value)}
                    placeholder={t('topBar.cardNamePlaceholder')}
                    aria-label={t('topBar.cardName')}
                    className="bg-transparent text-white/55 text-[12px] placeholder:text-white/18 outline-none min-w-0 flex-1 max-w-[160px] border-b border-transparent focus:border-white/12 py-0.5"
                />
            </div>

            {/* Center: Style Selector */}
            <div className="flex items-center gap-[2px] bg-white/[0.04] rounded-lg p-[3px] shrink overflow-hidden">
                {markdownStyles.map((style) => (
                    <button
                        key={style.id}
                        type="button"
                        onClick={() => onStyleChange(style)}
                        title={t(`config.mdStyle.${style.id}`)}
                        aria-label={t('topBar.styleLabel', { name: style.name })}
                        className={`px-2.5 py-[4px] text-[11px] font-medium rounded-[5px] whitespace-nowrap ${
                            currentStyle.id === style.id
                                ? 'bg-white/[0.10] text-white/90 shadow-sm shadow-black/10'
                                : 'text-white/28 hover:text-white/55'
                        }`}
                    >
                        {style.name}
                    </button>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-0.5 shrink-0 whitespace-nowrap">
                <button
                    type="button"
                    onClick={onOpenWorkspaceHub}
                    aria-label={t('topBar.share')}
                    className="relative p-1.5 text-white/35 rounded-md hover:bg-white/[0.04] hover:text-white/70"
                    title={t('topBar.share')}
                >
                    <Share2 className="h-[14px] w-[14px]" strokeWidth={1.5} />
                    {pendingComments > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full px-1 bg-amber-500 text-[9px] leading-[14px] text-black font-semibold text-center">
                            {pendingComments > 9 ? '9+' : pendingComments}
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={onDuplicateCard}
                    aria-label={t('topBar.duplicateCard')}
                    className="p-1.5 text-white/35 rounded-md hover:bg-white/[0.04] hover:text-white/70"
                    title={t('topBar.duplicateCard')}
                >
                    <CopyPlus className="h-[14px] w-[14px]" strokeWidth={1.5} />
                </button>

                <button
                    type="button"
                    onClick={onCopy}
                    disabled={isExporting}
                    className="flex items-center gap-1 px-2 py-[5px] text-[11px] text-white/35 rounded-md hover:bg-white/[0.04] hover:text-white/65 disabled:opacity-30 disabled:pointer-events-none"
                    title={t('topBar.copy')}
                >
                    {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                        <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
                    )}
                    <span>{copied ? t('topBar.copied') : t('topBar.copy')}</span>
                </button>

                <button
                    type="button"
                    onClick={onResetWorkspace}
                    aria-label={t('topBar.resetWorkspace')}
                    className="p-1.5 text-red-300/40 rounded-md hover:bg-red-500/10 hover:text-red-300/75"
                    title={t('topBar.resetWorkspace')}
                >
                    <Trash2 className="h-[14px] w-[14px]" strokeWidth={1.5} />
                </button>

                <button
                    type="button"
                    onClick={onDownloadAll}
                    disabled={isExporting}
                    aria-label={t('topBar.exportAll')}
                    className="flex items-center gap-1 px-2 py-[5px] text-[11px] text-white/35 rounded-md hover:bg-white/[0.04] hover:text-white/65 disabled:opacity-30 disabled:pointer-events-none"
                    title={t('topBar.exportAll')}
                >
                    <Files className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <span>{t('topBar.exportAll')}</span>
                </button>

                <button
                    type="button"
                    onClick={onDownload}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-3 py-[5px] text-[11px] font-medium bg-indigo-500/90 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none shadow-sm shadow-indigo-500/20"
                >
                    {isExporting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                    )}
                    <span>{t('topBar.export')}</span>
                    <ChevronDown className="h-2.5 w-2.5 opacity-40 ml-0.5" />
                </button>
            </div>
        </div>
    )
}

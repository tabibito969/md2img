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
    Share2,
    Undo2,
    ChevronDown,
} from 'lucide-react'
import { markdownStyles } from '@/config/markdownStyles'

export default function TopBar({
    cardName,
    onCardNameChange,
    currentStyle,
    onStyleChange,
    onDownload,
    onCopy,
    copied,
    isExporting,
}) {
    return (
        <div className="flex items-center justify-between px-4 h-14 border-b border-white/[0.06] bg-[#1c1c30]/80 backdrop-blur-md shrink-0">
            {/* Left: Undo + Card Name */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="p-1.5 text-white/40 hover:text-white/70 rounded-md hover:bg-white/[0.06] transition-colors"
                    title="撤销"
                >
                    <Undo2 className="h-4 w-4" />
                </button>
                <input
                    type="text"
                    value={cardName}
                    onChange={(e) => onCardNameChange(e.target.value)}
                    placeholder="添加卡片名称"
                    className="bg-transparent text-white/70 text-sm placeholder:text-white/30 outline-none w-40 border-b border-transparent focus:border-white/20 transition-colors"
                />
            </div>

            {/* Center: Style Selector */}
            <div className="flex items-center gap-1 bg-white/[0.06] rounded-lg p-0.5">
                {markdownStyles.map((style) => (
                    <button
                        key={style.id}
                        type="button"
                        onClick={() => onStyleChange(style)}
                        title={style.description}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                            currentStyle.id === style.id
                                ? 'bg-white/[0.12] text-white shadow-sm'
                                : 'text-white/40 hover:text-white/70'
                        }`}
                    >
                        {style.name}
                    </button>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/50 rounded-lg hover:bg-white/[0.06] hover:text-white/80 transition-colors"
                    title="分享"
                >
                    <Share2 className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={onCopy}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/50 rounded-lg hover:bg-white/[0.06] hover:text-white/80 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    title="复制"
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                    <span>复制</span>
                </button>
                <button
                    type="button"
                    onClick={onDownload}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                    {isExporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    <span>导出</span>
                    <ChevronDown className="h-3 w-3 ml-0.5 opacity-60" />
                </button>
            </div>
        </div>
    )
}

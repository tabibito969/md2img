/**
 * ============================================================================
 * [INPUT]: 接收 currentTheme、onThemeChange、onDownload、onCopy、copied、
 *          isExporting props
 *          依赖 lucide-react 图标
 *          依赖 @/config/themes 主题列表
 * [OUTPUT]: 对外提供 Toolbar 组件（默认导出）
 * [POS]: 顶部工具栏，包含主题选择器和导出按钮
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { Download, Copy, Check, Sparkles, Loader2 } from 'lucide-react'
import { themes } from '@/config/themes'

export default function Toolbar({
    currentTheme,
    onThemeChange,
    onDownload,
    onCopy,
    copied,
    isExporting,
}) {
    return (
        <div className="flex items-center justify-between px-5 h-14 border-b border-border/40 bg-background/95 backdrop-blur-md shrink-0">
            {/* ========================= LOGO ========================= */}
            <div className="flex items-center gap-2 font-semibold text-foreground select-none">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm tracking-tight">Md2Img</span>
            </div>

            {/* ===================== THEME DOTS ===================== */}
            <div className="flex items-center gap-1.5">
                {themes.map((theme) => (
                    <button
                        key={theme.id}
                        type="button"
                        onClick={() => onThemeChange(theme)}
                        aria-label={`切换主题: ${theme.name}`}
                        className="group relative"
                    >
                        <span
                            className={`block h-6 w-6 rounded-full transition-all duration-200 ${
                                currentTheme.id === theme.id
                                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110'
                                    : 'hover:scale-110 opacity-70 hover:opacity-100'
                            }`}
                            style={{ background: theme.dot }}
                        />
                    </button>
                ))}
            </div>

            {/* ==================== ACTION BUTTONS ==================== */}
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={onCopy}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-foreground/70 rounded-lg hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                        {copied ? '已复制' : '复制'}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={onDownload}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
                >
                    {isExporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">下载</span>
                </button>
            </div>
        </div>
    )
}

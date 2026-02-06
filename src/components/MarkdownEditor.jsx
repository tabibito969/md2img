/**
 * ============================================================================
 * [INPUT]: 接收 value、onChange props
 * [OUTPUT]: 对外提供 MarkdownEditor 组件（默认导出）
 * [POS]: 左侧 Markdown 输入面板
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */

export default function MarkdownEditor({ value, onChange }) {
    return (
        <div className="flex flex-col h-full">
            {/* 面板标题栏 */}
            <div className="flex items-center px-4 h-10 border-b border-white/6 text-[11px] uppercase tracking-widest text-white/30 font-mono select-none">
                Markdown
            </div>

            {/* 编辑区 */}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 w-full resize-none bg-transparent p-5 text-[14px] text-white/85 font-mono leading-relaxed outline-none placeholder:text-white/20 selection:bg-blue-500/30"
                placeholder="在这里输入或粘贴 Markdown..."
                spellCheck={false}
                autoFocus
            />
        </div>
    )
}

/**
 * ============================================================================
 * [INPUT]: 接收 activeTab, onTabChange props
 * [OUTPUT]: 对外提供 IconSidebar 组件（默认导出）
 * [POS]: 最左侧图标导航栏，切换内容面板
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { LayoutTemplate, Image, Sparkles } from 'lucide-react'

const tabs = [
    { id: 'template', icon: LayoutTemplate, label: '模板' },
    { id: 'background', icon: Image, label: '背景' },
]

export default function IconSidebar({ activeTab, onTabChange }) {
    return (
        <div className="flex flex-col items-center w-[52px] h-full bg-gradient-to-b from-[#16162a] to-[#111122] border-r border-white/[0.04] shrink-0 select-none">
            {/* Logo */}
            <div className="flex items-center justify-center w-full h-[52px]" aria-hidden="true">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
            </div>

            {/* Divider */}
            <div className="w-6 h-px bg-white/[0.06] mb-2" />

            {/* Nav Icons */}
            <div className="flex flex-col items-center gap-0.5 w-full px-1.5" role="tablist" aria-label="侧栏导航">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onTabChange(tab.id)}
                            className="group relative flex flex-col items-center justify-center w-full py-2.5 rounded-lg"
                            title={tab.label}
                        >
                            {/* Active indicator - left bar */}
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-r-full bg-indigo-400" />
                            )}

                            <Icon
                                className={`h-[17px] w-[17px] transition-colors ${
                                    isActive
                                        ? 'text-white'
                                        : 'text-white/30 group-hover:text-white/60'
                                }`}
                                strokeWidth={isActive ? 2 : 1.5}
                            />
                            <span
                                className={`text-[9px] mt-1.5 leading-none tracking-wide transition-colors ${
                                    isActive
                                        ? 'text-white/80'
                                        : 'text-white/25 group-hover:text-white/50'
                                }`}
                            >
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

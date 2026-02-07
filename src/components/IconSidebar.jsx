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
        <div className="flex flex-col items-center w-[50px] h-full bg-[#141422] border-r border-white/[0.06] shrink-0">
            {/* Logo */}
            <div className="flex items-center justify-center w-full h-14 mb-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>

            {/* Nav Icons */}
            <div className="flex flex-col items-center gap-1 w-full px-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            className={`group flex flex-col items-center justify-center w-full py-2 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-white/[0.08] text-white'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                            }`}
                            title={tab.label}
                        >
                            <Icon className="h-[18px] w-[18px]" />
                            <span className="text-[10px] mt-1 leading-none">
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

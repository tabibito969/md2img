/**
 * ============================================================================
 * [INPUT]: 依赖 react-i18next
 * [OUTPUT]: 对外提供 LanguageSwitcher 组件（默认导出）
 * [POS]: 语言切换下拉组件，用于导航栏和编辑器侧栏
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const languages = [
    { code: 'zh-CN', flag: '🇨🇳' },
    { code: 'zh-TW', flag: '🇹🇼' },
    { code: 'en', flag: '🇺🇸' },
    { code: 'ja', flag: '🇯🇵' },
    { code: 'ko', flag: '🇰🇷' },
]

export default function LanguageSwitcher({ variant = 'dark' }) {
    const { i18n, t } = useTranslation()
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const currentLang = languages.find((l) => l.code === i18n.language) ?? languages[0]

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-1.5 rounded-lg transition-colors ${
                    variant === 'sidebar'
                        ? 'p-2 text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
                        : 'px-2.5 py-1.5 text-[12px] text-white/45 hover:text-white/80 hover:bg-white/[0.04] border border-white/[0.06]'
                }`}
                title={t(`langSwitcher.${currentLang.code}`)}
            >
                <Globe className={variant === 'sidebar' ? 'h-[17px] w-[17px]' : 'h-3.5 w-3.5'} strokeWidth={1.5} />
                {variant !== 'sidebar' && (
                    <span className="hidden sm:inline">{t(`langSwitcher.${currentLang.code}`)}</span>
                )}
            </button>

            {open && (
                <div className={`absolute z-[100] mt-1 py-1 rounded-xl border border-white/[0.08] bg-[#1e1e34]/95 backdrop-blur-xl shadow-2xl shadow-black/40 min-w-[150px] ${
                    variant === 'sidebar' ? 'left-full ml-2 top-0' : 'right-0 top-full'
                }`}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            type="button"
                            onClick={() => {
                                i18n.changeLanguage(lang.code)
                                setOpen(false)
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] transition-colors ${
                                i18n.language === lang.code
                                    ? 'text-indigo-300 bg-indigo-500/10'
                                    : 'text-white/55 hover:text-white/90 hover:bg-white/[0.04]'
                            }`}
                        >
                            <span className="text-[14px]">{lang.flag}</span>
                            <span>{t(`langSwitcher.${lang.code}`)}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

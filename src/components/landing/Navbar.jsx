import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Sparkles, Menu, X } from 'lucide-react'
import { motion as Motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getLocalePath } from '@/config/locales'
import LanguageSwitcher from '../LanguageSwitcher'

export default function Navbar({ localeSegment = 'en' }) {
    const { t } = useTranslation()
    const [mobileOpen, setMobileOpen] = useState(false)
    const { scrollY } = useScroll()
    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ['rgba(10,10,20,0)', 'rgba(10,10,20,0.92)'],
    )

    const navLinks = [
        { label: t('landing.navbar.features'), href: '#features' },
        { label: t('landing.navbar.testimonials'), href: '#testimonials' },
        { label: t('landing.navbar.showcase'), href: '#showcase' },
        { label: t('landing.navbar.faq'), href: '#faq' },
    ]

    /* Close mobile menu on resize */
    useEffect(() => {
        const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    return (
        <Motion.nav
            className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.04]"
            style={{ backgroundColor }}
        >
            <div className="backdrop-blur-xl">
                <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-5">
                    {/* Logo */}
                    <Link to={getLocalePath(localeSegment)} className="flex items-center gap-2 shrink-0">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-[15px] font-semibold tracking-tight text-white">Md2Img</span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-7">
                        {navLinks.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="text-[13px] text-white/45 hover:text-white/90 transition-colors"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA + Language Switcher */}
                    <div className="hidden md:flex items-center gap-3">
                        <LanguageSwitcher />
                        <Link
                            to="/app"
                            className="px-4 py-[6px] text-[13px] font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 shadow-sm shadow-indigo-500/25 transition-colors"
                        >
                            {t('landing.navbar.getStarted')}
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        className="md:hidden p-2 text-white/50 hover:text-white/80"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-white/[0.06] px-5 py-4 space-y-3">
                        {navLinks.map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="block text-sm text-white/60 hover:text-white/90"
                                onClick={() => setMobileOpen(false)}
                            >
                                {l.label}
                            </a>
                        ))}
                        <div className="py-2">
                            <LanguageSwitcher />
                        </div>
                        <Link
                            to="/app"
                            className="block text-center px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-lg"
                            onClick={() => setMobileOpen(false)}
                        >
                            {t('landing.navbar.getStarted')}
                        </Link>
                    </div>
                )}
            </div>
        </Motion.nav>
    )
}

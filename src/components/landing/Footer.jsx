import { Link } from 'react-router'
import { Sparkles } from 'lucide-react'
import { SiGithub, SiX } from 'react-icons/si'
import { useTranslation } from 'react-i18next'

export default function Footer() {
    const { t } = useTranslation()

    const footerLinks = {
        product: [
            { label: t('landing.footer.startCreating'), to: '/app' },
            { label: t('landing.footer.features'), href: '#features' },
            { label: t('landing.footer.faq'), href: '#faq' },
        ],
        social: [
            { label: 'GitHub', icon: SiGithub, href: 'https://github.com' },
            { label: 'Twitter/X', icon: SiX, href: 'https://x.com' },
        ],
    }

    return (
        <footer className="border-t border-white/[0.04] bg-[#08080f]">
            <div className="max-w-6xl mx-auto px-5 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-white">Md2Img</span>
                        </div>
                        <p className="text-[12px] text-white/30 leading-relaxed max-w-xs">
                            {t('landing.footer.desc')}
                        </p>
                    </div>

                    {/* Product links */}
                    <div>
                        <h4 className="text-[11px] text-white/40 font-medium tracking-wider uppercase mb-4">{t('landing.footer.product')}</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((l) =>
                                l.to ? (
                                    <li key={l.label}>
                                        <Link to={l.to} className="text-[13px] text-white/40 hover:text-white/70 transition-colors">
                                            {l.label}
                                        </Link>
                                    </li>
                                ) : (
                                    <li key={l.label}>
                                        <a href={l.href} className="text-[13px] text-white/40 hover:text-white/70 transition-colors">
                                            {l.label}
                                        </a>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-[11px] text-white/40 font-medium tracking-wider uppercase mb-4">{t('landing.footer.social')}</h4>
                        <div className="flex items-center gap-3">
                            {footerLinks.social.map((s) => {
                                const Icon = s.icon
                                return (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/35 hover:text-white/70 hover:bg-white/[0.08] transition-colors"
                                        title={s.label}
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-10 pt-6 border-t border-white/[0.04] text-center">
                    <p className="text-[11px] text-white/20">
                        {t('landing.footer.copyright', { year: new Date().getFullYear() })}
                    </p>
                </div>
            </div>
        </footer>
    )
}

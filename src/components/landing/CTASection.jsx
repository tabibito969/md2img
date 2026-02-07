import { Link } from 'react-router'
import { motion as Motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function CTASection() {
    const { t } = useTranslation()

    return (
        <section className="py-20 md:py-28 px-5 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[400px] bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/15 rounded-full blur-[120px]" />
            </div>

            <Motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative max-w-2xl mx-auto text-center"
            >
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                    {t('landing.cta.titlePre')}
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {t('landing.cta.titleHighlight')}
                    </span>
                    {t('landing.cta.titlePost')}
                </h2>
                <p className="mt-5 text-white/40 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                    {t('landing.cta.subtitle')}
                </p>
                <Link
                    to="/app"
                    className="inline-block mt-8 px-8 py-3 text-sm font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 transition-all"
                >
                    {t('landing.cta.button')}
                </Link>
            </Motion.div>
        </section>
    )
}

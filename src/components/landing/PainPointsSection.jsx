import { motion as Motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function PainPointsSection() {
    const { t } = useTranslation()

    const painPoints = [
        { num: '01', titleKey: 'landing.painPoints.p1Title', descKey: 'landing.painPoints.p1Desc' },
        { num: '02', titleKey: 'landing.painPoints.p2Title', descKey: 'landing.painPoints.p2Desc' },
        { num: '03', titleKey: 'landing.painPoints.p3Title', descKey: 'landing.painPoints.p3Desc' },
        { num: '04', titleKey: 'landing.painPoints.p4Title', descKey: 'landing.painPoints.p4Desc' },
    ]

    return (
        <section className="py-20 md:py-28 px-5">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <span className="text-[12px] text-indigo-400 font-medium tracking-wider uppercase">{t('landing.painPoints.label')}</span>
                    <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
                        {t('landing.painPoints.title')}
                    </h2>
                    <p className="mt-3 text-white/35 text-sm max-w-lg mx-auto">
                        {t('landing.painPoints.subtitle')}
                    </p>
                </Motion.div>

                {/* Cards grid */}
                <Motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {painPoints.map((p) => (
                        <Motion.div
                            key={p.num}
                            variants={item}
                            className="group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors"
                        >
                            <span className="text-3xl font-extrabold text-indigo-500/20 mb-3 block">
                                {p.num}
                            </span>
                            <h3 className="text-[15px] font-semibold text-white mb-2">{t(p.titleKey)}</h3>
                            <p className="text-[13px] text-white/35 leading-relaxed">{t(p.descKey)}</p>
                        </Motion.div>
                    ))}
                </Motion.div>
            </div>
        </section>
    )
}

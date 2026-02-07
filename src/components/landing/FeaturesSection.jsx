import { motion as Motion } from 'framer-motion'
import {
    FileText,
    Palette,
    Layers,
    LayoutTemplate,
    Copy,
    ImageDown,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const featureConfig = [
    { icon: FileText, titleKey: 'landing.features.f1Title', descKey: 'landing.features.f1Desc', color: 'from-blue-500 to-cyan-400' },
    { icon: Palette, titleKey: 'landing.features.f2Title', descKey: 'landing.features.f2Desc', color: 'from-purple-500 to-pink-400' },
    { icon: Layers, titleKey: 'landing.features.f3Title', descKey: 'landing.features.f3Desc', color: 'from-amber-500 to-orange-400' },
    { icon: LayoutTemplate, titleKey: 'landing.features.f4Title', descKey: 'landing.features.f4Desc', color: 'from-emerald-500 to-teal-400' },
    { icon: Copy, titleKey: 'landing.features.f5Title', descKey: 'landing.features.f5Desc', color: 'from-rose-500 to-red-400' },
    { icon: ImageDown, titleKey: 'landing.features.f6Title', descKey: 'landing.features.f6Desc', color: 'from-indigo-500 to-violet-400' },
]

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
}

const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function FeaturesSection() {
    const { t } = useTranslation()

    return (
        <section id="features" className="py-20 md:py-28 px-5">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <span className="text-[12px] text-indigo-400 font-medium tracking-wider uppercase">{t('landing.features.label')}</span>
                    <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
                        {t('landing.features.title')}
                    </h2>
                    <p className="mt-3 text-white/35 text-sm max-w-lg mx-auto">
                        {t('landing.features.subtitle')}
                    </p>
                </Motion.div>

                {/* Feature cards */}
                <Motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {featureConfig.map((f) => {
                        const Icon = f.icon
                        const title = t(f.titleKey)
                        return (
                            <Motion.div
                                key={f.titleKey}
                                variants={item}
                                className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                                </div>
                                <h3 className="text-[15px] font-semibold text-white mb-2">{title}</h3>
                                <p className="text-[13px] text-white/35 leading-relaxed">{t(f.descKey)}</p>
                            </Motion.div>
                        )
                    })}
                </Motion.div>
            </div>
        </section>
    )
}

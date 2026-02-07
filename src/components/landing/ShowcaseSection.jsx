import { motion as Motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

/* Showcase cards simulate different theme + style combos */
const showcaseCards = [
    { bg: 'linear-gradient(135deg, #667eea, #764ba2)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #f093fb, #f5576c)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #43e97b, #38f9d7)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #fa709a, #fee140)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', text: '#e2e8f0' },
    { bg: 'linear-gradient(135deg, #232526, #414345)', text: '#e2e8f0' },
    { bg: 'linear-gradient(135deg, #ff9a9e, #fecfef, #fdfcfb)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #f6d365, #fda085)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)', text: '#1a1a2e' },
    { bg: '#09090b', text: '#e2e8f0' },
]

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
}

const item = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

function MiniCard({ card }) {
    const isDark = card.text !== '#1a1a2e'
    return (
        <div
            className="aspect-[3/4] rounded-xl overflow-hidden p-3 flex items-center justify-center shadow-lg"
            style={{ background: card.bg }}
        >
            <div
                className="w-full rounded-lg p-3 space-y-1.5"
                style={{
                    backgroundColor: isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.92)',
                    color: card.text,
                }}
            >
                <div className="h-2 rounded-full w-3/4" style={{ backgroundColor: card.text, opacity: 0.5 }} />
                <div className="h-[3px] rounded-full w-full" style={{ backgroundColor: card.text, opacity: 0.15 }} />
                <div className="h-[3px] rounded-full w-5/6" style={{ backgroundColor: card.text, opacity: 0.15 }} />
                <div className="h-[3px] rounded-full w-2/3" style={{ backgroundColor: card.text, opacity: 0.12 }} />
                <div className="mt-2 h-6 rounded" style={{ backgroundColor: card.text, opacity: 0.06 }} />
            </div>
        </div>
    )
}

export default function ShowcaseSection() {
    const { t } = useTranslation()

    return (
        <section id="showcase" className="py-20 md:py-28 px-5">
            <div className="max-w-6xl mx-auto">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        {t('landing.showcase.title')}
                    </h2>
                    <p className="mt-3 text-white/35 text-sm">
                        {t('landing.showcase.subtitle')}
                    </p>
                </Motion.div>

                <Motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4"
                >
                    {showcaseCards.map((card, i) => (
                        <Motion.div key={i} variants={item}>
                            <MiniCard card={card} />
                        </Motion.div>
                    ))}
                </Motion.div>
            </div>
        </section>
    )
}

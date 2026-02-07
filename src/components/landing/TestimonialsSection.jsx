import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function TestimonialCard({ t: testimonial }) {
    return (
        <div className="shrink-0 w-[300px] p-5 rounded-2xl border border-white/6 bg-white/2">
            <p className="text-[13px] text-white/50 leading-relaxed mb-4">&ldquo;{testimonial.text}&rdquo;</p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500/40 to-purple-500/40 flex items-center justify-center text-[11px] font-bold text-white/70">
                    {testimonial.name[0]}
                </div>
                <div>
                    <div className="text-[12px] font-medium text-white/70">{testimonial.name}</div>
                    <div className="text-[11px] text-white/30">{testimonial.role}</div>
                </div>
            </div>
        </div>
    )
}

function ScrollRow({ items, direction = 'left', duration = 40, paused = false }) {
    const doubled = [...items, ...items]
    return (
        <div className="relative overflow-hidden">
            <div
                className="flex gap-4 py-2"
                style={{
                    animation: `scroll-${direction} ${duration}s linear infinite`,
                    width: 'max-content',
                    animationPlayState: paused ? 'paused' : 'running',
                }}
            >
                {doubled.map((t, i) => (
                    <TestimonialCard key={`${t.name}-${i}`} t={t} />
                ))}
            </div>
        </div>
    )
}

export default function TestimonialsSection() {
    const { t } = useTranslation()
    const [paused, setPaused] = useState(false)

    const row1 = t('landing.testimonials.row1', { returnObjects: true })
    const row2 = t('landing.testimonials.row2', { returnObjects: true })

    return (
        <section id="testimonials" className="py-20 md:py-28 overflow-hidden">
            {/* Header */}
            <Motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12 px-5"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {t('landing.testimonials.title')}
                </h2>
                <p className="mt-3 text-white/35 text-sm">
                    {t('landing.testimonials.subtitle')}
                </p>
            </Motion.div>

            {/* Scrolling rows - pause on hover */}
            <div
                className="space-y-4"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <ScrollRow items={row1} direction="left" duration={45} paused={paused} />
                <ScrollRow items={row2} direction="right" duration={50} paused={paused} />
            </div>

            {/* CSS keyframes injected inline */}
            <style>{`
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scroll-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
            `}</style>
        </section>
    )
}

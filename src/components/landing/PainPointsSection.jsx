import { motion } from 'framer-motion'

const painPoints = [
    {
        num: '01',
        title: '纯文字缺乏吸引力？',
        desc: '信息容易被忽略，需要更具视觉冲击力的表达方式来提升关注度与传播效率。',
    },
    {
        num: '02',
        title: '排版调整费时费力？',
        desc: '手动调整字体、间距、颜色非常繁琐，每次都要从零开始设计。',
    },
    {
        num: '03',
        title: '截图质量不稳定？',
        desc: '手动截图模糊、尺寸不统一，发到社交媒体上效果大打折扣。',
    },
    {
        num: '04',
        title: '没有统一的视觉风格？',
        desc: '每次做图风格不同，缺乏品牌一致性，影响专业形象。',
    },
]

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function PainPointsSection() {
    return (
        <section className="py-20 md:py-28 px-5">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <span className="text-[12px] text-indigo-400 font-medium tracking-wider uppercase">痛点解决</span>
                    <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
                        你是否遇到这些困扰？
                    </h2>
                    <p className="mt-3 text-white/35 text-sm max-w-lg mx-auto">
                        关注真实创作场景，我们提炼出最常见的阻碍，并提供即用即得的解决方案。
                    </p>
                </motion.div>

                {/* Cards grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {painPoints.map((p) => (
                        <motion.div
                            key={p.num}
                            variants={item}
                            className="group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors"
                        >
                            <span className="text-3xl font-extrabold text-indigo-500/20 mb-3 block">
                                {p.num}
                            </span>
                            <h3 className="text-[15px] font-semibold text-white mb-2">{p.title}</h3>
                            <p className="text-[13px] text-white/35 leading-relaxed">{p.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

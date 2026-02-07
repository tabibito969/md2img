import { motion } from 'framer-motion'
import {
    FileText,
    Palette,
    Layers,
    LayoutTemplate,
    Copy,
    ImageDown,
} from 'lucide-react'

const features = [
    {
        icon: FileText,
        title: 'Markdown 实时渲染',
        desc: '所见即所得，编辑与预览零距离，专注内容表达。',
        color: 'from-blue-500 to-cyan-400',
    },
    {
        icon: Palette,
        title: '40+ 背景主题',
        desc: '渐变、纯色、自定义图片，按分类快速浏览与选择。',
        color: 'from-purple-500 to-pink-400',
    },
    {
        icon: Layers,
        title: '阴影与纹理系统',
        desc: '12 种阴影预设 + 12 种纹理叠加，轻松打造高级质感。',
        color: 'from-amber-500 to-orange-400',
    },
    {
        icon: LayoutTemplate,
        title: '10+ 排版模板',
        desc: '金句、书摘、备忘录、黑日...一键切换预设风格。',
        color: 'from-emerald-500 to-teal-400',
    },
    {
        icon: Copy,
        title: '多卡片批量管理',
        desc: '添加、切换、删除多张卡片，像管理画板一样高效。',
        color: 'from-rose-500 to-red-400',
    },
    {
        icon: ImageDown,
        title: '一键高清导出',
        desc: '2x 分辨率 PNG 导出，或直接复制到剪贴板分享。',
        color: 'from-indigo-500 to-violet-400',
    },
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
    return (
        <section id="features" className="py-20 md:py-28 px-5">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <span className="text-[12px] text-indigo-400 font-medium tracking-wider uppercase">功能与特点</span>
                    <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
                        Md2Img 能为你做什么？
                    </h2>
                    <p className="mt-3 text-white/35 text-sm max-w-lg mx-auto">
                        从内容创作到分享发布，为你提供全方位支持。
                    </p>
                </motion.div>

                {/* Feature cards */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {features.map((f) => {
                        const Icon = f.icon
                        return (
                            <motion.div
                                key={f.title}
                                variants={item}
                                className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                                </div>
                                <h3 className="text-[15px] font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-[13px] text-white/35 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}

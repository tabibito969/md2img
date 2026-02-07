import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Eye, Palette, LayoutTemplate, ImageDown } from 'lucide-react'

const badges = [
    { icon: Eye, label: '实时预览', color: 'from-blue-500 to-cyan-400' },
    { icon: Palette, label: '40+ 背景', color: 'from-purple-500 to-pink-400' },
    { icon: LayoutTemplate, label: '模板系统', color: 'from-amber-500 to-orange-400' },
    { icon: ImageDown, label: '高清导出', color: 'from-emerald-500 to-teal-400' },
]

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
}

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
            {/* Glow background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-500/15 via-purple-500/8 to-transparent rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-4xl mx-auto px-5 text-center">
                {/* Tagline */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    variants={fadeUp}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-[12px] text-indigo-300 mb-6"
                >
                    为创作者与自媒体团队而设
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    variants={fadeUp}
                    className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
                >
                    <span className="text-white">用 </span>
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Md2Img
                    </span>
                    <br className="hidden sm:block" />
                    <span className="text-white"> 让你的文字一眼出彩</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    variants={fadeUp}
                    className="mt-5 text-base md:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed"
                >
                    将 Markdown 快速转为高质视觉卡片，40+ 渐变背景，10+ 排版模板，一键导出高清 PNG。
                </motion.p>

                {/* Badges */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={3}
                    variants={fadeUp}
                    className="flex flex-wrap justify-center gap-3 mt-8"
                >
                    {badges.map((b) => {
                        const Icon = b.icon
                        return (
                            <span
                                key={b.label}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[12px] text-white/60"
                            >
                                <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${b.color} flex items-center justify-center`}>
                                    <Icon className="h-2.5 w-2.5 text-white" strokeWidth={2} />
                                </span>
                                {b.label}
                            </span>
                        )
                    })}
                </motion.div>

                {/* CTA buttons */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={4}
                    variants={fadeUp}
                    className="flex flex-wrap justify-center gap-3 mt-9"
                >
                    <Link
                        to="/app"
                        className="px-6 py-2.5 text-sm font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 transition-all"
                    >
                        立即开始创作
                    </Link>
                    <a
                        href="#features"
                        className="px-6 py-2.5 text-sm font-medium text-white/60 rounded-xl border border-white/10 hover:bg-white/[0.04] hover:text-white/80 transition-all"
                    >
                        了解更多
                    </a>
                </motion.div>

                {/* Product screenshot mock */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-16 relative"
                >
                    {/* Glow behind screenshot */}
                    <div className="absolute -inset-4 bg-gradient-to-t from-indigo-500/10 via-purple-500/5 to-transparent rounded-3xl blur-2xl" />

                    <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#16162a] to-[#111120] p-1 shadow-2xl shadow-black/40 overflow-hidden">
                        {/* Fake toolbar */}
                        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
                            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                            <span className="ml-3 text-[10px] text-white/20 font-mono">Md2Img Editor</span>
                        </div>

                        {/* Screenshot content - stylized editor mock */}
                        <div className="flex h-[260px] md:h-[360px]">
                            {/* Left sidebar mock */}
                            <div className="w-10 shrink-0 bg-white/[0.02] border-r border-white/[0.04]" />
                            <div className="w-44 shrink-0 bg-white/[0.015] border-r border-white/[0.04] hidden md:block">
                                <div className="p-2 space-y-2">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="aspect-[3/4] rounded-lg bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.04]" />
                                    ))}
                                </div>
                            </div>
                            {/* Center - card preview mock */}
                            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#0e0e1a] to-[#0d0d18] p-6">
                                <div className="w-52 md:w-64 rounded-xl overflow-hidden shadow-xl">
                                    <div className="aspect-[3/4] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 flex items-center justify-center">
                                        <div className="w-full bg-white/95 rounded-lg p-4 space-y-2">
                                            <div className="h-3 bg-gray-800/60 rounded-full w-3/4" />
                                            <div className="h-1.5 bg-gray-800/20 rounded-full w-full" />
                                            <div className="h-1.5 bg-gray-800/20 rounded-full w-5/6" />
                                            <div className="h-1.5 bg-gray-800/20 rounded-full w-2/3" />
                                            <div className="mt-3 h-12 bg-gray-800/10 rounded-md" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Right panel mock */}
                            <div className="w-48 shrink-0 bg-white/[0.015] border-l border-white/[0.04] hidden lg:block">
                                <div className="p-3 space-y-3">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="h-7 rounded-md bg-white/[0.03]" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom text */}
                <motion.p
                    initial="hidden"
                    animate="visible"
                    custom={5}
                    variants={fadeUp}
                    className="mt-6 text-[12px] text-white/25"
                >
                    无需注册，免费使用
                </motion.p>
            </div>
        </section>
    )
}

import { Link } from 'react-router'
import { motion } from 'framer-motion'

export default function CTASection() {
    return (
        <section className="py-20 md:py-28 px-5 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[400px] bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/15 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative max-w-2xl mx-auto text-center"
            >
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                    一切准备就绪，
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        开始创作
                    </span>
                    {' '}吧！
                </h2>
                <p className="mt-5 text-white/40 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                    你已经发现了 Md2Img 的潜力，别再犹豫，立即动手制作你的第一张卡片，让创意成为现实！
                </p>
                <Link
                    to="/app"
                    className="inline-block mt-8 px-8 py-3 text-sm font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 shadow-lg shadow-indigo-500/25 transition-all"
                >
                    开始使用
                </Link>
            </motion.div>
        </section>
    )
}

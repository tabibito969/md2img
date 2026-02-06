/**
 * ============================================================================
 * [INPUT]: 依赖 @/components/ui/button 的设计系统组件
 *          依赖 @/components/ui/badge 的设计系统组件
 *          依赖 lucide-react 的图标
 *          依赖 framer-motion 的动画能力
 * [OUTPUT]: 对外提供 Hero 组件（默认导出）
 * [POS]: layout 模块的首屏英雄区组件，被 HomePage 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Image, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ========================================================================== */
/*                              ANIMATION CONFIG                               */
/* ========================================================================== */

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const floatVariants = {
    animate: {
        y: [0, -10, 0],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
}

/* ========================================================================== */
/*                                    HERO                                     */
/* ========================================================================== */

export default function Hero() {
    return (
        <section className="relative overflow-hidden py-20 md:py-32">
            {/* ===================== BACKGROUND GRADIENT ===================== */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-3xl" />
                <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-gradient-to-tl from-accent/15 to-transparent blur-3xl" />
            </div>

            <motion.div
                className="container mx-auto px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="mx-auto max-w-4xl text-center">
                    {/* ========================= BADGE ========================= */}
                    <motion.div variants={itemVariants}>
                        <Badge
                            variant="secondary"
                            className="mb-6 px-4 py-1.5 text-sm font-medium"
                        >
                            <Zap className="mr-1.5 h-3.5 w-3.5" />
                            全新升级 v2.0
                        </Badge>
                    </motion.div>

                    {/* ========================= TITLE ========================= */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                        将{' '}
                        <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                            Markdown
                        </span>{' '}
                        转换为
                        <br />
                        精美的{' '}
                        <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                            图片
                        </span>
                    </motion.h1>

                    {/* ====================== DESCRIPTION ====================== */}
                    <motion.p
                        variants={itemVariants}
                        className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
                    >
                        一键将 Markdown 文档转换为社交媒体友好的图片。
                        支持代码高亮、自定义主题，让你的内容更加出众。
                    </motion.p>

                    {/* ========================= CTA ========================= */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Button size="lg" className="group min-w-[160px]">
                            立即开始
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button size="lg" variant="outline" className="min-w-[160px]">
                            查看演示
                        </Button>
                    </motion.div>

                    {/* ===================== FLOATING ICONS ===================== */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-16 flex items-center justify-center gap-8"
                    >
                        <motion.div
                            variants={floatVariants}
                            animate="animate"
                            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-lg"
                        >
                            <FileText className="h-8 w-8 text-primary" />
                        </motion.div>
                        <motion.div
                            className="text-4xl text-muted-foreground/50"
                            variants={floatVariants}
                            animate="animate"
                            style={{ animationDelay: '0.5s' }}
                        >
                            →
                        </motion.div>
                        <motion.div
                            variants={floatVariants}
                            animate="animate"
                            style={{ animationDelay: '1s' }}
                            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg"
                        >
                            <Image className="h-8 w-8 text-primary-foreground" />
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}

import { useState } from 'react'
import { motion as Motion } from 'framer-motion'

const row1 = [
    { name: '林一', role: '内容创作者', text: 'Markdown 转图片太方便了，几分钟就能把一篇稿件变成精美卡片，背景还能一键切换。' },
    { name: '周衡', role: '企业主', text: '模板系统帮团队省了大量时间，品牌色和字体一键套用，产出更稳定。' },
    { name: 'Yuki', role: '社交媒体博主', text: '背景渐变很精致，中文排版友好，直接导出适配小红书和微博。' },
    { name: '陈潇', role: '品牌运营', text: '模板复制到整组作品太好用，活动视觉能快速统一，上线节奏更稳。' },
    { name: 'Aiden', role: '教育博主', text: '常用备忘录模板做知识卡片，高清导出便于课堂分享。' },
    { name: '王琪', role: '电商卖家', text: '批量生成商品亮点卡，转化素材一天就能备齐，效率翻倍。' },
    { name: '李明', role: 'UI 设计师', text: '阴影和纹理系统太棒了，做出来的卡片质感比其他工具好很多。' },
    { name: '张伟', role: '产品经理', text: '多卡片管理功能很实用，一次做一套系列图，输出标准化。' },
]

const row2 = [
    { name: 'Emma', role: '市场营销', text: '操作比其他工具顺手太多，做活动海报效率提升了一倍。' },
    { name: '刘洋', role: '自媒体运营', text: '圆角和阴影调节很细致，做出来的卡片质感比同类产品好很多。' },
    { name: 'Alex', role: '创业者', text: '模板库足够丰富，各种场景都能找到合适的，节省了大量设计成本。' },
    { name: '赵雅', role: '培训讲师', text: '高清导出很给力，打印出来的效果也很棒，学员反馈很好。' },
    { name: 'Mark', role: '独立开发者', text: '开源免费，代码质量高，集成到自己的工作流里很顺利。' },
    { name: '孙丽', role: '公关专员', text: '紧急情况下能快速出图，救急功能很强，老板都夸效率高。' },
    { name: 'David', role: '内容策划', text: '颜色搭配很专业，不懂设计也能做出有品味的作品。' },
    { name: '陈晨', role: '学生', text: '做课堂笔记分享卡片，同学们都说好看，用 Markdown 写完一键生成。' },
]

function TestimonialCard({ t }) {
    return (
        <div className="shrink-0 w-[300px] p-5 rounded-2xl border border-white/6 bg-white/2">
            <p className="text-[13px] text-white/50 leading-relaxed mb-4">"{t.text}"</p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500/40 to-purple-500/40 flex items-center justify-center text-[11px] font-bold text-white/70">
                    {t.name[0]}
                </div>
                <div>
                    <div className="text-[12px] font-medium text-white/70">{t.name}</div>
                    <div className="text-[11px] text-white/30">{t.role}</div>
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
    const [paused, setPaused] = useState(false)
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
                    用户选择 Md2Img 的理由
                </h2>
                <p className="mt-3 text-white/35 text-sm">
                    来自各行各业用户的真实反馈
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

import { motion as Motion } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

const faqs = [
    {
        q: '是否免费使用？',
        a: '是的，Md2Img 完全免费且开源。所有功能、模板、背景主题均可无限制使用，无需注册。',
    },
    {
        q: '支持哪些 Markdown 语法？',
        a: '支持完整的 GitHub Flavored Markdown (GFM) 语法，包括标题、列表、粗体、斜体、链接、图片、代码块、表格、任务列表、删除线等。',
    },
    {
        q: '导出图片的分辨率是多少？',
        a: '默认以 2x 像素比导出 PNG 格式，确保在高分辨率屏幕上也能清晰显示。例如 540px 宽的卡片，实际导出为 1080px 宽的图片。',
    },
    {
        q: '可以自定义背景图片吗？',
        a: '可以。在背景面板中点击"上传背景"按钮，选择本地图片即可作为卡片背景使用。支持 JPG、PNG、WebP 等常见格式。',
    },
    {
        q: '支持代码语法高亮吗？',
        a: '支持。使用 Prism 语法高亮引擎，支持 JavaScript、Python、Go、Rust 等数十种编程语言，并根据主题自动切换明暗代码风格。',
    },
    {
        q: '数据是否安全？',
        a: '完全安全。所有编辑和导出操作均在你的浏览器本地完成，不会上传任何内容到服务器。你的文字始终只存在于你的设备上。',
    },
]

export default function FAQSection() {
    return (
        <section id="faq" className="py-20 md:py-28 px-5">
            <div className="max-w-3xl mx-auto">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-14"
                >
                    <span className="text-[12px] text-indigo-400 font-medium tracking-wider uppercase">FAQS</span>
                    <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">常见问题</h2>
                </Motion.div>

                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Accordion.Root type="single" collapsible className="space-y-2">
                        {faqs.map((faq, i) => (
                            <Accordion.Item
                                key={i}
                                value={`faq-${i}`}
                                className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                            >
                                <Accordion.Header>
                                    <Accordion.Trigger className="flex items-center justify-between w-full px-5 py-4 text-left text-[14px] font-medium text-white/80 hover:text-white transition-colors group">
                                        {faq.q}
                                        <ChevronDown className="h-4 w-4 text-white/30 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                    </Accordion.Trigger>
                                </Accordion.Header>
                                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                                    <div className="px-5 pb-4 text-[13px] text-white/40 leading-relaxed">
                                        {faq.a}
                                    </div>
                                </Accordion.Content>
                            </Accordion.Item>
                        ))}
                    </Accordion.Root>
                </Motion.div>
            </div>
        </section>
    )
}

/**
 * ============================================================================
 * [INPUT]: 依赖 @/components/ui/separator 的设计系统组件
 *          依赖 lucide-react 的图标
 *          依赖 react-icons/si 的社媒图标
 *          依赖 react-router 的 Link 组件
 * [OUTPUT]: 对外提供 Footer 组件（默认导出）
 * [POS]: layout 模块的页脚组件，被 App.jsx 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { Link } from 'react-router'
import { Sparkles, Heart } from 'lucide-react'
import { SiGithub, SiX, SiDiscord } from 'react-icons/si'
import { Separator } from '@/components/ui/separator'

/* ========================================================================== */
/*                                 FOOTER DATA                                 */
/* ========================================================================== */

const footerLinks = {
    product: {
        title: '产品',
        links: [
            { label: '功能', href: '#features' },
            { label: '定价', href: '#pricing' },
            { label: '更新日志', href: '/changelog' },
            { label: '路线图', href: '/roadmap' },
        ],
    },
    resources: {
        title: '资源',
        links: [
            { label: '文档', href: '/docs' },
            { label: 'API', href: '/api' },
            { label: '模板', href: '/templates' },
            { label: '设计系统', href: '/design-system' },
        ],
    },
    company: {
        title: '关于',
        links: [
            { label: '博客', href: '/blog' },
            { label: '关于我们', href: '/about' },
            { label: '联系我们', href: '/contact' },
            { label: '隐私政策', href: '/privacy' },
        ],
    },
}

const socialLinks = [
    { icon: SiGithub, href: 'https://github.com', label: 'GitHub' },
    { icon: SiX, href: 'https://x.com', label: 'X (Twitter)' },
    { icon: SiDiscord, href: 'https://discord.com', label: 'Discord' },
]

/* ========================================================================== */
/*                                   FOOTER                                    */
/* ========================================================================== */

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border/40 bg-card/50">
            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* ======================= MAIN CONTENT ======================= */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* ========================= BRAND ========================= */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Markdown2Image
                            </span>
                        </Link>
                        <p className="mt-4 max-w-sm text-muted-foreground">
                            将 Markdown 转换为精美图片的最佳工具。
                            让你的内容在社交媒体上脱颖而出。
                        </p>
                        {/* ====================== SOCIAL ====================== */}
                        <div className="mt-6 flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ====================== LINK COLUMNS ====================== */}
                    {Object.values(footerLinks).map((column) => (
                        <div key={column.title}>
                            <h4 className="font-semibold text-foreground">{column.title}</h4>
                            <ul className="mt-4 space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            to={link.href}
                                            className="text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ======================== SEPARATOR ======================== */}
                <Separator className="my-8" />

                {/* ========================= BOTTOM ========================= */}
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} Markdown2Image. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        Made with <Heart className="h-4 w-4 text-accent" /> by the team
                    </p>
                </div>
            </div>
        </footer>
    )
}

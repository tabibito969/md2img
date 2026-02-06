/**
 * ============================================================================
 * [INPUT]: 依赖 @/components/ui/button、@/components/ui/sheet、
 *          @/components/ui/navigation-menu 的设计系统组件
 *          依赖 react-router 的 Link 组件
 *          依赖 lucide-react 的图标
 * [OUTPUT]: 对外提供 Header 组件（默认导出）
 * [POS]: layout 模块的顶部导航组件，被 App.jsx 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { Link } from 'react-router'
import { Menu, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from '@/components/ui/sheet'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'

/* ========================================================================== */
/*                                   NAV DATA                                  */
/* ========================================================================== */

const navItems = [
    { label: '首页', href: '/' },
    { label: '功能', href: '#features' },
    { label: '定价', href: '#pricing' },
    { label: '设计系统', href: '/design-system' },
]

/* ========================================================================== */
/*                                   HEADER                                    */
/* ========================================================================== */

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* ========================= LOGO ========================= */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Markdown2Image
                    </span>
                </Link>

                {/* ==================== DESKTOP NAV ==================== */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList className="gap-1">
                        {navItems.map((item) => (
                            <NavigationMenuItem key={item.href}>
                                <NavigationMenuLink asChild>
                                    <Link
                                        to={item.href}
                                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent/10 hover:text-foreground focus:bg-accent/10 focus:text-foreground focus:outline-none"
                                    >
                                        {item.label}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* ==================== ACTIONS ==================== */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                        登录
                    </Button>
                    <Button size="sm" className="hidden md:inline-flex">
                        开始使用
                    </Button>

                    {/* ================== MOBILE MENU ================== */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">打开菜单</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[280px]">
                            <SheetTitle className="sr-only">导航菜单</SheetTitle>
                            <nav className="flex flex-col gap-4 mt-8">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="mt-4 flex flex-col gap-2">
                                    <Button variant="outline" className="w-full">
                                        登录
                                    </Button>
                                    <Button className="w-full">开始使用</Button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

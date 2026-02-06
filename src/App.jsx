/**
 * ============================================================================
 * [INPUT]: 依赖 react-router 的 RouterProvider、createBrowserRouter
 *          依赖 @/components/layout/Header、Hero、Footer 组件
 * [OUTPUT]: 对外提供 App 组件（默认导出）
 * [POS]: 主应用组件，作为页面根容器被 main.jsx 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import { RouterProvider, createBrowserRouter } from 'react-router'
import Header from '@/components/layout/Header'
import Hero from '@/components/layout/Hero'
import Footer from '@/components/layout/Footer'

/* ========================================================================== */
/*                                  ROUTES                                    */
/* ========================================================================== */

function HomePage() {
    return (
        <>
            <Header />
            <main>
                <Hero />
            </main>
            <Footer />
        </>
    )
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
])

/* ========================================================================== */
/*                                    APP                                     */
/* ========================================================================== */

function App() {
    return <RouterProvider router={router} />
}

export default App

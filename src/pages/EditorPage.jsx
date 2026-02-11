/**
 * EditorPage — /app 路由，包装现有编辑器
 */
import { useMemo } from 'react'
import App from '../App.jsx'
import { usePageSeo } from '@/lib/seo'

export default function EditorPage() {
    const seoConfig = useMemo(
        () => ({
            title: 'Md2Img Editor | Markdown to Image Workspace',
            description:
                'Create visual cards in the Md2Img editor and export markdown to image in one click.',
            path: '/app',
            robots: 'noindex,nofollow',
        }),
        [],
    )

    usePageSeo(seoConfig)

    return (
        <div className="dark">
            <App />
        </div>
    )
}

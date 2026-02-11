/**
 * LandingPage — / 路由，仿流光卡片落地页
 */
import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { usePageSeo } from '@/lib/seo'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import PainPointsSection from '../components/landing/PainPointsSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import ShowcaseSection from '../components/landing/ShowcaseSection'
import FAQSection from '../components/landing/FAQSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const isKeywordLanding =
        location.pathname === '/markdown-to-image' ||
        location.pathname === '/md-to-image'

    const seoConfig = useMemo(() => {
        const title = isKeywordLanding
            ? t('seo.markdownToImage.title')
            : t('seo.home.title')
        const description = isKeywordLanding
            ? t('seo.markdownToImage.description')
            : t('seo.home.description')

        return {
            title,
            description,
            path: isKeywordLanding ? '/markdown-to-image' : '/',
            keywords: t('seo.home.keywords'),
            jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Md2Img',
                applicationCategory: 'DesignApplication',
                operatingSystem: 'Web',
                description,
                inLanguage: i18n.language,
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                },
                featureList: [
                    t('landing.features.f1Title'),
                    t('landing.features.f2Title'),
                    t('landing.features.f4Title'),
                    t('landing.features.f6Title'),
                ],
            },
        }
    }, [i18n.language, isKeywordLanding, t])

    usePageSeo(seoConfig)

    return (
        <div className="min-h-screen bg-[#0a0a14] text-white overflow-x-hidden antialiased">
            <Navbar />
            <HeroSection />
            <PainPointsSection />
            <FeaturesSection />
            <TestimonialsSection />
            <ShowcaseSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </div>
    )
}

/**
 * LandingPage — / 路由，仿流光卡片落地页
 */
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageSeo } from '@/lib/seo'
import {
    DEFAULT_LOCALE_SEGMENT,
    LOCALE_CONFIGS,
    getLocalePath,
    localeBySegment,
} from '@/config/locales'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import PainPointsSection from '../components/landing/PainPointsSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import ShowcaseSection from '../components/landing/ShowcaseSection'
import SeoLongformSection from '../components/landing/SeoLongformSection'
import FAQSection from '../components/landing/FAQSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

export default function LandingPage({
    localeSegment = DEFAULT_LOCALE_SEGMENT,
    localeCode,
    isKeywordLanding = false,
}) {
    const { t, i18n } = useTranslation()
    const currentLocale =
        localeBySegment(localeSegment) || localeBySegment(DEFAULT_LOCALE_SEGMENT)

    useEffect(() => {
        const targetLanguage = localeCode || currentLocale?.i18n || 'en'
        if (i18n.language !== targetLanguage) {
            i18n.changeLanguage(targetLanguage)
        }
    }, [currentLocale?.i18n, i18n, localeCode])

    const seoConfig = useMemo(() => {
        const normalizedSegment = currentLocale?.segment || DEFAULT_LOCALE_SEGMENT
        const pagePath = getLocalePath(normalizedSegment, isKeywordLanding)
        const alternates = LOCALE_CONFIGS.map((locale) => ({
            hreflang: locale.hreflang,
            href: getLocalePath(locale.segment, isKeywordLanding),
        }))
        alternates.push({
            hreflang: 'x-default',
            href: getLocalePath(DEFAULT_LOCALE_SEGMENT, isKeywordLanding),
        })

        const title = isKeywordLanding
            ? t('seo.markdownToImage.title')
            : t('seo.home.title')
        const description = isKeywordLanding
            ? t('seo.markdownToImage.description')
            : t('seo.home.description')
        const keywords = isKeywordLanding
            ? t('seo.markdownToImage.keywords')
            : t('seo.home.keywords')

        return {
            title,
            description,
            path: pagePath,
            keywords,
            alternates,
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
    }, [currentLocale?.segment, i18n.language, isKeywordLanding, t])

    usePageSeo(seoConfig)

    return (
        <div className="min-h-screen bg-[#0a0a14] text-white overflow-x-hidden antialiased">
            <Navbar localeSegment={currentLocale?.segment || DEFAULT_LOCALE_SEGMENT} />
            <HeroSection />
            <PainPointsSection />
            <FeaturesSection />
            <TestimonialsSection />
            <ShowcaseSection />
            {isKeywordLanding && (currentLocale?.segment || DEFAULT_LOCALE_SEGMENT) === 'en' && (
                <SeoLongformSection />
            )}
            <FAQSection />
            <CTASection />
            <Footer />
        </div>
    )
}

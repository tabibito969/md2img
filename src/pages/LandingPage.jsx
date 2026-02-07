/**
 * LandingPage — / 路由，仿流光卡片落地页
 */
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

import { motion as Motion } from 'framer-motion'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function FAQSection() {
    const { t } = useTranslation()
    const faqs = t('landing.faq.items', { returnObjects: true })

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
                    <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">{t('landing.faq.title')}</h2>
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

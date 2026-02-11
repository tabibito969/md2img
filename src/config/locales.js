export const DEFAULT_LOCALE_SEGMENT = 'en'
export const KEYWORD_PAGE_SLUG = 'markdown-to-image'

export const LOCALE_CONFIGS = [
    { segment: 'en', i18n: 'en', htmlLang: 'en', hreflang: 'en' },
    { segment: 'zh-cn', i18n: 'zh-CN', htmlLang: 'zh-CN', hreflang: 'zh-CN' },
    { segment: 'zh-tw', i18n: 'zh-TW', htmlLang: 'zh-TW', hreflang: 'zh-TW' },
    { segment: 'ja', i18n: 'ja', htmlLang: 'ja', hreflang: 'ja' },
    { segment: 'ko', i18n: 'ko', htmlLang: 'ko', hreflang: 'ko' },
]

export const LOCALE_SEGMENTS = LOCALE_CONFIGS.map((item) => item.segment)

export const localeBySegment = (segment) =>
    LOCALE_CONFIGS.find((item) => item.segment === String(segment).toLowerCase())

export const localeByI18n = (code) =>
    LOCALE_CONFIGS.find((item) => item.i18n.toLowerCase() === String(code).toLowerCase())

export const getLocalePath = (segment, isKeywordPage = false) => {
    const normalized = String(segment).toLowerCase()
    return isKeywordPage
        ? `/${normalized}/${KEYWORD_PAGE_SLUG}`
        : `/${normalized}/`
}


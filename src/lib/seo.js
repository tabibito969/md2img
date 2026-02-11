import { useEffect } from 'react'

const SITE_NAME = 'Md2Img'
const DEFAULT_OG_IMAGE = '/android-chrome-512x512.png'
const JSON_LD_SCRIPT_ID = 'md2img-jsonld'
const ALT_LINK_MARK = 'data-md2img-alt'

const normalizeSiteUrl = (value) => {
    if (typeof value !== 'string') return ''
    const trimmed = value.trim()
    if (!trimmed) return ''
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    try {
        const url = new URL(withProtocol)
        return `${url.origin}${url.pathname}`.replace(/\/+$/, '')
    } catch {
        return ''
    }
}

const resolveSiteUrl = () => {
    const envSiteUrl = normalizeSiteUrl(import.meta.env.VITE_SITE_URL)
    if (envSiteUrl) return envSiteUrl
    if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin
    }
    return ''
}

const toAbsoluteUrl = (siteUrl, path = '/') => {
    if (!path) return siteUrl || '/'
    if (/^https?:\/\//i.test(path)) return path
    if (!siteUrl) return path.startsWith('/') ? path : `/${path}`
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return new URL(normalizedPath, `${siteUrl}/`).toString()
}

const ensureMetaTag = (attribute, value) => {
    const selector = `meta[${attribute}="${value}"]`
    let element = document.head.querySelector(selector)
    if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, value)
        document.head.appendChild(element)
    }
    return element
}

const upsertMeta = ({ name, property, content }) => {
    if (typeof content !== 'string' || !content.trim()) return
    const target = name
        ? ensureMetaTag('name', name)
        : ensureMetaTag('property', property)
    target.setAttribute('content', content.trim())
}

const upsertCanonical = (href) => {
    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
    }
    link.setAttribute('href', href)
}

const upsertJsonLd = (jsonLd) => {
    if (!jsonLd) return
    let script = document.getElementById(JSON_LD_SCRIPT_ID)
    if (!script) {
        script = document.createElement('script')
        script.id = JSON_LD_SCRIPT_ID
        script.type = 'application/ld+json'
        document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)
}

const replaceAlternates = (alternates) => {
    document.head
        .querySelectorAll(`link[rel="alternate"][${ALT_LINK_MARK}="1"]`)
        .forEach((node) => node.remove())

    if (!Array.isArray(alternates) || alternates.length === 0) return

    for (const item of alternates) {
        if (!item || typeof item.hreflang !== 'string' || typeof item.href !== 'string') continue
        const href = item.href.trim()
        const hreflang = item.hreflang.trim()
        if (!href || !hreflang) continue
        const link = document.createElement('link')
        link.setAttribute('rel', 'alternate')
        link.setAttribute('hreflang', hreflang)
        link.setAttribute('href', href)
        link.setAttribute(ALT_LINK_MARK, '1')
        document.head.appendChild(link)
    }
}

const removeJsonLd = () => {
    const script = document.getElementById(JSON_LD_SCRIPT_ID)
    if (script) script.remove()
}

export const applySeo = ({
    title,
    description,
    path = '/',
    robots = 'index,follow',
    keywords = '',
    ogType = 'website',
    ogImage = DEFAULT_OG_IMAGE,
    jsonLd = null,
    alternates = [],
}) => {
    if (typeof document === 'undefined') return

    const siteUrl = resolveSiteUrl()
    const canonicalUrl = toAbsoluteUrl(siteUrl, path)
    const ogImageUrl = toAbsoluteUrl(siteUrl, ogImage)
    const trimmedTitle = typeof title === 'string' ? title.trim() : ''
    const trimmedDescription = typeof description === 'string' ? description.trim() : ''

    if (trimmedTitle) document.title = trimmedTitle

    upsertCanonical(canonicalUrl)
    upsertMeta({ name: 'description', content: trimmedDescription })
    upsertMeta({ name: 'robots', content: robots })
    upsertMeta({ name: 'keywords', content: keywords })
    upsertMeta({ property: 'og:title', content: trimmedTitle })
    upsertMeta({ property: 'og:description', content: trimmedDescription })
    upsertMeta({ property: 'og:type', content: ogType })
    upsertMeta({ property: 'og:url', content: canonicalUrl })
    upsertMeta({ property: 'og:site_name', content: SITE_NAME })
    upsertMeta({ property: 'og:image', content: ogImageUrl })
    upsertMeta({ name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta({ name: 'twitter:title', content: trimmedTitle })
    upsertMeta({ name: 'twitter:description', content: trimmedDescription })
    upsertMeta({ name: 'twitter:image', content: ogImageUrl })
    const normalizedAlternates = Array.isArray(alternates)
        ? alternates.map((item) => ({
            ...item,
            href: toAbsoluteUrl(siteUrl, item?.href || ''),
        }))
        : []
    replaceAlternates(normalizedAlternates)

    if (jsonLd) {
        upsertJsonLd({
            inLanguage: document.documentElement.lang || 'en',
            ...jsonLd,
            url: jsonLd.url || canonicalUrl,
        })
    } else {
        removeJsonLd()
    }
}

export const usePageSeo = (config) => {
    useEffect(() => {
        applySeo(config)
    }, [config])
}

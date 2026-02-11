import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
    DEFAULT_LOCALE_SEGMENT,
    LOCALE_CONFIGS,
    getLocalePath,
} from '../src/config/locales.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const distIndexPath = path.join(distDir, 'index.html')

const parseEnvFile = (filePath) => {
    if (!fs.existsSync(filePath)) return {}
    const content = fs.readFileSync(filePath, 'utf8')
    const result = {}
    for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const normalized = trimmed.startsWith('export ')
            ? trimmed.slice('export '.length)
            : trimmed
        const separatorIndex = normalized.indexOf('=')
        if (separatorIndex <= 0) continue
        const key = normalized.slice(0, separatorIndex).trim()
        const rawValue = normalized.slice(separatorIndex + 1).trim()
        const value = rawValue
            .replace(/^"(.*)"$/, '$1')
            .replace(/^'(.*)'$/, '$1')
        result[key] = value
    }
    return result
}

const normalizeSiteUrl = (value) => {
    if (typeof value !== 'string') return ''
    const trimmed = value.trim()
    if (!trimmed) return ''
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    try {
        const normalized = new URL(withProtocol)
        return normalized.origin.replace(/\/+$/, '')
    } catch {
        return ''
    }
}

const loadLocalEnv = () => {
    const files = [
        '.env.example',
        '.env',
        '.env.local',
        '.env.production',
        '.env.production.local',
    ]
    return files.reduce((acc, filename) => {
        const next = parseEnvFile(path.join(rootDir, filename))
        return { ...acc, ...next }
    }, {})
}

const updateTag = (html, regex, nextTag) => {
    if (regex.test(html)) return html.replace(regex, nextTag)
    return html
}

const ensureDirForRoute = (routePath) => {
    const clean = routePath.replace(/^\/+|\/+$/g, '')
    const dirPath = clean ? path.join(distDir, clean) : distDir
    fs.mkdirSync(dirPath, { recursive: true })
    return path.join(dirPath, 'index.html')
}

const localeJsonPath = (localeCode) =>
    path.join(rootDir, 'src', 'i18n', 'locales', `${localeCode}.json`)

if (!fs.existsSync(distIndexPath)) {
    throw new Error('[prerender] dist/index.html not found. Run vite build first.')
}

const localEnv = loadLocalEnv()
const siteUrl =
    normalizeSiteUrl(process.env.VITE_SITE_URL) ||
    normalizeSiteUrl(process.env.SITE_URL) ||
    normalizeSiteUrl(localEnv.VITE_SITE_URL) ||
    normalizeSiteUrl(localEnv.SITE_URL) ||
    'https://example.com'

const localeMessages = Object.fromEntries(
    LOCALE_CONFIGS.map((locale) => {
        const json = fs.readFileSync(localeJsonPath(locale.i18n), 'utf8')
        return [locale.segment, JSON.parse(json)]
    }),
)

const template = fs.readFileSync(distIndexPath, 'utf8')
const pageKinds = [
    { key: 'home', keyword: false },
    { key: 'markdownToImage', keyword: true },
]

for (const locale of LOCALE_CONFIGS) {
    const messages = localeMessages[locale.segment]
    for (const page of pageKinds) {
        const seo = messages?.seo?.[page.key]
        if (!seo) continue

        const routePath = getLocalePath(locale.segment, page.keyword)
        const canonicalUrl = `${siteUrl}${routePath}`
        let html = template

        html = updateTag(
            html,
            /<html lang="[^"]+"/i,
            `<html lang="${locale.htmlLang}"`,
        )
        html = updateTag(
            html,
            /<title>[\s\S]*?<\/title>/i,
            `<title>${seo.title}</title>`,
        )
        html = updateTag(
            html,
            /<meta name="description" content="[^"]*"\s*\/?>/i,
            `<meta name="description" content="${seo.description}" />`,
        )
        html = updateTag(
            html,
            /<meta name="keywords" content="[^"]*"\s*\/?>/i,
            `<meta name="keywords" content="${seo.keywords || ''}" />`,
        )
        html = updateTag(
            html,
            /<link rel="canonical" href="[^"]*"\s*\/?>/i,
            `<link rel="canonical" href="${canonicalUrl}" />`,
        )
        html = updateTag(
            html,
            /<meta property="og:url" content="[^"]*"\s*\/?>/i,
            `<meta property="og:url" content="${canonicalUrl}" />`,
        )
        html = updateTag(
            html,
            /<meta property="og:title" content="[^"]*"\s*\/?>/i,
            `<meta property="og:title" content="${seo.title}" />`,
        )
        html = updateTag(
            html,
            /<meta property="og:description" content="[^"]*"\s*\/?>/i,
            `<meta property="og:description" content="${seo.description}" />`,
        )
        html = updateTag(
            html,
            /<meta name="twitter:title" content="[^"]*"\s*\/?>/i,
            `<meta name="twitter:title" content="${seo.title}" />`,
        )
        html = updateTag(
            html,
            /<meta name="twitter:description" content="[^"]*"\s*\/?>/i,
            `<meta name="twitter:description" content="${seo.description}" />`,
        )

        html = html.replace(
            /<link rel="alternate" hreflang="[^"]+" href="[^"]*"\s*\/?>\n?/gi,
            '',
        )

        const alternateLinks = LOCALE_CONFIGS.map((item) => {
            const href = `${siteUrl}${getLocalePath(item.segment, page.keyword)}`
            return `<link rel="alternate" hreflang="${item.hreflang}" href="${href}" />`
        })
        alternateLinks.push(
            `<link rel="alternate" hreflang="x-default" href="${siteUrl}${getLocalePath(DEFAULT_LOCALE_SEGMENT, page.keyword)}" />`,
        )

        html = html.replace('</head>', `  ${alternateLinks.join('\n  ')}\n</head>`)

        const outputPath = ensureDirForRoute(routePath)
        fs.writeFileSync(outputPath, html, 'utf8')
    }
}

console.log(`[prerender] Generated localized prerendered pages for ${LOCALE_CONFIGS.length} locales`)


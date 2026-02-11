import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
    DEFAULT_LOCALE_SEGMENT,
    KEYWORD_PAGE_SLUG,
    LOCALE_CONFIGS,
    getLocalePath,
} from '../src/config/locales.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')

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

const localEnv = loadLocalEnv()
const siteUrl =
    normalizeSiteUrl(process.env.VITE_SITE_URL) ||
    normalizeSiteUrl(process.env.SITE_URL) ||
    normalizeSiteUrl(localEnv.VITE_SITE_URL) ||
    normalizeSiteUrl(localEnv.SITE_URL) ||
    'https://example.com'

if (siteUrl === 'https://example.com') {
    console.warn(
        '[seo] Missing VITE_SITE_URL/SITE_URL. Using fallback https://example.com for sitemap/robots.',
    )
}

const urls = [
    ...LOCALE_CONFIGS.map((locale) => getLocalePath(locale.segment)),
    ...LOCALE_CONFIGS.map((locale) => getLocalePath(locale.segment, true)),
]
const timestamp = new Date().toISOString()
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
        (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${
        route === getLocalePath(DEFAULT_LOCALE_SEGMENT)
            ? '1.0'
            : route.endsWith(`/${KEYWORD_PAGE_SLUG}`)
              ? '0.9'
              : '0.8'
    }</priority>
  </url>`,
    )
    .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

# Share links are generated dynamically and should not be indexed.
Disallow: /share

Sitemap: ${siteUrl}/sitemap.xml
`

fs.mkdirSync(publicDir, { recursive: true })
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8')

console.log(`[seo] Generated robots.txt and sitemap.xml with site URL: ${siteUrl}`)

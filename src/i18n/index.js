/**
 * ============================================================================
 * [OUTPUT]: 初始化并导出 i18n 实例
 * [POS]: 国际化入口，配置 react-i18next + 浏览器语言检测
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * ============================================================================
 */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import zhCN from './locales/zh-CN.json'
import zhTW from './locales/zh-TW.json'
import en from './locales/en.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            'zh-CN': { translation: zhCN },
            'zh-TW': { translation: zhTW },
            en: { translation: en },
            ja: { translation: ja },
            ko: { translation: ko },
        },
        fallbackLng: 'zh-CN',
        interpolation: {
            escapeValue: false, // React 已处理 XSS
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'md2img-lang',
        },
    })

export default i18n

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          const segments = id.split('node_modules/')
          const pkgPath = segments[segments.length - 1]
          const pkgParts = pkgPath?.split('/') ?? []
          const name = pkgParts[0]?.startsWith('@')
            ? `${pkgParts[0]}/${pkgParts[1]}`
            : pkgParts[0]
          if (!name) return 'vendor'
          if (
            name === 'react' ||
            name === 'react-dom' ||
            name === 'scheduler' ||
            name === 'react-is' ||
            name === 'use-sync-external-store'
          ) {
            return 'react'
          }
          if (name === 'react-router') return 'router'
          if (name === 'framer-motion') return 'motion'
          if (name === 'html-to-image') return 'image-export'
          if (name === 'react-syntax-highlighter') return 'syntax-highlighter'
          if (name === 'refractor' || name === 'prismjs') return 'syntax-prism'
          if (name === 'lucide-react' || name === 'react-icons') return 'icons'
          if (name?.startsWith('@radix-ui')) return 'radix'
          if (
            name === 'react-hook-form' ||
            name === '@hookform/resolvers' ||
            name === 'zod'
          ) {
            return 'forms'
          }
          if (name === 'sonner') return 'sonner'
          if (name === 'cmdk') return 'cmdk'
          if (
            name === 'react-markdown' ||
            name === 'remark-gfm' ||
            name.startsWith('remark-') ||
            name.startsWith('rehype-') ||
            name.startsWith('micromark') ||
            name.startsWith('mdast') ||
            name.startsWith('hast') ||
            name.startsWith('unist') ||
            name.startsWith('vfile') ||
            name.startsWith('unified') ||
            name === 'github-slugger' ||
            name === 'property-information' ||
            name === 'space-separated-tokens' ||
            name === 'comma-separated-tokens' ||
            name === 'parse-entities' ||
            name === 'stringify-entities' ||
            name === 'decode-named-character-reference' ||
            name === 'bail' ||
            name === 'trough' ||
            name === 'zwitch' ||
            name === 'is-plain-obj' ||
            name === 'ccount' ||
            name === 'longest-streak'
          ) {
            return 'markdown'
          }
          return 'vendor'
        },
      },
    },
  },
})


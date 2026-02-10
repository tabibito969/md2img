const SHARE_VERSION = 1

const toBase64Url = (value) =>
    btoa(unescape(encodeURIComponent(value)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '')

const fromBase64Url = (value) => {
    const normalized = value
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    return decodeURIComponent(escape(atob(padded)))
}

export const encodeSharePayload = (workspace) => {
    const payload = {
        v: SHARE_VERSION,
        workspace,
    }
    return toBase64Url(JSON.stringify(payload))
}

export const decodeSharePayload = (encoded) => {
    if (!encoded || typeof encoded !== 'string') return null
    try {
        const raw = fromBase64Url(encoded)
        const parsed = JSON.parse(raw)
        if (!parsed || typeof parsed !== 'object') return null
        if (parsed.v !== SHARE_VERSION) return null
        if (!parsed.workspace || typeof parsed.workspace !== 'object') return null
        return parsed.workspace
    } catch {
        return null
    }
}


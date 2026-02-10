const rawBase = (import.meta.env.VITE_AUTH_API_BASE || '').trim()
const API_BASE = rawBase.replace(/\/+$/g, '')

const buildUrl = (path) =>
    API_BASE ? `${API_BASE}${path}` : path

async function request(path, options = {}) {
    const response = await fetch(buildUrl(path), {
        method: options.method || 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        body:
            options.body === undefined
                ? undefined
                : JSON.stringify(options.body),
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
        const message =
            typeof payload?.error === 'string'
                ? payload.error
                : '请求失败，请稍后重试'
        throw new Error(message)
    }
    return payload
}

export async function getCurrentUser() {
    return request('/api/auth/me')
}

export async function registerWithEmail(email, password) {
    return request('/api/auth/register', {
        method: 'POST',
        body: { email, password },
    })
}

export async function loginWithEmail(email, password) {
    return request('/api/auth/login', {
        method: 'POST',
        body: { email, password },
    })
}

export async function logoutSession() {
    return request('/api/auth/logout', {
        method: 'POST',
        body: {},
    })
}

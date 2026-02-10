import { neon } from '@neondatabase/serverless'

interface Env {
    DATABASE_URL: string
    SESSION_TTL_SECONDS?: string
    COOKIE_NAME?: string
    COOKIE_SECURE?: string
    ALLOWED_ORIGIN?: string
}

type DbUser = {
    id: number
    email: string
    password_hash: string
    password_salt: string
}

type PublicUser = {
    id: number
    email: string
}

const encoder = new TextEncoder()
const MIN_PASSWORD_LENGTH = 8
const PASSWORD_ITERATIONS = 120000
const PASSWORD_BYTES = 32
const DEFAULT_TTL_SECONDS = 7 * 24 * 60 * 60
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

class HttpError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

const toHex = (bytes: ArrayBuffer | Uint8Array) => {
    const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const toBase64Url = (bytes: Uint8Array) => {
    let raw = ''
    for (const byte of bytes) raw += String.fromCharCode(byte)
    return btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const fromBase64Url = (value: string) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    const raw = atob(padded)
    const bytes = new Uint8Array(raw.length)
    for (let index = 0; index < raw.length; index += 1) {
        bytes[index] = raw.charCodeAt(index)
    }
    return bytes
}

const randomToken = (byteLength: number) =>
    toBase64Url(crypto.getRandomValues(new Uint8Array(byteLength)))

const normalizeEmail = (value: unknown) =>
    typeof value === 'string' ? value.trim().toLowerCase() : ''

const parsePositiveInt = (value: string | undefined, fallback: number) => {
    const numeric = Number.parseInt(value || '', 10)
    return Number.isInteger(numeric) && numeric > 0 ? numeric : fallback
}

const shouldUseSecureCookie = (env: Env) =>
    String(env.COOKIE_SECURE || 'true').toLowerCase() !== 'false'

const getCookieName = (env: Env) => (env.COOKIE_NAME || 'md2img_session').trim()

const getTtlSeconds = (env: Env) =>
    parsePositiveInt(env.SESSION_TTL_SECONDS, DEFAULT_TTL_SECONDS)

const getCorsHeaders = (request: Request, env: Env) => {
    const configured = (env.ALLOWED_ORIGIN || '*').trim()
    const requestOrigin = request.headers.get('Origin')
    let allowOrigin = configured
    if (configured === '*') {
        allowOrigin = requestOrigin || '*'
    }

    const headers = new Headers({
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        Vary: 'Origin',
    })

    headers.set('Access-Control-Allow-Origin', allowOrigin)
    if (allowOrigin !== '*') {
        headers.set('Access-Control-Allow-Credentials', 'true')
    }
    return headers
}

const json = (
    body: unknown,
    status: number,
    corsHeaders: Headers,
    extraHeaders?: Record<string, string>,
) => {
    const headers = new Headers(corsHeaders)
    headers.set('Content-Type', 'application/json; charset=utf-8')
    if (extraHeaders) {
        for (const [key, value] of Object.entries(extraHeaders)) {
            headers.set(key, value)
        }
    }
    return new Response(JSON.stringify(body), { status, headers })
}

const parseCookie = (headerValue: string | null) => {
    if (!headerValue) return {}
    return headerValue.split(';').reduce<Record<string, string>>((result, chunk) => {
        const [rawKey, ...rest] = chunk.trim().split('=')
        if (!rawKey) return result
        result[rawKey] = decodeURIComponent(rest.join('=') || '')
        return result
    }, {})
}

const buildSessionCookie = (
    name: string,
    token: string,
    ttlSeconds: number,
    secure: boolean,
) => {
    const base = `${name}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ttlSeconds}`
    return secure ? `${base}; Secure` : base
}

const buildClearCookie = (name: string, secure: boolean) => {
    const base = `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    return secure ? `${base}; Secure` : base
}

const sha256Hex = async (value: string) => {
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
    return toHex(digest)
}

const derivePasswordHash = async (password: string, salt: Uint8Array) => {
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits'],
    )
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations: PASSWORD_ITERATIONS,
            hash: 'SHA-256',
        },
        key,
        PASSWORD_BYTES * 8,
    )
    return toHex(derivedBits)
}

const hashPassword = async (password: string) => {
    const saltBytes = crypto.getRandomValues(new Uint8Array(16))
    return {
        salt: toBase64Url(saltBytes),
        hash: await derivePasswordHash(password, saltBytes),
    }
}

const timingSafeEqual = (left: string, right: string) => {
    if (left.length !== right.length) return false
    let diff = 0
    for (let index = 0; index < left.length; index += 1) {
        diff |= left.charCodeAt(index) ^ right.charCodeAt(index)
    }
    return diff === 0
}

const verifyPassword = async (password: string, saltBase64Url: string, expectedHash: string) => {
    const actual = await derivePasswordHash(password, fromBase64Url(saltBase64Url))
    return timingSafeEqual(actual, expectedHash)
}

const parseJsonBody = async (request: Request) => {
    const contentType = request.headers.get('Content-Type') || ''
    if (!contentType.includes('application/json')) {
        throw new HttpError(415, '请求体必须为 application/json')
    }
    try {
        return await request.json<Record<string, unknown>>()
    } catch {
        throw new HttpError(400, '请求体 JSON 格式错误')
    }
}

const toPublicUser = (user: DbUser): PublicUser => ({
    id: Number(user.id),
    email: user.email,
})

const createSession = async (
    env: Env,
    userId: number,
    request: Request,
) => {
    const sql = neon(env.DATABASE_URL)
    const sessionToken = randomToken(32)
    const sessionHash = await sha256Hex(sessionToken)
    const ttlSeconds = getTtlSeconds(env)
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString()
    const userAgent = request.headers.get('User-Agent') || ''
    const sessionId = `sess_${randomToken(16)}`

    await sql`
        INSERT INTO sessions (id, user_id, session_hash, expires_at, user_agent)
        VALUES (${sessionId}, ${userId}, ${sessionHash}, ${expiresAt}, ${userAgent})
    `

    return {
        token: sessionToken,
        ttlSeconds,
    }
}

const clearExpiredSessions = async (env: Env) => {
    const sql = neon(env.DATABASE_URL)
    await sql`DELETE FROM sessions WHERE expires_at <= NOW()`
}

const register = async (request: Request, env: Env) => {
    const body = await parseJsonBody(request)
    const email = normalizeEmail(body.email)
    const password = typeof body.password === 'string' ? body.password : ''

    if (!EMAIL_REGEX.test(email)) {
        throw new HttpError(400, '请输入有效的邮箱地址')
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new HttpError(400, `密码至少 ${MIN_PASSWORD_LENGTH} 位`)
    }

    const sql = neon(env.DATABASE_URL)
    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
    if (existing.length > 0) {
        throw new HttpError(409, '该邮箱已注册')
    }

    const { salt, hash } = await hashPassword(password)
    const inserted = await sql<DbUser[]>`
        INSERT INTO users (email, password_hash, password_salt)
        VALUES (${email}, ${hash}, ${salt})
        RETURNING id, email, password_hash, password_salt
    `
    const created = inserted[0]
    if (!created) throw new HttpError(500, '创建用户失败')

    await clearExpiredSessions(env)
    const session = await createSession(env, Number(created.id), request)
    return {
        user: toPublicUser(created),
        session,
    }
}

const login = async (request: Request, env: Env) => {
    const body = await parseJsonBody(request)
    const email = normalizeEmail(body.email)
    const password = typeof body.password === 'string' ? body.password : ''
    if (!EMAIL_REGEX.test(email) || !password) {
        throw new HttpError(400, '邮箱或密码格式不正确')
    }

    const sql = neon(env.DATABASE_URL)
    const rows = await sql<DbUser[]>`
        SELECT id, email, password_hash, password_salt
        FROM users
        WHERE email = ${email}
        LIMIT 1
    `
    const user = rows[0]
    if (!user) {
        throw new HttpError(401, '邮箱或密码错误')
    }

    const isValid = await verifyPassword(password, user.password_salt, user.password_hash)
    if (!isValid) {
        throw new HttpError(401, '邮箱或密码错误')
    }

    await clearExpiredSessions(env)
    const session = await createSession(env, Number(user.id), request)
    return {
        user: toPublicUser(user),
        session,
    }
}

const getSessionUser = async (request: Request, env: Env) => {
    const cookieName = getCookieName(env)
    const cookies = parseCookie(request.headers.get('Cookie'))
    const token = cookies[cookieName]
    if (!token) throw new HttpError(401, '未登录')

    const sessionHash = await sha256Hex(token)
    const sql = neon(env.DATABASE_URL)
    const rows = await sql<{ id: number; email: string }[]>`
        SELECT users.id, users.email
        FROM sessions
        INNER JOIN users ON users.id = sessions.user_id
        WHERE sessions.session_hash = ${sessionHash}
          AND sessions.expires_at > NOW()
        LIMIT 1
    `
    const user = rows[0]
    if (!user) throw new HttpError(401, '会话已失效，请重新登录')
    return user
}

const logout = async (request: Request, env: Env) => {
    const cookieName = getCookieName(env)
    const cookies = parseCookie(request.headers.get('Cookie'))
    const token = cookies[cookieName]
    if (!token) return

    const sessionHash = await sha256Hex(token)
    const sql = neon(env.DATABASE_URL)
    await sql`DELETE FROM sessions WHERE session_hash = ${sessionHash}`
}

const normalizeAuthPath = (pathname: string) => {
    const cleaned = pathname.replace(/\/+$/, '') || '/'
    if (cleaned.startsWith('/api/auth/')) return cleaned.slice('/api'.length)
    if (cleaned === '/api/auth') return '/auth'
    return cleaned
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const corsHeaders = getCorsHeaders(request, env)
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders })
        }

        if (!env.DATABASE_URL) {
            return json(
                { error: '缺少环境变量 DATABASE_URL' },
                500,
                corsHeaders,
            )
        }

        const path = normalizeAuthPath(new URL(request.url).pathname)
        const method = request.method.toUpperCase()

        try {
            if (method === 'POST' && path === '/auth/register') {
                const result = await register(request, env)
                return json(
                    { user: result.user },
                    200,
                    corsHeaders,
                    {
                        'Set-Cookie': buildSessionCookie(
                            getCookieName(env),
                            result.session.token,
                            result.session.ttlSeconds,
                            shouldUseSecureCookie(env),
                        ),
                    },
                )
            }

            if (method === 'POST' && path === '/auth/login') {
                const result = await login(request, env)
                return json(
                    { user: result.user },
                    200,
                    corsHeaders,
                    {
                        'Set-Cookie': buildSessionCookie(
                            getCookieName(env),
                            result.session.token,
                            result.session.ttlSeconds,
                            shouldUseSecureCookie(env),
                        ),
                    },
                )
            }

            if (method === 'POST' && path === '/auth/logout') {
                await logout(request, env)
                return json(
                    { ok: true },
                    200,
                    corsHeaders,
                    {
                        'Set-Cookie': buildClearCookie(
                            getCookieName(env),
                            shouldUseSecureCookie(env),
                        ),
                    },
                )
            }

            if (method === 'GET' && path === '/auth/me') {
                const user = await getSessionUser(request, env)
                return json({ user }, 200, corsHeaders)
            }

            return json({ error: 'Not found' }, 404, corsHeaders)
        } catch (error) {
            if (error instanceof HttpError) {
                return json({ error: error.message }, error.status, corsHeaders)
            }

            console.error('Unhandled auth error', error)
            return json({ error: '服务器内部错误' }, 500, corsHeaders)
        }
    },
}

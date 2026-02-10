import { useEffect, useMemo, useState } from 'react'
import { Loader2, Mail, Lock, X } from 'lucide-react'
import { toast } from 'sonner'
import { loginWithEmail, registerWithEmail } from '@/lib/authApi'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

export default function AuthDialog({
    open,
    onClose,
    onAuthenticated,
}) {
    const [mode, setMode] = useState('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return undefined
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose?.()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [open, onClose])

    useEffect(() => {
        if (!open) return
        setPassword('')
        setConfirmPassword('')
    }, [open, mode])

    const title = useMemo(
        () => (mode === 'login' ? '邮箱登录' : '邮箱注册'),
        [mode],
    )

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-[85] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose?.()
            }}
        >
            <div className="w-full max-w-[440px] rounded-2xl border border-white/10 bg-[#0f1422] shadow-2xl shadow-black/45 overflow-hidden">
                <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-white/35">
                            Account
                        </p>
                        <h2 className="text-sm font-medium text-white/90">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => onClose?.()}
                        className="p-1.5 rounded-md text-white/45 hover:text-white/85 hover:bg-white/[0.06]"
                        aria-label="关闭"
                    >
                        <X className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                </div>

                <form
                    className="p-4 space-y-3"
                    onSubmit={async (event) => {
                        event.preventDefault()
                        const safeEmail = email.trim().toLowerCase()
                        if (!EMAIL_REGEX.test(safeEmail)) {
                            toast.error('请输入有效邮箱地址')
                            return
                        }
                        if (password.length < MIN_PASSWORD_LENGTH) {
                            toast.error(`密码至少 ${MIN_PASSWORD_LENGTH} 位`)
                            return
                        }
                        if (mode === 'register' && password !== confirmPassword) {
                            toast.error('两次输入的密码不一致')
                            return
                        }

                        setIsSubmitting(true)
                        try {
                            const result =
                                mode === 'login'
                                    ? await loginWithEmail(safeEmail, password)
                                    : await registerWithEmail(safeEmail, password)
                            onAuthenticated?.(result.user)
                            toast.success(mode === 'login' ? '登录成功' : '注册成功')
                            onClose?.()
                        } catch (error) {
                            toast.error(error instanceof Error ? error.message : '请求失败')
                        } finally {
                            setIsSubmitting(false)
                        }
                    }}
                >
                    <label className="block space-y-1">
                        <span className="text-xs text-white/60">邮箱</span>
                        <div className="relative">
                            <Mail className="h-3.5 w-3.5 text-white/30 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                value={email}
                                autoComplete="email"
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-8 pr-3 py-2 rounded-md border border-white/12 bg-[#090d16] text-sm text-white/85 outline-none focus:border-indigo-400/50"
                            />
                        </div>
                    </label>

                    <label className="block space-y-1">
                        <span className="text-xs text-white/60">密码</span>
                        <div className="relative">
                            <Lock className="h-3.5 w-3.5 text-white/30 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                value={password}
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="至少 8 位"
                                className="w-full pl-8 pr-3 py-2 rounded-md border border-white/12 bg-[#090d16] text-sm text-white/85 outline-none focus:border-indigo-400/50"
                            />
                        </div>
                    </label>

                    {mode === 'register' && (
                        <label className="block space-y-1">
                            <span className="text-xs text-white/60">确认密码</span>
                            <div className="relative">
                                <Lock className="h-3.5 w-3.5 text-white/30 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    autoComplete="new-password"
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="再次输入密码"
                                    className="w-full pl-8 pr-3 py-2 rounded-md border border-white/12 bg-[#090d16] text-sm text-white/85 outline-none focus:border-indigo-400/50"
                                />
                            </div>
                        </label>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-indigo-500/90 hover:bg-indigo-500 text-sm font-medium disabled:opacity-55 disabled:pointer-events-none"
                    >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        <span>{mode === 'login' ? '登录' : '注册'}</span>
                    </button>

                    <div className="pt-1 text-xs text-white/55 text-center">
                        {mode === 'login' ? '没有账号？' : '已有账号？'}
                        <button
                            type="button"
                            onClick={() => setMode((prev) => (prev === 'login' ? 'register' : 'login'))}
                            className="ml-1 text-indigo-300 hover:text-indigo-200"
                        >
                            {mode === 'login' ? '去注册' : '去登录'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

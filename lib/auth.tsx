'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken, type User } from '@/lib/api'

type AuthResponse = { user: User; token: string }

type RegisterResponse = { message: string; email: string; verification_required: boolean }

type MessageResponse = { message: string }

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  /** Creates the account; the user must then enter the emailed code. */
  register: (data: { name: string; email: string; phone?: string; password: string; password_confirmation: string }) => Promise<RegisterResponse>
  verifyEmail: (email: string, code: string) => Promise<void>
  resendVerificationCode: (email: string) => Promise<string>
  sendPasswordResetCode: (email: string) => Promise<string>
  resetPassword: (data: { email: string; code: string; password: string; password_confirmation: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    api<User>('/me')
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  const signIn = useCallback((response: AuthResponse) => {
    setToken(response.token)
    setUser(response.user)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    signIn(await api<AuthResponse>('/login', { method: 'POST', body: JSON.stringify({ email, password }) }))
  }, [signIn])

  const register = useCallback(async (data: Parameters<AuthContextValue['register']>[0]) => {
    return api<RegisterResponse>('/register', { method: 'POST', body: JSON.stringify(data) })
  }, [])

  const verifyEmail = useCallback(async (email: string, code: string) => {
    signIn(await api<AuthResponse>('/email/verify', { method: 'POST', body: JSON.stringify({ email, code }) }))
  }, [signIn])

  const resendVerificationCode = useCallback(async (email: string) => {
    const response = await api<MessageResponse>('/email/resend', { method: 'POST', body: JSON.stringify({ email }) })
    return response.message
  }, [])

  const sendPasswordResetCode = useCallback(async (email: string) => {
    const response = await api<MessageResponse>('/password/forgot', { method: 'POST', body: JSON.stringify({ email }) })
    return response.message
  }, [])

  const resetPassword = useCallback(async (data: Parameters<AuthContextValue['resetPassword']>[0]) => {
    signIn(await api<AuthResponse>('/password/reset', { method: 'POST', body: JSON.stringify(data) }))
  }, [signIn])

  const logout = useCallback(async () => {
    await api('/logout', { method: 'POST' }).catch(() => undefined)
    setToken(null)
    setUser(null)
  }, [])

  return <AuthContext.Provider value={{ user, loading, login, register, verifyEmail, resendVerificationCode, sendPasswordResetCode, resetPassword, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

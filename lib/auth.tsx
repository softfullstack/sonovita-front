'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken, type User } from '@/lib/api'

type AuthResponse = { user: User; token: string }

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; phone?: string; password: string; password_confirmation: string }) => Promise<void>
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

  const login = useCallback(async (email: string, password: string) => {
    const response = await api<AuthResponse>('/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    setToken(response.token)
    setUser(response.user)
  }, [])

  const register = useCallback(async (data: Parameters<AuthContextValue['register']>[0]) => {
    const response = await api<AuthResponse>('/register', { method: 'POST', body: JSON.stringify(data) })
    setToken(response.token)
    setUser(response.user)
  }, [])

  const logout = useCallback(async () => {
    await api('/logout', { method: 'POST' }).catch(() => undefined)
    setToken(null)
    setUser(null)
  }, [])

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

/** Sends guests to the login page and back here after signing in. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/ingresar/?next=${encodeURIComponent(window.location.pathname + window.location.search)}`)
    }
  }, [loading, user, router])

  if (loading || !user) {
    return <div className="mx-auto max-w-7xl px-5 py-20 text-center text-[#796d77]">Cargando…</div>
  }

  return <>{children}</>
}

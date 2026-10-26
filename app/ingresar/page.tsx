'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Alert, Field, PrimaryButton, inputClass } from '@/components/form'
import { ApiError } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { safeNext } from '@/lib/navigation'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const next = safeNext(useSearchParams().get('next'))
  const [error, setError] = useState<ApiError | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email'))
    setSubmitting(true)
    setError(null)
    try {
      await login(email, String(data.get('password')))
      router.push(next)
    } catch (exception) {
      if (exception instanceof ApiError && exception.code === 'email_not_verified') {
        router.push(`/verificar-correo/?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`)
        return
      }
      setError(exception as ApiError)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-serif text-4xl font-bold text-[#51305f]">Ingresar</h1>
      <p className="mt-2 text-[#796d77]">Para publicar tus equipos y ver el contacto de los vendedores.</p>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-[#eadfe5] bg-white p-6">
        {error && !error.field('email') && <Alert>{error.message}</Alert>}
        <Field label="Correo" error={error?.field('email')}>
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </Field>
        <Field label="Contraseña" error={error?.field('password')}>
          <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
        </Field>
        <PrimaryButton type="submit" disabled={submitting} className="w-full">{submitting ? 'Ingresando…' : 'Ingresar'}</PrimaryButton>
      </form>
      <p className="mt-6 text-center text-sm text-[#796d77]">¿No tienes cuenta? <Link href={`/registro/?next=${encodeURIComponent(next)}`} className="font-bold text-[#f47d43]">Regístrate</Link></p>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Alert, Field, PrimaryButton, inputClass } from '@/components/form'
import { ApiError } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { safeNext } from '@/lib/navigation'

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()
  const next = safeNext(useSearchParams().get('next'))
  const [error, setError] = useState<ApiError | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>
    setSubmitting(true)
    setError(null)
    try {
      await register({ name: data.name, email: data.email, phone: data.phone || undefined, password: data.password, password_confirmation: data.password_confirmation })
      router.push(next)
    } catch (exception) {
      setError(exception as ApiError)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-serif text-4xl font-bold text-[#51305f]">Crear cuenta</h1>
      <p className="mt-2 text-[#796d77]">Publica tus equipos y contacta a otros vendedores.</p>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-[#eadfe5] bg-white p-6">
        {error && Object.keys(error.errors).length === 0 && <Alert>{error.message}</Alert>}
        <Field label="Nombre o razón social" error={error?.field('name')}>
          <input name="name" required autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Correo" error={error?.field('email')}>
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </Field>
        <Field label="Teléfono" hint="Lo verán los compradores interesados en tus equipos." error={error?.field('phone')}>
          <input name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </Field>
        <Field label="Contraseña" hint="Mínimo 8 caracteres." error={error?.field('password')}>
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
        </Field>
        <Field label="Confirmar contraseña">
          <input name="password_confirmation" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
        </Field>
        <PrimaryButton type="submit" disabled={submitting} className="w-full">{submitting ? 'Creando cuenta…' : 'Crear cuenta'}</PrimaryButton>
      </form>
      <p className="mt-6 text-center text-sm text-[#796d77]">¿Ya tienes cuenta? <Link href={`/ingresar/?next=${encodeURIComponent(next)}`} className="font-bold text-[#f47d43]">Ingresa</Link></p>
    </div>
  )
}

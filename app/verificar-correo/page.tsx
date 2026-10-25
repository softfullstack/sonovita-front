'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Alert, Field, PrimaryButton, inputClass } from '@/components/form'
import { CodeInput, ResendCodeButton } from '@/components/verification-code'
import { ApiError } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { safeNext } from '@/lib/navigation'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  )
}

function VerifyEmailForm() {
  const { verifyEmail, resendVerificationCode } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const next = safeNext(params.get('next'))
  // Coming from registration the code was just sent; coming from login it may have expired.
  const justRegistered = params.get('enviado') === '1'
  const [email, setEmail] = useState(params.get('email') ?? '')
  const [code, setCode] = useState('')
  const [error, setError] = useState<ApiError | null>(null)
  const [notice, setNotice] = useState<string | null>(justRegistered ? 'Te enviamos un código de 6 dígitos a tu correo. Revisa también la carpeta de spam.' : null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await verifyEmail(email, code)
      router.push(next)
    } catch (exception) {
      setError(exception as ApiError)
      setSubmitting(false)
    }
  }

  const resend = async () => {
    setError(null)
    try {
      setNotice(await resendVerificationCode(email))
      setCode('')
    } catch (exception) {
      setError(exception as ApiError)
      throw exception
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-serif text-4xl font-bold text-[#51305f]">Activa tu cuenta</h1>
      <p className="mt-2 text-[#796d77]">Escribe el código que enviamos a tu correo. Vence en 15 minutos.</p>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-[#eadfe5] bg-white p-6">
        {notice && !error && <Alert tone="success">{notice}</Alert>}
        {error && Object.keys(error.errors).length === 0 && <Alert>{error.message}</Alert>}
        <Field label="Correo" error={error?.field('email')}>
          <input name="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
        </Field>
        <Field label="Código de verificación" error={error?.field('code')}>
          <CodeInput value={code} onChange={setCode} />
        </Field>
        <PrimaryButton type="submit" disabled={submitting || code.length !== 6} className="w-full">{submitting ? 'Verificando…' : 'Activar cuenta'}</PrimaryButton>
        <div className="text-center">
          <ResendCodeButton onResend={resend} startCoolingDown={justRegistered} />
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-[#796d77]">¿Ya la activaste? <Link href={`/ingresar/?next=${encodeURIComponent(next)}`} className="font-bold text-[#f47d43]">Ingresa</Link></p>
    </div>
  )
}

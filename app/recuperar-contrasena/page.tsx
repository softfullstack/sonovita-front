'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Alert, Field, PrimaryButton, inputClass } from '@/components/form'
import { CodeInput, ResendCodeButton } from '@/components/verification-code'
import { ApiError } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { safeNext } from '@/lib/navigation'

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  )
}

/** Step 1 asks for the email and sends the code; step 2 takes the code and the new password. */
function ForgotPasswordForm() {
  const { sendPasswordResetCode, resetPassword } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const next = safeNext(params.get('next'))
  const [email, setEmail] = useState(params.get('email') ?? '')
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const requestCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      setNotice(await sendPasswordResetCode(email))
      setCodeSent(true)
    } catch (exception) {
      setError(exception as ApiError)
    } finally {
      setSubmitting(false)
    }
  }

  const resend = async () => {
    setError(null)
    try {
      setNotice(await sendPasswordResetCode(email))
      setCode('')
    } catch (exception) {
      setError(exception as ApiError)
      throw exception
    }
  }

  const submitNewPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmitting(true)
    setError(null)
    try {
      await resetPassword({ email, code, password: String(data.get('password')), password_confirmation: String(data.get('password_confirmation')) })
      router.push(next)
    } catch (exception) {
      setError(exception as ApiError)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="font-serif text-4xl font-bold text-[#51305f]">Recuperar contraseña</h1>
      <p className="mt-2 text-[#796d77]">
        {codeSent ? 'Escribe el código que te enviamos y elige tu nueva contraseña.' : 'Te enviaremos un código a tu correo para que elijas una nueva contraseña.'}
      </p>

      {!codeSent ? (
        <form onSubmit={requestCode} className="mt-8 space-y-4 rounded-2xl border border-[#eadfe5] bg-white p-6">
          {error && !error.field('email') && <Alert>{error.message}</Alert>}
          <Field label="Correo" error={error?.field('email')}>
            <input name="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
          </Field>
          <PrimaryButton type="submit" disabled={submitting} className="w-full">{submitting ? 'Enviando…' : 'Enviar código'}</PrimaryButton>
        </form>
      ) : (
        <form onSubmit={submitNewPassword} className="mt-8 space-y-4 rounded-2xl border border-[#eadfe5] bg-white p-6">
          {notice && !error && <Alert tone="success">{notice}</Alert>}
          {error && Object.keys(error.errors).length === 0 && <Alert>{error.message}</Alert>}
          <p className="text-sm text-[#5e5260]">
            Correo: <span className="font-semibold">{email}</span>{' '}
            <button type="button" onClick={() => { setCodeSent(false); setCode(''); setError(null) }} className="font-bold text-[#f47d43]">Cambiar</button>
          </p>
          <Field label="Código" error={error?.field('code')}>
            <CodeInput value={code} onChange={setCode} />
          </Field>
          <Field label="Nueva contraseña" hint="Mínimo 8 caracteres." error={error?.field('password')}>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
          </Field>
          <Field label="Confirmar nueva contraseña">
            <input name="password_confirmation" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
          </Field>
          <PrimaryButton type="submit" disabled={submitting || code.length !== 6} className="w-full">{submitting ? 'Guardando…' : 'Cambiar contraseña'}</PrimaryButton>
          <div className="text-center">
            <ResendCodeButton onResend={resend} />
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-[#796d77]">¿La recordaste? <Link href={`/ingresar/?next=${encodeURIComponent(next)}`} className="font-bold text-[#f47d43]">Ingresa</Link></p>
    </div>
  )
}

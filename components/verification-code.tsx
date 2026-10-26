'use client'

import { useEffect, useState } from 'react'
import { inputClass } from '@/components/form'
import { cn } from '@/lib/utils'

/** Seconds the API waits before emailing another code. */
export const RESEND_COOLDOWN_SECONDS = 60

/** Six digit input for the code we email; keeps only digits. */
export function CodeInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      name="code"
      required
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="\d{6}"
      maxLength={6}
      placeholder="000000"
      className={cn(inputClass, 'text-center font-mono text-2xl tracking-[0.5em]')}
    />
  )
}

/** Link-style button that asks for a new code and then waits out the cooldown. */
export function ResendCodeButton({ onResend, startCoolingDown = true }: { onResend: () => Promise<void>; startCoolingDown?: boolean }) {
  const [secondsLeft, setSecondsLeft] = useState(startCoolingDown ? RESEND_COOLDOWN_SECONDS : 0)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (secondsLeft <= 0) {
      return
    }
    const timer = window.setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  const resend = async () => {
    setSending(true)
    try {
      await onResend()
      setSecondsLeft(RESEND_COOLDOWN_SECONDS)
    } catch {
      // The page shows the error; the button stays available to try again.
    } finally {
      setSending(false)
    }
  }

  return (
    <button type="button" onClick={resend} disabled={sending || secondsLeft > 0} className="text-sm font-bold text-[#f47d43] disabled:cursor-not-allowed disabled:font-medium disabled:text-[#a99ba7]">
      {sending ? 'Enviando…' : secondsLeft > 0 ? `Reenviar código en ${secondsLeft} s` : 'Reenviar código'}
    </button>
  )
}

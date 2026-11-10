'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, CheckCircle2, Copy, Download, ImageOff, Wallet } from 'lucide-react'
import { QuoteCarousel } from '@/components/quote-carousel'
import { Field, inputClass } from '@/components/form'
import { api, formatMoney, toApiError, type ApiError, type Quote } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

/** Badge color per plan, from the Sonovita orange to its purple. */
const TERM_COLORS = ['#f6a172', '#f47d43', '#c25a6f', '#84406f', '#51305f']

export default function QuotePage() {
  return (
    <Suspense fallback={null}>
      <QuoteDetail />
    </Suspense>
  )
}

function formatDate(value: string): string {
  // Dates without time are read as local dates, so 2026-11-25 never shows as the 24th.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value)
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function wholeMoney(amount: number | string, currency: string): string {
  return formatMoney(amount, currency, 0)
}

function QuoteDetail() {
  const token = useSearchParams().get('id')
  const { user } = useAuth()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonths, setSelectedMonths] = useState<number | null>(null)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState<ApiError | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('No encontramos esta cotización.')
      return
    }
    api<{ data: Quote }>(`/quotes/${encodeURIComponent(token)}`)
      .then((response) => {
        setQuote(response.data)
        setSelectedMonths(response.data.selected_months)
      })
      .catch((exception) => setError(exception.status === 404 ? 'Esta cotización no existe. Revisa que el link esté completo.' : exception.message))
  }, [token])

  useEffect(() => {
    if (quote) {
      // Browsers use the page title as the name of the saved PDF.
      document.title = `Cotización ${quote.folio} - ${quote.device.title} - Sonovita`
    }
  }, [quote])

  useEffect(() => {
    if (user) {
      setPhone((current) => current || user.phone || '')
      setEmail((current) => current || user.email)
    }
  }, [user])

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-[#796d77]">{error}</p>
        <Link href="/catalogo/" className="mt-6 inline-flex rounded-full bg-[#51305f] px-6 py-3 text-sm font-bold text-white">Ver catálogo</Link>
      </div>
    )
  }

  if (!quote) {
    return <div className="mx-auto max-w-4xl px-5 py-24 text-center text-[#796d77]">Cargando cotización…</div>
  }

  const confirmed = quote.confirmed_at !== null
  const canConfirm = !confirmed && !quote.is_expired
  const shareUrl = quote.url || window.location.href

  async function confirmQuote() {
    if (!quote || selectedMonths === null) {
      return
    }
    setConfirming(true)
    setConfirmError(null)
    try {
      const response = await api<{ data: Quote }>(`/quotes/${encodeURIComponent(quote.token)}/confirmation`, {
        method: 'POST',
        body: JSON.stringify({ months: selectedMonths, phone, email: email.trim() || null }),
      })
      setQuote(response.data)
    } catch (exception) {
      setConfirmError(toApiError(exception))
    } finally {
      setConfirming(false)
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copia el link de la cotización', shareUrl)
    }
  }

  return (
    <div className="bg-[#f6f0ec] px-3 py-8 sm:px-6 print:bg-white print:p-0">
      {/* Letter size page with no browser margins, so the bars reach the edges like the printed quote. */}
      <style>{'@page { size: letter; margin: 0; }'}</style>

      <article className="mx-auto flex max-w-[8.5in] flex-col overflow-hidden rounded-[28px] bg-white shadow-xl shadow-[#51305f]/10 print:h-[11in] print:max-w-none print:rounded-none print:shadow-none">
        <header className="flex items-center justify-between gap-4 rounded-b-[28px] bg-gradient-to-r from-[#3c2447] via-[#51305f] to-[#7a3f73] px-6 py-4 text-white sm:px-8">
          <img src="/logo-footer.png" alt="Sonovita" width={150} height={136} className="h-14 w-auto" />
          <div className="text-right">
            <p className="text-sm font-bold sm:text-base">{formatDate(quote.created_at)}</p>
            <p className="text-xs text-white/70">Cotización {quote.folio}</p>
          </div>
        </header>

        <div className="grid gap-8 px-6 pt-7 pb-6 sm:grid-cols-[1fr_1.1fr] sm:px-8 print:grid-cols-[1fr_1.1fr] print:gap-7 print:pt-5 print:pb-3">
          <div className="space-y-5">
            <p className="text-base font-bold text-[#27212b]">{quote.customer_name ?? 'Cotización personalizada'}</p>

            {quote.device.images.length ? (
              <QuoteCarousel images={quote.device.images} title={quote.device.title} />
            ) : (
              <div className="grid aspect-[4/3] place-items-center rounded-2xl bg-[#f6f0ec] text-[#c9b9c4]"><ImageOff size={40} /></div>
            )}

            <section className="rounded-2xl border-2 border-[#f47d43]/60 bg-white p-5 shadow-sm" aria-label="Pago inicial">
              <p className="text-center text-[#5e5260]">El <span className="font-bold text-[#27212b]">Pago Inicial</span> incluye:</p>
              <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-[#5e5260]"><Wallet size={18} className="text-[#f47d43]" />Enganche</span>
                <span className="text-[#27212b]">{wholeMoney(quote.down_payment, quote.currency)}</span>
              </div>
              <div className="ml-auto mt-3 w-1/2 border-t-2 border-[#27212b] pt-2 text-right font-bold text-[#27212b]">{wholeMoney(quote.down_payment, quote.currency)}</div>
            </section>
          </div>

          <div>
            <div>
              <div>
                <h1 className="border-b-2 border-[#d9cdd4] pb-1 text-2xl leading-tight text-[#51305f] sm:text-[1.7rem]">{quote.device.title}</h1>
                <p className="mt-2 text-3xl font-bold text-[#f47d43]">{wholeMoney(quote.price, quote.currency)}</p>
              </div>
            </div>

            <div role="radiogroup" aria-label="Plazo de financiamiento" className="mt-5 space-y-3 print:mt-4 print:space-y-2">
              {quote.plans.map((plan, position) => {
                const color = TERM_COLORS[position % TERM_COLORS.length]
                const isSelected = selectedMonths === plan.months
                const isDimmed = confirmed && !isSelected
                return (
                  <button
                    key={plan.months}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={!canConfirm}
                    onClick={() => setSelectedMonths(plan.months)}
                    className={cn(
                      'relative w-full rounded-2xl border bg-white px-5 py-3 text-left disabled:cursor-default print:py-2',
                      isSelected ? 'border-[#f47d43] ring-2 ring-[#f47d43]/40' : 'border-[#9b8f98]/70 enabled:hover:border-[#f47d43]',
                      isDimmed && 'opacity-50 print:opacity-100',
                    )}
                  >
                    <span className="absolute top-3 right-4 rounded-full px-3 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: color }}>{plan.months} meses</span>
                    <span className="flex items-center gap-2 text-[#27212b]">
                      {isSelected && <CheckCircle2 size={16} className="text-[#f47d43]" />}
                      Financiamiento
                    </span>
                    <span className="mt-0.5 block text-2xl print:text-xl" style={{ color }}>{wholeMoney(plan.monthly_payment, quote.currency)}/mes</span>
                    <span className="mt-2 grid grid-cols-2 text-center text-sm print:mt-1 print:text-xs">
                      <span><span className="block text-[#5e5260]">Pago Inicial</span><span className="text-[#27212b]">{wholeMoney(quote.down_payment, quote.currency)}</span></span>
                      <span><span className="block text-[#5e5260]">Costo total</span><span className="text-[#27212b]">{wholeMoney(plan.total_cost, quote.currency)}</span></span>
                    </span>
                  </button>
                )
              })}
            </div>

            {confirmed ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 print:hidden" role="status">
                <p className="flex items-center gap-2 font-bold"><CheckCircle2 size={18} />Cotización enviada</p>
                <p className="mt-1">Su solicitud del plan a {quote.selected_months} meses fue enviada a un agente de Sonovita, quien se pondrá en contacto con usted a la brevedad.</p>
              </div>
            ) : quote.is_expired ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 print:hidden">
                Esta cotización venció el {formatDate(quote.valid_until)}. <Link href={`/dispositivo/?slug=${quote.device.slug}`} className="font-bold underline">Vuelva a cotizar el equipo</Link> para obtener montos vigentes.
              </div>
            ) : selectedMonths !== null ? (
              <div className="mt-5 rounded-2xl border border-[#eadfe5] bg-[#fff8f5] p-5 print:hidden">
                <p className="text-sm leading-relaxed text-[#5e5260]">
                  Al confirmar, su cotización con el plan a <span className="font-bold text-[#27212b]">{selectedMonths} meses</span> será enviada a un agente de Sonovita, quien se pondrá en contacto con usted a la brevedad para dar seguimiento a su solicitud.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Teléfono de contacto" error={confirmError?.field('phone')}>
                    <input className={inputClass} type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="10 dígitos" />
                  </Field>
                  <Field label="Correo (opcional)" error={confirmError?.field('email')}>
                    <input className={inputClass} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                  </Field>
                </div>
                {confirmError && !confirmError.field('phone') && !confirmError.field('email') && (
                  <p className="mt-3 text-sm font-medium text-red-600">{confirmError.field('months') ?? confirmError.message}</p>
                )}
                <button
                  type="button"
                  onClick={confirmQuote}
                  disabled={confirming || phone.replace(/\D/g, '').length < 10}
                  className="mt-4 w-full rounded-full bg-[#f47d43] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#df6935] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {confirming ? 'Enviando…' : 'Confirmar'}
                </button>
              </div>
            ) : (
              <p className="mt-4 text-center text-sm text-[#8a7d87] print:hidden">Seleccione el plazo de su preferencia para confirmar su cotización.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 px-6 pb-4 text-sm text-[#5e5260] sm:flex-row sm:items-end sm:px-8 print:mt-auto print:flex-row print:items-end print:text-xs">
          <div>
            <p className="font-bold text-[#51305f]">Cotización ID <span className="ml-1 rounded-full border border-[#9b8f98] px-2 py-0.5 text-xs font-normal text-[#5e5260]">{quote.folio}</span></p>
            <p className="mt-1">Los precios están expresados en {quote.currency === 'MXN' ? 'pesos (MXN)' : quote.currency}.</p>
            <p>Esta cotización está sujeta a cambios. Vigencia de 15 días naturales, hasta el {formatDate(quote.valid_until)}.</p>
            <p>Tasa anual de {Number(quote.annual_rate)}%. Financiamiento sujeto a aprobación.</p>
          </div>
        </div>

        <footer className="flex flex-col gap-2 bg-gradient-to-r from-[#3c2447] via-[#51305f] to-[#7a3f73] px-6 py-4 text-sm text-white sm:flex-row sm:items-center sm:justify-between sm:px-8 print:flex-row print:items-center print:justify-between">
          <span className="font-bold">sonovita.com.mx</span>
          <span className="text-white/80">Marketplace de equipos médicos</span>
          <span className="break-all text-xs text-white/70">{shareUrl}</span>
        </footer>
      </article>

      <div className="fixed right-4 bottom-6 z-40 flex flex-col items-end gap-2 sm:right-6 print:hidden">
        <button type="button" onClick={copyLink} aria-label="Copiar link" className="inline-flex items-center gap-2 rounded-full border border-[#eadfe5] bg-white p-3 text-sm font-bold text-[#51305f] shadow-md hover:border-[#f47d43] sm:px-4 sm:py-2.5">
          {copied ? <Check size={16} /> : <Copy size={16} />}<span className="hidden sm:inline">{copied ? 'Link copiado' : 'Copiar link'}</span>
        </button>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-[#f47d43] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#f47d43]/30 hover:bg-[#df6935]">
          <Download size={18} />Descargar PDF
        </button>
      </div>
    </div>
  )
}

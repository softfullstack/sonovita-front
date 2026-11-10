'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, Copy, Download, MessageCircle } from 'lucide-react'
import { api, formatMoney, type Quote } from '@/lib/api'

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

function QuoteDetail() {
  const token = useSearchParams().get('id')
  const [quote, setQuote] = useState<Quote | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('No encontramos esta cotización.')
      return
    }
    api<{ data: Quote }>(`/quotes/${encodeURIComponent(token)}`)
      .then((response) => setQuote(response.data))
      .catch((exception) => setError(exception.status === 404 ? 'Esta cotización no existe. Revisa que el link esté completo.' : exception.message))
  }, [token])

  useEffect(() => {
    if (quote) {
      // Browsers use the page title as the name of the saved PDF.
      document.title = `Cotización ${quote.folio} | Sonovita`
    }
  }, [quote])

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

  const shareUrl = quote.url || window.location.href
  const deviceDetails = [quote.device.brand, quote.device.model].filter(Boolean).join(' · ')
  const whatsappText = `Cotización ${quote.folio} de Sonovita: ${quote.device.title}\n${shareUrl}`

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
    <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8 print:max-w-none print:p-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={`/dispositivo/?slug=${quote.device.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#5e5260] hover:text-[#f47d43]"><ArrowLeft size={16} />Ver equipo</Link>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-[#eadfe5] bg-white px-4 py-2.5 text-sm font-bold text-[#51305f] hover:border-[#f47d43]">
            {copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Link copiado' : 'Copiar link'}
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#eadfe5] bg-white px-4 py-2.5 text-sm font-bold text-[#51305f] hover:border-[#f47d43]"><MessageCircle size={16} />WhatsApp</a>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-[#f47d43] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#df6935]"><Download size={16} />Descargar PDF</button>
        </div>
      </div>

      {quote.is_expired && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 print:hidden">Esta cotización venció el {formatDate(quote.valid_until)}. Vuelve a cotizar el equipo para obtener montos vigentes.</div>
      )}
      {!quote.device.is_available && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 print:hidden">Este equipo ya no está publicado en la tienda.</div>
      )}

      <article className="rounded-3xl border border-[#eadfe5] bg-white p-6 sm:p-10 print:rounded-none print:border-0 print:p-0">
        <header className="flex flex-col justify-between gap-6 border-b border-[#eadfe5] pb-6 sm:flex-row sm:items-start print:flex-row">
          <img src="/logo-sonovita.png" alt="Sonovita" width={292} height={85} className="h-12 w-auto" />
          <div className="sm:text-right print:text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-[#f47d43]">Cotización</p>
            <p className="font-serif text-2xl font-bold text-[#51305f]">{quote.folio}</p>
            <p className="mt-1 text-sm text-[#796d77]">Fecha: {formatDate(quote.created_at)}</p>
            <p className="text-sm text-[#796d77]">Vigencia: hasta el {formatDate(quote.valid_until)}</p>
          </div>
        </header>

        {quote.customer_name && (
          <p className="mt-6 text-sm text-[#5e5260]">Preparada para <span className="font-bold text-[#27212b]">{quote.customer_name}</span></p>
        )}

        <section className="mt-6 flex gap-5">
          {quote.device.cover_image && (
            <img src={quote.device.cover_image.url} alt="" className="h-24 w-32 shrink-0 rounded-xl border border-[#eadfe5] object-cover" />
          )}
          <div>
            <h1 className="font-serif text-2xl font-bold leading-tight text-[#51305f]">{quote.device.title}</h1>
            {deviceDetails && <p className="mt-1 text-sm text-[#796d77]">{deviceDetails}</p>}
          </div>
        </section>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-[#fff8f5] p-5 sm:grid-cols-4 print:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[#8a7d87]">Precio del equipo</dt>
            <dd className="mt-1 font-bold text-[#27212b]">{formatMoney(quote.price, quote.currency)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[#8a7d87]">Pago inicial</dt>
            <dd className="mt-1 font-bold text-[#27212b]">{formatMoney(quote.down_payment, quote.currency)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[#8a7d87]">Monto a financiar</dt>
            <dd className="mt-1 font-bold text-[#27212b]">{formatMoney(quote.financed_amount, quote.currency)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[#8a7d87]">Tasa anual</dt>
            <dd className="mt-1 font-bold text-[#27212b]">{Number(quote.annual_rate) > 0 ? `${Number(quote.annual_rate)}%` : 'Sin intereses'}</dd>
          </div>
        </dl>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold text-[#51305f]">Mensualidades</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-[#eadfe5]">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="bg-[#51305f] text-left text-xs uppercase tracking-wide text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Plazo</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Mensualidad</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Intereses</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Costo total</th>
                </tr>
              </thead>
              <tbody>
                {quote.plans.map((plan) => (
                  <tr key={plan.months} className="border-t border-[#eadfe5] first:border-t-0 even:bg-[#fffaf7]">
                    <td className="px-4 py-3 font-semibold text-[#5e5260]">{plan.months} meses</td>
                    <td className="px-4 py-3 text-right font-bold text-[#27212b]">{formatMoney(plan.monthly_payment, quote.currency)}</td>
                    <td className="px-4 py-3 text-right text-[#5e5260]">{formatMoney(plan.total_interest, quote.currency)}</td>
                    <td className="px-4 py-3 text-right text-[#5e5260]">{formatMoney(plan.total_cost, quote.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#8a7d87]">
            El costo total incluye el pago inicial. Montos en {quote.currency}, calculados con pagos fijos mensuales. Esta cotización es informativa y no constituye una oferta de crédito; el financiamiento está sujeto a aprobación.
          </p>
        </section>

        <footer className="mt-8 border-t border-[#eadfe5] pt-4 text-xs text-[#8a7d87]">
          <p>Consulta esta cotización en línea: <span className="break-all font-semibold text-[#51305f]">{shareUrl}</span></p>
        </footer>
      </article>
    </div>
  )
}

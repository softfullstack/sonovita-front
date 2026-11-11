'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, FileText } from 'lucide-react'
import { Alert, Field, PrimaryButton, inputClass } from '@/components/form'
import { api, formatMoney, monthlyPayment, toApiError, type ApiError, type Device, type Financing, type Quote } from '@/lib/api'
import { cn } from '@/lib/utils'

const DOWN_PAYMENT_SHORTCUTS = [10, 20, 30, 50]

/** Only digits and one decimal point, so the field accepts "150,000" or "150000.50". */
function parseAmount(value: string): number {
  const cleaned = value.replace(/[^\d.]/g, '')
  return cleaned === '' ? 0 : Number(cleaned)
}

/**
 * Down payment field and the monthly plans for the device. Saving creates a
 * quote with its own link, which the customer can share or download as PDF.
 */
export function FinancingQuote({ device, defaultName }: { device: Device; defaultName?: string }) {
  const router = useRouter()
  const price = Number(device.price)
  const [financing, setFinancing] = useState<Financing | null>(null)
  const [downPaymentInput, setDownPaymentInput] = useState(() => String(Math.round(price * 0.2)))
  const [customerName, setCustomerName] = useState(defaultName ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    api<{ data: Financing }>('/financing')
      .then((response) => setFinancing(response.data))
      .catch((exception) => setError(toApiError(exception)))
  }, [])

  useEffect(() => {
    if (defaultName) {
      setCustomerName((current) => current || defaultName)
    }
  }, [defaultName])

  const downPayment = parseAmount(downPaymentInput)
  const financedAmount = Math.max(price - downPayment, 0)
  const downPaymentError = downPayment >= price ? 'El pago inicial debe ser menor al precio del equipo.' : error?.field('down_payment')

  async function saveQuote() {
    setSaving(true)
    setError(null)
    try {
      const response = await api<{ data: Quote }>('/quotes', {
        method: 'POST',
        body: JSON.stringify({ device: device.slug, down_payment: downPayment, customer_name: customerName.trim() || null }),
      })
      router.push(`/cotizacion/?id=${response.data.token}`)
    } catch (exception) {
      setError(toApiError(exception))
      setSaving(false)
    }
  }

  return (
    <section id="cotiza-a-meses" className="mt-6 scroll-mt-6 rounded-2xl border border-[#eadfe5] bg-white p-6" aria-labelledby="financing-title">
      <h2 id="financing-title" className="flex items-center gap-2 font-serif text-xl font-bold text-[#51305f]"><Calculator size={20} className="text-[#f47d43]" />Cotiza a meses</h2>
      <p className="mt-1 text-sm text-[#796d77]">Escribe tu pago inicial y elige el plazo que más te convenga.</p>

      <div className="mt-5 space-y-4">
        <Field label="Pago inicial (enganche)" error={downPaymentError}>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8a7d87]">$</span>
            <input
              className={cn(inputClass, 'pl-8')}
              inputMode="decimal"
              value={downPaymentInput}
              onChange={(event) => setDownPaymentInput(event.target.value)}
              aria-describedby="down-payment-shortcuts"
            />
          </div>
        </Field>
        <div id="down-payment-shortcuts" className="flex flex-wrap gap-2">
          {DOWN_PAYMENT_SHORTCUTS.map((percent) => {
            const amount = Math.round((price * percent) / 100)
            return (
              <button
                key={percent}
                type="button"
                onClick={() => setDownPaymentInput(String(amount))}
                className={cn('rounded-full border px-3 py-1.5 text-xs font-bold', downPayment === amount ? 'border-[#f47d43] bg-[#fff1ea] text-[#df6935]' : 'border-[#eadfe5] text-[#5e5260] hover:border-[#f47d43]')}
              >
                {percent}%
              </button>
            )
          })}
        </div>

        <div className="flex items-baseline justify-between rounded-xl bg-[#fff8f5] px-4 py-3 text-sm">
          <span className="text-[#5e5260]">Monto a financiar</span>
          <span className="font-bold text-[#51305f]">{formatMoney(financedAmount, device.currency)}</span>
        </div>

        {financing ? (
          <div className="overflow-hidden rounded-xl border border-[#eadfe5]">
            <table className="w-full text-sm">
              <thead className="bg-[#51305f] text-left text-xs uppercase tracking-wide text-white">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-semibold">Plazo</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-semibold">Mensualidad</th>
                </tr>
              </thead>
              <tbody>
                {financing.terms.map((months) => (
                  <tr key={months} className="border-t border-[#eadfe5] first:border-t-0">
                    <td className="px-4 py-2.5 text-[#5e5260]">{months} meses</td>
                    <td className="px-4 py-2.5 text-right font-bold text-[#27212b]">{formatMoney(monthlyPayment(financedAmount, financing.annual_rate, months), device.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-[#eadfe5] bg-[#fffaf7] px-4 py-2 text-xs text-[#8a7d87]">
              {financing.annual_rate > 0 ? `Tasa de interés anual de ${financing.annual_rate}%.` : 'Sin intereses.'} Cálculo informativo, sujeto a aprobación.
            </p>
          </div>
        ) : (
          !error && <p className="text-sm text-[#8a7d87]">Calculando mensualidades…</p>
        )}

        <Field label="Nombre o clínica (opcional)" hint="Aparecerá en la cotización." error={error?.field('customer_name')}>
          <input className={inputClass} value={customerName} maxLength={120} onChange={(event) => setCustomerName(event.target.value)} placeholder="Ej. Clínica San Ángel" />
        </Field>

        {error && !error.field('down_payment') && !error.field('customer_name') && <Alert>{error.field('device') ?? error.message}</Alert>}

        <PrimaryButton type="button" onClick={saveQuote} disabled={saving || !financing || downPayment >= price} className="flex w-full items-center justify-center gap-2">
          <FileText size={16} />
          {saving ? 'Generando cotización…' : 'Generar cotización'}
        </PrimaryButton>
        <p className="text-center text-xs text-[#8a7d87]">Obtendrás un link propio para compartirla y descargarla en PDF.</p>
      </div>
    </section>
  )
}

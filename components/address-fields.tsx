'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Alert, Field, inputClass } from '@/components/form'
import { api, ApiError, type Device } from '@/lib/api'
import { MEXICAN_STATES, type PostalCodeInfo } from '@/lib/mexico'
import { cn } from '@/lib/utils'

type Lookup = { status: 'idle' | 'loading' | 'not_found' | 'error' } | { status: 'found'; info: PostalCodeInfo }

const readOnlyClass = cn(inputClass, 'cursor-default bg-[#f3ebe8] text-[#5e5260] focus:border-[#eadfe5] focus:bg-[#f3ebe8]')

/**
 * Address of a device. Typing the postal code fills state, municipality and
 * city from the SEPOMEX catalog, so the customer only picks the colonia. If the
 * code is not in the catalog, every field can be typed by hand.
 */
export function AddressFields({ device, error }: { device?: Device; error: ApiError | null }) {
  const [postalCode, setPostalCode] = useState(device?.postal_code ?? '')
  const [lookup, setLookup] = useState<Lookup>({ status: 'idle' })
  const [state, setState] = useState(device?.state ?? '')
  const [municipality, setMunicipality] = useState(device?.municipality ?? '')
  const [city, setCity] = useState(device?.city ?? '')
  const [neighborhood, setNeighborhood] = useState(device?.neighborhood ?? '')

  useEffect(() => {
    if (!/^\d{5}$/.test(postalCode)) {
      setLookup({ status: 'idle' })
      return
    }
    let cancelled = false
    setLookup({ status: 'loading' })
    api<{ data: PostalCodeInfo }>(`/postal-codes/${postalCode}`)
      .then(({ data }) => {
        if (cancelled) return
        setLookup({ status: 'found', info: data })
        setState(data.state)
        setMunicipality(data.municipality)
        setCity(data.city ?? '')
        setNeighborhood((current) => {
          const names = data.settlements.map((item) => item.name)
          if (names.includes(current)) return current
          return names.length === 1 ? names[0] : ''
        })
      })
      .catch((exception) => {
        if (!cancelled) setLookup({ status: exception instanceof ApiError && exception.status === 404 ? 'not_found' : 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [postalCode])

  const found = lookup.status === 'found' ? lookup.info : null
  const hasPostalCode = postalCode !== ''

  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 text-sm font-semibold text-[#51305f]">Ubicación del equipo</legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Código postal" hint="Escribe los 5 dígitos y llenamos el resto." error={error?.field('postal_code')}>
          <div className="relative">
            <input
              name="postal_code"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              pattern="\d{5}"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="Ej. 06700"
              className={inputClass}
            />
            {lookup.status === 'loading' && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#a99ba7]" />}
          </div>
        </Field>
        <Field label="Colonia" error={error?.field('neighborhood')}>
          {found ? (
            <select name="neighborhood" required value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)} className={inputClass}>
              <option value="" disabled>Selecciona tu colonia…</option>
              {found.settlements.map((item) => (
                <option key={item.name} value={item.name}>{item.type && item.type !== 'Colonia' ? `${item.name} (${item.type})` : item.name}</option>
              ))}
            </select>
          ) : (
            <input
              name="neighborhood"
              required={hasPostalCode}
              maxLength={255}
              value={neighborhood}
              onChange={(event) => setNeighborhood(event.target.value)}
              disabled={lookup.status === 'loading'}
              placeholder={lookup.status === 'idle' && !hasPostalCode ? 'Primero escribe el código postal' : ''}
              className={inputClass}
            />
          )}
        </Field>
      </div>
      {lookup.status === 'not_found' && <Alert tone="info">No encontramos ese código postal en el catálogo de SEPOMEX. Revísalo o escribe los datos a mano.</Alert>}
      {lookup.status === 'error' && <Alert>No pudimos consultar el código postal. Puedes escribir los datos a mano.</Alert>}
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Estado" error={error?.field('state')}>
          {found ? (
            <input name="state" readOnly value={state} className={readOnlyClass} />
          ) : (
            <select name="state" required={hasPostalCode} value={state} onChange={(event) => setState(event.target.value)} className={inputClass}>
              <option value="">Selecciona…</option>
              {MEXICAN_STATES.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          )}
        </Field>
        <Field label="Municipio o alcaldía" error={error?.field('municipality')}>
          <input name="municipality" required={hasPostalCode} maxLength={255} readOnly={!!found} value={municipality} onChange={(event) => setMunicipality(event.target.value)} className={found ? readOnlyClass : inputClass} />
        </Field>
        <Field label="Ciudad" error={error?.field('city')}>
          <input name="city" maxLength={255} readOnly={!!found} value={city} onChange={(event) => setCity(event.target.value)} className={found ? readOnlyClass : inputClass} />
        </Field>
      </div>
    </fieldset>
  )
}

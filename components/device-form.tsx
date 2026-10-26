'use client'

import { useEffect, useState } from 'react'
import { Alert, Field, PrimaryButton, inputClass } from '@/components/form'
import { api, plainText, toApiError, type ApiError, type Category, type Device } from '@/lib/api'

const conditions = [
  { value: 'new', label: 'Nuevo' },
  { value: 'used', label: 'Usado' },
  { value: 'refurbished', label: 'Reacondicionado' },
]

/** Create or edit the data of a device (photos are handled separately). */
export function DeviceForm({ device, submitLabel, onSaved }: { device?: Device; submitLabel: string; onSaved: (device: Device) => void }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<ApiError | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api<{ data: Category[] }>('/categories').then((response) => setCategories(response.data)).catch(() => undefined)
  }, [])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>
    const payload = {
      ...data,
      category_id: data.category_id ? Number(data.category_id) : null,
      year: data.year ? Number(data.year) : null,
      price: data.price ? Number(data.price) : null,
    }
    setSaving(true)
    setError(null)
    try {
      const response = await api<{ data: Device }>(device ? `/my/devices/${device.id}` : '/my/devices', {
        method: device ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      })
      onSaved(response.data)
    } catch (exception) {
      setError(toApiError(exception))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-[#eadfe5] bg-white p-6">
      {error && <Alert>{Object.keys(error.errors).length ? 'Revisa los campos marcados.' : error.message}</Alert>}
      <Field label="Título del anuncio" error={error?.field('title')}>
        <input name="title" required maxLength={255} defaultValue={device?.title} placeholder="Ej. Ultrasonido GE Voluson E8" className={inputClass} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Categoría" error={error?.field('category_id')}>
          <select name="category_id" defaultValue={device?.category?.id ?? ''} className={inputClass} key={categories.length}>
            <option value="">Sin categoría</option>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </Field>
        <Field label="Estado del equipo" error={error?.field('condition')}>
          <select name="condition" required defaultValue={device?.condition ?? ''} className={inputClass}>
            <option value="" disabled>Selecciona…</option>
            {conditions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </Field>
        <Field label="Marca" error={error?.field('brand')}>
          <input name="brand" required maxLength={255} defaultValue={device?.brand} className={inputClass} />
        </Field>
        <Field label="Modelo" error={error?.field('model')}>
          <input name="model" required maxLength={255} defaultValue={device?.model} className={inputClass} />
        </Field>
        <Field label="Año" error={error?.field('year')}>
          <input name="year" type="number" min={1950} max={new Date().getFullYear() + 1} defaultValue={device?.year ?? ''} className={inputClass} />
        </Field>
        <Field label="Registro sanitario" hint="Opcional, ayuda a que tu anuncio se apruebe más rápido." error={error?.field('sanitary_registration')}>
          <input name="sanitary_registration" maxLength={255} defaultValue={device?.sanitary_registration ?? ''} className={inputClass} />
        </Field>
        <Field label="Precio" hint="Déjalo vacío para mostrar «Consultar precio»." error={error?.field('price')}>
          <input name="price" type="number" min={0} step="0.01" defaultValue={device?.price ?? ''} className={inputClass} />
        </Field>
        <Field label="Moneda" error={error?.field('currency')}>
          <select name="currency" defaultValue={device?.currency ?? 'MXN'} className={inputClass}>
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
          </select>
        </Field>
      </div>
      <Field label="Ubicación" error={error?.field('location')}>
        <input name="location" maxLength={255} defaultValue={device?.location ?? ''} placeholder="Ciudad, estado" className={inputClass} />
      </Field>
      <Field label="Descripción" error={error?.field('description')}>
        <textarea name="description" required rows={6} maxLength={10000} defaultValue={device ? plainText(device.description) : ''} placeholder="Accesorios incluidos, horas de uso, mantenimiento, garantía…" className={inputClass} />
      </Field>
      <PrimaryButton type="submit" disabled={saving}>{saving ? 'Guardando…' : submitLabel}</PrimaryButton>
    </form>
  )
}

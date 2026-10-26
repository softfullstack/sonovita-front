'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'
import { DeviceForm } from '@/components/device-form'
import { DeviceImages } from '@/components/device-images'
import { Alert, PrimaryButton } from '@/components/form'
import { RequireAuth } from '@/components/require-auth'
import { StatusBadge } from '@/components/status-badge'
import { api, type ApiError, type Device } from '@/lib/api'

export default function EditDevicePage() {
  return (
    <RequireAuth>
      <Suspense fallback={null}>
        <EditDevice />
      </Suspense>
    </RequireAuth>
  )
}

function EditDevice() {
  const id = useSearchParams().get('id')
  const [device, setDevice] = useState<Device | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api<{ data: Device }>(`/my/devices/${id}`)
      .then((response) => setDevice(response.data))
      .catch((exception: Error) => setError(exception.message))
  }, [id])

  const submitForReview = async () => {
    if (!device) return
    setSubmitting(true)
    setError(null)
    try {
      const response = await api<{ data: Device }>(`/my/devices/${device.id}/submission`, { method: 'POST' })
      setDevice(response.data)
      setNotice('¡Listo! Tu equipo está en revisión. Te avisaremos aquí cuando se publique.')
    } catch (exception) {
      setError((exception as ApiError).field?.('device') ?? (exception as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!device) {
    return <div className="mx-auto max-w-3xl px-5 py-20 text-center text-[#796d77]">{error ?? 'Cargando…'}</div>
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 py-12">
      <Link href="/mi-cuenta/dispositivos/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5e5260] hover:text-[#f47d43]"><ArrowLeft size={16} />Mis equipos</Link>
      <div>
        <StatusBadge status={device.status} label={device.status_label} />
        <h1 className="mt-3 font-serif text-4xl font-bold text-[#51305f]">{device.title}</h1>
      </div>

      {notice && <Alert tone="success">{notice}</Alert>}
      {error && <Alert>{error}</Alert>}
      {device.status === 'rejected' && device.rejection_reason && <Alert><strong>Motivo del rechazo:</strong> {device.rejection_reason}. Corrige lo necesario y vuelve a enviarlo.</Alert>}
      {device.status === 'pending' && !notice && <Alert tone="info">Tu equipo está en revisión. No se puede editar hasta que termine.</Alert>}
      {device.status === 'approved' && <Alert tone="success">Tu equipo está publicado. <Link href={`/dispositivo/?slug=${device.slug}`} className="font-bold underline">Ver anuncio</Link></Alert>}

      <DeviceImages device={device} onChange={(images) => setDevice({ ...device, images })} />

      {device.can_edit && (
        <>
          <DeviceForm key={device.id} device={device} submitLabel="Guardar cambios" onSaved={(saved) => { setDevice(saved); setNotice('Cambios guardados.') }} />
          <div className="flex flex-col items-start gap-2 rounded-2xl border border-[#eadfe5] bg-[#fff8f5] p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#5e5260]">Cuando tengas los datos y las fotos listos, envíalo para que lo revisemos.</p>
            <PrimaryButton onClick={submitForReview} disabled={submitting || device.images.length === 0} className="inline-flex items-center gap-2"><Send size={16} />{submitting ? 'Enviando…' : 'Enviar a revisión'}</PrimaryButton>
          </div>
        </>
      )}
    </div>
  )
}

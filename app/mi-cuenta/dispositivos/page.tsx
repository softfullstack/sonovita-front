'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ImageOff, Plus } from 'lucide-react'
import { RequireAuth } from '@/components/require-auth'
import { StatusBadge } from '@/components/status-badge'
import { api, formatPrice, type Device, type Paginated } from '@/lib/api'

export default function MyDevicesPage() {
  return (
    <RequireAuth>
      <MyDevices />
    </RequireAuth>
  )
}

function MyDevices() {
  const [devices, setDevices] = useState<Device[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<Paginated<Device>>('/my/devices').then((response) => setDevices(response.data)).catch((exception: Error) => setError(exception.message))
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f47d43]">Mi cuenta</p>
          <h1 className="font-serif text-4xl font-bold text-[#51305f]">Mis equipos</h1>
          <p className="mt-2 text-[#796d77]">Nuestro equipo revisa los datos y las fotos de cada anuncio antes de publicarlo.</p>
        </div>
        <Link href="/mi-cuenta/dispositivos/nuevo/" className="inline-flex items-center gap-2 rounded-full bg-[#f47d43] px-5 py-3 text-sm font-bold text-white hover:bg-[#df6935]"><Plus size={16} />Publicar equipo</Link>
      </div>

      {error && <div className="rounded-2xl border border-dashed border-[#ddced8] p-12 text-center text-[#796d77]">{error}</div>}
      {!devices && !error && <div className="py-12 text-center text-[#796d77]">Cargando…</div>}
      {devices?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#ddced8] p-12 text-center text-[#796d77]">
          Todavía no has publicado equipos.
          <div><Link href="/mi-cuenta/dispositivos/nuevo/" className="mt-4 inline-flex font-bold text-[#f47d43]">Publicar el primero →</Link></div>
        </div>
      )}

      <div className="space-y-4">
        {devices?.map((device) => (
          <article key={device.id} className="flex flex-col gap-4 rounded-2xl border border-[#eadfe5] bg-white p-4 sm:flex-row sm:items-center">
            <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-[#f2ebe7] sm:w-40">
              {device.cover_image ? <img src={device.cover_image.url} alt="" className="size-full object-cover" /> : <div className="grid size-full place-items-center text-[#c9b9c4]"><ImageOff size={28} /></div>}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={device.status} label={device.status_label} />
                <span className="text-xs text-[#8a7d87]">{device.images.length} {device.images.length === 1 ? 'foto' : 'fotos'}</span>
              </div>
              <h2 className="mt-2 font-serif text-xl font-bold text-[#51305f]">{device.title}</h2>
              <p className="text-sm text-[#796d77]">{device.brand} · {device.model} · {formatPrice(device)}</p>
              {device.status === 'rejected' && device.rejection_reason && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"><strong>Motivo del rechazo:</strong> {device.rejection_reason}</p>}
            </div>
            <div className="flex gap-2 sm:flex-col">
              <Link href={`/mi-cuenta/dispositivos/editar/?id=${device.id}`} className="rounded-full border border-[#51305f] px-4 py-2 text-center text-sm font-bold text-[#51305f] hover:bg-[#51305f] hover:text-white">{device.can_edit ? 'Editar' : 'Ver'}</Link>
              {device.status === 'approved' && <Link href={`/dispositivo/?slug=${device.slug}`} className="rounded-full px-4 py-2 text-center text-sm font-semibold text-[#f47d43]">Ver publicado</Link>}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

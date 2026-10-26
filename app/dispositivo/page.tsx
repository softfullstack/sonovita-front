'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, BadgeCheck, ImageOff, Mail, MapPin, Phone } from 'lucide-react'
import { api, formatPrice, plainText, type Device } from '@/lib/api'
import { useAuth } from '@/lib/auth'

export default function DevicePage() {
  return (
    <Suspense fallback={null}>
      <DeviceDetail />
    </Suspense>
  )
}

function DeviceDetail() {
  const slug = useSearchParams().get('slug')
  const { user, loading: authLoading } = useAuth()
  const [device, setDevice] = useState<Device | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!slug) {
      setError('No encontramos este equipo.')
      return
    }
    if (authLoading) {
      return
    }
    api<{ data: Device }>(`/devices/${encodeURIComponent(slug)}`)
      .then((response) => setDevice(response.data))
      .catch((exception) => setError(exception.status === 404 ? 'Este equipo no existe o ya no está publicado.' : exception.message))
  }, [slug, authLoading, user])

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-[#796d77]">{error}</p>
        <Link href="/catalogo/" className="mt-6 inline-flex rounded-full bg-[#51305f] px-6 py-3 text-sm font-bold text-white">Ver catálogo</Link>
      </div>
    )
  }

  if (!device) {
    return <div className="mx-auto max-w-7xl px-5 py-24 text-center text-[#796d77]">Cargando equipo…</div>
  }

  const image = device.images[activeImage]
  const specs = [
    ['Marca', device.brand],
    ['Modelo', device.model],
    ['Año', device.year],
    ['Estado', device.condition_label],
    ['Categoría', device.category?.name],
    ['Registro sanitario', device.sanitary_registration],
  ].filter(([, value]) => value)

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <Link href="/catalogo/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#5e5260] hover:text-[#f47d43]"><ArrowLeft size={16} />Volver al catálogo</Link>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-[#eadfe5] bg-[#f2ebe7]">
            {image ? <img src={image.url} alt={device.title} className="size-full object-contain" /> : <div className="grid size-full place-items-center text-[#c9b9c4]"><ImageOff size={48} /></div>}
          </div>
          {device.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {device.images.map((item, index) => (
                <button key={item.id} onClick={() => setActiveImage(index)} className={`aspect-square overflow-hidden rounded-xl border-2 ${index === activeImage ? 'border-[#f47d43]' : 'border-transparent'}`} aria-label={`Ver foto ${index + 1}`}>
                  <img src={item.url} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-[#f47d43]">{device.category?.name ?? 'Equipo médico'}</span>
          <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-[#51305f]">{device.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-700"><BadgeCheck size={16} />Publicación revisada por Sonovita</p>
          <div className="mt-6 font-serif text-3xl font-bold text-[#51305f]">{formatPrice(device)}</div>
          {device.location && <p className="mt-2 flex items-center gap-1.5 text-sm text-[#8a7d87]"><MapPin size={14} />{device.location}</p>}

          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-[#eadfe5] bg-white p-5">
            {specs.map(([label, value]) => (
              <div key={String(label)}>
                <dt className="text-xs uppercase tracking-wide text-[#8a7d87]">{label}</dt>
                <dd className="mt-1 font-semibold text-[#27212b]">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-2xl bg-[#51305f] p-6 text-white">
            <h2 className="font-serif text-xl font-bold">Contactar al vendedor</h2>
            <p className="mt-1 text-sm text-white/75">{device.seller?.name}</p>
            {user ? (
              <div className="mt-4 space-y-2">
                {device.seller?.phone && <a href={`tel:${device.seller.phone}`} className="flex items-center gap-2 rounded-full bg-[#f47d43] px-5 py-3 text-sm font-bold hover:bg-[#ff8d51]"><Phone size={16} />{device.seller.phone}</a>}
                {device.seller?.email && <a href={`mailto:${device.seller.email}?subject=${encodeURIComponent(`Interés en ${device.title}`)}`} className="flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-bold hover:bg-white/10"><Mail size={16} />{device.seller.email}</a>}
              </div>
            ) : (
              <Link href={`/ingresar/?next=${encodeURIComponent(`/dispositivo/?slug=${device.slug}`)}`} className="mt-4 inline-flex rounded-full bg-[#f47d43] px-5 py-3 text-sm font-bold hover:bg-[#ff8d51]">Ingresa para ver el contacto</Link>
            )}
          </div>
        </div>
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="font-serif text-2xl font-bold text-[#51305f]">Descripción</h2>
        <p className="mt-3 whitespace-pre-line leading-relaxed text-[#5e5260]">{plainText(device.description)}</p>
      </section>
    </div>
  )
}

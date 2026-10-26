import Link from 'next/link'
import { ImageOff, MapPin } from 'lucide-react'
import { formatPrice, type Device } from '@/lib/api'

export function DeviceCard({ device }: { device: Device }) {
  const href = `/dispositivo/?slug=${encodeURIComponent(device.slug)}`

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#eadfe5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-[#f2ebe7]">
        {device.cover_image ? (
          <img src={device.cover_image.url} alt={device.title} className="size-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="grid size-full place-items-center text-[#c9b9c4]"><ImageOff size={36} /></div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#51305f]">{device.condition_label}</span>
      </Link>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-[#f47d43]">{device.category?.name ?? 'Equipo médico'}</span>
          <span className="text-xs text-[#918490]">Verificado</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#51305f]"><Link href={href}>{device.title}</Link></h3>
        <p className="mt-1 text-sm text-[#796d77]">{device.brand} · {device.model}{device.year ? ` · ${device.year}` : ''}</p>
        {device.location && <p className="mt-2 flex items-center gap-1.5 text-sm text-[#8a7d87]"><MapPin size={14} />{device.location}</p>}
        <div className="mt-5 flex items-center justify-between border-t border-[#f0e8ec] pt-4">
          <span className="font-bold text-[#51305f]">{formatPrice(device)}</span>
          <Link href={href} className="rounded-full bg-[#51305f] px-4 py-2 text-xs font-bold text-white hover:bg-[#3e244a]">Ver equipo</Link>
        </div>
      </div>
    </article>
  )
}

export function DeviceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#eadfe5] bg-white">
      <div className="aspect-[4/3] animate-pulse bg-[#f2ebe7]" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-[#f2ebe7]" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-[#f2ebe7]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#f2ebe7]" />
      </div>
    </div>
  )
}

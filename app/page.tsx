'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { DeviceCard, DeviceCardSkeleton } from '@/components/device-card'
import { api, type Category, type Device, type Paginated } from '@/lib/api'

const categoryTones = ['bg-[#51305f] text-white', 'bg-white text-[#51305f]', 'bg-[#f47d43] text-white']

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [latest, setLatest] = useState<Paginated<Device> | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    api<{ data: Category[] }>('/categories').then((response) => setCategories(response.data)).catch(() => setFailed(true))
    api<Paginated<Device>>('/devices?per_page=6').then(setLatest).catch(() => setFailed(true))
  }, [])

  const search = (event: React.FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    if (category) params.set('category', category)
    router.push(`/catalogo/${params.size ? `?${params}` : ''}`)
  }

  return (
    <>
      <section id="inicio" className="relative overflow-hidden bg-[#f5ebe6]">
        <div className="absolute inset-0 bg-[url('/hero-sonovita.jpg')] bg-cover bg-[position:70%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(62,32,65,.88),rgba(62,32,65,.6)_45%,rgba(62,32,65,.1))]" />
        <div className="relative mx-auto flex min-h-[530px] max-w-7xl items-center px-5 py-20 lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[#ffb08a]">Marketplace especializado</p>
            <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">La tecnología que<br /><span className="text-[#ff9a6b]">cuida de tu mundo.</span></h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">Encuentra equipos médicos nuevos y seminuevos, revisados por nuestro equipo, o publica el tuyo.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo/" className="inline-flex rounded-full bg-[#f47d43] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#3d2144]/20 hover:bg-[#ff8d51]">Explorar equipos <span className="ml-3">→</span></Link>
              <Link href="/mi-cuenta/dispositivos/nuevo/" className="inline-flex rounded-full border border-white/60 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10">Publicar mi equipo</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-5 lg:px-8">
        <form onSubmit={search} className="rounded-2xl border border-white/70 bg-white p-3 shadow-xl shadow-[#51305f]/10">
          <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_auto]">
            <label className="flex items-center gap-3 rounded-xl bg-[#fff8f5] px-4 py-3 text-sm text-[#8b7d89]">
              <Search size={18} className="text-[#f47d43]" />
              <input className="w-full bg-transparent outline-none placeholder:text-[#a99ba7]" placeholder="¿Qué equipo estás buscando? Marca, modelo…" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <select className="rounded-xl bg-[#fff8f5] px-4 py-3 text-sm text-[#665967] outline-none" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Categoría">
              <option value="">Todas las categorías</option>
              {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="rounded-xl bg-[#f47d43] px-7 py-3 text-sm font-bold text-white hover:bg-[#df6935]">Buscar</button>
          </div>
        </form>
      </section>

      <section id="catalogo" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f47d43]">Recién publicados</p>
            <h2 className="font-serif text-4xl font-bold text-[#51305f]">Equipos destacados</h2>
            <p className="mt-2 text-[#796d77]">Cada anuncio fue revisado antes de publicarse.</p>
          </div>
        </div>
        {failed && <div className="rounded-2xl border border-dashed border-[#ddced8] p-12 text-center text-[#796d77]">No pudimos cargar los equipos. Intenta de nuevo en un momento.</div>}
        {!failed && (
          <div className="grid gap-6 md:grid-cols-3">
            {latest ? latest.data.map((device) => <DeviceCard key={device.id} device={device} />) : Array.from({ length: 3 }, (_, index) => <DeviceCardSkeleton key={index} />)}
          </div>
        )}
        {latest && latest.data.length === 0 && <div className="rounded-2xl border border-dashed border-[#ddced8] p-12 text-center text-[#796d77]">Pronto habrá equipos publicados aquí.</div>}
        <div className="mt-10 text-center">
          <Link href="/catalogo/" className="inline-flex rounded-full border border-[#51305f] px-6 py-3 text-sm font-bold text-[#51305f] hover:bg-[#51305f] hover:text-white">Ver todo el catálogo →</Link>
        </div>
      </section>

      {categories.length > 0 && (
        <section id="categorias" className="bg-[#f8efeb] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f47d43]">Explora por especialidad</p>
              <h2 className="mt-2 font-serif text-4xl font-bold text-[#51305f]">Encuentra lo que necesitas</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {categories.map((item, index) => (
                <Link key={item.id} href={`/catalogo/?category=${item.slug}`} className={`rounded-2xl p-7 text-left transition hover:-translate-y-1 ${categoryTones[index % categoryTones.length]}`}>
                  <h3 className="font-serif text-2xl font-bold">{item.name}</h3>
                  <p className="mt-1 flex items-center gap-2 text-sm opacity-75">{item.published_devices_count ?? 0} equipos publicados <ArrowRight size={14} /></p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="nosotros" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f47d43]">La comunidad Sonovita</p>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#51305f]">Tecnología para profesionales que cuidan.</h2>
            <p className="mt-5 max-w-lg leading-relaxed text-[#796d77]">Conectamos a médicos, clínicas y distribuidores con equipos confiables. Cada anuncio y cada foto pasan por la revisión de nuestro equipo antes de publicarse.</p>
            <div className="mt-7 flex gap-8">
              <div><div className="font-serif text-3xl font-bold text-[#51305f]">{latest?.meta.total ?? '—'}</div><div className="text-sm text-[#8a7d87]">equipos publicados</div></div>
              <div><div className="font-serif text-3xl font-bold text-[#51305f]">{categories.length || '—'}</div><div className="text-sm text-[#8a7d87]">categorías</div></div>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-[#f5ebe6]">
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=85" alt="Profesional de la salud utilizando equipo de ultrasonido" className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      </section>
    </>
  )
}

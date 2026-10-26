'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { DeviceCard, DeviceCardSkeleton } from '@/components/device-card'
import { inputClass } from '@/components/form'
import { api, toQuery, type Category, type Device, type Paginated } from '@/lib/api'

const conditions = [
  { value: 'new', label: 'Nuevo' },
  { value: 'used', label: 'Usado' },
  { value: 'refurbished', label: 'Reacondicionado' },
]

const sorts = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
]

const filterKeys = ['search', 'category', 'condition', 'min_price', 'max_price', 'sort', 'page'] as const

export default function CatalogPage() {
  return (
    <Suspense fallback={null}>
      <Catalog />
    </Suspense>
  )
}

function Catalog() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [result, setResult] = useState<Paginated<Device> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  const filters = Object.fromEntries(filterKeys.map((key) => [key, searchParams.get(key) ?? ''])) as Record<(typeof filterKeys)[number], string>

  useEffect(() => {
    api<{ data: Category[] }>('/categories').then((response) => setCategories(response.data)).catch(() => undefined)
  }, [])

  useEffect(() => {
    setResult(null)
    setError(null)
    api<Paginated<Device>>(`/devices${toQuery({ ...filters, per_page: 12 })}`)
      .then(setResult)
      .catch((exception: Error) => setError(exception.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

  const update = (changes: Partial<Record<(typeof filterKeys)[number], string>>) => {
    const next = { ...filters, page: '', ...changes }
    router.push(`${pathname}${toQuery(next)}`)
  }

  const activeCategory = categories.find((item) => item.slug === filters.category)
  const hasFilters = filterKeys.some((key) => key !== 'sort' && key !== 'page' && filters[key])

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f47d43]">Catálogo</p>
        <h1 className="font-serif text-4xl font-bold text-[#51305f]">{activeCategory?.name ?? 'Todos los equipos'}</h1>
        {result && <p className="mt-2 text-[#796d77]">{result.meta.total} {result.meta.total === 1 ? 'equipo publicado' : 'equipos publicados'}</p>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <form onSubmit={(event) => { event.preventDefault(); update({ search: searchText }) }} className="flex items-center gap-2 rounded-xl border border-[#eadfe5] bg-white px-3 py-2">
            <Search size={16} className="text-[#f47d43]" />
            <input className="w-full bg-transparent py-1 text-sm outline-none" placeholder="Marca, modelo…" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
          </form>

          <div>
            <h2 className="mb-2 text-sm font-bold text-[#51305f]">Categoría</h2>
            <div className="flex flex-col gap-1 text-sm">
              <button onClick={() => update({ category: '' })} className={`rounded-lg px-3 py-2 text-left ${!filters.category ? 'bg-[#51305f] font-bold text-white' : 'hover:bg-[#fff1ea]'}`}>Todas</button>
              {categories.map((item) => (
                <button key={item.id} onClick={() => update({ category: item.slug })} className={`flex justify-between rounded-lg px-3 py-2 text-left ${filters.category === item.slug ? 'bg-[#51305f] font-bold text-white' : 'hover:bg-[#fff1ea]'}`}>
                  {item.name}<span className="opacity-60">{item.published_devices_count}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-bold text-[#51305f]">Estado del equipo</h2>
            <select className={inputClass} value={filters.condition} onChange={(event) => update({ condition: event.target.value })} aria-label="Estado del equipo">
              <option value="">Cualquiera</option>
              {conditions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              update({ min_price: String(data.get('min_price') ?? ''), max_price: String(data.get('max_price') ?? '') })
            }}
          >
            <h2 className="mb-2 text-sm font-bold text-[#51305f]">Precio (MXN)</h2>
            <div className="flex gap-2">
              <input name="min_price" type="number" min={0} defaultValue={filters.min_price} className={inputClass} placeholder="Mín." />
              <input name="max_price" type="number" min={0} defaultValue={filters.max_price} className={inputClass} placeholder="Máx." />
            </div>
            <button className="mt-2 w-full rounded-full border border-[#51305f] py-2 text-sm font-bold text-[#51305f] hover:bg-[#51305f] hover:text-white">Aplicar</button>
          </form>

          {hasFilters && (
            <button onClick={() => { setSearchText(''); router.push(pathname) }} className="flex items-center gap-1 text-sm font-semibold text-[#f47d43]"><X size={14} />Quitar filtros</button>
          )}
        </aside>

        <section>
          <div className="mb-5 flex justify-end">
            <select className="rounded-full border border-[#eadfe5] bg-white px-4 py-2 text-sm text-[#5e5260] outline-none" value={filters.sort || 'newest'} onChange={(event) => update({ sort: event.target.value })} aria-label="Ordenar">
              {sorts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>

          {error && <div className="rounded-2xl border border-dashed border-[#ddced8] p-12 text-center text-[#796d77]">{error}</div>}
          {!error && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {result ? result.data.map((device) => <DeviceCard key={device.id} device={device} />) : Array.from({ length: 6 }, (_, index) => <DeviceCardSkeleton key={index} />)}
            </div>
          )}
          {result && result.data.length === 0 && <div className="rounded-2xl border border-dashed border-[#ddced8] p-12 text-center text-[#796d77]">No encontramos equipos con esos filtros.</div>}

          {result && result.meta.last_page > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Paginación">
              <button disabled={result.meta.current_page <= 1} onClick={() => update({ ...filters, page: String(result.meta.current_page - 1) })} className="rounded-full border border-[#eadfe5] p-2 disabled:opacity-40" aria-label="Página anterior"><ChevronLeft size={18} /></button>
              <span className="text-sm text-[#5e5260]">Página {result.meta.current_page} de {result.meta.last_page}</span>
              <button disabled={result.meta.current_page >= result.meta.last_page} onClick={() => update({ ...filters, page: String(result.meta.current_page + 1) })} className="rounded-full border border-[#eadfe5] p-2 disabled:opacity-40" aria-label="Página siguiente"><ChevronRight size={18} /></button>
            </nav>
          )}
        </section>
      </div>
    </div>
  )
}

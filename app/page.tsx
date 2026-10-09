'use client'

import { useMemo, useState } from 'react'
import { Heart, MapPin, Menu, Search, ShoppingCart, SlidersHorizontal, UserRound, X } from 'lucide-react'

const products = [
  { name: 'Voluson E6', category: 'Ultrasonido', location: 'Ciudad de México', price: '$300,000', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=85', tag: 'Destacado' },
  { name: 'GE Voluson P8', category: 'Ultrasonido', location: 'Monterrey, NL', price: 'Consultar precio', image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=900&q=85', tag: 'Nuevo' },
  { name: 'SonoScape S22', category: 'Ultrasonido', location: 'Guadalajara, Jal.', price: '$185,000', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=85', tag: 'Verificado' },
]

export default function Page() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas las categorías')
  const [cartOpen, setCartOpen] = useState(false)
  const [liked, setLiked] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [added, setAdded] = useState(false)

  const filtered = useMemo(() => products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'Todas las categorías' || product.category === category
    return matchesQuery && matchesCategory
  }), [query, category])

  const toggleLike = (name: string) => setLiked((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name])

  return (
    <main className="min-h-screen bg-[#fffaf7] text-[#27212b]">
      <div className="bg-[#4f315f] px-4 py-2 text-center text-xs font-medium tracking-wide text-white/90">Compra segura · Envíos a todo México · Atención personalizada</div>
      <header className="border-b border-[#eadfe5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Sonovita inicio">
            <div className="grid size-12 place-items-center rounded-full bg-[#f47d43] text-xl font-black text-white">S</div>
            <div><div className="font-serif text-2xl font-bold leading-none tracking-tight text-[#51305f]">sonovita</div><div className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-[#f47d43]">ultrasound</div></div>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#5e5260] md:flex" aria-label="Principal">
            <a href="#catalogo" className="hover:text-[#ef7442]">Comprar equipos</a><a href="#categorias" className="hover:text-[#ef7442]">Categorías</a><a href="#nosotros" className="hover:text-[#ef7442]">Sobre Sonovita</a>
          </nav>
          <div className="flex items-center gap-2">
            <button className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#5e5260] hover:bg-[#fff1ea] sm:block">Publicar equipo</button>
            <button className="hidden rounded-full bg-[#f47d43] px-5 py-2.5 text-sm font-bold text-white shadow-sm sm:block">Mi cuenta</button>
            <button className="relative rounded-full border border-[#eadfe5] p-2.5" onClick={() => setCartOpen(true)} aria-label="Abrir carrito"><ShoppingCart size={19}/><span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#51305f] text-[10px] text-white">0</span></button>
            <button className="rounded-full border border-[#eadfe5] p-2.5 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={19}/></button>
          </div>
        </div>
        {menuOpen && <nav className="flex flex-col gap-4 border-t border-[#eadfe5] px-5 py-4 text-sm font-semibold md:hidden"><a href="#catalogo" onClick={() => setMenuOpen(false)}>Comprar equipos</a><a href="#categorias" onClick={() => setMenuOpen(false)}>Categorías</a><a href="#nosotros" onClick={() => setMenuOpen(false)}>Sobre Sonovita</a></nav>}
      </header>

      <section id="inicio" className="relative overflow-hidden bg-[#f5ebe6]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(62,32,65,.84),rgba(62,32,65,.4),rgba(62,32,65,.08))]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=2000&q=85')] bg-cover bg-center opacity-60 mix-blend-multiply" />
        <div className="relative mx-auto flex min-h-[530px] max-w-7xl items-center px-5 py-20 lg:px-8"><div className="max-w-2xl text-white"><p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[#ffb08a]">Marketplace especializado</p><h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">La tecnología que<br/><span className="text-[#ff9a6b]">cuida de tu mundo.</span></h1><p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">Encuentra equipos de ultrasonido certificados, nuevos y seminuevos para llevar tu práctica al siguiente nivel.</p><a href="#catalogo" className="mt-8 inline-flex rounded-full bg-[#f47d43] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#3d2144]/20 hover:bg-[#ff8d51]">Explorar equipos <span className="ml-3">→</span></a></div></div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-5 lg:px-8"><div className="rounded-2xl border border-white/70 bg-white p-3 shadow-xl shadow-[#51305f]/10"><div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]"><label className="flex items-center gap-3 rounded-xl bg-[#fff8f5] px-4 py-3 text-sm text-[#8b7d89]"><Search size={18} className="text-[#f47d43]"/><input className="w-full bg-transparent outline-none placeholder:text-[#a99ba7]" placeholder="¿Qué equipo estás buscando?" value={query} onChange={(e) => setQuery(e.target.value)} /></label><label className="flex items-center gap-3 rounded-xl bg-[#fff8f5] px-4 py-3 text-sm text-[#8b7d89]"><MapPin size={18} className="text-[#f47d43]"/><input className="w-full bg-transparent outline-none placeholder:text-[#a99ba7]" placeholder="Ubicación" /></label><select className="rounded-xl bg-[#fff8f5] px-4 py-3 text-sm text-[#665967] outline-none" value={category} onChange={(e) => setCategory(e.target.value)}><option>Todas las categorías</option><option>Ultrasonido</option></select><button className="rounded-xl bg-[#f47d43] px-7 py-3 text-sm font-bold text-white hover:bg-[#df6935]">Buscar</button></div></div></section>

      <section id="catalogo" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="mb-8 flex items-end justify-between"><div><p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f47d43]">Selección Sonovita</p><h2 className="font-serif text-4xl font-bold text-[#51305f]">Equipos destacados</h2><p className="mt-2 text-[#796d77]">Encuentra el equipo ideal para tu consultorio.</p></div><button className="hidden items-center gap-2 rounded-full border border-[#ddced8] px-4 py-2.5 text-sm font-semibold text-[#5e5260] sm:flex"><SlidersHorizontal size={16}/> Filtrar</button></div><div className="grid gap-6 md:grid-cols-3">{filtered.map((product) => <article key={product.name} className="group overflow-hidden rounded-2xl border border-[#eadfe5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[4/3] overflow-hidden bg-[#f2ebe7]"><img src={product.image} alt={`Equipo ${product.name}`} className="size-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#51305f]">{product.tag}</span><button onClick={() => toggleLike(product.name)} className="absolute right-4 top-4 rounded-full bg-white/90 p-2.5 text-[#51305f]" aria-label={`Favorito ${product.name}`}><Heart size={17} fill={liked.includes(product.name) ? 'currentColor' : 'none'} /></button></div><div className="p-5"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wide text-[#f47d43]">{product.category}</span><span className="text-xs text-[#918490]">Verificado</span></div><h3 className="font-serif text-2xl font-bold text-[#51305f]">{product.name}</h3><p className="mt-2 flex items-center gap-1.5 text-sm text-[#8a7d87]"><MapPin size={14}/>{product.location}</p><div className="mt-5 flex items-center justify-between border-t border-[#f0e8ec] pt-4"><span className="font-bold text-[#51305f]">{product.price}</span><button onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1800) }} className="rounded-full bg-[#51305f] px-4 py-2 text-xs font-bold text-white hover:bg-[#3e244a]">Ver equipo</button></div></div></article>)}</div>{filtered.length === 0 && <div className="rounded-2xl border border-dashed border-[#ddced8] p-12 text-center text-[#796d77]">No encontramos equipos con esos filtros.</div>}<div className="mt-10 text-center"><button className="rounded-full border border-[#51305f] px-6 py-3 text-sm font-bold text-[#51305f] hover:bg-[#51305f] hover:text-white">Ver todo el catálogo →</button></div></section>

      <section id="categorias" className="bg-[#f8efeb] px-5 py-16 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-8 text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f47d43]">Explora por especialidad</p><h2 className="mt-2 font-serif text-4xl font-bold text-[#51305f]">Encuentra lo que necesitas</h2></div><div className="grid gap-4 sm:grid-cols-3"><button onClick={() => setCategory('Ultrasonido')} className="rounded-2xl bg-[#51305f] p-7 text-left text-white transition hover:-translate-y-1"><div className="mb-10 text-3xl">◉</div><h3 className="font-serif text-2xl font-bold">Ultrasonido</h3><p className="mt-1 text-sm text-white/70">Equipos de diagnóstico por imagen</p></button><div className="rounded-2xl bg-white p-7 text-left"><div className="mb-10 text-3xl text-[#f47d43]">✚</div><h3 className="font-serif text-2xl font-bold text-[#51305f]">Accesorios</h3><p className="mt-1 text-sm text-[#8a7d87]">Transductores, impresoras y más</p></div><div className="rounded-2xl bg-[#f47d43] p-7 text-left text-white"><div className="mb-10 text-3xl">♡</div><h3 className="font-serif text-2xl font-bold">Servicios</h3><p className="mt-1 text-sm text-white/80">Instalación, mantenimiento y soporte</p></div></div></div></section>

      <section id="nosotros" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid items-center gap-10 md:grid-cols-2"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f47d43]">La comunidad Sonovita</p><h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#51305f]">Tecnología para profesionales que cuidan.</h2><p className="mt-5 max-w-lg leading-relaxed text-[#796d77]">Conectamos a médicos, clínicas y distribuidores con equipos confiables. Cada anuncio pasa por un proceso de verificación para que compres con tranquilidad.</p><div className="mt-7 flex gap-8"><div><div className="font-serif text-3xl font-bold text-[#51305f]">+500</div><div className="text-sm text-[#8a7d87]">equipos publicados</div></div><div><div className="font-serif text-3xl font-bold text-[#51305f]">32</div><div className="text-sm text-[#8a7d87]">estados de México</div></div></div></div><div className="overflow-hidden rounded-3xl bg-[#f5ebe6]"><img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=85" alt="Profesional de la salud utilizando equipo de ultrasonido" className="aspect-[4/3] w-full object-cover"/></div></div></section>

      <footer className="bg-[#3c2447] px-5 py-10 text-white lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><div className="font-serif text-2xl font-bold">sonovita</div><p className="mt-1 text-sm text-white/60">Marketplace de equipos de ultrasonido</p></div><p className="text-sm text-white/60">© 2025 Sonovita · Hecho para cuidar mejor</p></div></footer>

      {cartOpen && <div className="fixed inset-0 z-50 bg-[#24152b]/40" onClick={() => setCartOpen(false)}><aside className="absolute right-0 top-0 h-full w-full max-w-sm bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><h2 className="font-serif text-2xl font-bold text-[#51305f]">Tu carrito</h2><button onClick={() => setCartOpen(false)} aria-label="Cerrar carrito"><X/></button></div><div className="mt-16 text-center"><ShoppingCart className="mx-auto text-[#f47d43]" size={36}/><p className="mt-4 font-semibold text-[#51305f]">Tu carrito está vacío</p><p className="mt-1 text-sm text-[#8a7d87]">Agrega equipos para comenzar.</p></div></aside></div>}
      {added && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#51305f] px-5 py-3 text-sm font-semibold text-white shadow-lg">Equipo agregado a favoritos de consulta</div>}
    </main>
  )
}

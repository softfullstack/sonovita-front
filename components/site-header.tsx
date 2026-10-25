'use client'

import Link from 'next/link'
import { useState } from 'react'
import { LogOut, Menu, UserRound } from 'lucide-react'
import { useAuth } from '@/lib/auth'

const links = [
  { href: '/catalogo/', label: 'Comprar equipos' },
  { href: '/#categorias', label: 'Categorías' },
  { href: '/#nosotros', label: 'Sobre Sonovita' },
]

export function SiteHeader() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="bg-[#4f315f] px-4 py-2 text-center text-xs font-medium tracking-wide text-white/90">Equipos verificados · Publicaciones revisadas por nuestro equipo · Atención personalizada</div>
      <header className="border-b border-[#eadfe5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Sonovita inicio">
            <div className="grid size-12 place-items-center rounded-full bg-[#f47d43] text-xl font-black text-white">S</div>
            <div>
              <div className="font-serif text-2xl font-bold leading-none tracking-tight text-[#51305f]">sonovita</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-[#f47d43]">ultrasound</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#5e5260] md:flex" aria-label="Principal">
            {links.map((link) => <Link key={link.href} href={link.href} className="hover:text-[#ef7442]">{link.label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link href={user ? '/mi-cuenta/dispositivos/nuevo/' : '/ingresar/?next=/mi-cuenta/dispositivos/nuevo/'} className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#5e5260] hover:bg-[#fff1ea] sm:block">Publicar equipo</Link>
            {user ? (
              <>
                <Link href="/mi-cuenta/dispositivos/" className="hidden items-center gap-2 rounded-full bg-[#f47d43] px-5 py-2.5 text-sm font-bold text-white shadow-sm sm:flex"><UserRound size={16} />Mis equipos</Link>
                <button onClick={logout} className="rounded-full border border-[#eadfe5] p-2.5 text-[#5e5260]" aria-label="Cerrar sesión" title="Cerrar sesión"><LogOut size={18} /></button>
              </>
            ) : (
              <Link href="/ingresar/" className="hidden rounded-full bg-[#f47d43] px-5 py-2.5 text-sm font-bold text-white shadow-sm sm:block">Mi cuenta</Link>
            )}
            <button className="rounded-full border border-[#eadfe5] p-2.5 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={19} /></button>
          </div>
        </div>
        {menuOpen && (
          <nav className="flex flex-col gap-4 border-t border-[#eadfe5] px-5 py-4 text-sm font-semibold md:hidden">
            {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}
            <Link href={user ? '/mi-cuenta/dispositivos/' : '/ingresar/'} onClick={() => setMenuOpen(false)}>{user ? 'Mis equipos' : 'Ingresar'}</Link>
            <Link href={user ? '/mi-cuenta/dispositivos/nuevo/' : '/registro/'} onClick={() => setMenuOpen(false)}>Publicar equipo</Link>
          </nav>
        )}
      </header>
    </>
  )
}

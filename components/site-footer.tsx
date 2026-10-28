export function SiteFooter() {
  return (
    <footer className="bg-[#3c2447] px-5 py-10 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <img src="logo-footer.png" alt="Sonovita" width={100} height={100} />
          <p className="mt-1 text-sm text-white/60">Marketplace de equipos médicos</p>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} Sonovita | Todos los derechos reservados</p>
        <div className="px-4 py-2 text-center text-xs font-medium tracking-wide text-white/90">Equipos verificados · Publicaciones revisadas por nuestro equipo · Atención personalizada</div>
      </div>
    </footer>
  )
}

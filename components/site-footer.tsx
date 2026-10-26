export function SiteFooter() {
  return (
    <footer className="bg-[#3c2447] px-5 py-10 text-white lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="font-serif text-2xl font-bold">sonovita</div>
          <p className="mt-1 text-sm text-white/60">Marketplace de equipos médicos</p>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} Sonovita · Hecho para cuidar mejor</p>
      </div>
    </footer>
  )
}

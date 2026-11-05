import Link from 'next/link'

/** Shared layout for the legal pages: title, last update date and readable long-form text. */
export function LegalPage({ title, lastUpdated, children }: { title: string; lastUpdated: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Link href="/" className="text-sm font-bold text-[#f47d43]">← Volver al inicio</Link>
      <h1 className="mt-4 font-serif text-4xl font-bold text-[#51305f]">{title}</h1>
      <p className="mt-2 text-sm text-[#796d77]">Última actualización: {lastUpdated}</p>
      <div className="mt-8 space-y-4 rounded-2xl border border-[#eadfe5] bg-white p-6 leading-relaxed text-[#3d343f] sm:p-8 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#51305f] [&_h2:first-child]:mt-0 [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_a]:font-semibold [&_a]:text-[#f47d43]">
        {children}
      </div>
    </article>
  )
}

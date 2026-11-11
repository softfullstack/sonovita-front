import { socialLinks, type SocialNetwork } from '@/lib/social'

/** White round badges with the network glyph cut in the brand purple. */
function Glyph({ network }: { network: SocialNetwork }) {
  switch (network) {
    case 'Facebook':
      return <path d="M13.2 19v-6.2h2.1l.3-2.5h-2.4V8.8c0-.7.2-1.2 1.2-1.2h1.3V5.4c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.8H8.5v2.5h2.1V19z" fill="currentColor" />
    case 'LinkedIn':
      return (
        <g fill="currentColor">
          <rect x="6.6" y="9.6" width="2.4" height="7.6" />
          <circle cx="7.8" cy="7.2" r="1.4" />
          <path d="M10.8 9.6h2.3v1.1c.4-.7 1.3-1.3 2.6-1.3 2.4 0 2.9 1.5 2.9 3.6v4.2h-2.4v-3.7c0-.9 0-2-1.3-2s-1.6 1-1.6 2v3.7h-2.5z" />
        </g>
      )
    case 'Instagram':
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="6.5" y="6.5" width="11" height="11" rx="3.2" />
          <circle cx="12" cy="12" r="2.6" />
          <circle cx="15.3" cy="8.7" r="0.4" fill="currentColor" />
        </g>
      )
  }
}

export function SocialIcons({ className }: { className?: string }) {
  return (
    <div className={className ?? 'flex items-center gap-3'}>
      {socialLinks.map(({ name, url }) => {
        const icon = (
          <svg viewBox="0 0 24 24" width="26" height="26" role="img" aria-label={name}>
            <circle cx="12" cy="12" r="12" fill="#ffffff" />
            <g className="text-[#51305f]"><Glyph network={name} /></g>
          </svg>
        )
        return url ? (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80">{icon}</a>
        ) : (
          <span key={name}>{icon}</span>
        )
      })}
    </div>
  )
}

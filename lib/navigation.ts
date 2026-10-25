/** Only follow redirects inside this site, never to another domain. */
export function safeNext(next: string | null, fallback = '/mi-cuenta/dispositivos/'): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback
}

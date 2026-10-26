export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api').replace(/\/$/, '')

const TOKEN_KEY = 'sonovita_token'

export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  published_devices_count?: number
}

export type DeviceImage = {
  id: number
  url: string
  position: number
  status?: 'pending' | 'approved' | 'rejected'
  status_label?: string
  rejection_reason?: string | null
}

export type DeviceStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export type Device = {
  id: number
  slug: string
  title: string
  brand: string
  model: string
  year: number | null
  condition: 'new' | 'used' | 'refurbished'
  condition_label: string
  description: string
  price: string | null
  currency: string
  location: string | null
  sanitary_registration: string | null
  category: Category | null
  cover_image: DeviceImage | null
  images: DeviceImage[]
  seller?: { name: string; email?: string; phone?: string | null }
  published_at: string | null
  status?: DeviceStatus
  status_label?: string
  rejection_reason?: string | null
  can_edit?: boolean
}

export type User = {
  id: number
  name: string
  email: string
  phone: string | null
  roles: string[]
  permissions: string[]
}

export type Paginated<T> = {
  data: T[]
  meta: { current_page: number; last_page: number; total: number; per_page: number }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: Record<string, string[]> = {},
    /** Machine readable reason, e.g. `email_not_verified`. */
    public code?: string,
  ) {
    super(message)
  }

  /** First validation message for a field, if any. */
  field(name: string): string | undefined {
    return this.errors[name]?.[0]
  }
}

/** Turns anything thrown by `api()` or `fetch` into an ApiError the forms can render. */
export function toApiError(exception: unknown): ApiError {
  if (exception instanceof ApiError) {
    return exception
  }
  if (exception instanceof TypeError) {
    return new ApiError('No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.', 0)
  }
  return new ApiError(exception instanceof Error ? exception.message : 'Ocurrió un error. Intenta de nuevo.', 0)
}

export function getToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token)
    } else {
      window.localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // Storage can be blocked (private mode); the session then lasts until reload.
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 401) {
      setToken(null)
    }
    if (response.status === 429) {
      throw new ApiError('Hiciste demasiados intentos. Espera un minuto y vuelve a intentarlo.', 429)
    }
    throw new ApiError(payload.message ?? 'Ocurrió un error. Intenta de nuevo.', response.status, payload.errors ?? {}, payload.code)
  }

  return payload as T
}

/** Builds a query string, skipping empty values. */
export function toQuery(params: Record<string, string | number | null | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}

export function formatPrice(device: Pick<Device, 'price' | 'currency'>): string {
  if (device.price === null) {
    return 'Consultar precio'
  }
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: device.currency, maximumFractionDigits: 0 }).format(Number(device.price))
}

/** The admin panel stores rich text; the store shows it as plain text. */
export function plainText(html: string): string {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, ' ')
  }
  const withBreaks = html.replace(/<\/(p|div|li|h\d)>|<br\s*\/?>/gi, '\n')
  return (new DOMParser().parseFromString(withBreaks, 'text/html').body.textContent ?? '').trim()
}

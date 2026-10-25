import { cn } from '@/lib/utils'

const tones: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-700',
}

export function StatusBadge({ status, label }: { status?: string; label?: string }) {
  if (!status) {
    return null
  }
  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-bold', tones[status] ?? tones.draft)}>{label ?? status}</span>
}

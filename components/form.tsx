import { cn } from '@/lib/utils'

export const inputClass = 'w-full rounded-xl border border-[#eadfe5] bg-[#fff8f5] px-4 py-3 text-sm text-[#27212b] outline-none placeholder:text-[#a99ba7] focus:border-[#f47d43] focus:bg-white'

export function Field({ label, error, hint, children, className }: { label: string; error?: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-sm font-semibold text-[#51305f]">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-[#8a7d87]">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}

export function PrimaryButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={cn('rounded-full bg-[#f47d43] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#df6935] disabled:cursor-not-allowed disabled:opacity-60', className)} />
}

export function Alert({ tone = 'error', children }: { tone?: 'error' | 'success' | 'info'; children: React.ReactNode }) {
  const tones = {
    error: 'border-red-200 bg-red-50 text-red-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    info: 'border-[#eadfe5] bg-[#fff8f5] text-[#5e5260]',
  }
  return <div className={cn('rounded-xl border px-4 py-3 text-sm', tones[tone])}>{children}</div>
}

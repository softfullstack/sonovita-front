'use client'

import { useRouter } from 'next/navigation'
import { DeviceForm } from '@/components/device-form'
import { RequireAuth } from '@/components/require-auth'

export default function NewDevicePage() {
  const router = useRouter()

  return (
    <RequireAuth>
      <div className="mx-auto max-w-3xl px-5 py-12">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#f47d43]">Paso 1 de 2</p>
        <h1 className="font-serif text-4xl font-bold text-[#51305f]">Publicar un equipo</h1>
        <p className="mt-2 mb-8 text-[#796d77]">Primero los datos del equipo; en el siguiente paso subes las fotos y lo envías a revisión.</p>
        <DeviceForm submitLabel="Guardar y continuar" onSaved={(device) => router.push(`/mi-cuenta/dispositivos/editar/?id=${device.id}`)} />
      </div>
    </RequireAuth>
  )
}

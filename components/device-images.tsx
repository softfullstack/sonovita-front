'use client'

import { useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { Alert } from '@/components/form'
import { StatusBadge } from '@/components/status-badge'
import { api, type ApiError, type Device, type DeviceImage } from '@/lib/api'
import { compressImage, MAX_IMAGE_SIDE } from '@/lib/image'

const MAX_IMAGES = 10
/** Size the API accepts per photo, checked after the photo is compressed. */
const MAX_SIZE_MB = 5
/** Largest original we try to compress, to avoid running the browser out of memory. */
const MAX_ORIGINAL_SIZE_MB = 30

/** Upload and remove the photos of a device while it can still be edited. */
export function DeviceImages({ device, onChange }: { device: Device; onChange: (images: DeviceImage[]) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const editable = device.can_edit ?? false

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setError(null)
    setUploading(true)
    let images = [...device.images]
    for (const file of Array.from(files)) {
      if (images.length >= MAX_IMAGES) {
        setError(`Cada equipo puede tener hasta ${MAX_IMAGES} fotos.`)
        break
      }
      if (file.size > MAX_ORIGINAL_SIZE_MB * 1024 * 1024) {
        setError(`«${file.name}» pesa más de ${MAX_ORIGINAL_SIZE_MB} MB.`)
        continue
      }
      const compressed = await compressImage(file)
      if (compressed.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`«${file.name}» sigue pesando más de ${MAX_SIZE_MB} MB después de optimizarla.`)
        continue
      }
      const body = new FormData()
      body.append('image', compressed)
      try {
        const response = await api<{ data: DeviceImage }>(`/my/devices/${device.id}/images`, { method: 'POST', body })
        images = [...images, response.data]
        onChange(images)
      } catch (exception) {
        setError((exception as ApiError).field?.('image') ?? (exception as Error).message)
      }
    }
    setUploading(false)
  }

  const remove = async (image: DeviceImage) => {
    setError(null)
    try {
      await api(`/my/devices/${device.id}/images/${image.id}`, { method: 'DELETE' })
      onChange(device.images.filter((item) => item.id !== image.id))
    } catch (exception) {
      setError((exception as Error).message)
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[#eadfe5] bg-white p-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#51305f]">Fotos</h2>
        <p className="mt-1 text-sm text-[#796d77]">Sube fotos claras del equipo, sus accesorios y el número de serie. JPG, PNG o WEBP, máximo {MAX_IMAGES}. Las optimizamos automáticamente a {MAX_IMAGE_SIDE} px en su lado mayor antes de subirlas.</p>
      </div>
      {error && <Alert>{error}</Alert>}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {device.images.map((image) => (
          <figure key={image.id} className="overflow-hidden rounded-xl border border-[#eadfe5]">
            <img src={image.url} alt="" className="aspect-[4/3] w-full object-cover" />
            <figcaption className="space-y-2 p-3">
              <div className="flex items-center justify-between">
                <StatusBadge status={image.status} label={image.status_label} />
                {editable && <button onClick={() => remove(image)} className="text-[#8a7d87] hover:text-red-600" aria-label="Quitar foto"><Trash2 size={16} /></button>}
              </div>
              {image.rejection_reason && <p className="text-xs text-red-600">{image.rejection_reason}</p>}
            </figcaption>
          </figure>
        ))}
        {editable && device.images.length < MAX_IMAGES && (
          <label className="grid aspect-[4/3] cursor-pointer place-items-center rounded-xl border-2 border-dashed border-[#ddced8] text-center text-sm text-[#8a7d87] hover:border-[#f47d43] hover:text-[#f47d43]">
            <span className="flex flex-col items-center gap-2"><ImagePlus size={28} />{uploading ? 'Subiendo…' : 'Agregar fotos'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" disabled={uploading} onChange={(event) => { upload(event.target.files); event.target.value = '' }} />
          </label>
        )}
      </div>
    </div>
  )
}

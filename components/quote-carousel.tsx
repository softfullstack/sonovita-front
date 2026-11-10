'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { DeviceImage } from '@/lib/api'
import { cn } from '@/lib/utils'

/**
 * Photo carousel of the quoted device. The PDF prints the photo on screen,
 * without the arrows or dots.
 */
export function QuoteCarousel({ images, title }: { images: DeviceImage[]; title: string }) {
  const [index, setIndex] = useState(0)
  const single = images.length === 1

  function go(step: number) {
    setIndex((current) => (current + step + images.length) % images.length)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#f6f0ec]" aria-roledescription="carrusel" aria-label={`Fotos de ${title}`}>
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((image, position) => (
          <img
            key={image.id}
            src={image.url}
            alt={`${title} — foto ${position + 1}`}
            className="aspect-[4/3] w-full shrink-0 object-contain"
            aria-hidden={position !== index}
          />
        ))}
      </div>
      {!single && (
        <>
          <button type="button" onClick={() => go(-1)} className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#51305f] shadow hover:bg-white print:hidden" aria-label="Foto anterior"><ChevronLeft size={18} /></button>
          <button type="button" onClick={() => go(1)} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#51305f] shadow hover:bg-white print:hidden" aria-label="Foto siguiente"><ChevronRight size={18} /></button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 print:hidden">
            {images.map((image, position) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setIndex(position)}
                className={cn('h-2 rounded-full transition-all', position === index ? 'w-6 bg-[#f47d43]' : 'w-2 bg-white/90')}
                aria-label={`Ver foto ${position + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Expand, ImageOff } from 'lucide-react'
import Lightbox, { type Slide } from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Inline from 'yet-another-react-lightbox/plugins/inline'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import type { DeviceImage } from '@/lib/api'

/**
 * Photo carousel of a published device. Clicking a photo opens it fullscreen with deep zoom,
 * so serial numbers, barcodes and labels can be read before contacting the seller.
 */
export function DeviceGallery({ images, title }: { images: DeviceImage[]; title: string }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  if (!images.length) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-3xl border border-[#eadfe5] bg-[#f2ebe7] text-[#c9b9c4]">
        <ImageOff size={48} />
      </div>
    )
  }

  const slides: Slide[] = images.map((image, position) => ({ src: image.url, alt: `${title} — foto ${position + 1}` }))
  const single = slides.length === 1
  const hideWhenSingle = single ? { buttonPrev: () => null, buttonNext: () => null } : {}

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-[#eadfe5] bg-[#f2ebe7] [&_.yarl\_\_slide]:cursor-zoom-in">
        <Lightbox
          index={index}
          slides={slides}
          plugins={[Inline]}
          on={{ view: ({ index: current }) => setIndex(current), click: () => setOpen(true) }}
          carousel={{ finite: single, padding: 0, spacing: 0, imageFit: 'contain' }}
          render={hideWhenSingle}
          inline={{ style: { width: '100%', aspectRatio: '4 / 3' } }}
          styles={{ container: { backgroundColor: '#f2ebe7', '--yarl__color_button': '#51305f', '--yarl__color_button_active': '#f47d43' } }}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#51305f] shadow-sm backdrop-blur hover:bg-white"
        >
          <Expand size={14} />
          Ampliar foto
        </button>
        {!single && (
          <span className="absolute top-4 left-4 rounded-full bg-[#27212b]/70 px-3 py-1 text-xs font-semibold text-white">
            {index + 1} / {slides.length}
          </span>
        )}
      </div>

      {!single && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((image, position) => (
            <button key={image.id} type="button" onClick={() => setIndex(position)} className={`aspect-square overflow-hidden rounded-xl border-2 ${position === index ? 'border-[#f47d43]' : 'border-transparent'}`} aria-label={`Ver foto ${position + 1}`}>
              <img src={image.url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        plugins={[Zoom, Thumbnails, Counter, Fullscreen]}
        on={{ view: ({ index: current }) => setIndex(current) }}
        carousel={{ finite: single }}
        render={hideWhenSingle}
        zoom={{ maxZoomPixelRatio: 5, zoomInMultiplier: 2, scrollToZoom: true, doubleClickMaxStops: 3 }}
        thumbnails={{ hidden: single, width: 96, height: 64, border: 2, borderRadius: 8, gap: 12, imageFit: 'cover' }}
        counter={{ container: { style: { top: 0, bottom: 'unset' } } }}
        controller={{ closeOnBackdropClick: true }}
        labels={{
          Previous: 'Foto anterior',
          Next: 'Foto siguiente',
          Close: 'Cerrar',
          'Zoom in': 'Acercar',
          'Zoom out': 'Alejar',
          'Enter Fullscreen': 'Pantalla completa',
          'Exit Fullscreen': 'Salir de pantalla completa',
          'Photo gallery': 'Galería de fotos',
          '{index} of {total}': '{index} de {total}',
        }}
      />
    </div>
  )
}

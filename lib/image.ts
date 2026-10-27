/** Longest side, in pixels, that a photo keeps after it is resized in the browser. */
export const MAX_IMAGE_SIDE = 1600

const QUALITY = 0.82

const loadBitmap = async (file: File): Promise<ImageBitmap | HTMLImageElement> => {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // Some browsers reject the options object; fall back to an <img> element.
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    return image
  } finally {
    URL.revokeObjectURL(url)
  }
}

const toBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY))

/**
 * Resize a photo so its longest side is at most {@link MAX_IMAGE_SIDE} pixels, keeping its
 * proportions, and re-encode it as WebP (JPEG where the browser cannot encode WebP).
 * The original file is returned when it cannot be decoded or when it is already smaller.
 */
export async function compressImage(file: File): Promise<File> {
  let source: ImageBitmap | HTMLImageElement
  try {
    source = await loadBitmap(file)
  } catch {
    return file
  }

  const width = source.width
  const height = source.height
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const context = canvas.getContext('2d')
  if (!context) return file

  context.imageSmoothingQuality = 'high'
  context.drawImage(source, 0, 0, canvas.width, canvas.height)
  if ('close' in source) source.close()

  let blob = await toBlob(canvas, 'image/webp')
  if (blob?.type !== 'image/webp') {
    // JPEG has no transparency: paint transparent areas white instead of black.
    context.globalCompositeOperation = 'destination-over'
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    blob = await toBlob(canvas, 'image/jpeg')
  }
  if (!blob) return file
  if (scale === 1 && blob.size >= file.size) return file

  const extension = blob.type === 'image/webp' ? 'webp' : 'jpg'
  const name = file.name.replace(/\.[^.]+$/, '') || 'foto'
  return new File([blob], `${name}.${extension}`, { type: blob.type, lastModified: Date.now() })
}

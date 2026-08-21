import React, { useState } from 'react'
import { ImageOff } from 'lucide-react'

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-flex items-center justify-center bg-slate-800/40 text-slate-500 rounded border border-slate-700/30 ${className ?? ''}`}
      style={style}
      role="img"
      aria-label={alt || 'Image failed to load'}
      data-testid="image-fallback"
      data-original-url={src}
    >
      <ImageOff className="w-6 h-6 opacity-60" aria-hidden="true" />
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}

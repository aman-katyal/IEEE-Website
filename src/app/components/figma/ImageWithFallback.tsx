import React, { useState } from 'react'
import { ImageOff } from 'lucide-react'

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: number | string
  lqip?: string
}

export function ImageWithFallback({
  src,
  alt,
  style,
  className,
  aspectRatio,
  lqip,
  onLoad,
  onError,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setDidError(true)
    onError?.(e)
  }

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true)
    onLoad?.(e)
  }

  const computedStyle: React.CSSProperties = {
    ...style,
    ...(aspectRatio ? { aspectRatio: String(aspectRatio) } : {}),
  }

  if (didError) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-slate-800/40 text-slate-500 rounded border border-slate-700/30 ${className ?? ''}`}
        style={computedStyle}
        role="img"
        aria-label={alt || 'Image failed to load'}
        data-testid="image-fallback"
        data-original-url={src}
      >
        <ImageOff className="w-6 h-6 opacity-60" aria-hidden="true" />
      </div>
    )
  }

  if (lqip) {
    return (
      <div
        className={`relative overflow-hidden ${className ?? ''}`}
        style={computedStyle}
        data-testid="lqip-container"
      >
        {/* Low-Quality Image Placeholder blur */}
        <img
          src={lqip}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-md scale-105 transition-opacity duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />
        {/* Full Resolution Image */}
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
          {...rest}
        />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={computedStyle}
      onLoad={handleLoad}
      onError={handleError}
      {...rest}
    />
  )
}

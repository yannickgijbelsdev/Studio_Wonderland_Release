'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap } from '@/lib/site/anim'

export function Magnetic({ children, className = '', as = 'button', strength, onClick, ...rest }) {
  const Tag = as
  return (
    <Tag onClick={onClick} data-cursor="hover" className={`transition-all duration-300 ease-out ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export function Eyebrow({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-[11px] font-medium tracking-[0.4em] uppercase ${className}`}>
      <Star className="h-3.5 w-3.5" />
      {children}
    </span>
  )
}

// The five-point star from the Studio Wonderland logo.
export function Star({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 1.6l2.94 6.63 7.16.62-5.43 4.72 1.64 7.03L12 18.9l-6.31 3.73 1.64-7.03L1.9 10.85l7.16-.62L12 1.6z" />
    </svg>
  )
}

// A heading that reveals on scroll, with the logo star before the first line and no clipping.
export function TitleReveal({ lines, starClass = 'text-wonder-pinkdeep', className = '' }) {
  return (
    <h2 className={`font-display leading-[1.12] ${className}`}>
      {lines.map((ln, i) => (
        <span key={i} className="block overflow-hidden pb-[0.28em]">
          <span data-reveal className="block">
            {i === 0 && <Star className={`mr-3 inline-block h-[0.66em] w-[0.66em] -translate-y-[0.04em] align-middle ${starClass}`} />}
            {ln}
          </span>
        </span>
      ))}
    </h2>
  )
}

// Twinkling glitter layer (client-only to avoid hydration mismatch).
export function Sparkles({ count = 60, className = '' }) {
  const [dots, setDots] = useState([])
  useEffect(() => {
    const colors = ['#ffffff', '#F6E7B8', '#F4B8CB', '#E098A8', '#FFF6F9']
    setDots(Array.from({ length: count }).map((_, i) => ({
      key: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 1 + Math.random() * 3.5,
      delay: (Math.random() * 4).toFixed(2),
      dur: (2 + Math.random() * 3).toFixed(2),
      color: colors[i % colors.length],
    })))
  }, [count])
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((d) => (
        <span key={d.key} className="sparkle" style={{ top: `${d.top}%`, left: `${d.left}%`, width: d.size, height: d.size, background: d.color, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
      ))}
    </div>
  )
}

// Smooth full-width SVG arch. Can sit on top (default) or bottom of a section,
// and curve in either direction (flip) so sections can alternate for a wavy look.
export function ArchDivider({ color = 'fill-wonder-bg', position = 'top', flip = false }) {
  const posClass = position === 'top' ? 'top-0 -translate-y-[99%]' : 'bottom-0 translate-y-[99%] rotate-180'
  const d = flip
    ? 'M0,100 L0,50 Q720,140 1440,50 L1440,100 Z'
    : 'M0,100 L0,50 Q720,-40 1440,50 L1440,100 Z'
  return (
    <div className={`pointer-events-none absolute inset-x-0 leading-[0] ${posClass}`} aria-hidden="true">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block h-[52px] w-full md:h-[92px]">
        <path className={color} d={d} />
      </svg>
    </div>
  )
}

// Reusable pink title band that arches into the light content below \u2014 shared across pages.
export function PageHeader({ eyebrow, lines, starClass = 'text-[#F8E7B0] drop-shadow-[0_0_12px_rgba(248,231,176,0.75)]' }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-wonder-pink via-wonder-pinkdeep to-wonder-plum px-6 pb-32 pt-36 text-center md:px-10 md:pb-40 md:pt-44">
      <Sparkles count={54} />
      <div className="relative mx-auto max-w-[1200px]">
        {eyebrow && <Eyebrow className="text-white/85">{eyebrow}</Eyebrow>}
        <TitleReveal lines={lines} starClass={starClass} className="mt-5 text-5xl text-white md:text-7xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
      </div>
    </section>
  )
}


// Masonry-style photo grid with an interactive lightbox. Reused across worlds.
export function PhotoGallery({ images = [], accent = 'text-white', ringClass = 'ring-white/20' }) {
  const [idx, setIdx] = useState(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const open = idx !== null
  const close = useCallback(() => setIdx(null), [])
  const prev = useCallback(() => setIdx((i) => (i === null ? i : (i - 1 + images.length) % images.length)), [images.length])
  const next = useCallback(() => setIdx((i) => (i === null ? i : (i + 1) % images.length)), [images.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, close, prev, next])

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((src, i) => (
          <button
            key={i}
            data-img
            onClick={() => setIdx(i)}
            data-cursor="hover"
            className={`group relative block w-full overflow-hidden rounded-2xl ring-1 ${ringClass} focus:outline-none`}
          >
            <img src={src} alt="Foto" className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
          </button>
        ))}
      </div>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={close}>
          <button onClick={close} className={`absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2.5 ${accent} transition hover:bg-white/20`} aria-label="Sluiten">
            <X className="h-6 w-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev() }} className={`absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 md:left-6 ${accent} transition hover:bg-white/20`} aria-label="Vorige">
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next() }} className={`absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 md:right-6 ${accent} transition hover:bg-white/20`} aria-label="Volgende">
            <ChevronRight className="h-7 w-7" />
          </button>
          <img
            src={images[idx]}
            alt="Foto groot"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
          />
          <span className={`absolute bottom-5 left-1/2 -translate-x-1/2 text-sm ${accent} opacity-70`}>{idx + 1} / {images.length}</span>
        </div>,
        document.body
      )}
    </>
  )
}

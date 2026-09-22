'use client'
import { useEffect, useRef, useState } from 'react'
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

// Smooth full-width SVG arch that sits on top of a section and overlaps the section above it.
export function ArchDivider({ color = 'fill-wonder-bg' }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -translate-y-[99%] leading-[0]" aria-hidden="true">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block h-[52px] w-full md:h-[92px]">
        <path className={color} d="M0,100 L0,50 Q720,-40 1440,50 L1440,100 Z" />
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

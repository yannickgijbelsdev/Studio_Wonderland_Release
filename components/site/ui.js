'use client'
import { useRef } from 'react'
import { gsap } from '@/lib/site/anim'

export function Magnetic({ children, className = '', as = 'button', strength = 0.35, onClick, ...rest }) {
  const ref = useRef(null)
  const Tag = as
  const move = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength,
      duration: 0.6,
      ease: 'power3.out',
    })
  }
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' })
  return (
    <Tag ref={ref} onMouseMove={move} onMouseLeave={leave} onClick={onClick} data-cursor="hover" className={className} {...rest}>
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
export function TitleReveal({ lines, starClass = 'text-wonder-pinkdeep', className = '', align = 'left' }) {
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

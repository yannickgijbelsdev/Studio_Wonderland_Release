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
    <span className={`inline-flex items-center gap-3 text-[11px] font-medium tracking-[0.4em] uppercase ${className}`}>
      <span className="h-px w-8 bg-current opacity-50" />
      {children}
    </span>
  )
}

'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/site/anim'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const dotEl = dot.current
    const ringEl = ring.current
    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50, opacity: 0 })

    const xDot = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power3' })
    const yDot = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power3' })
    const xRing = gsap.quickTo(ringEl, 'x', { duration: 0.45, ease: 'power3' })
    const yRing = gsap.quickTo(ringEl, 'y', { duration: 0.45, ease: 'power3' })

    let shown = false
    const move = (e) => {
      if (!shown) { gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.3 }); shown = true }
      xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY)
    }
    const over = (e) => {
      if (e.target.closest('[data-cursor]')) {
        gsap.to(ringEl, { scale: 2.2, opacity: 0.6, duration: 0.35 })
        gsap.to(dotEl, { scale: 0.4, duration: 0.35 })
      }
    }
    const out = (e) => {
      if (e.target.closest('[data-cursor]')) {
        gsap.to(ringEl, { scale: 1, opacity: 1, duration: 0.35 })
        gsap.to(dotEl, { scale: 1, duration: 0.35 })
      }
    }
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-wonder-gold/80 mix-blend-difference" />
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-wonder-gold" />
    </>
  )
}

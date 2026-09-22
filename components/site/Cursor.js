'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/site/anim'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const layer = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const dotEl = dot.current
    const ringEl = ring.current
    const layerEl = layer.current
    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50, opacity: 0 })

    const xDot = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power3' })
    const yDot = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power3' })
    const xRing = gsap.quickTo(ringEl, 'x', { duration: 0.45, ease: 'power3' })
    const yRing = gsap.quickTo(ringEl, 'y', { duration: 0.45, ease: 'power3' })

    const spawnSparkle = (x, y) => {
      if (!layerEl) return
      const s = document.createElement('span')
      const size = 5 + Math.random() * 7
      s.style.cssText = `position:fixed;left:0;top:0;width:${size}px;height:${size}px;pointer-events:none;transform:translate(-50%,-50%);` +
        `background:radial-gradient(circle,#F8E7B0 0%,#E9C46A 55%,rgba(233,196,106,0) 70%);` +
        `filter:drop-shadow(0 0 5px rgba(248,231,176,0.9));border-radius:9999px;`
      layerEl.appendChild(s)
      gsap.set(s, { x, y, scale: 1, opacity: 1 })
      gsap.to(s, {
        x: x + (Math.random() * 26 - 13),
        y: y + (Math.random() * 20 - 4),
        scale: 0.1,
        opacity: 0,
        duration: 0.7 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => s.remove(),
      })
    }

    let shown = false
    let last = 0
    const move = (e) => {
      if (!shown) { gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.3 }); shown = true }
      xDot(e.clientX); yDot(e.clientY); xRing(e.clientX); yRing(e.clientY)
      const now = performance.now()
      if (now - last > 55) { last = now; spawnSparkle(e.clientX, e.clientY) }
    }
    const over = (e) => {
      if (e.target.closest('[data-cursor]')) {
        gsap.to(ringEl, { scale: 2.2, opacity: 0.7, duration: 0.35 })
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
      <div ref={layer} className="pointer-events-none fixed inset-0 z-[9998]" aria-hidden="true" />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-wonder-gold" style={{ boxShadow: '0 0 10px rgba(233,196,106,0.5)' }} />
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-wonder-gold" style={{ boxShadow: '0 0 8px rgba(248,231,176,0.9)' }} />
    </>
  )
}

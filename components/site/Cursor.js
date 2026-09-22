'use client'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/site/anim'

export default function Cursor() {
  const arrow = useRef(null)
  const layer = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const arrowEl = arrow.current
    const layerEl = layer.current
    gsap.set(arrowEl, { opacity: 0 })

    const xArrow = gsap.quickTo(arrowEl, 'x', { duration: 0.07, ease: 'power3' })
    const yArrow = gsap.quickTo(arrowEl, 'y', { duration: 0.07, ease: 'power3' })

    const makeStar = (size) => {
      const s = document.createElement('span')
      s.style.cssText = `position:fixed;left:0;top:0;width:${size}px;height:${size}px;pointer-events:none;transform:translate(-50%,-50%);` +
        `background:#F8E7B0;` +
        `clip-path:polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%);` +
        `filter:drop-shadow(0 0 6px rgba(248,231,176,0.95));`
      layerEl.appendChild(s)
      return s
    }

    // gentle sparkle trail while moving
    const spawnSparkle = (x, y) => {
      if (!layerEl) return
      const s = makeStar(4 + Math.random() * 7)
      gsap.set(s, { x: x + (Math.random() * 16 - 8), y: y + (Math.random() * 16 - 8), scale: 1, opacity: 1, rotation: Math.random() * 90 })
      gsap.to(s, {
        x: `+=${Math.random() * 40 - 20}`,
        y: `+=${Math.random() * 34 + 6}`,
        scale: 0.05,
        opacity: 0,
        rotation: '+=90',
        duration: 0.8 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => s.remove(),
      })
    }

    // radial burst of stars on click
    const burst = (x, y) => {
      if (!layerEl) return
      const n = 12
      for (let i = 0; i < n; i++) {
        const s = makeStar(5 + Math.random() * 8)
        const ang = (Math.PI * 2 * i) / n + Math.random() * 0.4
        const dist = 34 + Math.random() * 42
        gsap.set(s, { x, y, scale: 1, opacity: 1, rotation: Math.random() * 120 })
        gsap.to(s, {
          x: x + Math.cos(ang) * dist,
          y: y + Math.sin(ang) * dist,
          scale: 0.05,
          opacity: 0,
          rotation: '+=140',
          duration: 0.6 + Math.random() * 0.4,
          ease: 'power3.out',
          onComplete: () => s.remove(),
        })
      }
    }

    let shown = false
    let last = 0
    let hovering = false
    const move = (e) => {
      if (!shown) { gsap.to(arrowEl, { opacity: 1, duration: 0.3 }); shown = true }
      xArrow(e.clientX); yArrow(e.clientY)
      const now = performance.now()
      const gap = hovering ? 40 : 26
      if (now - last > gap) { last = now; spawnSparkle(e.clientX, e.clientY) }
    }

    const over = (e) => {
      if (e.target.closest('[data-cursor]') || e.target.closest('a,button,[role="button"]')) {
        hovering = true
        gsap.to(arrowEl, { scale: 1.45, rotation: -12, duration: 0.3, ease: 'power3' })
      }
    }
    const out = (e) => {
      if (e.target.closest('[data-cursor]') || e.target.closest('a,button,[role="button"]')) {
        hovering = false
        gsap.to(arrowEl, { scale: 1, rotation: 0, duration: 0.3, ease: 'power3' })
      }
    }

    const down = (e) => {
      gsap.to(arrowEl, { scale: hovering ? 1.1 : 0.75, duration: 0.12, ease: 'power2.out' })
      burst(e.clientX, e.clientY)
    }
    const up = () => {
      gsap.to(arrowEl, { scale: hovering ? 1.45 : 1, duration: 0.4, ease: 'elastic.out(1,0.5)' })
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  return (
    <>
      <div ref={layer} className="pointer-events-none fixed inset-0 z-[9998]" aria-hidden="true" />
      {/* primary gold arrow cursor */}
      <div ref={arrow} className="pointer-events-none fixed left-0 top-0 z-[9999]" style={{ transformOrigin: '2px 2px' }} aria-hidden="true">
        <svg width="27" height="27" viewBox="0 0 24 24" style={{ display: 'block', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5)) drop-shadow(0 0 9px rgba(248,231,176,0.7))' }}>
          <defs>
            <linearGradient id="cur-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF6DE" />
              <stop offset="55%" stopColor="#F8E7B0" />
              <stop offset="100%" stopColor="#E9C46A" />
            </linearGradient>
          </defs>
          <path d="M3 2 L3 20.5 L8 15.7 L11.1 22 L14.1 20.6 L11 14.3 L18 14.3 Z" fill="url(#cur-g)" stroke="#B4880F" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  )
}

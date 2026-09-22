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

    const xArrow = gsap.quickTo(arrowEl, 'x', { duration: 0.09, ease: 'power3' })
    const yArrow = gsap.quickTo(arrowEl, 'y', { duration: 0.09, ease: 'power3' })

    const spawnSparkle = (x, y) => {
      if (!layerEl) return
      const s = document.createElement('span')
      const size = 4 + Math.random() * 8
      // four-point golden star
      s.style.cssText = `position:fixed;left:0;top:0;width:${size}px;height:${size}px;pointer-events:none;transform:translate(-50%,-50%);` +
        `background:#F8E7B0;` +
        `clip-path:polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%);` +
        `filter:drop-shadow(0 0 6px rgba(248,231,176,0.95));`
      layerEl.appendChild(s)
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

    let shown = false
    let last = 0
    const move = (e) => {
      if (!shown) { gsap.to(arrowEl, { opacity: 1, duration: 0.3 }); shown = true }
      xArrow(e.clientX); yArrow(e.clientY)
      const now = performance.now()
      if (now - last > 24) { last = now; spawnSparkle(e.clientX, e.clientY); spawnSparkle(e.clientX, e.clientY) }
    }
    const over = (e) => {
      if (e.target.closest('[data-cursor]')) gsap.to(arrowEl, { scale: 1.4, rotation: -12, duration: 0.3, ease: 'power3' })
    }
    const out = (e) => {
      if (e.target.closest('[data-cursor]')) gsap.to(arrowEl, { scale: 1, rotation: 0, duration: 0.3, ease: 'power3' })
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
      <div ref={arrow} className="pointer-events-none fixed left-0 top-0 z-[9999]" style={{ transformOrigin: '2px 2px' }} aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" style={{ display: 'block', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.45)) drop-shadow(0 0 8px rgba(248,231,176,0.65))' }}>
          <path d="M3 2 L3 20.5 L8 15.7 L11.1 22 L14.1 20.6 L11 14.3 L18 14.3 Z" fill="#F8E7B0" stroke="#B4880F" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  )
}

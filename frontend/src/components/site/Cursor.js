'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/site/anim'

const STAR_COLOR = '#F8E7B0'
const GLOW_COLOR = 'rgba(248,231,176,0.95)'
const MAX_PARTICLES = 90

// Pre-render one glowing star sprite once; drawing a bitmap is far cheaper than
// a DOM node with clip-path + drop-shadow filter per sparkle.
function makeStarSprite(dpr) {
  const size = 32
  const c = document.createElement('canvas')
  c.width = c.height = size * dpr
  const g = c.getContext('2d')
  g.scale(dpr, dpr)
  const cx = size / 2
  const r = 7
  const pts = [[0, -1], [0.22, -0.22], [1, 0], [0.22, 0.22], [0, 1], [-0.22, 0.22], [-1, 0], [-0.22, -0.22]]
  g.shadowColor = GLOW_COLOR
  g.shadowBlur = 6
  g.fillStyle = STAR_COLOR
  g.beginPath()
  pts.forEach(([x, y], i) => (i ? g.lineTo(cx + x * r, cx + y * r) : g.moveTo(cx + x * r, cx + y * r)))
  g.closePath()
  g.fill()
  return { img: c, size }
}

export default function Cursor() {
  const arrow = useRef(null)
  const canvasRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  // Only on real mouse devices without "reduce motion" — elsewhere the native cursor is used.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mqPointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(mqPointer.matches && !mqMotion.matches)
    update()
    mqPointer.addEventListener?.('change', update)
    mqMotion.addEventListener?.('change', update)
    return () => {
      mqPointer.removeEventListener?.('change', update)
      mqMotion.removeEventListener?.('change', update)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const arrowEl = arrow.current
    const canvas = canvasRef.current
    if (!arrowEl || !canvas) return
    const ctx2d = canvas.getContext('2d')

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let sprite = makeStarSprite(dpr)
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      sprite = makeStarSprite(dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    gsap.set(arrowEl, { opacity: 0, x: -100, y: -100 })
    const xArrow = gsap.quickTo(arrowEl, 'x', { duration: 0.07, ease: 'power3' })
    const yArrow = gsap.quickTo(arrowEl, 'y', { duration: 0.07, ease: 'power3' })

    // ---- particle system (single canvas, driven by the GSAP ticker) ----
    const particles = []
    let ticking = false
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)

    const add = (p) => {
      if (particles.length >= MAX_PARTICLES) particles.shift()
      particles.push(p)
      if (!ticking) { ticking = true; gsap.ticker.add(render) }
    }

    // Dirty-rect from the previous frame (CSS px) — only that area is cleared.
    let dirty = null
    const clearDirty = () => {
      if (!dirty) return
      ctx2d.setTransform(1, 0, 0, 1, 0, 0)
      const x = Math.max(0, Math.floor(dirty.x0 * dpr) - 2)
      const y = Math.max(0, Math.floor(dirty.y0 * dpr) - 2)
      ctx2d.clearRect(x, y, Math.ceil((dirty.x1 - dirty.x0) * dpr) + 4, Math.ceil((dirty.y1 - dirty.y0) * dpr) + 4)
      dirty = null
    }

    const render = () => {
      const now = performance.now()
      clearDirty()
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0)
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      const half = sprite.size / 2
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        const t = (now - p.born) / p.life
        if (t >= 1) { particles.splice(i, 1); continue }
        const e = easeOut(t)
        const x = p.x + p.dx * e
        const y = p.y + p.dy * e
        const s = (p.size / 14) * (1 - 0.95 * e)
        const ext = half * s * 1.5
        if (x - ext < x0) x0 = x - ext
        if (y - ext < y0) y0 = y - ext
        if (x + ext > x1) x1 = x + ext
        if (y + ext > y1) y1 = y + ext
        ctx2d.globalAlpha = p.alpha * (1 - e)
        ctx2d.setTransform(dpr * s * Math.cos(p.rot + p.drot * e), dpr * s * Math.sin(p.rot + p.drot * e),
          -dpr * s * Math.sin(p.rot + p.drot * e), dpr * s * Math.cos(p.rot + p.drot * e), x * dpr, y * dpr)
        ctx2d.drawImage(sprite.img, -half, -half, sprite.size, sprite.size)
      }
      ctx2d.globalAlpha = 1
      if (particles.length) dirty = { x0, y0, x1, y1 }
      else {
        gsap.ticker.remove(render)
        ticking = false
      }
    }

    const spawnSparkle = (x, y) => add({
      x: x + (Math.random() * 14 - 7),
      y: y + (Math.random() * 14 - 7),
      dx: Math.random() * 40 - 20,
      dy: Math.random() * 34 + 6,
      size: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI / 2,
      drot: Math.PI / 2,
      alpha: 0.9,
      born: performance.now(),
      life: 800 + Math.random() * 500,
    })

    const burst = (x, y) => {
      const n = 12
      for (let i = 0; i < n; i++) {
        const ang = (Math.PI * 2 * i) / n + Math.random() * 0.4
        const dist = 34 + Math.random() * 42
        add({
          x, y,
          dx: Math.cos(ang) * dist,
          dy: Math.sin(ang) * dist,
          size: 5 + Math.random() * 8,
          rot: Math.random() * 2,
          drot: 2.4,
          alpha: 1,
          born: performance.now(),
          life: 600 + Math.random() * 400,
        })
      }
    }

    // ---- pointer handling ----
    let shown = false
    let last = 0
    let hovering = false
    const move = (e) => {
      if (!shown) { gsap.to(arrowEl, { opacity: 1, duration: 0.3 }); shown = true }
      xArrow(e.clientX); yArrow(e.clientY)
      const now = performance.now()
      const gap = hovering ? 55 : 36
      if (now - last > gap) { last = now; spawnSparkle(e.clientX, e.clientY) }
    }

    const SEL = '[data-cursor],a,button,[role="button"]'
    const over = (e) => {
      const hit = e.target instanceof Element && e.target.closest(SEL)
      if (hit && !hovering) {
        hovering = true
        gsap.to(arrowEl, { scale: 1.3, rotation: -10, duration: 0.3, ease: 'power3', overwrite: 'auto' })
      } else if (!hit && hovering) {
        hovering = false
        gsap.to(arrowEl, { scale: 1, rotation: 0, duration: 0.3, ease: 'power3', overwrite: 'auto' })
      }
    }
    const leave = () => { gsap.to(arrowEl, { opacity: 0, duration: 0.2 }); shown = false }

    const down = (e) => {
      gsap.to(arrowEl, { scale: hovering ? 1.1 : 0.75, duration: 0.12, ease: 'power2.out', overwrite: 'auto' })
      burst(e.clientX, e.clientY)
    }
    const up = () => {
      gsap.to(arrowEl, { scale: hovering ? 1.3 : 1, duration: 0.4, ease: 'elastic.out(1,0.5)', overwrite: 'auto' })
    }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', over, { passive: true })
    document.documentElement.addEventListener('mouseleave', leave)
    window.addEventListener('mousedown', down, { passive: true })
    window.addEventListener('mouseup', up, { passive: true })
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.documentElement.removeEventListener('mouseleave', leave)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      gsap.ticker.remove(render)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998] h-screen w-screen"
        style={{ transform: 'translateZ(0)' }}
        aria-hidden="true"
      />
      {/* primary gold arrow cursor */}
      <div
        ref={arrow}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ transformOrigin: '2px 2px', willChange: 'transform' }}
        aria-hidden="true"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" style={{ display: 'block', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.45)) drop-shadow(0 0 6px rgba(248,231,176,0.5))' }}>
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

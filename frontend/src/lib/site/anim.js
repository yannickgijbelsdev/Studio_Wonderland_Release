'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

// Smooth-scroll instance registry + scroll lock for modals/popups. Scrolling the
// page behind a full-screen blurred overlay forces the browser to re-blur the
// whole viewport every frame — so we freeze scrolling while one is open.
let lenisInstance = null
let lockCount = 0
export function registerLenis(l) { lenisInstance = l }
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    lockCount += 1
    lenisInstance?.stop()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (!lockCount) {
        lenisInstance?.start()
        document.documentElement.style.overflow = prev
      }
    }
  }, [active])
}

// One shared, debounced refresh for the whole app. ScrollTrigger.refresh() is
// expensive (re-measures every trigger), so many callers within a short window
// collapse into a single refresh — and never while the user is mid-scroll.
let refreshTimer = 0
let lastScrollAt = 0
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => { lastScrollAt = performance.now() }, { passive: true })
}
export function scheduleRefresh(delay = 200) {
  if (typeof window === 'undefined') return
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(function run() {
    if (performance.now() - lastScrollAt < 150) { refreshTimer = setTimeout(run, 150); return }
    ScrollTrigger.refresh()
  }, delay)
}

// Scoped scroll-triggered animations for a section subtree.
export function useSectionAnimations(scopeRef, deps = []) {
  useEffect(() => {
    if (!scopeRef.current) return
    const scopeEl = scopeRef.current
    const ctx = gsap.context((self) => {
      const q = self.selector

      q('[data-fade]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 28 }, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      q('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { yPercent: 118, opacity: 0 }, {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      q('[data-img]').forEach((el) => {
        const img = el.querySelector('img') || el
        gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.5,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%', invalidateOnRefresh: true },
        })
        gsap.fromTo(img, { scale: 1.4 }, {
          scale: 1,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', invalidateOnRefresh: true },
        })
      })

      q('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2
        gsap.to(el, {
          yPercent: -speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })
    }, scopeRef)

    // Async content (API news, gallery, videos, images, fonts) changes the page
    // height AFTER the triggers are calculated, which makes reveals fire too late.
    // Recompute trigger positions whenever the layout settles or grows.
    const refresh = scheduleRefresh
    const timers = [setTimeout(refresh, 300), setTimeout(refresh, 1400)]
    window.addEventListener('load', refresh)

    // Refresh once each still-loading image finishes.
    const imgs = Array.from(scopeEl.querySelectorAll('img'))
    imgs.forEach((img) => { if (!img.complete) img.addEventListener('load', refresh, { once: true }) })

    // Refresh only when the scope's HEIGHT really changes (async sections
    // mounting/growing) — not on every sub-pixel/width jitter.
    let ro
    let lastH = Math.round(scopeEl.offsetHeight)
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        const h = Math.round(scopeEl.offsetHeight)
        if (Math.abs(h - lastH) < 4) return
        lastH = h
        refresh()
      })
      ro.observe(scopeEl)
    }

    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('load', refresh)
      imgs.forEach((img) => img.removeEventListener('load', refresh))
      if (ro) ro.disconnect()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

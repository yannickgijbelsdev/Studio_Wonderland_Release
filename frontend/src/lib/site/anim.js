'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

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
    let raf = 0
    const refresh = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    const timers = [setTimeout(refresh, 150), setTimeout(refresh, 600), setTimeout(refresh, 1400)]
    window.addEventListener('load', refresh)

    // Refresh once each still-loading image finishes.
    const imgs = Array.from(scopeEl.querySelectorAll('img'))
    imgs.forEach((img) => { if (!img.complete) img.addEventListener('load', refresh, { once: true }) })

    // Refresh when the scope changes size (async sections mounting/growing).
    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(refresh)
      ro.observe(scopeEl)
    }

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      window.removeEventListener('load', refresh)
      imgs.forEach((img) => img.removeEventListener('load', refresh))
      if (ro) ro.disconnect()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

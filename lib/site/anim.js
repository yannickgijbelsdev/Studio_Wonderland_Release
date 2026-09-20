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
    const ctx = gsap.context((self) => {
      const q = self.selector

      q('[data-fade]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 70,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })

      q('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          yPercent: 118,
          opacity: 0,
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 94%' },
        })
      })

      q('[data-img]').forEach((el) => {
        const img = el.querySelector('img') || el
        gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.5,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
        gsap.fromTo(img, { scale: 1.4 }, {
          scale: 1,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
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

    const t = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => { clearTimeout(t); ctx.revert() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

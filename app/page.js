'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { Toaster } from '@/components/ui/sonner'
import { gsap, ScrollTrigger } from '@/lib/site/anim'
import { SiteContext } from '@/components/site/ctx'
import Cursor from '@/components/site/Cursor'
import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'
import Home from '@/components/site/Home'
import ShowWorld from '@/components/site/ShowWorld'
import ChristmasWorld from '@/components/site/ChristmasWorld'
import Productions from '@/components/site/Productions'
import About from '@/components/site/About'
import Contact from '@/components/site/Contact'
import Admin from '@/components/site/Admin'

const WORLD_CLASS = {
  home: 'bg-wonder-bg text-wonder-ink',
  productions: 'bg-wonder-bg text-wonder-ink',
  about: 'bg-wonder-bg text-wonder-ink',
  contact: 'bg-wonder-bg text-wonder-ink',
  admin: 'bg-wonder-bg text-wonder-ink',
  show: 'bg-show-bg text-show-cream',
  xmas: 'bg-xmas-bg text-xmas-cream',
}

function App() {
  const [route, setRoute] = useState('home')
  const lenisRef = useRef(null)
  const transRef = useRef(false)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])

  const navigate = useCallback((next, anchor) => {
    if (transRef.current) return
    if (next === route) {
      if (anchor && lenisRef.current) lenisRef.current.scrollTo(`#${anchor}`, { offset: -80, duration: 1.2 })
      return
    }
    transRef.current = true
    const tl = gsap.timeline({ onComplete: () => { transRef.current = false } })
    tl.set('.pt-panel', { transformOrigin: 'bottom center' })
      .to('.pt-panel', { scaleY: 1, duration: 0.5, stagger: 0.06, ease: 'power4.inOut' })
      .to('.pt-brand', { opacity: 1, y: 0, duration: 0.3 }, '-=0.25')
      .add(() => {
        setRoute(next)
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
        window.scrollTo(0, 0)
        ScrollTrigger.refresh()
      })
      .to('.pt-brand', { opacity: 0, y: -10, duration: 0.3 }, '+=0.15')
      .set('.pt-panel', { transformOrigin: 'top center' })
      .to('.pt-panel', { scaleY: 0, duration: 0.5, stagger: 0.06, ease: 'power4.inOut' })
      .add(() => {
        if (anchor && lenisRef.current) lenisRef.current.scrollTo(`#${anchor}`, { offset: -80 })
        ScrollTrigger.refresh()
      })
  }, [route])

  return (
    <SiteContext.Provider value={{ route, navigate }}>
      <div className={`grain min-h-screen transition-colors duration-500 ${WORLD_CLASS[route] || WORLD_CLASS.home}`}>
        <Cursor />
        <Nav />
        <main>
          {route === 'home' && <Home />}
          {route === 'show' && <ShowWorld />}
          {route === 'xmas' && <ChristmasWorld />}
          {route === 'productions' && <Productions />}
          {route === 'about' && <About />}
          {route === 'contact' && <Contact />}
          {route === 'admin' && <Admin />}
        </main>
        <Footer />
      </div>

      {/* Page transition panels */}
      <div className="pointer-events-none fixed inset-0 z-[100] flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="pt-panel h-full flex-1 origin-bottom scale-y-0 bg-gradient-to-b from-wonder-ink to-wonder-gold" />
        ))}
        <div className="pt-brand absolute inset-0 flex items-center justify-center opacity-0">
          <img src="/studio-wonderland-logo.png" alt="Studio Wonderland" className="h-14 w-auto md:h-20" />
        </div>
      </div>

      <Toaster position="top-center" theme="light" />
    </SiteContext.Provider>
  )
}

export default App

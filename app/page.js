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
import Article from '@/components/site/Article'

const WORLD_CLASS = {
  home: 'bg-wonder-bg text-wonder-ink',
  productions: 'bg-wonder-bg text-wonder-ink',
  about: 'bg-wonder-bg text-wonder-ink',
  contact: 'bg-wonder-bg text-wonder-ink',
  show: 'bg-show-bg text-show-cream',
  xmas: 'bg-xmas-bg text-xmas-cream',
  article: 'bg-show-bg text-show-cream',
}

function App() {
  const [route, setRoute] = useState('home')
  const [articleId, setArticleId] = useState(null)
  const lenisRef = useRef(null)
  const transRef = useRef(false)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9, syncTouch: true })
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
    tl.set('.pt-left', { xPercent: -100 })
      .set('.pt-right', { xPercent: 100 })
      .to('.pt-left', { xPercent: 0, duration: 0.6, ease: 'power4.inOut' }, 0)
      .to('.pt-right', { xPercent: 0, duration: 0.6, ease: 'power4.inOut' }, 0)
      .to('.pt-brand', { opacity: 1, duration: 0.3 }, '-=0.2')
      .add(() => {
        setRoute(next)
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
        window.scrollTo(0, 0)
        ScrollTrigger.refresh()
      })
      .to('.pt-brand', { opacity: 0, duration: 0.3 }, '+=0.15')
      .to('.pt-left', { xPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '>')
      .to('.pt-right', { xPercent: 100, duration: 0.7, ease: 'power4.inOut' }, '<')
      .add(() => {
        if (anchor && lenisRef.current) lenisRef.current.scrollTo(`#${anchor}`, { offset: -80 })
        ScrollTrigger.refresh()
      })
  }, [route])

  const openArticle = useCallback((id) => {
    setArticleId(id)
    navigate('article')
  }, [navigate])

  return (
    <SiteContext.Provider value={{ route, navigate, articleId, openArticle }}>
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
          {route === 'article' && <Article />}
        </main>
        <Footer />
      </div>

      {/* Page transition \u2014 theatre curtain that closes then opens */}
      <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
        <div className="pt-left absolute inset-y-0 left-0 w-1/2 border-r-2 border-[#F8E7B0]/30 bg-[repeating-linear-gradient(90deg,#5f1c30_0px,#5f1c30_16px,#7d2540_16px,#7d2540_34px)] shadow-2xl" style={{ transform: 'translateX(-100%)' }} />
        <div className="pt-right absolute inset-y-0 right-0 w-1/2 border-l-2 border-[#F8E7B0]/30 bg-[repeating-linear-gradient(90deg,#7d2540_0px,#7d2540_18px,#5f1c30_18px,#5f1c30_34px)] shadow-2xl" style={{ transform: 'translateX(100%)' }} />
        <div className="pt-brand absolute inset-0 flex items-center justify-center opacity-0">
          <img src="/studio-wonderland-logo.png" alt="Studio Wonderland" className="h-14 w-auto md:h-20" />
        </div>
      </div>

      <Toaster position="top-center" theme="light" />
    </SiteContext.Provider>
  )
}

export default App

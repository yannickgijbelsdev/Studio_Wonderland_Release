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
    if (next === route) {
      if (anchor && lenisRef.current) lenisRef.current.scrollTo(`#${anchor}`, { offset: -80, duration: 1.2 })
      return
    }
    setRoute(next)
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (anchor && lenisRef.current) lenisRef.current.scrollTo(`#${anchor}`, { offset: -80 })
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

      <Toaster position="top-center" theme="light" />
    </SiteContext.Provider>
  )
}

export default App

import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { Toaster } from '@/components/ui/sonner'
import { gsap, ScrollTrigger } from '@/lib/site/anim'
import { SiteContext, pathForRoute, routeForPath } from '@/components/site/ctx'
import Cursor from '@/components/site/Cursor'
import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'
import Home from '@/components/site/Home'
import ShowWorld from '@/components/site/ShowWorld'
import ChristmasWorld from '@/components/site/ChristmasWorld'
import Productions from '@/components/site/Productions'
import About from '@/components/site/About'
import Contact from '@/components/site/Contact'
import Applausmeter from '@/components/site/Applausmeter'
import Article from '@/components/site/Article'
import Legal from '@/components/site/Legal'
import CookieConsent from '@/components/site/CookieConsent'

const WORLD_CLASS = {
  home: 'bg-wonder-bg text-wonder-ink',
  productions: 'bg-wonder-bg text-wonder-ink',
  about: 'bg-wonder-bg text-wonder-ink',
  contact: 'bg-wonder-bg text-wonder-ink',
  applausmeter: 'bg-show-reddeep text-show-cream',
  show: 'bg-show-bg text-show-cream',
  xmas: 'bg-xmas-bg text-xmas-cream',
  article: 'bg-show-bg text-show-cream',
  privacy: 'bg-wonder-bg text-wonder-ink',
  cookies: 'bg-wonder-bg text-wonder-ink',
}

function App() {
  const [route, setRoute] = useState('home')
  const [articleId, setArticleId] = useState(null)
  const [articleOrigin, setArticleOrigin] = useState('show')
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9, syncTouch: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])

  // Sync route with browser URL (initial load + back/forward buttons)
  useEffect(() => {
    setRoute(routeForPath(window.location.pathname))
    const onPop = () => setRoute(routeForPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((next, anchor) => {
    if (next === route) {
      if (anchor && lenisRef.current) lenisRef.current.scrollTo(`#${anchor}`, { offset: -80, duration: 1.2 })
      else if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.1 })
      return
    }
    if (next !== 'article' && typeof window !== 'undefined') {
      const path = pathForRoute(next)
      if (window.location.pathname !== path) window.history.pushState({ route: next }, '', path)
    }
    setRoute(next)
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (anchor && lenisRef.current) lenisRef.current.scrollTo(`#${anchor}`, { offset: -80 })
    })
  }, [route])

  const openArticle = useCallback((id, origin = 'show') => {
    setArticleId(id)
    setArticleOrigin(origin)
    navigate('article')
  }, [navigate])

  const worldClass = route === 'article'
    ? (articleOrigin === 'xmas' ? WORLD_CLASS.xmas : articleOrigin === 'productions' ? WORLD_CLASS.home : WORLD_CLASS.show)
    : (WORLD_CLASS[route] || WORLD_CLASS.home)

  return (
    <SiteContext.Provider value={{ route, navigate, articleId, articleOrigin, openArticle }}>
      <div className={`grain min-h-screen transition-colors duration-500 ${worldClass}`}>
        <Cursor />
        {route !== 'applausmeter' && <Nav />}
        <main>
          {route === 'home' && <Home />}
          {route === 'show' && <ShowWorld />}
          {route === 'xmas' && <ChristmasWorld />}
          {route === 'productions' && <Productions />}
          {route === 'about' && <About />}
          {route === 'contact' && <Contact />}
          {route === 'applausmeter' && <Applausmeter />}
          {route === 'article' && <Article />}
          {route === 'privacy' && <Legal type="privacy" />}
          {route === 'cookies' && <Legal type="cookies" />}
        </main>
        {route !== 'applausmeter' && <Footer />}
      </div>

      <CookieConsent />

      <Toaster position="top-center" theme="light" />
    </SiteContext.Provider>
  )
}

export default App

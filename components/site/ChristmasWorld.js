'use client'
import { useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, Home as HomeIcon, Users, Sparkles, MapPin } from 'lucide-react'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow } from './ui'

function Snow() {
  const flakes = useMemo(() => Array.from({ length: 40 }).map((_, i) => {
    const size = 2 + Math.random() * 5
    return {
      left: Math.random() * 100,
      size,
      delay: -Math.random() * 12,
      dur: 9 + Math.random() * 10,
      drift: (Math.random() * 60 - 30).toFixed(0) + 'px',
      opacity: 0.3 + Math.random() * 0.6,
      key: i,
    }
  }), [])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {flakes.map((f) => (
        <span key={f.key} className="snowflake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.opacity, animationDelay: `${f.delay}s`, animationDuration: `${f.dur}s`, ['--drift']: f.drift }} />
      ))}
    </div>
  )
}

export default function ChristmasWorld() {
  const scope = useRef(null)
  const { navigate } = useSite()
  useSectionAnimations(scope, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.x-hero-line', { yPercent: 120, duration: 1.1, stagger: 0.1, ease: 'power4.out' })
      gsap.to('.x-hero-img', { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.x-hero', start: 'top top', end: 'bottom top', scrub: true } })
    }, scope)
    return () => ctx.revert()
  }, [])

  const parts = [
    { icon: HomeIcon, t: 'Het Huis', d: 'Wandel door kamer na kamer van het magische huis van de Kerstman — elk met een eigen sfeer en geheim.', i: IMG.xmasHouse },
    { icon: Users, t: 'De personages', d: 'Ontmoet de Kerstman, zijn helpers en de bewoners die het huis tot leven brengen.', i: IMG.xmasSantaChair },
    { icon: Sparkles, t: 'De ervaring', d: 'Een interactieve reis vol licht, geur, geluid en verwondering die je samen beleeft.', i: IMG.xmasWalk },
    { icon: MapPin, t: 'Praktische info', d: 'Open vanaf november 2026. Tickets, locatie en tijdsloten volgen binnenkort.', i: IMG.xmasRoad },
  ]

  return (
    <div ref={scope} className="aurora-xmas">
      <div className="flex justify-center pt-24 pb-2">
        <button onClick={() => navigate('home')} data-cursor="hover" className="text-[11px] uppercase tracking-[0.4em] text-xmas-gold/80 hover:text-xmas-gold">Een productie van Studio Wonderland</button>
      </div>

      {/* hero */}
      <section className="x-hero relative h-[88svh] overflow-hidden rounded-b-[40px]">
        <img src={IMG.xmasLandscape} alt="Huis van de Kerstman" className="x-hero-img absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-xmas-bg via-xmas-bg/40 to-black/40" />
        <Snow />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <span className="x-hero-line text-xs uppercase tracking-[0.5em] text-xmas-gold">Winterwereld · 2026</span>
          <h1 className="mt-5 font-display text-[13vw] font-500 leading-[0.85] text-white md:text-[8vw]">
            <span className="block overflow-hidden"><span className="x-hero-line block">Huis van de</span></span>
            <span className="block overflow-hidden"><span className="x-hero-line block text-xmas-gold">Kerstman 2026</span></span>
          </h1>
          <p className="x-hero-line mt-6 max-w-xl text-lg text-white/85">Stap binnen in de magische wereld van de Kerstman.</p>
          <Magnetic as="button" onClick={() => navigate('contact')} className="x-hero-line mt-8 rounded-full bg-xmas-red px-8 py-4 font-semibold text-white">Blijf op de hoogte</Magnetic>
        </div>
      </section>

      {/* intro */}
      <section className="relative px-6 py-24 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl leading-tight text-xmas-cream md:text-5xl">
            <span className="block overflow-hidden"><span data-reveal className="block">Een warme winterwereld</span></span>
            <span className="block overflow-hidden"><span data-reveal className="block text-xmas-gold">om samen in te verdwalen</span></span>
          </h2>
          <p data-fade className="mx-auto mt-6 max-w-2xl text-xmas-cream/75">Kerstlichtjes, zachte sneeuw, houten interieurs en gezellige geuren. Elke hoek van dit huis is ontworpen om families samen te laten dromen.</p>
        </div>
      </section>

      {/* parts */}
      <section className="px-6 pb-12 md:px-10">
        <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2">
          {parts.map((p, idx) => {
            const Icon = p.icon
            return (
              <div key={idx} data-fade className="group relative overflow-hidden rounded-3xl border border-xmas-gold/15 bg-xmas-panel">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={p.i} alt={p.t} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-xmas-panel via-transparent to-transparent" />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-xmas-gold/15 text-xmas-gold"><Icon className="h-5 w-5" /></span>
                    <h3 className="font-display text-2xl text-xmas-cream">{p.t}</h3>
                  </div>
                  <p className="mt-3 text-xmas-cream/75">{p.d}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* atmosphere strip */}
      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4 md:grid-cols-4">
          {[IMG.xmasBaubles, IMG.xmasStars, IMG.xmasTrees, IMG.xmasSanta].map((src, i) => (
            <div key={i} data-img className="aspect-square overflow-hidden rounded-2xl">
              <img src={src} alt="Sfeer" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* back */}
      <section className="px-6 pb-28 md:px-10">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between border-t border-xmas-gold/20 pt-10">
          <button onClick={() => navigate('home')} data-cursor="hover" className="inline-flex items-center gap-2 text-xmas-cream/80 hover:text-xmas-gold"><ArrowLeft className="h-4 w-4" /> Terug naar Studio Wonderland</button>
          <Magnetic as="button" onClick={() => navigate('show')} className="rounded-full border border-xmas-gold/40 px-5 py-2.5 text-sm text-xmas-gold">Naar De Grote Sinterklaasshow</Magnetic>
        </div>
      </section>
    </div>
  )
}

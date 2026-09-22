'use client'
import { useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, Home as HomeIcon, Users, Sparkles as SparkIcon } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow, Star, TitleReveal, ArchDivider } from './ui'

function Snow() {
  const flakes = useMemo(() => Array.from({ length: 40 }).map((_, i) => {
    const size = 2 + Math.random() * 5
    return { left: Math.random() * 100, size, delay: -Math.random() * 12, dur: 9 + Math.random() * 10, drift: (Math.random() * 60 - 30).toFixed(0) + 'px', opacity: 0.3 + Math.random() * 0.6, key: i }
  }), [])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {flakes.map((f) => (
        <span key={f.key} className="snowflake" style={{ left: `${f.left}%`, width: f.size, height: f.size, opacity: f.opacity, animationDelay: `${f.delay}s`, animationDuration: `${f.dur}s`, ['--drift']: f.drift }} />
      ))}
    </div>
  )
}

const FAQ = [
  { q: 'Wanneer is het Huis van de Kerstman open?', a: 'Vanaf november 2026. Exacte data en tijdsloten volgen binnenkort.' },
  { q: 'Voor welke leeftijd is de ervaring bedoeld?', a: 'Voor het hele gezin — van de allerkleinsten tot grootouders.' },
  { q: 'Hoe lang duurt een bezoek?', a: 'Reken op ongeveer een uur om alle kamers rustig te beleven.' },
  { q: 'Is het toegankelijk met een kinderwagen of rolstoel?', a: 'Ja, de volledige route is vlot toegankelijk.' },
  { q: 'Kan ik op voorhand tickets reserveren?', a: 'Zeker. Reserveren gebeurt per tijdslot zodra de verkoop start.' },
]

export default function ChristmasWorld() {
  const scope = useRef(null)
  const { navigate } = useSite()
  useSectionAnimations(scope, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.x-hero-line', { yPercent: 120, duration: 1.1, stagger: 0.1, ease: 'power4.out' })
      gsap.to('.x-hero-img', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.x-hero', start: 'top top', end: 'bottom top', scrub: true } })
    }, scope)
    return () => ctx.revert()
  }, [])

  const parts = [
    { icon: HomeIcon, t: 'Het Huis', d: 'Wandel door kamer na kamer van het magische huis van de Kerstman.', i: IMG.xmasHouse },
    { icon: Users, t: 'De personages', d: 'Ontmoet de Kerstman, zijn helpers en de bewoners van het huis.', i: IMG.xmasSantaChair },
    { icon: SparkIcon, t: 'De ervaring', d: 'Een interactieve reis vol licht, geur, geluid en verwondering.', i: IMG.xmasWalk },
  ]

  return (
    <div ref={scope} className="aurora-xmas">
      <div className="flex justify-center pt-24 pb-2">
        <button onClick={() => navigate('home')} data-cursor="hover" className="text-[11px] uppercase tracking-[0.4em] text-xmas-gold/80 hover:text-xmas-gold">Een productie van Studio Wonderland</button>
      </div>

      {/* HERO */}
      <section className="x-hero relative h-[88svh] overflow-hidden">
        <img src={IMG.xmasLandscape} alt="Huis van de Kerstman" className="x-hero-img absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-xmas-bg via-xmas-bg/40 to-black/40" />
        <Snow />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <span className="x-hero-line text-xs uppercase tracking-[0.5em] text-xmas-gold">Winterwereld &middot; 2026</span>
          <h1 className="mt-5 font-display text-[13vw] leading-[0.94] text-white md:text-[8vw]">
            <span className="block overflow-hidden pb-[0.1em]"><span className="x-hero-line block"><Star className="mr-3 inline-block h-[0.5em] w-[0.5em] -translate-y-[0.08em] align-middle text-xmas-gold" />Huis van de</span></span>
            <span className="block overflow-hidden pb-[0.1em]"><span className="x-hero-line block text-xmas-gold">Kerstman 2026</span></span>
          </h1>
          <p className="x-hero-line mt-6 max-w-xl text-lg text-white/85">Stap binnen in de magische wereld van de Kerstman.</p>
        </div>
      </section>

      {/* WELKOM / VERHAAL */}
      <section className="relative z-10 bg-xmas-green px-6 pb-28 pt-24 md:px-10 md:pb-32 md:pt-28">
        <ArchDivider color="fill-xmas-green" />
        <Snow />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-2">
          <div data-img className="aspect-[4/3] overflow-hidden rounded-3xl">
            <img src={IMG.xmasRoad} alt="Winterwereld" className="h-full w-full object-cover" />
          </div>
          <div>
            <Eyebrow className="text-xmas-gold">Welkom</Eyebrow>
            <TitleReveal lines={["Een warme", "winterwereld"]} starClass="text-xmas-gold" className="mt-4 text-4xl text-xmas-cream md:text-5xl" />
            <p data-fade className="mt-6 text-xmas-cream/80">Kerstlichtjes, zachte sneeuw, houten interieurs en gezellige geuren. Elke hoek van dit huis is ontworpen om families samen te laten dromen en verwonderen.</p>
            <Magnetic as="button" onClick={() => navigate('contact')} className="mt-8 rounded-full bg-xmas-red px-8 py-4 font-semibold text-white hover:bg-white hover:text-xmas-green">Blijf op de hoogte</Magnetic>
          </div>
        </div>
      </section>

      {/* ONDERDELEN */}
      <section className="relative z-10 bg-xmas-bg px-6 pb-24 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-xmas-bg" />
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-14 text-center">
            <Eyebrow className="text-xmas-gold">De ervaring</Eyebrow>
            <TitleReveal lines={["Stap van kamer naar kamer"]} starClass="text-xmas-gold" className="mt-4 text-4xl text-xmas-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {parts.map((p, idx) => {
              const Icon = p.icon
              return (
                <div key={idx} data-fade className="group relative overflow-hidden rounded-3xl border border-xmas-gold/15 bg-xmas-panel">
                  <div className="aspect-[4/3] overflow-hidden">
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
        </div>
      </section>

      {/* PRAKTISCH + FAQ */}
      <section className="relative z-10 bg-xmas-green px-6 pb-24 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-xmas-green" />
        <div className="mx-auto max-w-[900px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-xmas-gold">Praktische info</Eyebrow>
            <TitleReveal lines={["Veelgestelde vragen"]} starClass="text-xmas-gold" className="mt-4 text-4xl text-xmas-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <Accordion type="single" collapsible data-native-cursor className="w-full">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-xmas-gold/20">
                <AccordionTrigger className="text-left text-xmas-cream hover:text-xmas-gold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-xmas-cream/75">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOTO'S */}
      <section className="relative z-10 bg-xmas-bg px-6 pb-28 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-xmas-bg" />
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-xmas-gold">Foto's</Eyebrow>
            <TitleReveal lines={["Sfeerbeelden"]} starClass="text-xmas-gold" className="mt-4 text-4xl text-xmas-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[IMG.xmasBaubles, IMG.xmasStars, IMG.xmasTrees, IMG.xmasSanta, IMG.xmasHouse, IMG.xmasStatue, IMG.xmasFamily1, IMG.xmasWalk].map((src, i) => (
              <div key={i} data-img className={`overflow-hidden rounded-2xl ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                <img src={src} alt="Sfeer" className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110" />
              </div>
            ))}
          </div>
          <div className="mt-16 flex items-center justify-between border-t border-xmas-gold/20 pt-10">
            <button onClick={() => navigate('home')} data-cursor="hover" className="inline-flex items-center gap-2 text-xmas-cream/80 hover:text-xmas-gold"><ArrowLeft className="h-4 w-4" /> Terug naar Studio Wonderland</button>
            <Magnetic as="button" onClick={() => navigate('show')} className="rounded-full border border-xmas-gold/40 px-5 py-2.5 text-sm text-xmas-gold hover:bg-xmas-gold hover:text-xmas-bg">Naar De Grote Sinterklaasshow</Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}

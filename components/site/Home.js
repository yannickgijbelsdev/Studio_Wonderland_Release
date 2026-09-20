'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow } from './ui'

function Sparkles({ count = 60 }) {
  const [dots, setDots] = useState([])
  useEffect(() => {
    const colors = ['#ffffff', '#F6E7B8', '#F4B8CB', '#E098A8', '#FFF6F9']
    setDots(Array.from({ length: count }).map((_, i) => ({
      key: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 1 + Math.random() * 3.5,
      delay: (Math.random() * 4).toFixed(2),
      dur: (2 + Math.random() * 3).toFixed(2),
      color: colors[i % colors.length],
    })))
  }, [count])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <span key={d.key} className="sparkle" style={{ top: `${d.top}%`, left: `${d.left}%`, width: d.size, height: d.size, background: d.color, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
      ))}
    </div>
  )
}

function ExperienceCard({ image, cta, onClick, alt }) {
  return (
    <button
      onClick={onClick}
      data-cursor="hover"
      className="group relative h-[58vh] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-white/25 md:h-[80vh]"
    >
      <img src={image} alt={alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 transition-opacity duration-500 group-hover:opacity-70" />
      <div className="relative flex h-full items-end justify-center p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-7 py-4 font-medium text-wonder-ink shadow-xl transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-wonder-pinkdeep group-hover:text-white">
          {cta}
          <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </button>
  )
}

export default function Home() {
  const scope = useRef(null)
  const { navigate } = useSite()
  useSectionAnimations(scope, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-img', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero-sec', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.from('.hero-cue', { opacity: 0, y: 12, duration: 1, delay: 0.6, ease: 'power3.out' })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={scope}>
      {/* HERO — video only, smooth handoff into the page */}
      <section className="hero-sec relative h-[100svh] w-full overflow-hidden">
        <video
          className="hero-img absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
        >
          <source src={IMG.heroVideo} type="video/mp4" />
          <source src={IMG.heroVideoAlt} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-wonder-pink/40" />
        <div className="hero-cue absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/85">
          <span className="text-[10px] uppercase tracking-[0.35em]">Ontdek</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      {/* KIES JOUW WERELD — magical, glittering, buttons only */}
      <section id="belevenissen" className="relative z-10 -mt-[10vh] overflow-hidden rounded-t-[2.5rem] bg-gradient-to-b from-wonder-pink via-wonder-pinkdeep to-wonder-plum px-6 pb-24 pt-28 md:px-10 md:pb-32 md:pt-36">
        <Sparkles count={80} />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="mb-12 text-center">
            <h2 className="font-display text-5xl leading-tight text-white md:text-7xl">
              <span className="block overflow-hidden"><span data-reveal className="block">Kies jouw wereld</span></span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <ExperienceCard image={IMG.showTile} alt="De Grote Sinterklaasshow" cta="Ontdek de show" onClick={() => navigate('show')} />
            <ExperienceCard image={IMG.xmasLandscape} alt="Huis van de Kerstman 2026" cta="Ontdek het Huis van de Kerstman" onClick={() => navigate('xmas')} />
          </div>
        </div>
      </section>

      {/* STUDIO WONDERLAND INTRO */}
      <section className="relative overflow-hidden bg-wonder-bg px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 md:grid-cols-2">
          <div>
            <Eyebrow className="text-wonder-pinkdeep">Over Studio Wonderland</Eyebrow>
            <h2 className="mt-6 font-display text-4xl leading-[1.05] text-wonder-ink md:text-6xl">
              <span className="block overflow-hidden"><span data-reveal className="block">Niet komen kijken.</span></span>
              <span className="block overflow-hidden"><span data-reveal className="block text-gradient-gold">Maar binnenstappen.</span></span>
            </h2>
            <p data-fade className="mt-8 max-w-lg text-lg leading-relaxed text-wonder-ink/80">
              Studio Wonderland creëert bijzondere livebelevingen voor jong en oud — werelden waarin bezoekers zich volledig kunnen onderdompelen. Wij combineren theater, muziek, licht en verhaal tot ervaringen die families samen beleven en nooit vergeten.
            </p>
            <div data-fade className="mt-10 grid grid-cols-3 gap-6 border-t border-wonder-pink/40 pt-8">
              <div><div className="font-display text-3xl text-wonder-pinkdeep">2</div><div className="mt-1 text-xs uppercase tracking-widest text-wonder-muted">Belevenissen</div></div>
              <div><div className="font-display text-3xl text-wonder-pinkdeep">100k+</div><div className="mt-1 text-xs uppercase tracking-widest text-wonder-muted">Bezoekers</div></div>
              <div><div className="font-display text-3xl text-wonder-pinkdeep">∞</div><div className="mt-1 text-xs uppercase tracking-widest text-wonder-muted">Verwondering</div></div>
            </div>
          </div>
          <div className="relative">
            <div data-img className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={IMG.showAudience} alt="Beleving" className="h-full w-full object-cover" />
            </div>
            <div data-parallax="0.15" className="absolute -bottom-10 -left-8 hidden w-48 overflow-hidden rounded-xl border-4 border-wonder-bg shadow-xl md:block">
              <img src={IMG.xmasSanta} alt="Winter" className="h-56 w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-wonder-bg px-6 pb-28 md:px-10">
        <div className="mx-auto max-w-[1400px] overflow-hidden rounded-3xl bg-gradient-to-br from-wonder-rose to-wonder-pinklt p-10 text-center md:p-20">
          <h3 data-fade className="font-display text-3xl text-wonder-ink md:text-5xl">Klaar om een wereld binnen te stappen?</h3>
          <p data-fade className="mx-auto mt-4 max-w-xl text-wonder-ink/70">Ontdek de twee belevenissen die je vandaag kan bezoeken.</p>
          <div data-fade className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic as="button" onClick={() => navigate('show')} className="rounded-full bg-show-red px-7 py-3.5 font-medium text-white">Ontdek de show</Magnetic>
            <Magnetic as="button" onClick={() => navigate('xmas')} className="rounded-full bg-xmas-green px-7 py-3.5 font-medium text-white">Ontdek het Huis van de Kerstman</Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}

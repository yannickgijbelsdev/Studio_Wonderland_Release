'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow, Star, TitleReveal } from './ui'

function Sparkles({ count = 60, className = '' }) {
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
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((d) => (
        <span key={d.key} className="sparkle" style={{ top: `${d.top}%`, left: `${d.left}%`, width: d.size, height: d.size, background: d.color, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }} />
      ))}
    </div>
  )
}

// Hero that crossfades between BOTH uploaded videos, looping.
function HeroVideos() {
  const a = useRef(null)
  const b = useRef(null)
  const [active, setActive] = useState(0)
  useEffect(() => {
    const va = a.current, vb = b.current
    if (!va || !vb) return
    const tryPlay = (v) => { const p = v.play?.(); if (p && p.catch) p.catch(() => {}) }
    tryPlay(va)
    const onEndA = () => { vb.currentTime = 0; tryPlay(vb); setActive(1) }
    const onEndB = () => { va.currentTime = 0; tryPlay(va); setActive(0) }
    va.addEventListener('ended', onEndA)
    vb.addEventListener('ended', onEndB)
    return () => { va.removeEventListener('ended', onEndA); vb.removeEventListener('ended', onEndB) }
  }, [])
  return (
    <>
      <video ref={a} className={`hero-img absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${active === 0 ? 'opacity-100' : 'opacity-0'}`} autoPlay muted playsInline preload="auto" poster="/hero-poster.jpg">
        <source src={IMG.heroVideo} type="video/mp4" />
      </video>
      <video ref={b} className={`hero-img absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${active === 1 ? 'opacity-100' : 'opacity-0'}`} muted playsInline preload="auto" poster="/hero-poster.jpg">
        <source src={IMG.heroVideoAlt} type="video/mp4" />
      </video>
    </>
  )
}

// Arch "doorway" portal tile — only a button remains.
function PortalTile({ image, cta, onClick, alt }) {
  return (
    <button
      onClick={onClick}
      data-cursor="hover"
      className="group relative h-[62vh] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-white/30 md:h-[80vh]"
    >
      <img src={image} alt={alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 transition-opacity duration-500 group-hover:opacity-70" />
      <div className="relative flex h-full items-end justify-center p-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-7 py-4 font-semibold text-wonder-ink shadow-xl transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-wonder-pinkdeep group-hover:text-white">
          {cta}
          <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </button>
  )
}

function ArchDivider({ color = 'fill-wonder-bg' }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -translate-y-[99%] leading-[0]" aria-hidden="true">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block h-[52px] w-full md:h-[92px]">
        <path className={color} d="M0,100 L0,50 Q720,-40 1440,50 L1440,100 Z" />
      </svg>
    </div>
  )
}

export default function Home() {
  const scope = useRef(null)
  const { navigate } = useSite()
  useSectionAnimations(scope, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-img', { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.hero-sec', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.from('.hero-cue', { opacity: 0, y: 12, duration: 1, delay: 0.8, ease: 'power3.out' })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={scope}>
      {/* HERO — both videos crossfading, no text, smooth arch handoff */}
      <section className="hero-sec relative h-[100svh] w-full overflow-hidden">
        <HeroVideos />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-wonder-pink/50" />
        <div className="hero-cue absolute bottom-[112px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white md:bottom-[132px]">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] [text-shadow:_0_1px_10px_rgba(0,0,0,0.55)]">Scroll om te ontdekken</span>
          <span className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/80 p-1.5 [box-shadow:_0_1px_10px_rgba(0,0,0,0.35)]">
            <span className="h-2 w-1 animate-bounce rounded-full bg-white" />
          </span>
        </div>
      </section>

      {/* KIES JOUW WERELD — magical arch section, glitter, buttons only */}
      <section id="belevenissen" className="relative z-10 bg-gradient-to-b from-wonder-pink via-wonder-pinkdeep to-wonder-plum px-6 pb-28 pt-24 md:px-10 md:pb-36 md:pt-32">
        <ArchDivider color="fill-wonder-pink" />
        <Sparkles count={90} />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="mb-14 text-center">
            <TitleReveal lines={["Kies jouw wereld"]} align="center" starClass="text-[#F8E7B0] drop-shadow-[0_0_12px_rgba(248,231,176,0.75)]" className="text-5xl text-white md:text-7xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <PortalTile image={IMG.showTile} alt="De Grote Sinterklaasshow" cta="Ontdek de show" onClick={() => navigate('show')} />
            <PortalTile image={IMG.xmasLandscape} alt="Huis van de Kerstman 2026" cta="Ontdek het Huis van de Kerstman" onClick={() => navigate('xmas')} />
          </div>
        </div>
      </section>

      {/* STUDIO WONDERLAND INTRO */}
      <section className="relative z-10 bg-wonder-bg px-6 pb-24 pt-24 md:px-10 md:pb-36 md:pt-32">
        <ArchDivider color="fill-wonder-bg" />
        <Sparkles count={26} className="opacity-50" />
        <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 md:grid-cols-2">
          <div>
            <Eyebrow className="text-wonder-pinkdeep">Over Studio Wonderland</Eyebrow>
            <TitleReveal
              lines={["Niet komen kijken.", "Maar binnenstappen."]}
              className="mt-6 text-4xl text-wonder-ink md:text-6xl [&>span:last-child>span]:text-gradient-gold"
            />
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
            <div data-img className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <img src={IMG.showAudience} alt="Beleving" className="h-full w-full object-cover" />
            </div>
            <div data-parallax="0.15" className="absolute -bottom-10 -left-8 hidden w-44 overflow-hidden rounded-2xl border-4 border-wonder-bg shadow-xl md:block">
              <img src={IMG.xmasSanta} alt="Winter" className="h-60 w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-wonder-bg px-6 pb-28 md:px-10">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-wonder-rose to-wonder-pinklt p-10 text-center md:p-20">
          <Sparkles count={30} className="opacity-60" />
          <div className="relative">
            <h3 data-fade className="flex items-center justify-center gap-3 font-display text-3xl text-wonder-ink md:text-5xl"><Star className="h-[0.6em] w-[0.6em] text-wonder-pinkdeep" /> Klaar om binnen te stappen?</h3>
            <p data-fade className="mx-auto mt-4 max-w-xl text-wonder-ink/70">Ontdek de twee belevenissen die je vandaag kan bezoeken.</p>
            <div data-fade className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnetic as="button" onClick={() => navigate('show')} className="rounded-full bg-show-red px-7 py-3.5 font-medium text-white">Ontdek de show</Magnetic>
              <Magnetic as="button" onClick={() => navigate('xmas')} className="rounded-full bg-xmas-green px-7 py-3.5 font-medium text-white">Ontdek het Huis van de Kerstman</Magnetic>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

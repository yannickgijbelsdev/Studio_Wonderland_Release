'use client'
import { useEffect, useRef } from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow } from './ui'

function ExperienceCard({ image, kicker, title, desc, cta, onClick, accent }) {
  const ref = useRef(null)
  return (
    <button
      ref={ref}
      onClick={onClick}
      data-cursor="hover"
      className="group relative h-[62vh] w-full overflow-hidden rounded-2xl text-left md:h-[78vh]"
    >
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${accent}`} />
      <div className="relative flex h-full flex-col justify-end p-8 md:p-10">
        <span className="text-[11px] uppercase tracking-[0.4em] text-white/70">{kicker}</span>
        <h3 className="mt-3 font-display text-4xl leading-none text-white md:text-6xl">{title}</h3>
        <p className="mt-4 max-w-md text-white/75">{desc}</p>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white">
          <span className="rounded-full border border-white/40 px-5 py-2.5 backdrop-blur-sm transition-colors group-hover:border-white group-hover:bg-white group-hover:text-black">{cta}</span>
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
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero-line', { yPercent: 120, duration: 1.15, stagger: 0.12 })
        .from('.hero-sub', { opacity: 0, y: 24, duration: 0.9 }, '-=0.55')
        .from('.hero-cue', { opacity: 0, duration: 0.6 }, '-=0.3')
      gsap.to('.hero-img', { scale: 1.15, ease: 'none', scrollTrigger: { trigger: '.hero-sec', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.hero-overlay', { opacity: 1, ease: 'none', scrollTrigger: { trigger: '.hero-sec', start: 'top top', end: 'bottom top', scrub: true } })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={scope}>
      {/* HERO */}
      <section className="hero-sec relative h-[100svh] w-full overflow-hidden">
        <img src={IMG.heroWonder} alt="Studio Wonderland" className="hero-img absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-wonder-bg" />
        <div className="hero-overlay absolute inset-0 bg-wonder-bg opacity-0" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="overflow-hidden"><span className="hero-sub block text-xs uppercase tracking-[0.5em] text-wonder-gold">Studio Wonderland presenteert</span></div>
          <h1 className="mt-6 font-display text-[15vw] font-500 leading-[0.85] text-wonder-cream md:text-[9vw]">
            <span className="block overflow-hidden"><span className="hero-line block">Studio</span></span>
            <span className="block overflow-hidden"><span className="hero-line block text-gradient-gold">Wonderland</span></span>
          </h1>
          <div className="mt-8 max-w-2xl overflow-hidden">
            <p className="hero-sub text-lg text-wonder-cream/85 md:text-2xl">Wij maken werelden waar families samen in kunnen stappen.</p>
          </div>
        </div>
        <div className="hero-cue absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-wonder-cream/70">
          <span className="text-[10px] uppercase tracking-[0.3em]">Ontdek</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      {/* BELEVENISSEN */}
      <section id="belevenissen" className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow className="text-wonder-gold">Momenteel te beleven</Eyebrow>
              <h2 className="mt-5 font-display text-4xl leading-tight text-wonder-cream md:text-6xl">
                <span className="block overflow-hidden"><span data-reveal className="block">Kies jouw wereld</span></span>
              </h2>
            </div>
            <p data-fade className="max-w-sm text-wonder-muted">Twee volledig eigen werelden. Stap binnen en kies welke belevenis je vandaag wil ontdekken.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <ExperienceCard
              image={IMG.showNeon}
              kicker="Belevenis 01 · Liveshow"
              title="De Grote Sinterklaasshow"
              desc="Een spectaculaire liveshow vol muziek, humor, dans en magie."
              cta="Ontdek de show"
              accent="bg-gradient-to-t from-show-red/50 to-transparent"
              onClick={() => navigate('show')}
            />
            <ExperienceCard
              image={IMG.xmasLandscape}
              kicker="Belevenis 02 · Winterwereld"
              title="Huis van de Kerstman 2026"
              desc="Stap binnen in de magische wereld van de Kerstman."
              cta="Ontdek het Huis van de Kerstman"
              accent="bg-gradient-to-t from-xmas-green/60 to-transparent"
              onClick={() => navigate('xmas')}
            />
          </div>
        </div>
      </section>

      {/* STUDIO WONDERLAND INTRO */}
      <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[1400px] items-center gap-14 md:grid-cols-2">
          <div>
            <Eyebrow className="text-wonder-gold">Over Studio Wonderland</Eyebrow>
            <h2 className="mt-6 font-display text-4xl leading-[1.05] text-wonder-cream md:text-6xl">
              <span className="block overflow-hidden"><span data-reveal className="block">Niet komen kijken.</span></span>
              <span className="block overflow-hidden"><span data-reveal className="block text-gradient-gold">Maar binnenstappen.</span></span>
            </h2>
            <p data-fade className="mt-8 max-w-lg text-lg leading-relaxed text-wonder-cream/80">
              Studio Wonderland creëert bijzondere livebelevingen voor jong en oud — werelden waarin bezoekers zich volledig kunnen onderdompelen. Wij combineren theater, muziek, licht en verhaal tot ervaringen die families samen beleven en nooit vergeten.
            </p>
            <div data-fade className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div><div className="font-display text-3xl text-wonder-gold">2</div><div className="mt-1 text-xs uppercase tracking-widest text-wonder-muted">Belevenissen</div></div>
              <div><div className="font-display text-3xl text-wonder-gold">100k+</div><div className="mt-1 text-xs uppercase tracking-widest text-wonder-muted">Bezoekers</div></div>
              <div><div className="font-display text-3xl text-wonder-gold">∞</div><div className="mt-1 text-xs uppercase tracking-widest text-wonder-muted">Verwondering</div></div>
            </div>
          </div>
          <div className="relative">
            <div data-img className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={IMG.showAudience} alt="Beleving" className="h-full w-full object-cover" />
            </div>
            <div data-parallax="0.15" className="absolute -bottom-10 -left-8 hidden w-48 overflow-hidden rounded-xl border border-white/10 md:block">
              <img src={IMG.xmasSanta} alt="Winter" className="h-56 w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA back to belevenissen */}
      <section className="relative px-6 pb-28 md:px-10">
        <div className="mx-auto max-w-[1400px] overflow-hidden rounded-3xl border border-wonder-gold/20 bg-wonder-panel p-10 text-center md:p-20">
          <h3 data-fade className="font-display text-3xl text-wonder-cream md:text-5xl">Klaar om een wereld binnen te stappen?</h3>
          <p data-fade className="mx-auto mt-4 max-w-xl text-wonder-muted">Ontdek de twee belevenissen die je vandaag kan bezoeken.</p>
          <div data-fade className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic as="button" onClick={() => navigate('show')} className="rounded-full bg-show-red px-7 py-3.5 font-medium text-white">Ontdek de show</Magnetic>
            <Magnetic as="button" onClick={() => navigate('xmas')} className="rounded-full bg-xmas-green px-7 py-3.5 font-medium text-white">Ontdek het Huis van de Kerstman</Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}

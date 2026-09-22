'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, Lock } from 'lucide-react'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow, Star, TitleReveal, Sparkles, ArchDivider } from './ui'
import HeroVideos, { HeroScrollCue } from './HeroVideos'

// Arch "doorway" portal tile — only a button remains.
function PortalTile({ image, cta, onClick, alt, locked = false, ribbon }) {
  const Comp = locked ? 'div' : 'button'
  return (
    <Comp
      onClick={locked ? undefined : onClick}
      data-cursor={locked ? undefined : 'hover'}
      className={`group relative block h-[62vh] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-white/30 md:h-[80vh] ${locked ? 'cursor-default' : ''}`}
    >
      <img src={image} alt={alt} className={`absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out ${locked ? 'scale-105 brightness-[0.45] saturate-[0.85]' : 'group-hover:scale-105'}`} />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 transition-opacity duration-500 ${locked ? '' : 'group-hover:opacity-70'}`} />
      {locked ? (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <div
              className="relative w-[150%] -rotate-[7deg]"
              style={{ transform: 'translateZ(0) rotate(-7deg)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
            >
              <div className="relative bg-gradient-to-b from-[#FBEECB] via-[#E9C766] to-[#C99A26] py-[18px] text-center shadow-[0_16px_36px_-10px_rgba(0,0,0,0.65)]">
                {/* soft inner highlight + trim lines for a ribbon feel */}
                <span className="absolute inset-x-0 top-[3px] h-px bg-white/55" />
                <span className="absolute inset-x-0 bottom-[3px] h-px bg-[#8a6511]/50" />
                <span className="relative flex items-center justify-center gap-2.5 px-6 text-[13px] font-extrabold uppercase tracking-[0.2em] text-[#4a3204] md:text-[15px]" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.35)' }}>
                  <Lock className="h-4 w-4 md:h-[18px] md:w-[18px]" strokeWidth={2.5} />
                  {ribbon}
                </span>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">Binnenkort beschikbaar</div>
        </>
      ) : (
        <div className="relative flex h-full items-end justify-center p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-7 py-4 font-semibold text-wonder-ink shadow-xl transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-wonder-pinkdeep group-hover:text-white">
            {cta}
            <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
      )}
    </Comp>
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        <HeroScrollCue />
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
            <PortalTile image={IMG.xmasLandscape} alt="Huis van de Kerstman 2026" locked ribbon="Je hebt nog geen toegang tot deze wereld" />
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
            <p data-fade className="mx-auto mt-4 max-w-xl text-wonder-ink/70">Ontdek de beleving die je vandaag al kan bezoeken.</p>
            <div data-fade className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnetic as="button" onClick={() => navigate('show')} className="rounded-full bg-show-red px-7 py-3.5 font-medium text-white">Ontdek de show</Magnetic>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

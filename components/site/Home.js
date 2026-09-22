'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, Lock } from 'lucide-react'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow, Star, TitleReveal, Sparkles, ArchDivider } from './ui'
import HeroVideos, { HeroScrollCue } from './HeroVideos'

// Arch "doorway" portal tile — only a button remains.
const CHAIN_TILE = `<svg xmlns='http://www.w3.org/2000/svg' width='34' height='62' viewBox='0 0 34 62'><defs><linearGradient id='cg' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='#FFF8E2'/><stop offset='40%' stop-color='#ECCB63'/><stop offset='72%' stop-color='#C4941C'/><stop offset='100%' stop-color='#6f5109'/></linearGradient></defs><g fill='none' stroke='url(#cg)' stroke-linecap='round'><ellipse cx='0' cy='31' rx='6.5' ry='23' stroke-width='6.5'/><ellipse cx='34' cy='31' rx='6.5' ry='23' stroke-width='6.5'/><ellipse cx='17' cy='31' rx='15' ry='25' stroke-width='7.5'/><ellipse cx='17' cy='31' rx='15' ry='25' stroke='#fff' stroke-opacity='0.25' stroke-width='2'/></g></svg>`
const CHAIN_BG = `url("data:image/svg+xml,${encodeURIComponent(CHAIN_TILE)}")`

function LockChain() {
  return (
    <div
      className="chain-shimmer h-16 w-full md:h-[84px]"
      style={{ backgroundImage: CHAIN_BG, backgroundRepeat: 'repeat-x', backgroundSize: 'auto 100%', backgroundPosition: 'center' }}
      aria-hidden="true"
    />
  )
}

function Padlock() {
  return (
    <svg viewBox="0 0 100 122" className="chain-lock relative h-24 w-auto drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)] md:h-32" aria-hidden="true">
      <defs>
        <linearGradient id="lockGold" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#FFF7E0" />
          <stop offset="38%" stopColor="#EFCF6E" />
          <stop offset="72%" stopColor="#C9971F" />
          <stop offset="100%" stopColor="#8a6511" />
        </linearGradient>
      </defs>
      <path d="M31 58 V42 a19 19 0 0 1 38 0 V58" fill="none" stroke="url(#lockGold)" strokeWidth="11" strokeLinecap="round" />
      <rect x="18" y="54" width="64" height="58" rx="12" fill="url(#lockGold)" stroke="#6d5209" strokeWidth="2" />
      <rect x="18" y="54" width="64" height="14" rx="12" fill="#ffffff" opacity="0.28" />
      <circle cx="50" cy="80" r="7.5" fill="#5a3d05" />
      <rect x="46.5" y="84" width="7" height="17" rx="3.5" fill="#5a3d05" />
      <circle className="lock-glint" cx="33" cy="70" r="2.6" fill="#fff" />
    </svg>
  )
}

function PortalTile({ image, cta, onClick, alt, locked = false, ribbon }) {
  const Comp = locked ? 'div' : 'button'
  return (
    <Comp
      onClick={locked ? undefined : onClick}
      data-cursor={locked ? undefined : 'hover'}
      className={`group relative block h-[62vh] w-full overflow-hidden rounded-[1.75rem] ring-1 ring-white/30 md:h-[80vh] ${locked ? 'cursor-default' : ''}`}
    >
      <img src={image} alt={alt} className={`absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out ${locked ? 'scale-105 brightness-[0.4] saturate-[0.85]' : 'group-hover:scale-105'}`} />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 transition-opacity duration-500 ${locked ? '' : 'group-hover:opacity-70'}`} />
      {locked ? (
        <>
          {/* big chain stretched across, anchored beyond both edges */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="w-[190%] -rotate-[10deg]" style={{ transform: 'translateZ(0) rotate(-10deg)' }}><LockChain /></div>
          </div>
          {/* big padlock in the centre */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><Padlock /></div>
          {/* label plate */}
          <div className="pointer-events-none absolute bottom-8 left-1/2 w-[86%] -translate-x-1/2 rounded-full border border-xmas-gold/50 bg-black/55 px-5 py-2.5 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-xmas-gold backdrop-blur-sm md:text-sm">
            Je hebt nog geen toegang tot deze wereld
          </div>
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
      <section id="over-ons" className="relative z-10 bg-wonder-bg px-6 pb-24 pt-24 md:px-10 md:pb-36 md:pt-32">
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

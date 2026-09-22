'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Volume2, Ticket } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow, Star, TitleReveal, ArchDivider } from './ui'

function Applausmeter() {
  const [level, setLevel] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setLevel((l) => Math.max(0, l - 4)), 120)
    return () => clearInterval(t)
  }, [])
  const clap = () => setLevel((l) => Math.min(100, l + 8))
  const db = Math.round(45 + level * 0.85)
  const label = level > 88 ? 'OORVERDOVEND!' : level > 60 ? 'DAVEREND APPLAUS' : level > 30 ? 'MOOI ZO!' : 'HANDEN OP ELKAAR!'
  return (
    <div className="relative overflow-hidden rounded-3xl border border-show-gold/25 bg-black/25 p-8 md:p-12">
      <div className="flex flex-col items-center text-center">
        <Eyebrow className="text-show-gold">Interactief</Eyebrow>
        <h3 className="mt-4 font-display text-3xl text-show-cream md:text-5xl">De Applausmeter</h3>
        <p className="mt-3 max-w-md text-show-cream/70">Hoe hard kan het publiek? Klik en laat de zaal daveren!</p>
        <div className="mt-8 flex items-end gap-4">
          <span className="font-display text-7xl leading-none text-show-gold md:text-8xl">{db}</span>
          <span className="mb-2 text-xl text-show-cream/70">dB</span>
        </div>
        <span className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-show-red">{label}</span>
        <div className="mt-6 h-5 w-full max-w-lg overflow-hidden rounded-full bg-black/40">
          <div className="h-full rounded-full bg-gradient-to-r from-show-gold via-show-red to-show-red transition-[width] duration-150 ease-out" style={{ width: `${level}%` }} />
        </div>
        <Magnetic as="button" onClick={clap} className="mt-8 inline-flex items-center gap-2 rounded-full bg-show-red px-8 py-4 text-lg font-semibold text-white shadow-[0_10px_40px_-10px_rgba(225,29,42,0.8)]">
          <Volume2 className="h-5 w-5" /> Applaus!
        </Magnetic>
      </div>
    </div>
  )
}

function Feature({ n, title, desc, image, reverse }) {
  return (
    <div className={`grid items-center gap-10 md:grid-cols-2 ${reverse ? 'md:[&>div:first-child]:order-2' : ''}`}>
      <div data-img className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div>
        <span className="font-display text-6xl text-show-red/50">{n}</span>
        <h3 className="mt-2 font-display text-3xl text-show-cream md:text-4xl">{title}</h3>
        <p data-fade className="mt-4 max-w-md text-show-cream/75">{desc}</p>
      </div>
    </div>
  )
}

const FAQ = [
  { q: 'Hoe lang duurt de voorstelling?', a: 'De show duurt ongeveer 75 minuten, zonder pauze.' },
  { q: 'Vanaf welke leeftijd is de voorstelling aan te raden?', a: 'De voorstelling is aanbevolen vanaf 3 jaar.' },
  { q: 'Zijn de plaatsen genummerd?', a: 'Ja, alle plaatsen zijn genummerd. Je kiest je zone bij het boeken.' },
  { q: 'Is de zaal toegankelijk voor rolstoelgebruikers?', a: 'Zeker. Laat het ons weten bij je reservatie zodat we een plek voorzien.' },
  { q: 'Kan ik mijn tickets omruilen of laten terugbetalen?', a: 'Tickets kunnen tot enkele dagen vooraf omgeruild worden naar een ander tijdslot.' },
  { q: 'Delen Sint en de pieten nadien nog cadeautjes uit?', a: 'Na de show is er tijd voor een groet en een klein presentje voor de kinderen.' },
]

export default function ShowWorld() {
  const scope = useRef(null)
  const { navigate } = useSite()
  useSectionAnimations(scope, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.show-hero-line', { yPercent: 120, duration: 1.1, stagger: 0.1, ease: 'power4.out' })
      gsap.to('.show-hero-img', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.show-hero', start: 'top top', end: 'bottom top', scrub: true } })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={scope} className="spotlight-bg">
      <div className="flex justify-center pt-24 pb-2">
        <button onClick={() => navigate('home')} data-cursor="hover" className="text-[11px] uppercase tracking-[0.4em] text-show-gold/80 hover:text-show-gold">Een productie van Studio Wonderland</button>
      </div>

      {/* HERO */}
      <section className="show-hero relative h-[86svh] overflow-hidden">
        <img src={IMG.showNeon} alt="De Grote Sinterklaasshow" className="show-hero-img absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-show-bg via-show-bg/50 to-black/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <span className="show-hero-line text-xs uppercase tracking-[0.5em] text-show-gold">Liveshow &middot; Tournee 2025</span>
          <h1 className="mt-5 font-display text-[13vw] leading-[0.94] text-white md:text-[8vw]">
            <span className="block overflow-hidden pb-[0.1em]"><span className="show-hero-line block"><Star className="mr-3 inline-block h-[0.5em] w-[0.5em] -translate-y-[0.08em] align-middle text-show-gold" />De Grote</span></span>
            <span className="block overflow-hidden pb-[0.1em]"><span className="show-hero-line block text-show-gold">Sinterklaasshow</span></span>
          </h1>
          <p className="show-hero-line mt-6 max-w-xl text-lg text-white/85">Een spectaculaire liveshow vol muziek, humor, dans en magie.</p>
        </div>
      </section>

      {/* HET VERHAAL / TICKETS */}
      <section id="verhaal" className="relative z-10 bg-show-reddeep px-6 pb-28 pt-24 md:px-10 md:pb-32 md:pt-28">
        <ArchDivider color="fill-show-reddeep" />
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-2">
          <div data-img className="aspect-[4/3] overflow-hidden rounded-3xl">
            <img src={IMG.showCurtain} alt="Het verhaal" className="h-full w-full object-cover" />
          </div>
          <div>
            <Eyebrow className="text-show-gold">Het verhaal</Eyebrow>
            <TitleReveal lines={["Twee uur non-stop", "spektakel"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl" />
            <p data-fade className="mt-6 text-show-cream/80">Spotlights, live band, dansers en de warmste held van het jaar. Een show waarin het hele gezin samen lacht, meezingt en zich laat betoveren van de eerste tot de laatste noot.</p>
            <Magnetic as="button" onClick={() => navigate('contact')} className="mt-8 inline-flex items-center gap-2 rounded-full bg-show-gold px-8 py-4 font-semibold text-show-bg hover:bg-white">
              <Ticket className="h-5 w-5" /> Bestel je tickets
            </Magnetic>
          </div>
        </div>
      </section>

      {/* DE SHOW - features */}
      <section className="relative z-10 bg-show-bg px-6 pb-24 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-bg" />
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <Eyebrow className="text-show-gold">De show</Eyebrow>
            <TitleReveal lines={["Vier werelden vol magie"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-6xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <div className="space-y-24">
            <Feature n="01" title="Muziek" desc="Een live band en meezingers die de zaal laten swingen." image={IMG.showGuitar} />
            <Feature n="02" title="Humor" desc="Slapstick, verrassingen en gags voor jong en oud." image={IMG.showCrowd} reverse />
            <Feature n="03" title="Dans" desc="Adembenemende choreografieën en een decor dat leeft." image={IMG.showSpot} />
            <Feature n="04" title="Sinterklaas" desc="De grote held zelf, in een rol vol warmte en magie." image={IMG.showAudience} reverse />
          </div>
        </div>
      </section>

      {/* CAST + APPLAUSMETER */}
      <section className="relative z-10 bg-show-reddeep px-6 pb-24 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-reddeep" />
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-14 text-center">
            <Eyebrow className="text-show-gold">Cast &amp; publiek</Eyebrow>
            <TitleReveal lines={["De sterren van de avond"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { t: 'Rob Vanoudenhoven', d: 'Onze charismatische presentator.', i: IMG.showSpot },
              { t: 'De kandidaten', d: 'Echte gezinnen die het podium op mogen.', i: IMG.showCrowd },
              { t: 'Het publiek', d: 'De ster van de avond. Zonder jullie geen show.', i: IMG.showAudience },
            ].map((c, idx) => (
              <div key={idx} data-fade className="group relative overflow-hidden rounded-2xl border border-show-gold/15">
                <div className="aspect-[3/4] overflow-hidden"><img src={c.i} alt={c.t} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-show-bg via-transparent to-transparent" />
                <div className="absolute bottom-0 p-6"><h4 className="font-display text-2xl text-show-cream">{c.t}</h4><p className="mt-2 text-sm text-show-cream/75">{c.d}</p></div>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-16 max-w-[1000px]"><Applausmeter /></div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 bg-show-bg px-6 pb-24 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-bg" />
        <div className="mx-auto max-w-[900px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-show-gold">Praktisch</Eyebrow>
            <TitleReveal lines={["Veelgestelde vragen"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <Accordion type="single" collapsible data-native-cursor className="w-full">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-show-gold/20">
                <AccordionTrigger className="text-left text-show-cream hover:text-show-gold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-show-cream/75">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOTO'S */}
      <section id="fotos" className="relative z-10 bg-show-reddeep px-6 pb-28 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-reddeep" />
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-show-gold">Foto's</Eyebrow>
            <TitleReveal lines={["Beleef de magie"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[IMG.showNeon, IMG.showSpot, IMG.showGuitar, IMG.showCrowd, IMG.showAudience, IMG.showCurtain, IMG.showSeats, IMG.showTile].map((src, i) => (
              <div key={i} data-img className={`overflow-hidden rounded-2xl ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                <img src={src} alt="Foto" className="h-full w-full object-cover transition-transform duration-1000 hover:scale-110" />
              </div>
            ))}
          </div>
          <div className="mt-16 flex items-center justify-between border-t border-show-gold/20 pt-10">
            <button onClick={() => navigate('home')} data-cursor="hover" className="inline-flex items-center gap-2 text-show-cream/80 hover:text-show-gold"><ArrowLeft className="h-4 w-4" /> Terug naar Studio Wonderland</button>
            <Magnetic as="button" onClick={() => navigate('xmas')} className="rounded-full border border-show-gold/40 px-5 py-2.5 text-sm text-show-gold hover:bg-show-gold hover:text-show-bg">Naar het Huis van de Kerstman</Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}

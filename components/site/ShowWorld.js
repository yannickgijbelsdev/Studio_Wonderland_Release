'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Volume2, Ticket, MapPin, Mic, Crown, Gift, Sparkles as SparkIcon, Radio } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow, Star, TitleReveal, ArchDivider, Sparkles, PhotoGallery } from './ui'
import ShowNews from './ShowNews'

const TICKETS_URL = 'https://events.flextickets.nl/event/de-grote-sinterklaasshow'

function TicketButton({ className = '', children }) {
  return (
    <a href={TICKETS_URL} target="_blank" rel="noopener noreferrer" data-cursor="hover" className={`inline-flex items-center justify-center gap-2 transition-all duration-300 ${className}`}>
      <Ticket className="h-5 w-5" /> {children}
    </a>
  )
}

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
      <span className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full bg-show-red/90 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> On Air
      </span>
      <div className="flex flex-col items-center text-center">
        <Eyebrow className="text-show-gold">Interactief</Eyebrow>
        <h3 className="mt-4 font-display text-3xl text-show-cream md:text-5xl">De Applausmeter</h3>
        <p className="mt-3 max-w-md text-show-cream/70">Het publiek bepaalt wie doorgaat. Klik mee en laat de zaal daveren!</p>
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

const CHARACTERS = [
  { icon: Radio, role: 'Backstagereporter', name: 'Rob Vanoudenhoven', desc: 'Volgt als reporter alles van dichtbij en neemt het publiek mee achter de schermen van deze bijzondere tv-show.', tone: 'from-show-gold/30 to-show-red/20' },
  { icon: Crown, role: 'De valsspelers', name: 'Barones Boterkoek & dochters', desc: 'Willen koste wat het kost winnen en spelen daarbij niet bepaald eerlijk. Acts lopen mis en zelfs de applausmeter lijkt gemanipuleerd…', tone: 'from-purple-500/25 to-show-red/20' },
  { icon: Gift, role: 'Het onderzoeksteam', name: 'De Pieten', desc: 'Gaan op onderzoek uit wanneer kandidaten plots verdwijnen. Tijdens de grote finale komt de waarheid aan het licht.', tone: 'from-show-red/25 to-show-gold/20' },
  { icon: Star, role: 'De grote held', name: 'Sinterklaas', desc: 'Grijpt in op het juiste moment, waarna de show eindigt zoals het hoort: met muziek, feest en het hele publiek op de dansvloer.', tone: 'from-show-gold/35 to-amber-500/20' },
]

const PARTNERS = [
  { name: 'Stad Genk', logo: '/partners/genk.png', invert: false },
  { name: 'Balls & Glory', logo: '/partners/ballsglory.webp', invert: true },
  { name: 'Hotel Bonka', logo: '/partners/hotelbonka.png', invert: false },
  { name: 'Rotary Club Genk', logo: '/partners/rotary.webp', invert: false },
]

const FAQ = [
  { q: 'Hoe lang duurt de voorstelling?', a: 'De show duurt ongeveer 75 minuten, zonder pauze.' },
  { q: 'Vanaf welke leeftijd is de voorstelling aan te raden?', a: 'De voorstelling is aanbevolen vanaf 3 jaar.' },
  { q: 'Zijn de plaatsen genummerd?', a: 'Ja, alle plaatsen zijn genummerd. Je kiest je zone bij het boeken.' },
  { q: 'Is de zaal toegankelijk voor rolstoelgebruikers?', a: 'Zeker. Laat het ons weten bij je reservatie zodat we een plek voorzien.' },
  { q: 'Kan ik mijn tickets omruilen of laten terugbetalen?', a: 'Tickets kunnen tot enkele dagen vooraf omgeruild worden naar een ander tijdslot.' },
  { q: 'Delen Sint en de pieten nadien nog cadeautjes uit?', a: 'Na de show is er tijd voor een groet en een klein presentje voor de kinderen.' },
]

const PHOTOS = [IMG.showNeon, IMG.showSpot, IMG.showGuitar, IMG.showCrowd, IMG.showAudience, IMG.showCurtain, IMG.showSeats, IMG.showTile]

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
        <Sparkles count={40} />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <span className="show-hero-line text-xs uppercase tracking-[0.5em] text-show-gold">Liveshow &middot; Schouwburg Genk</span>
          <h1 className="mt-5 font-display text-[13vw] leading-[0.94] text-white md:text-[8vw]">
            <span className="block overflow-hidden pb-[0.1em]"><span className="show-hero-line block"><Star className="mr-3 inline-block h-[0.5em] w-[0.5em] -translate-y-[0.08em] align-middle text-show-gold" />De Grote</span></span>
            <span className="block overflow-hidden pb-[0.1em]"><span className="show-hero-line block text-show-gold">Sinterklaasshow</span></span>
          </h1>
          <p className="show-hero-line mt-6 max-w-xl text-lg text-white/85">Muziek &bull; Humor &bull; Dans &bull; Magie — en het publiek bepaalt wie wint.</p>
          <div className="show-hero-line mt-8">
            <TicketButton className="rounded-full bg-show-gold px-8 py-4 text-lg font-semibold text-show-bg shadow-[0_12px_40px_-10px_rgba(248,231,176,0.8)] hover:bg-white">Bestel je tickets</TicketButton>
          </div>
        </div>
      </section>

      {/* HET VERHAAL */}
      <section id="verhaal" className="relative z-10 bg-show-reddeep px-6 pb-28 pt-24 md:px-10 md:pb-32 md:pt-28">
        <ArchDivider color="fill-show-reddeep" />
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-2">
          <div data-img className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <img src={IMG.showCurtain} alt="Het verhaal" className="h-full w-full object-cover" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-show-red/90 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white"><span className="h-2 w-2 animate-pulse rounded-full bg-white" /> On Air</span>
          </div>
          <div>
            <Eyebrow className="text-show-gold">Het verhaal</Eyebrow>
            <TitleReveal lines={["Eén grote", "talentenshow"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl" />
            <div data-fade className="mt-6 space-y-4 text-show-cream/80">
              <p>In <em>De Grote Sinterklaasshow</em> nemen verschillende kandidaten het tegen elkaar op met hun meest originele Sinterklaasact. Muziek, humor, dans en magie wisselen elkaar af, terwijl het publiek via de applausmeter mee bepaalt wie doorgaat.</p>
              <p>Maar niet alles loopt volgens plan. Barones Boterkoek en haar dochters spelen vals: acts lopen mis, kandidaten verdwijnen en zelfs de applausmeter lijkt gemanipuleerd. De Pieten gaan op onderzoek uit en tijdens de grote finale komt de waarheid aan het licht — waarna Sinterklaas ingrijpt en de show eindigt met muziek, feest en het hele publiek op de dansvloer.</p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-sm text-show-cream/80">
              <MapPin className="h-4 w-4 text-show-gold" /> Schouwburg — Stadhuis Genk
            </div>
            <div className="mt-8">
              <TicketButton className="rounded-full bg-show-gold px-8 py-4 font-semibold text-show-bg hover:bg-white">Bestel je tickets</TicketButton>
            </div>
          </div>
        </div>
      </section>

      {/* KERNBOODSCHAP */}
      <section className="relative z-10 overflow-hidden bg-show-bg px-6 py-20 text-center md:py-24">
        <ArchDivider color="fill-show-bg" />
        <Sparkles count={30} />
        <div className="relative mx-auto max-w-[900px]">
          <p className="font-display text-3xl leading-tight text-show-cream md:text-5xl">
            <span className="text-show-gold">Muziek</span> &bull; <span className="text-show-gold">Humor</span> &bull; <span className="text-show-gold">Dans</span> &bull; <span className="text-show-gold">Magie</span>
          </p>
          <p className="mt-5 text-lg text-show-cream/80 md:text-xl">En het publiek bepaalt wie wint.</p>
        </div>
      </section>

      {/* DE SHOW - features */}
      <section className="relative z-10 bg-show-reddeep px-6 pb-24 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-reddeep" />
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <Eyebrow className="text-show-gold">De show</Eyebrow>
            <TitleReveal lines={["Vier werelden vol magie"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-6xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <div className="space-y-24">
            <Feature n="01" title="Muziek" desc="Een live band en meezingers die de zaal laten swingen." image={IMG.showGuitar} />
            <Feature n="02" title="Humor" desc="Slapstick, verrassingen en gags voor jong en oud." image={IMG.showCrowd} reverse />
            <Feature n="03" title="Dans" desc="Adembenemende choreografieën en een decor dat leeft." image={IMG.showSpot} />
            <Feature n="04" title="Magie" desc="Spektakel en verwondering tot de allerlaatste noot." image={IMG.showAudience} reverse />
          </div>
        </div>
      </section>

      {/* PERSONAGES + APPLAUSMETER */}
      <section className="relative z-10 bg-show-bg px-6 pb-24 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-bg" />
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-14 text-center">
            <Eyebrow className="text-show-gold">Wie is wie</Eyebrow>
            <TitleReveal lines={["De sterren van de show"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CHARACTERS.map((c, idx) => {
              const Icon = c.icon
              return (
                <div key={idx} data-fade className="group relative overflow-hidden rounded-3xl border border-show-gold/15 bg-black/25 p-7 text-center">
                  <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${c.tone} ring-1 ring-show-gold/25`}>
                    <Icon className="h-10 w-10 text-show-gold" />
                  </div>
                  <span className="mt-5 block text-[11px] font-semibold uppercase tracking-[0.25em] text-show-red">{c.role}</span>
                  <h4 className="mt-2 font-display text-xl leading-tight text-show-cream">{c.name}</h4>
                  <p className="mt-3 text-sm text-show-cream/70">{c.desc}</p>
                  <span className="mt-4 inline-block rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-show-cream/40">Portret volgt</span>
                </div>
              )
            })}
          </div>
          <div className="mx-auto mt-16 max-w-[1000px]"><Applausmeter /></div>
        </div>
      </section>

      {/* NIEUWS */}
      <ShowNews />

      {/* FAQ */}
      <section id="faq" className="relative z-10 bg-show-reddeep px-6 pb-24 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-reddeep" />
        <div className="mx-auto max-w-[820px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-show-gold">Praktisch</Eyebrow>
            <TitleReveal lines={["Veelgestelde vragen"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <Accordion type="single" collapsible data-native-cursor className="w-full space-y-3">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="overflow-hidden rounded-2xl border border-show-gold/15 bg-black/20 px-5 transition-colors data-[state=open]:border-show-gold/40 data-[state=open]:bg-black/30">
                <AccordionTrigger className="py-5 text-left text-base font-medium text-show-cream hover:text-show-gold hover:no-underline md:text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-5 text-show-cream/75">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOTO'S */}
      <section id="fotos" className="relative z-10 bg-show-bg px-6 pb-28 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-bg" />
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-show-gold">Foto's</Eyebrow>
            <TitleReveal lines={["Beleef de magie"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <PhotoGallery images={PHOTOS} accent="text-white" ringClass="ring-show-gold/20" />
        </div>
      </section>

      {/* PARTNERS */}
      <section className="relative z-10 bg-show-reddeep px-6 pb-28 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-reddeep" />
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-show-gold">Met dank aan</Eyebrow>
            <TitleReveal lines={["Onze partners"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {PARTNERS.map((p) => (
              <div key={p.name} data-fade className="flex h-28 items-center justify-center rounded-2xl bg-white/95 p-6 shadow-lg">
                <img src={p.logo} alt={p.name} className={`max-h-14 w-auto max-w-full object-contain ${p.invert ? 'invert' : ''}`} />
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-show-gold/20 pt-10 md:flex-row">
            <button onClick={() => navigate('home')} data-cursor="hover" className="inline-flex items-center gap-2 text-show-cream/80 hover:text-show-gold"><ArrowLeft className="h-4 w-4" /> Terug naar Studio Wonderland</button>
            <Magnetic as="button" onClick={() => navigate('xmas')} className="rounded-full border border-show-gold/40 px-5 py-2.5 text-sm text-show-gold hover:bg-show-gold hover:text-show-bg">Naar het Huis van de Kerstman</Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}

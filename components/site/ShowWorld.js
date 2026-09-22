'use client'
import { useEffect, useRef } from 'react'
import { ArrowLeft, Ticket, MapPin } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow, Star, TitleReveal, ArchDivider, Sparkles, PhotoGallery } from './ui'
import ShowNews from './ShowNews'

const TICKETS_URL = 'https://events.flextickets.nl/event/de-grote-sinterklaasshow'

const PARTNERS = [
  { name: 'Stad Genk', logo: '/partners/genk-white.png' },
  { name: 'Balls & Glory', logo: '/partners/ballsglory-white.png' },
  { name: 'Hotel Bonka', logo: '/partners/hotelbonka-white.png' },
  { name: 'Rotary Club Genk', logo: '/partners/rotary-white.png' },
]

const WORLDS4 = [
  { label: 'Muziek', desc: 'Live band en meezingers die de zaal laten swingen.' },
  { label: 'Humor', desc: 'Slapstick, verrassingen en gags voor jong en oud.' },
  { label: 'Dans', desc: 'Adembenemende choreografieën en een decor dat leeft.' },
  { label: 'Magie', desc: 'Spektakel en verwondering tot de laatste noot.' },
]

const CHARACTERS = [
  { role: 'Backstagereporter', name: 'Rob Vanoudenhoven', desc: 'Volgt als reporter alles van dichtbij en neemt het publiek mee achter de schermen van deze bijzondere tv-show.' },
  { role: 'De valsspelers', name: 'Barones Boterkoek & dochters', desc: 'Willen koste wat het kost winnen en spelen daarbij niet bepaald eerlijk. Acts lopen mis en zelfs de applausmeter lijkt gemanipuleerd…' },
  { role: 'Het onderzoeksteam', name: 'De Pieten', desc: 'Gaan op onderzoek uit wanneer kandidaten plots verdwijnen. Tijdens de grote finale komt de waarheid aan het licht.' },
  { role: 'De grote held', name: 'Sinterklaas', desc: 'Grijpt in op het juiste moment, waarna de show eindigt zoals het hoort: met muziek, feest en het hele publiek op de dansvloer.' },
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

function TicketButton({ className = '', children }) {
  return (
    <a href={TICKETS_URL} target="_blank" rel="noopener noreferrer" data-cursor="hover" className={`inline-flex items-center justify-center gap-2 transition-all duration-300 ${className}`}>
      <Ticket className="h-5 w-5" /> {children}
    </a>
  )
}

// A sliding partner strip (white silhouettes) placed beside the hero scroll cue.
function PartnerStrip({ reverse = false }) {
  const set = [...PARTNERS, ...PARTNERS]
  return (
    <div className="relative min-w-0 flex-1 overflow-hidden">
      <div className={`flex w-max items-center gap-12 md:gap-16 ${reverse ? '[animation:marquee_24s_linear_infinite_reverse]' : '[animation:marquee_24s_linear_infinite]'}`}>
        {[...set, ...set].map((p, i) => (
          <img key={i} src={p.logo} alt={p.name} title={p.name} className="h-12 w-auto shrink-0 opacity-95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] md:h-16" />
        ))}
      </div>
    </div>
  )
}

export default function ShowWorld() {
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
    <div ref={scope} className="spotlight-bg">
      {/* HERO — enkel de Sinterklaas-video, partners flankeren de scroll-cue */}
      <section className="hero-sec relative h-[100svh] w-full overflow-hidden">
        <video className="hero-img absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" poster="/hero-poster.jpg">
          <source src={IMG.heroVideo} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

        {/* Bottom: partners flank the centered scroll cue (all white, sliding) */}
        <div className="absolute inset-x-0 bottom-[70px] z-10 md:bottom-[90px]">
          <div className="mx-auto flex max-w-[1600px] items-center gap-6 px-5 md:gap-10 md:px-10">
            <PartnerStrip />
            <div className="hero-cue flex shrink-0 flex-col items-center gap-3 text-white">
              <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.3em] [text-shadow:_0_1px_10px_rgba(0,0,0,0.6)]">Scroll om te ontdekken</span>
              <span className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/80 p-1.5 [box-shadow:_0_1px_10px_rgba(0,0,0,0.35)]">
                <span className="h-2 w-1 animate-bounce rounded-full bg-white" />
              </span>
            </div>
            <PartnerStrip reverse />
          </div>
        </div>
      </section>

      {/* NIEUWS — bovenaan */}
      <ShowNews showArch={false} />

      {/* HET VERHAAL — voluit, zonder foto */}
      <section id="verhaal" className="relative z-10 bg-show-reddeep px-6 pb-28 pt-24 md:px-10 md:pb-32 md:pt-28">
        <ArchDivider color="fill-show-reddeep" flip />
        <div className="mx-auto max-w-[820px] text-center">
          <Eyebrow className="text-show-gold [&]:justify-center">Het verhaal</Eyebrow>
          <TitleReveal lines={["Eén grote talentenshow"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          <div data-fade className="mx-auto mt-8 max-w-[720px] space-y-5 text-left text-lg leading-relaxed text-show-cream/85 md:text-center">
            <p>In <em>De Grote Sinterklaasshow</em> nemen verschillende kandidaten het tegen elkaar op met hun meest originele Sinterklaasact. Muziek, humor, dans en magie wisselen elkaar af, terwijl het publiek via de applausmeter mee bepaalt wie doorgaat.</p>
            <p>Rob Vanoudenhoven volgt als backstagereporter alles van dichtbij en neemt het publiek mee achter de schermen van deze bijzondere tv-show.</p>
            <p>Maar daar loopt niet alles volgens plan. Barones Boterkoek en haar dochters willen koste wat het kost winnen en spelen daarbij niet bepaald eerlijk. Acts lopen mis, kandidaten verdwijnen en zelfs de applausmeter lijkt gemanipuleerd.</p>
            <p>De Pieten gaan op onderzoek uit en tijdens de grote finale komt de waarheid aan het licht. Sinterklaas grijpt in, waarna de show eindigt zoals het hoort: met muziek, feest en het hele publiek op de dansvloer.</p>
          </div>
          <div className="mt-9 flex flex-col items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-sm text-show-cream/80"><MapPin className="h-4 w-4 text-show-gold" /> Schouwburg — Stadhuis Genk</span>
            <TicketButton className="rounded-full bg-show-gold px-8 py-4 font-semibold text-show-bg hover:scale-[1.03] hover:bg-white">Bestel je tickets</TicketButton>
          </div>
        </div>
      </section>

      {/* VIER WERELDEN — compact, 4 sterretjes */}
      <section className="relative z-10 overflow-hidden bg-show-bg px-6 py-24 md:px-10 md:py-28">
        <ArchDivider color="fill-show-bg" />
        <Sparkles count={26} />
        <div className="relative mx-auto max-w-[1000px] text-center">
          <Eyebrow className="text-show-gold [&]:justify-center">De show</Eyebrow>
          <p className="mt-5 font-display text-2xl text-show-cream md:text-3xl">
            <span className="text-show-gold">Muziek</span> &bull; <span className="text-show-gold">Humor</span> &bull; <span className="text-show-gold">Dans</span> &bull; <span className="text-show-gold">Magie</span>
          </p>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {WORLDS4.map((w) => (
              <div key={w.label} data-fade className="group flex cursor-default flex-col items-center">
                <Star className="h-9 w-9 text-show-gold transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:drop-shadow-[0_0_14px_rgba(248,231,176,0.8)]" />
                <span className="mt-4 font-display text-xl text-show-cream">{w.label}</span>
                <p className="mt-2 max-w-[190px] text-sm text-show-cream/55 transition-colors duration-300 group-hover:text-show-cream/85">{w.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-14 text-lg text-show-cream/80">En het publiek bepaalt wie wint.</p>
        </div>
      </section>

      {/* WIE IS WIE — netter, zonder iconen */}
      <section className="relative z-10 bg-show-reddeep px-6 py-24 md:px-10 md:py-28">
        <ArchDivider color="fill-show-reddeep" flip />
        <div className="mx-auto max-w-[1050px]">
          <div className="mb-14 text-center">
            <Eyebrow className="text-show-gold [&]:justify-center">Wie is wie</Eyebrow>
            <TitleReveal lines={["De sterren van de show"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {CHARACTERS.map((c, idx) => (
              <div key={idx} data-fade className="group relative overflow-hidden rounded-3xl border border-show-gold/15 bg-black/25 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-show-gold/45 md:p-8">
                <span className="absolute left-0 top-7 h-10 w-1 rounded-r bg-show-gold/70" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-show-red">{c.role}</span>
                <h4 className="mt-1.5 font-display text-2xl leading-tight text-show-cream">{c.name}</h4>
                <p className="mt-3 text-sm leading-relaxed text-show-cream/70">{c.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs uppercase tracking-[0.25em] text-show-cream/40">Portretten volgen binnenkort</p>
        </div>
      </section>

      {/* FAQ — verticaal gecentreerd */}
      <section id="faq" className="relative z-10 flex min-h-[85vh] flex-col justify-center bg-show-bg px-6 py-24 md:px-10 md:py-28">
        <ArchDivider color="fill-show-bg" />
        <div className="mx-auto w-full max-w-[820px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-show-gold [&]:justify-center">Praktisch</Eyebrow>
            <TitleReveal lines={["Veelgestelde vragen"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <Accordion type="single" collapsible data-native-cursor className="w-full space-y-3">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="overflow-hidden rounded-2xl border border-show-gold/15 bg-black/20 px-5 transition-colors data-[state=open]:border-show-gold/45 data-[state=open]:bg-black/30">
                <AccordionTrigger className="py-5 text-left text-base font-medium text-show-cream hover:text-show-gold hover:no-underline md:text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-5 text-show-cream/75">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FOTO'S */}
      <section id="fotos" className="relative z-10 bg-show-reddeep px-6 pb-40 pt-24 md:px-10 md:pb-48 md:pt-28">
        <ArchDivider color="fill-show-reddeep" flip />
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-show-gold [&]:justify-center">Foto's</Eyebrow>
            <TitleReveal lines={["Beleef de magie"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <PhotoGallery images={PHOTOS} accent="text-white" ringClass="ring-show-gold/20" />

          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-show-gold/20 pt-10 md:flex-row">
            <button onClick={() => navigate('home')} data-cursor="hover" className="inline-flex items-center gap-2 text-show-cream/80 hover:text-show-gold"><ArrowLeft className="h-4 w-4" /> Terug naar Studio Wonderland</button>
            <Magnetic as="button" onClick={() => navigate('xmas')} className="rounded-full border border-show-gold/40 px-5 py-2.5 text-sm text-show-gold hover:bg-show-gold hover:text-show-bg">Naar het Huis van de Kerstman</Magnetic>
          </div>
        </div>
        <ArchDivider color="fill-show-reddeep" position="bottom" />
      </section>
    </div>
  )
}

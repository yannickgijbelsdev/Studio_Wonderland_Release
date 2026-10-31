'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Ticket, CalendarDays, Clock, MapPin } from 'lucide-react'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Eyebrow, Star, TitleReveal, ArchDivider, PhotoGallery } from './ui'
import HeroVideos, { HeroScrollCue } from './HeroVideos'
import ShowNews from './ShowNews'

const XMAS_SITE = 'het-huis-van-de-kerstman'

const TICKETS_URL = 'https://events.flextickets.nl/event/huis-van-de-kerstman'

const CENTER_TITLE = 'mt-4 text-4xl text-xmas-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center'

// Hero: vervangen door een foto van Mr. Bonbonetti (Koen Crucke) of de nieuwe
// trailer zodra die geüpload zijn. Tot dan een neutraal kerstbeeld (geen Scrooge).
const XMAS_HERO_IMAGE = IMG.xmasLandscape
const XMAS_HERO_VIDEO = null // bv. '/kerst-trailer.mp4'
// Trailer in "Data & tickets" — verschijnt automatisch zodra een bestand is ingesteld.
const XMAS_TRAILER = null // bv. '/kerst-trailer.mp4'

const DATES = ['Zaterdag 12 december', 'Zondag 13 december', 'Woensdag 16 december', 'Zaterdag 19 december', 'Zondag 20 december', 'Maandag 21 december', 'Dinsdag 22 december', 'Woensdag 23 december', 'Donderdag 24 december']

const INCLUDED = [
  'Persoonlijke ontvangst in een kleine groep door een Kerstelf',
  'Een persoonlijke vertelling en fotomoment met de Kerstman',
  'Samen de Elfendans beleven',
  'Een écht Elfendiploma om mee naar huis te nemen',
  'Een gereserveerd tijdstip, zonder aanschuiven',
]

const GOLDEN_INFO = [
  { label: 'Data', value: 'Zondag 13 december, Zaterdag 19 december, Zondag 20 december, Maandag 21 december, Dinsdag 22 december, Woensdag 23 december', wide: true },
  { label: 'Locatie', value: 'Sint-Martinusplein, Genk (de precieze locatie houden we nog geheim)', wide: true },
  { label: 'Prijs', value: '€ 9,50 per persoon' },
  { label: 'Duur', value: '± 45 minuten' },
  { label: 'Leeftijd', value: 'Geschikt voor alle leeftijden' },
]

const PHOTOS = [IMG.xmasBaubles, IMG.xmasStars, IMG.xmasTrees, IMG.xmasSanta, IMG.xmasHouse, IMG.xmasStatue, IMG.xmasFamily1, IMG.xmasWalk]

function TicketButton({ className = '', children }) {
  return (
    <a href={TICKETS_URL} target="_blank" rel="noopener noreferrer" data-cursor="hover" className={`inline-flex items-center justify-center gap-2 transition-all duration-300 ${className}`}>
      <Ticket className="h-5 w-5" /> {children}
    </a>
  )
}

function Snow() {
  const flakes = useMemo(() => Array.from({ length: 22 }).map((_, i) => {
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

export default function ChristmasWorld() {
  const scope = useRef(null)
  const { navigate } = useSite()
  const [galleryPhotos, setGalleryPhotos] = useState([])
  useSectionAnimations(scope, [galleryPhotos.length])

  // Foto's uit de Clara/koodh galerij van het Huis van de Kerstman; valt terug op
  // de vaste sfeerbeelden wanneer de galerij nog leeg is.
  useEffect(() => {
    let mounted = true
    fetch(`/api/news?site=${XMAS_SITE}&category=galerij`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!mounted || !data) return
        const imgs = (data.items || [])
          .map((i) => ({ src: i.image_url, caption: i.image_caption_html }))
          .filter((i) => i.src)
        if (imgs.length) setGalleryPhotos(imgs)
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-img', { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.hero-sec', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.from('.hero-cue', { opacity: 0, y: 12, duration: 1, delay: 0.8, ease: 'power3.out' })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={scope} className="aurora-xmas">
      {/* HERO — identiek aan de Studio Wonderland-hoofdsite (crossfade video's) */}
      <section className="hero-sec relative h-[100svh] w-full overflow-hidden">
        {XMAS_HERO_VIDEO ? (
          <HeroVideos mp4={XMAS_HERO_VIDEO} />
        ) : (
          <img src={XMAS_HERO_IMAGE} alt="Het Huis van de Kerstman" className="hero-img absolute inset-0 h-full w-full object-cover will-change-transform" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        <HeroScrollCue />
      </section>

      {/* NIEUWS — bovenaan, met boog omhoog in de hero */}
      <ShowNews
        site={XMAS_SITE}
        category="nieuws"
        origin="xmas"
        title="Vers uit het Huis van de Kerstman"
        archColor="fill-xmas-bg"
        sectionBg="bg-xmas-bg"
        eyebrowCls="text-xmas-gold"
        titleCls="text-xmas-cream"
        titleStar="text-xmas-gold"
        cardBorder="border-xmas-gold/15"
        cardHover="hover:border-xmas-gold/50 hover:shadow-[0_20px_50px_-20px_rgba(232,180,80,0.35)]"
        headingCls="text-xmas-cream group-hover:text-xmas-gold"
        excerptCls="text-xmas-cream/70"
        btnCls="bg-xmas-gold text-xmas-bg hover:bg-white"
        imageBg="bg-xmas-green"
        fallbackBg="bg-xmas-green"
        iconCls="text-xmas-gold/50"
      />

      {/* HET VERHAAL */}
      <section id="verhaal" className="relative z-10 bg-xmas-green px-6 pb-28 pt-24 md:px-10 md:pb-32 md:pt-28">
        <ArchDivider color="fill-xmas-green" />
        <Snow />
        <div className="relative mx-auto max-w-[820px] text-center">
          <Eyebrow className="text-xmas-gold [&]:justify-center">Het verhaal</Eyebrow>
          <TitleReveal lines={["De reis begint", "in een snoepwinkel"]} starClass="text-xmas-gold" className={CENTER_TITLE} />
          <div data-fade className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <button onClick={() => navigate('xmas', 'tickets')} data-cursor="hover" className="inline-flex items-center justify-center gap-2 rounded-full bg-xmas-gold px-8 py-4 font-semibold text-xmas-bg shadow-[0_0_18px_rgba(248,231,176,0.5)] transition-all duration-300 hover:bg-white">
              <CalendarDays className="h-5 w-5" /> Bezoek het Huis van de Kerstman
            </button>
            <button onClick={() => navigate('xmas', 'golden')} data-cursor="hover" className="inline-flex items-center justify-center gap-2 rounded-full bg-xmas-gold px-8 py-4 font-semibold text-xmas-bg shadow-[0_0_18px_rgba(248,231,176,0.5)] transition-all duration-300 hover:bg-white">
              <Ticket className="h-5 w-5" /> Golden Ticket - Kerstvertelling
            </button>
          </div>
          <div data-fade className="mt-10 space-y-5 text-left text-lg leading-relaxed text-xmas-cream/85">
            <p>Ergens in Genk bevindt zich een bijzondere snoepwinkel. Achter de toonbank vind je potten vol kleurrijke snoepjes, vreemde recepten en wonderlijke uitvindingen. Hier woont en werkt Mr. Bonbonetti, een excentrieke snoepmaker en uitvinder die ervan overtuigd is dat een beetje magie en teamwork bijna ieder probleem kunnen oplossen.</p>
            <p>Maar achter in zijn winkel staat iets wat bijna niemand kent… <strong className="text-xmas-gold">De Magische Kast</strong>. En die kast kan vliegen naar <strong className="text-xmas-gold">het Huis van de Kerstman</strong>.</p>
          </div>
        </div>
      </section>

      {/* DATA & TICKETS (doel van knop 1) */}
      <section id="tickets" className="relative z-10 bg-xmas-bg px-6 py-24 md:px-10 md:py-28">
        <ArchDivider color="fill-xmas-bg" flip />
        <div className="mx-auto max-w-[1000px]">
          <div className="text-center">
            <Eyebrow className="text-xmas-gold [&]:justify-center">Ben jij klaar voor de reis?</Eyebrow>
            <TitleReveal lines={["Data & tickets"]} starClass="text-xmas-gold" className={CENTER_TITLE} />
          </div>
          <div data-fade className="mx-auto mb-12 mt-6 max-w-[760px] space-y-4 text-center text-xmas-cream/75">
            <p>Het Huis van de Kerstman 2026 is geen klassieke voorstelling waarbij kinderen alleen maar kijken. Hier stappen ze zélf het verhaal binnen. Ze ontmoeten bijzondere personages, helpen de elfen, lossen opdrachten op en maken samen de magische reis naar de Kerstman.</p>
            <p>Het Huis van de Kerstman is gratis toegankelijk tijdens de gewone openingsuren, zolang de capaciteit het toelaat. Hou er rekening mee dat je op drukke momenten mogelijk moet aanschuiven.</p>
            <p>Zeker zijn van je bezoek én liever niet wachten? Kies dan voor de <a href={TICKETS_URL} target="_blank" rel="noopener noreferrer" data-cursor="hover" className="font-semibold text-xmas-gold underline underline-offset-4 hover:text-white">Golden Ticket-beleving</a>. Met een Golden Ticket reserveer je vooraf je tijdstip en hoef je niet aan te schuiven. Per voormiddag is slechts een beperkt aantal Golden Tickets beschikbaar.</p>
          </div>

          {XMAS_TRAILER && (
            <div data-fade className="mb-12 overflow-hidden rounded-3xl border border-xmas-gold/15 bg-black/30">
              <video src={XMAS_TRAILER} controls playsInline preload="metadata" className="block aspect-video w-full" />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div data-fade className="rounded-3xl border border-xmas-gold/15 bg-xmas-panel p-7">
              <div className="flex items-center gap-2 text-xmas-gold"><CalendarDays className="h-5 w-5" /><h3 className="font-display text-2xl text-xmas-cream">Data</h3></div>
              <ul className="mt-4 space-y-1.5 text-lg text-xmas-cream/90">
                {DATES.map((d) => (
                  <li key={d} className="flex items-center gap-2"><Star className="h-3.5 w-3.5 shrink-0 text-xmas-gold" /> {d}</li>
                ))}
              </ul>
            </div>
            <div data-fade className="rounded-3xl border border-xmas-gold/30 bg-xmas-gold/10 p-7">
              <p className="flex items-center gap-2 text-lg text-xmas-cream/90"><Clock className="h-5 w-5 shrink-0 text-xmas-gold" /> Telkens van 14u tot 17u</p>
              <p className="mt-4 flex items-start gap-2 text-lg text-xmas-cream/90"><MapPin className="mt-1 h-5 w-5 shrink-0 text-xmas-gold" /> <span>Locatie: Sint-Martinusplein Genk (de precieze locatie houden we nog geheim)</span></p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <TicketButton className="rounded-full bg-xmas-gold px-8 py-4 font-semibold text-xmas-bg shadow-[0_0_18px_rgba(248,231,176,0.5)] hover:bg-white">Bestel je Golden Ticket</TicketButton>
          </div>
        </div>
      </section>

      {/* GOLDEN TICKET (doel van knop 2) */}
      <section id="golden" className="relative z-10 bg-xmas-green px-6 py-24 md:px-10 md:py-28">
        <ArchDivider color="fill-xmas-green" />
        <Snow />
        <div className="relative mx-auto max-w-[900px]">
          <div className="text-center">
            <div className="mb-10 flex justify-center">
              <div className="golden-ticket relative flex items-center gap-4 overflow-hidden rounded-2xl border border-xmas-gold/60 bg-gradient-to-br from-[#FFF6DE] via-[#F0D48A] to-[#C9971F] px-7 py-5 text-xmas-bg">
                <span className="shine" />
                <span className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-xmas-green" />
                <span className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-xmas-green" />
                <Ticket className="h-9 w-9 shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
                <div className="border-l-2 border-dashed border-xmas-bg/40 pl-4 text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.35em]">Golden Ticket</span>
                  <span className="block font-display text-xl leading-tight">Huis van de Kerstman</span>
                </div>
              </div>
            </div>
            <Eyebrow className="text-xmas-gold [&]:justify-center">Golden Ticket</Eyebrow>
            <TitleReveal lines={["Het Golden Ticket"]} starClass="text-xmas-gold" className={CENTER_TITLE} />
            <div data-fade className="mx-auto mt-6 max-w-[720px] space-y-4 text-xmas-cream/85">
              <p>Sommige uitnodigingen van de Kerstman zijn nét dat tikkeltje magischer…</p>
              <p>Met een Golden Ticket beleef je de reis naar het Huis van de Kerstman op een heel bijzondere manier. Geen wachtrij, geen onzekerheid: jullie tijdstip ligt vooraf vast en de Kerstman weet dat jullie komen.</p>
              <p>En het mooiste? Hij heeft speciaal voor jullie tijd vrijgemaakt.</p>
            </div>
          </div>
          <h3 data-fade className="mt-12 text-center font-display text-2xl text-xmas-gold md:text-3xl">Wat is inbegrepen?</h3>
          <ul className="mt-6 space-y-4">
            {INCLUDED.map((item, i) => (
              <li key={i} data-fade className="flex items-center gap-4 rounded-2xl border border-xmas-gold/15 bg-black/20 p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-xmas-gold text-xmas-bg"><Star className="h-4 w-4" /></span>
                <p className="text-xmas-cream/85">{item}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <TicketButton className="rounded-full bg-xmas-gold px-8 py-4 font-semibold text-xmas-bg shadow-[0_0_18px_rgba(248,231,176,0.5)] hover:bg-white">Reserveer jullie magische vlucht</TicketButton>
          </div>
          <div data-fade className="mt-10 grid gap-6 rounded-3xl border border-xmas-gold/30 bg-xmas-gold/10 p-8 text-center sm:grid-cols-3">
            {GOLDEN_INFO.map((g) => (
              <div key={g.label} className={g.wide ? 'sm:col-span-3' : ''}>
                <span className="text-xs uppercase tracking-[0.2em] text-xmas-gold">{g.label}</span>
                <p className={`mt-1 text-xmas-cream ${g.wide ? 'text-base md:text-lg' : 'font-display text-xl'}`}>{g.value}</p>
              </div>
            ))}
          </div>
          <div data-fade className="mt-6 space-y-1 text-center text-sm italic text-xmas-cream/60">
            <p>Het aantal Golden Tickets per dag is beperkt.</p>
            <p>Reserveer jullie tijdstip en verzeker je van een magische ontmoeting met de Kerstman.</p>
          </div>
        </div>
      </section>

      {/* FOTO'S */}
      <section id="fotos" className="relative z-10 bg-xmas-bg px-6 pb-40 pt-24 md:px-10 md:pb-48 md:pt-28">
        <ArchDivider color="fill-xmas-bg" flip />
        <Snow />
        <div className="relative mx-auto max-w-[1300px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-xmas-gold [&]:justify-center">Foto's</Eyebrow>
            <TitleReveal lines={["Sfeerbeelden"]} starClass="text-xmas-gold" className={CENTER_TITLE} />
            <p data-fade className="mt-4 text-xmas-cream/70">Sfeerbeelden van Kerst 2024 en Kerst 2025</p>
          </div>
          <PhotoGallery images={galleryPhotos.length ? galleryPhotos : PHOTOS} accent="text-white" ringClass="ring-xmas-gold/20" />
        </div>
        <ArchDivider color="fill-xmas-bg" position="bottom" />
      </section>
    </div>
  )
}

'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Ticket, CalendarDays, Clock, MapPin, Play, X } from 'lucide-react'
import { gsap, useSectionAnimations, useScrollLock } from '@/lib/site/anim'
import { useSite } from './ctx'
import { Eyebrow, Star, TitleReveal, ArchDivider, PhotoGallery } from './ui'
import ShowNews from './ShowNews'

const XMAS_SITE = 'het-huis-van-de-kerstman'

const TICKETS_URL = 'https://events.flextickets.nl/event/huis-van-de-kerstman-2026'

const CENTER_TITLE = 'mt-4 text-4xl text-xmas-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center'

// Trailer met Mr. Bonbonetti (Koen Crucke) — staand formaat (9:16).
// Gebruikt als hero (gedempt, in een lus) én met geluid in "Data & tickets".
const XMAS_TRAILER = '/kerst-trailer.mp4'
const XMAS_TRAILER_POSTER = '/kerst-trailer-poster.jpg'
// Foto van de etalage: vult op desktop de ruimte achter de staande trailer.
const XMAS_HERO_BG = '/huis-kerstman-etalage.webp'

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
  const heroVid = useRef(null)
  const { navigate } = useSite()
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [galleryPhotos, setGalleryPhotos] = useState([])

  // Foto's uit de Clara/koodh galerij (clr.koodh.com/api/news/het-huis-van-de-kerstman/galerij).
  useEffect(() => {
    let mounted = true
    fetch('/api/news?site=het-huis-van-de-kerstman&category=galerij')
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
  useScrollLock(trailerOpen)
  // Hero-video pauzeren zolang de trailer (met geluid) openstaat.
  useEffect(() => {
    const v = heroVid.current
    if (!v) return
    if (trailerOpen) v.pause?.()
    else { const p = v.play?.(); if (p && p.catch) p.catch(() => {}) }
  }, [trailerOpen])
  useSectionAnimations(scope, [galleryPhotos.length])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-img', { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.hero-sec', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.from('.hero-cue', { opacity: 0, y: 12, duration: 1, delay: 0.8, ease: 'power3.out' })
    }, scope)
    // Hero-trailer pauzeren zodra hij uit beeld is (spaart rekenkracht tijdens scrollen).
    const v = heroVid.current
    let io
    if (v && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { const pr = v.play?.(); if (pr && pr.catch) pr.catch(() => {}) }
        else v.pause?.()
      }, { threshold: 0 })
      io.observe(v)
    }
    return () => { if (io) io.disconnect(); ctx.revert() }
  }, [])

  return (
    <div ref={scope} className="aurora-xmas">
      {/* HERO — trailer met Mr. Bonbonetti. Mobiel: schermvullend. Desktop: staande
          video gecentreerd op een vervaagde still van hetzelfde decor. */}
      <section className="hero-sec relative h-[100svh] w-full overflow-hidden bg-xmas-bg">
        <img src={XMAS_HERO_BG} alt="Etalage van het Huis van de Kerstman" className="hero-img absolute inset-0 hidden h-full w-full object-cover will-change-transform md:block" />
        <div className="pointer-events-none absolute inset-0 hidden bg-black/30 md:block" />
        <div className="absolute inset-0 flex items-center justify-center md:pb-[270px] md:pt-[96px]">
          <video
            ref={heroVid}
            className="h-full w-full object-cover md:aspect-[9/16] md:w-auto md:rounded-3xl md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] md:ring-1 md:ring-xmas-gold/30"
            poster={XMAS_TRAILER_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Trailer Het Huis van de Kerstman met Mr. Bonbonetti"
          >
            <source src={XMAS_TRAILER} type="video/mp4" />
          </video>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        {/* Trailer-knop + scroll-cue — zelfde opbouw als bij De Grote Sinterklaasshow */}
        <div className="hero-cue absolute bottom-[112px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-4 text-white md:bottom-[132px]">
          <button
            onClick={() => setTrailerOpen(true)}
            data-cursor="hover"
            className="pointer-events-auto inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-xmas-gold px-6 py-3 text-sm font-semibold text-xmas-bg shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4 fill-current" /> Bekijk de trailer
          </button>
          <div className="flex flex-col items-center gap-2">
            <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.3em] [text-shadow:_0_1px_10px_rgba(0,0,0,0.6)]">Scroll om te ontdekken</span>
            <span className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/80 p-1.5 [box-shadow:_0_1px_10px_rgba(0,0,0,0.35)]">
              <span className="h-2 w-1 animate-bounce rounded-full bg-white" />
            </span>
          </div>
        </div>
      </section>

      {/* TRAILER MODAL */}
      {trailerOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setTrailerOpen(false)}
        >
          <button
            onClick={() => setTrailerOpen(false)}
            data-cursor="hover"
            aria-label="Sluiten"
            className="absolute right-5 top-5 z-10 text-white/80 transition-colors hover:text-white"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <video
              src={XMAS_TRAILER}
              poster={XMAS_TRAILER_POSTER}
              controls
              autoPlay
              playsInline
              className="block max-h-[86vh] w-auto max-w-[92vw] rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

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

      {/* HET VERHAAL — met Mr. Bonbonetti ernaast, zoals de Sint bij De Grote Sinterklaasshow */}
      <section id="verhaal" className="relative z-10 bg-xmas-green px-6 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-xmas-green" />
        <Snow />
        <div className="relative mx-auto flex max-w-[1360px] flex-col items-center gap-8 lg:flex-row-reverse lg:items-end lg:gap-12">
          <div className="w-full max-w-[820px] pb-12 text-center lg:max-w-none lg:flex-1 lg:pb-28 lg:text-left">
            <Eyebrow className="text-xmas-gold [&]:justify-center lg:[&]:justify-start">Het verhaal</Eyebrow>
            <TitleReveal lines={["De reis begint hier"]} starClass="text-xmas-gold" className="mt-4 text-4xl text-xmas-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center lg:[&>span]:mx-0 lg:[&>span>span]:justify-start" />
            <div data-fade className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center lg:justify-start">
              <button onClick={() => navigate('xmas', 'tickets')} data-cursor="hover" className="inline-flex items-center justify-center gap-2 rounded-full bg-xmas-gold px-8 py-4 font-semibold text-xmas-bg shadow-[0_0_18px_rgba(248,231,176,0.5)] transition-all duration-300 hover:bg-white">
                <CalendarDays className="h-5 w-5" /> Bezoek het Huis van de Kerstman
              </button>
              <button onClick={() => navigate('xmas', 'golden')} data-cursor="hover" className="inline-flex items-center justify-center gap-2 rounded-full bg-xmas-gold px-8 py-4 font-semibold text-xmas-bg shadow-[0_0_18px_rgba(248,231,176,0.5)] transition-all duration-300 hover:bg-white">
                <Ticket className="h-5 w-5" /> Golden Ticket - Kerstvertelling
              </button>
            </div>
            <div data-fade className="mt-10 max-w-[820px] space-y-5 text-left text-lg leading-relaxed text-xmas-cream/85">
              <p>Ergens in Genk bevindt zich een bijzondere snoepwinkel. Achter de toonbank vind je potten vol kleurrijke snoepjes, vreemde recepten en wonderlijke uitvindingen. Hier woont en werkt Mr. Bonbonetti, een excentrieke snoepmaker en uitvinder die ervan overtuigd is dat een beetje magie en teamwork bijna ieder probleem kunnen oplossen.</p>
              <p>Maar achter in zijn winkel staat iets wat bijna niemand kent… <strong className="text-xmas-gold">De Magische Kast</strong>. En die kast kan vliegen naar <strong className="text-xmas-gold">het Huis van de Kerstman</strong>.</p>
            </div>
          </div>

          <div className="w-full max-w-[340px] sm:max-w-[400px] lg:w-[440px] lg:max-w-none lg:flex-shrink-0 lg:self-end">
            <img src="/bonbonetti.png" alt="Mr. Bonbonetti — Het Huis van de Kerstman" className="mx-auto block h-auto w-full object-contain drop-shadow-[0_-6px_36px_rgba(0,0,0,0.35)] [transform:translateZ(0)]" />
          </div>
        </div>
      </section>

      {/* DATA & TICKETS + GOLDEN TICKET — samengevoegd (doel van beide knoppen) */}
      <section id="tickets" className="relative z-10 bg-xmas-bg px-6 pt-24 md:px-10 md:pt-28 xl:pb-28">
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

          <div className="grid gap-6 md:grid-cols-2">
              <div data-fade className="rounded-3xl border border-xmas-gold/15 bg-xmas-panel p-7">
                <div className="flex items-center gap-2 text-xmas-gold"><CalendarDays className="h-5 w-5" /><h3 className="font-display text-2xl text-xmas-cream">Data</h3></div>
                <ul className="mt-4 space-y-1.5 text-lg text-xmas-cream/90">
                  {DATES.map((d) => (
                    <li key={d} className="flex items-center gap-2"><Star className="h-3.5 w-3.5 shrink-0 text-xmas-gold" /> {d}</li>
                  ))}
                </ul>
              </div>
              <div data-fade className="flex flex-col overflow-hidden rounded-3xl border border-xmas-gold/30 bg-xmas-gold/10 p-7 pb-0">
                <p className="flex items-center gap-2 text-lg text-xmas-cream/90"><Clock className="h-5 w-5 shrink-0 text-xmas-gold" /> Telkens van 14u tot 17u</p>
                <p className="mt-4 flex items-start gap-2 text-lg text-xmas-cream/90"><MapPin className="mt-1 h-5 w-5 shrink-0 text-xmas-gold" /> <span>Locatie: Sint-Martinusplein Genk (de precieze locatie houden we nog geheim)</span></p>
                <img src="/peperkoek.webp" alt="Peperkoekmannetje" loading="lazy" className="mt-auto block w-[170px] self-end pt-6 drop-shadow-[0_-6px_36px_rgba(0,0,0,0.35)] [transform:translateZ(0)] md:w-[200px]" />
              </div>
          </div>

          {/* GOLDEN TICKET (doel van knop 2) */}
          <div id="golden" className="mt-24 scroll-mt-24 md:mt-28">
            <div className="text-center">
            <div className="mb-10 flex justify-center">
              <div className="golden-ticket relative flex items-center gap-4 overflow-hidden rounded-2xl border border-xmas-gold/60 bg-gradient-to-br from-[#FFF6DE] via-[#F0D48A] to-[#C9971F] px-7 py-5 text-xmas-bg">
                <span className="shine" />
                <span className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-xmas-bg" />
                <span className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-xmas-bg" />
                <Ticket className="h-9 w-9 shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
                <div className="border-l-2 border-dashed border-xmas-bg/40 pl-4 text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.35em]">Golden Ticket</span>
                  <img src="/huis-van-de-kerstman-logo-dark.png" alt="Huis van de Kerstman" className="mt-1 block h-9 w-auto" />
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
            <div className="mx-auto max-w-[900px]">
              <h3 data-fade className="mt-12 text-center font-display text-2xl text-xmas-gold md:text-3xl">Wat is inbegrepen?</h3>
              <ul className="mt-6 space-y-4">
                {INCLUDED.map((item, i) => (
                  <li key={i} data-fade className="flex items-center gap-4 rounded-2xl border border-xmas-gold/15 bg-xmas-panel p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-xmas-gold text-xmas-bg"><Star className="h-4 w-4" /></span>
                    <p className="text-xmas-cream/85">{item}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-10 text-center">
                <TicketButton className="rounded-full bg-xmas-gold px-8 py-4 font-semibold text-xmas-bg shadow-[0_0_18px_rgba(248,231,176,0.5)] hover:bg-white">Reserveer je Golden Ticket</TicketButton>
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
          </div>
        </div>

        {/* Elfen — staan op de onderrand van de sectie, zoals de figuren bij De Grote Sinterklaasshow.
            Desktop (xl+): links en rechts naast de inhoud. Kleiner scherm: naast elkaar onder de inhoud. */}
        <img src="/elf-cadeau.webp" alt="Kerstelf met cadeau" loading="lazy" className="pointer-events-none absolute bottom-0 left-0 hidden w-[min(360px,calc((100vw-1000px)/2-16px))] xl:block drop-shadow-[0_-6px_36px_rgba(0,0,0,0.35)] [transform:translateZ(0)]" />
        <img src="/elf-snoep.webp" alt="Kerstelf met snoepgoed" loading="lazy" className="pointer-events-none absolute bottom-0 right-0 hidden w-[min(360px,calc((100vw-1000px)/2-16px))] xl:block drop-shadow-[0_-6px_36px_rgba(0,0,0,0.35)] [transform:translateZ(0)]" />
        <div className="mx-auto mt-12 flex max-w-[620px] items-end justify-center gap-2 sm:gap-6 xl:hidden">
          <img src="/elf-cadeau.webp" alt="Kerstelf met cadeau" loading="lazy" className="block w-1/2 max-w-[280px] drop-shadow-[0_-6px_36px_rgba(0,0,0,0.35)] [transform:translateZ(0)]" />
          <img src="/elf-snoep.webp" alt="Kerstelf met snoepgoed" loading="lazy" className="block w-1/2 max-w-[280px] drop-shadow-[0_-6px_36px_rgba(0,0,0,0.35)] [transform:translateZ(0)]" />
        </div>
      </section>

      {/* FOTO'S — uit de Clara/koodh galerij van het Huis van de Kerstman.
          Verschijnt automatisch zodra er foto's in de galerij staan. */}
      {galleryPhotos.length > 0 && (
        <section id="fotos" className="relative z-10 bg-xmas-green px-6 py-24 md:px-10 md:py-28">
          <ArchDivider color="fill-xmas-green" />
          <Snow />
          <div className="relative mx-auto max-w-[1300px]">
            <div className="mb-12 text-center">
              <Eyebrow className="text-xmas-gold [&]:justify-center">Foto's</Eyebrow>
              <TitleReveal lines={["Sfeerbeelden"]} starClass="text-xmas-gold" className={CENTER_TITLE} />
            </div>
            <PhotoGallery images={galleryPhotos} accent="text-white" ringClass="ring-xmas-gold/20" />
          </div>
        </section>
      )}

    </div>
  )
}

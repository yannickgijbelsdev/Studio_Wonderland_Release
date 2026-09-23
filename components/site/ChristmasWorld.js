'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Ticket, CalendarDays, Gift, Clock } from 'lucide-react'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow, Star, TitleReveal, ArchDivider, Sparkles, PhotoGallery } from './ui'
import HeroVideos, { HeroScrollCue } from './HeroVideos'
import ShowNews from './ShowNews'

const XMAS_SITE = 'het-huis-van-de-kerstman'

const TICKETS_URL = 'https://events.flextickets.nl/event/huis-van-de-kerstman'

const CENTER_TITLE = 'mt-4 text-4xl text-xmas-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center'

const BELEVING = [
  { label: 'Verwondering', desc: 'Stap zelf het verhaal binnen, van kamer tot kamer vol magie.' },
  { label: 'Samenzijn', desc: 'Een kerstervaring om samen als gezin te beleven.' },
  { label: 'Vriendschap', desc: 'Help de elfen, ontmoet de personages en werk samen.' },
  { label: 'Magie', desc: 'Los opdrachten op en maak de wonderlijke reis naar de Kerstman.' },
]

const GOLDEN_STEPS = [
  'Je wordt persoonlijk ontvangen door een kerstelf en ontdekt het Snoephuis van Mr. Bonbonetti.',
  'Samen breng je de drie magische snoepjes bij elkaar en stap je in de Magische Kast.',
  'Je maakt de wonderlijke vlucht naar het Huis van de Kerstman — want de Kerstman weet dat jullie komen.',
  'In een kleine groep ontmoet je de Kerstman persoonlijk. Breng zeker je brief of tekening mee, want je mag die zelf aan hem geven.',
  'Neem plaats bij de Kerstman, luister naar een bijzonder kerstverhaal en vertel gerust wat jij zo mooi vindt aan Kerstmis.',
  'Daarna is er uitgebreid tijd voor een persoonlijke foto met de Kerstman.',
  'Leer de kerstelfendans, zing samen het kerstlied én toon dat je voldoende kerstmagie bezit — en ontvang een officieel Elfencertificaat.',
]

const FREE_DATES = ['ZA 12 dec', 'ZO 13 dec', 'WO 16 dec', 'ZA 19 dec', 'ZO 20 dec', 'MA 21 dec', 'DI 22 dec', 'WO 23 dec', 'DO 24 dec']

const GOLDEN_DATES = [
  { day: 'Zondag 13 december', slots: ['10u–11u', '11u–12u', '12u–13u'] },
  { day: 'Zaterdag 19 december', slots: ['10u–11u', '11u–12u', '12u–13u'] },
  { day: 'Zondag 20 december', slots: ['10u–11u', '11u–12u', '12u–13u'] },
  { day: 'Maandag 21 december', slots: ['10u–11u', '11u–12u', '12u–13u'] },
  { day: 'Dinsdag 22 december', slots: ['10u–11u', '11u–12u', '12u–13u'] },
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
        <HeroVideos webm="/hero-2.webm" mp4={IMG.heroVideoAlt} />
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
        dateCls="text-xmas-cream/50"
        headingCls="text-xmas-cream group-hover:text-xmas-gold"
        excerptCls="text-xmas-cream/70"
        linkCls="text-xmas-gold"
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
          <div data-fade className="mt-8 space-y-5 text-left text-lg leading-relaxed text-xmas-cream/85">
            <p>Ergens in Genk bevindt zich een bijzondere snoepwinkel. Achter de toonbank vind je potten vol kleurrijke snoepjes, vreemde recepten en wonderlijke uitvindingen. Hier woont en werkt <strong className="text-xmas-cream">Mr. Bonbonetti</strong>, een excentrieke snoepmaker en uitvinder die ervan overtuigd is dat een beetje magie en teamwork bijna ieder probleem kunnen oplossen.</p>
            <p>Maar achter in zijn winkel staat iets wat bijna niemand kent… <strong className="text-xmas-gold">De Magische Kast.</strong> En die kast kan vliegen.</p>
            <h3 className="pt-3 font-display text-2xl text-xmas-gold md:text-3xl">Een magisch kerstavontuur</h3>
            <p>Dit jaar nodigt Studio Wonderland gezinnen uit om zélf op reis te gaan naar het Huis van de Kerstman. Je avontuur begint in de magische snoepwinkel van Mr. Bonbonetti. Daar ontdek je dat er een probleem is: de Magische Kast, waarmee de elfen naar de Kerstman reizen, wil niet meer vliegen. Zoek, puzzel en werk samen om de kast weer te doen werken.</p>
          </div>
        </div>
      </section>

      {/* EEN KERSTBELEVING VOOR HET HELE GEZIN — 4 sterretjes */}
      <section className="relative z-10 bg-xmas-bg px-6 py-24 md:px-10 md:py-28">
        <ArchDivider color="fill-xmas-bg" flip />
        <Sparkles count={22} />
        <div className="relative mx-auto max-w-[1100px]">
          <div className="text-center">
            <Eyebrow className="text-xmas-gold [&]:justify-center">Voor het hele gezin</Eyebrow>
            <TitleReveal lines={["Een kerstbeleving", "voor het hele gezin"]} starClass="text-xmas-gold" className={CENTER_TITLE} />
          </div>
          <p data-fade className="mx-auto mb-14 mt-6 max-w-[720px] text-center text-xmas-cream/75">Huis van de Kerstman 2026 is geen klassieke voorstelling waarbij kinderen alleen maar kijken. Ze stappen zelf het verhaal binnen: ze ontmoeten personages, helpen de elfen, lossen opdrachten op en maken samen de magische reis naar de Kerstman. Een kerstervaring rond verwondering, samenzijn, vriendschap en magie.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BELEVING.map((b, i) => (
              <div key={i} data-fade className="rounded-3xl border border-xmas-gold/15 bg-xmas-panel p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-xmas-gold/40">
                <Star className="mx-auto h-6 w-6 text-xmas-gold" />
                <h4 className="mt-4 font-display text-xl text-xmas-cream">{b.label}</h4>
                <p className="mt-2 text-sm leading-relaxed text-xmas-cream/70">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GOLDEN TICKET */}
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
            <p data-fade className="mx-auto mt-6 max-w-[720px] text-xmas-cream/85">Sommige uitnodigingen van de Kerstman zijn nét dat tikkeltje magischer… Met het Golden Ticket beleef je de magische reis naar het Huis van de Kerstman op een heel bijzondere manier. En dan gebeurt er iets bijzonders: want de Kerstman weet dat jullie komen, en hij heeft speciaal voor jullie tijd vrijgemaakt.</p>
          </div>
          <ol className="mt-12 space-y-4">
            {GOLDEN_STEPS.map((s, i) => (
              <li key={i} data-fade className="flex gap-4 rounded-2xl border border-xmas-gold/15 bg-black/20 p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-xmas-gold font-semibold text-xmas-bg">{i + 1}</span>
                <p className="text-xmas-cream/85">{s}</p>
              </li>
            ))}
          </ol>
          <div data-fade className="mt-10 grid gap-4 rounded-3xl border border-xmas-gold/30 bg-xmas-gold/10 p-8 text-center sm:grid-cols-3">
            <div><span className="text-xs uppercase tracking-[0.2em] text-xmas-gold">Beleving</span><p className="mt-1 font-display text-xl text-xmas-cream">Golden Ticket</p></div>
            <div><span className="text-xs uppercase tracking-[0.2em] text-xmas-gold">Tijdslot</span><p className="mt-1 font-display text-xl text-xmas-cream">45 minuten</p></div>
            <div><span className="text-xs uppercase tracking-[0.2em] text-xmas-gold">Leeftijd</span><p className="mt-1 font-display text-xl text-xmas-cream">Alle leeftijden</p></div>
          </div>
          <p data-fade className="mt-6 text-center text-sm italic text-xmas-cream/60">Jouw persoonlijke uitnodiging voor het Huis van de Kerstman.</p>
        </div>
      </section>

      {/* BEN JIJ KLAAR — DATA & TICKETS */}
      <section id="tickets" className="relative z-10 bg-xmas-bg px-6 py-24 md:px-10 md:py-28">
        <ArchDivider color="fill-xmas-bg" flip />
        <div className="mx-auto max-w-[1000px]">
          <div className="text-center">
            <Eyebrow className="text-xmas-gold [&]:justify-center">Ben jij klaar voor de reis?</Eyebrow>
            <TitleReveal lines={["Data & tickets"]} starClass="text-xmas-gold" className={CENTER_TITLE} />
          </div>
          <p data-fade className="mx-auto mb-12 mt-6 max-w-[760px] text-center text-xmas-cream/75">De Magische Kast staat bijna klaar. Nu ontbreken alleen jullie nog. Het Huis van de Kerstman is <strong className="text-xmas-cream">gratis toegankelijk</strong> tijdens de gewone openingsuren. Wil je méér dan alleen een bezoek? Kies dan voor de Golden Ticket-beleving met een gereserveerd tijdstip, zonder aanschuiven. Een beperkt aantal Golden Tickets per voormiddag.</p>

          <div className="grid gap-6 md:grid-cols-2">
            <div data-fade className="rounded-3xl border border-xmas-gold/15 bg-xmas-panel p-7">
              <div className="flex items-center gap-2 text-xmas-gold"><CalendarDays className="h-5 w-5" /><h3 className="font-display text-2xl text-xmas-cream">Gratis toegankelijk</h3></div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-xmas-cream/60"><Clock className="h-3.5 w-3.5" /> Telkens van 14u tot 17u</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {FREE_DATES.map((d, i) => (<span key={i} className="rounded-full bg-black/25 px-3.5 py-1.5 text-sm text-xmas-cream/85">{d}</span>))}
              </div>
            </div>
            <div data-fade className="rounded-3xl border border-xmas-gold/30 bg-xmas-gold/10 p-7">
              <div className="flex items-center gap-2 text-xmas-gold"><Gift className="h-5 w-5" /><h3 className="font-display text-2xl text-xmas-cream">Golden Ticket</h3></div>
              <p className="mt-1 text-sm text-xmas-cream/60">Tijdslot 45 min · beperkt aantal per voormiddag</p>
              <div className="mt-5 space-y-3">
                {GOLDEN_DATES.map((g, i) => (
                  <div key={i} className="flex flex-col gap-2 border-b border-xmas-gold/15 pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xmas-cream/90">{g.day}</span>
                    <span className="flex flex-wrap gap-1.5">{g.slots.map((s, j) => (<span key={j} className="rounded-full bg-black/25 px-2.5 py-1 text-xs text-xmas-cream/80">{s}</span>))}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <TicketButton className="rounded-full bg-xmas-gold px-8 py-4 font-semibold text-xmas-bg shadow-[0_0_18px_rgba(248,231,176,0.5)] hover:bg-white">Bestel je Golden Ticket</TicketButton>
          </div>
        </div>
      </section>

      {/* FOTO'S */}
      <section id="fotos" className="relative z-10 bg-xmas-green px-6 pb-40 pt-24 md:px-10 md:pb-48 md:pt-28">
        <ArchDivider color="fill-xmas-green" />
        <Snow />
        <div className="relative mx-auto max-w-[1300px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-xmas-gold [&]:justify-center">Foto's</Eyebrow>
            <TitleReveal lines={["Sfeerbeelden"]} starClass="text-xmas-gold" className={CENTER_TITLE} />
          </div>
          <PhotoGallery images={galleryPhotos.length ? galleryPhotos : PHOTOS} accent="text-white" ringClass="ring-xmas-gold/20" />
        </div>
        <ArchDivider color="fill-xmas-green" position="bottom" />
      </section>
    </div>
  )
}

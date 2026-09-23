'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Ticket, MapPin, Play, X } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { gsap, useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { useSite } from './ctx'
import { Magnetic, Eyebrow, Star, TitleReveal, ArchDivider, Sparkles, PhotoGallery } from './ui'
import ShowNews from './ShowNews'

const TICKETS_URL = 'https://events.flextickets.nl/event/de-grote-sinterklaasshow'

const PARTNERS = [
  { name: 'Stad Genk', logo: '/partners/genk.png', cls: '' },
  { name: 'Balls & Glory', logo: '/partners/ballsglory.webp', cls: 'brightness-0 invert' },
  { name: 'Hotel Bonka', logo: '/partners/hotelbonka.png', cls: 'brightness-0 invert' },
  { name: 'Rotary Club Genk', logo: '/partners/rotary.webp', cls: 'brightness-0 invert' },
]

const WORLDS4 = [
  { label: 'Muziek', desc: 'Meezingen met Sint en pieten en alle kandidaten.' },
  { label: 'Humor', desc: 'Ook de Sint houdt van grappen. Hou je klaar voor verrassingen.' },
  { label: 'Dans', desc: 'Je kan niet blijven stilzitten met onze topdansers.' },
  { label: 'Magie', desc: 'Spektakel en verwondering tot de laatste noot.' },
]

const CHARACTERS = [
  { role: 'Backstagereporter', name: 'Rob Vanoudenhoven', desc: 'Volgt als reporter alles van dichtbij en neemt het publiek mee achter de schermen van deze bijzondere tv-show.' },
  { role: 'De valsspelers', name: 'Barones Boterkoek & dochters', desc: 'Willen koste wat het kost winnen en spelen daarbij niet bepaald eerlijk. Acts lopen mis en zelfs de applausmeter lijkt gemanipuleerd…' },
  { role: 'Het onderzoeksteam', name: 'De Pieten', desc: 'Gaan op onderzoek uit wanneer kandidaten plots verdwijnen. Tijdens de grote finale komt de waarheid aan het licht.' },
  { role: 'De grote held', name: 'Sinterklaas', desc: 'Grijpt in op het juiste moment, waarna de show eindigt zoals het hoort: met muziek, feest en het hele publiek op de dansvloer.' },
]

const FAQ = [
  { q: 'Hoe lang duurt de voorstelling?', a: 'De voorstelling duurt ongeveer een uur. Het is een afwisseling tussen live theater, filmbeelden, liedjes en animatie. Na de voorstelling kan je nog een drankje drinken in de Foyer en delen de Pieten snoepzakjes uit aan de kinderen.' },
  { q: 'Is de voorstelling bereikbaar voor mensen met een rolstoel?', a: 'Ja, het stadhuis is toegankelijk voor iedereen. Bent u slecht te been of gebruikt u een rolstoel: kom dan langs het hellend vlak aan de hoofdingang. Op het Balieplein vind je een lift voor personen met een beperking die toegang geeft tot de schouwburg. Druk op 1 B. Kom op tijd en verwittig het personeel aan de zaal dan helpen we u ook in de zaal om een plekje te verzekeren.' },
  { q: 'Zijn de plaatsen genummerd?', a: 'Neen, we werken niet met genummerde plaatsen. Een half uur voor iedere voorstelling gaan de deuren van de Foyer open en kan je al een drankje drinken. Tien minuten voor iedere voorstelling gaan de deuren van de zaal open.' },
  { q: 'Delen de Sint en de Pieten na de voorstelling snoep uit?', a: 'De Sint gaat na de voorstelling even rusten. De pieten delen snoep uit aan de kinderen na de voorstelling. Ieder kind met een ticket heeft recht op 1 snoepzakje. Deze snoepzakjes worden u aangeboden door het centrummanagement van Stad Genk.' },
  { q: 'Vanaf welke leeftijd moet een kind betalen?', a: 'Kinderen onder de 2 jaar hoeven geen ticket te betalen en kunnen mee op de schoot. Ze hebben geen recht op een stoel. Indien dit toch wenselijk is, koopt u best toch een ticket. Kinderen ouder dan 2 jaar moeten dus een ticket kopen.' },
  { q: 'Vanaf welke leeftijd is de voorstelling aangeraden?', a: 'De voorstelling is een mix tussen film, live theater, animatie en muziek. Op die manier is het ook voor kleine kinderen een feest. We adviseren de leeftijd vanaf 3 jaar.' },
  { q: 'Hoe komt het dat jullie de kost zo laag kunnen houden?', a: 'We weten dat andere Sinterklaasvoorstellingen vaak het dubbele of meer kosten. VZW Studio Wonderland werkt hoofdzakelijk met vrijwilligers en met partners zoals Stad Genk. De voorstelling is ook beperkt tot een uur. Op die manier kunnen we de ticketprijs laag houden.' },
  { q: 'Vanaf wanneer moet ik een ticket kopen als volwassene?', a: 'Vanaf 18 jaar betaal je een ticket voor een volwassene. Kinderen tot 12 jaar hebben recht op een snoepzakje na de voorstelling.' },
  { q: 'Wat moet ik doen als ik het ticket niet heb ontvangen of kwijt ben?', a: 'Je kan dan best de tickets nog eens opnieuw laten versturen. Dit doe je door op de knop te drukken die je begeleidt naar de support pagina van onze partner Flextickets.', link: 'https://events.flextickets.nl/Ticketing/lostticket', linkLabel: 'Ticket opnieuw versturen' },
  { q: 'Waarom betaal ik boekingskosten op mijn ticket?', a: 'We werken met een externe ticketverdeler flextickets. In de boekingskost zitten zowel de prijs van de handeling van de tickets als de kosten die de bank aanrekent voor het afrekenen van de tickets. Terwijl je bij de meeste ticketverdelers een bedrag betaalt per ticket werken we hier met één prijs per boeking. Je betaalt dus 2 euro boekingskost voor het bestellen van 1 ticket, maar evenveel als je bijvoorbeeld 10 tickets boekt. Het is dus aan te raden om in grote groep tickets te bestellen.' },
  { q: 'Zijn er parkeermogelijkheden voorzien?', a: 'Parkeren kan op verschillende plaatsen rondom het Stadhuis van Genk. Voor meer informatie raadpleeg je de website van Stad Genk.' },
]

const PHOTOS = [IMG.showNeon, IMG.showSpot, IMG.showGuitar, IMG.showCrowd, IMG.showAudience, IMG.showCurtain, IMG.showSeats, IMG.showTile]

function TicketButton({ className = '', children }) {
  return (
    <a href={TICKETS_URL} target="_blank" rel="noopener noreferrer" data-cursor="hover" className={`inline-flex items-center justify-center gap-2 transition-all duration-300 ${className}`}>
      <Ticket className="h-5 w-5" /> {children}
    </a>
  )
}

// A single marquee (left → right) with the scroll cue sitting IN BETWEEN, forming
// the break in the strip: logos slide up to the cue, the cue interrupts, and the
// scroll continues on the other side.
// All logos are white except GENK, which keeps its original black/white artwork.
function PartnerStrip() {
  return (
    <div className="relative min-w-0 flex-1 overflow-hidden">
      <div className="flex w-max items-center gap-14 [animation:marquee_30s_linear_infinite_reverse] md:gap-24">
        {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
          <img key={i} src={p.logo} alt={p.name} title={p.name} className={`h-12 w-auto shrink-0 opacity-95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] md:h-16 ${p.cls}`} />
        ))}
      </div>
    </div>
  )
}

function HeroPartners({ onTrailer }) {
  return (
    <div className="absolute inset-x-0 bottom-[120px] z-10 md:bottom-[150px]">
      <div className="mx-auto flex max-w-[1600px] items-center gap-6 px-5 md:gap-10 md:px-10">
        <PartnerStrip />
        <div className="hero-cue flex shrink-0 flex-col items-center gap-4 text-white">
          <button
            onClick={onTrailer}
            data-cursor="hover"
            className="pointer-events-auto inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-show-gold px-6 py-3 text-sm font-semibold text-show-bg shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
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
        <PartnerStrip />
      </div>
    </div>
  )
}

export default function ShowWorld() {
  const scope = useRef(null)
  const heroVid = useRef(null)
  const { navigate } = useSite()
  const [galleryPhotos, setGalleryPhotos] = useState([])
  const [stars, setStars] = useState([])
  const [trailerOpen, setTrailerOpen] = useState(false)
  useSectionAnimations(scope, [galleryPhotos.length, stars.length])

  // Foto's uit de Clara/koodh galerij (categorie "galerij"); valt terug op de
  // vaste foto's wanneer de galerij nog leeg is.
  useEffect(() => {
    let mounted = true
    fetch('/api/news?category=galerij')
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

  // Sterren van de show (categorie "sterren-van-de-show"): titel, body en foto.
  // De body zit enkel in het detail-endpoint, dus die halen we per item op.
  useEffect(() => {
    let mounted = true
    fetch('/api/news?category=sterren-van-de-show')
      .then((r) => (r.ok ? r.json() : null))
      .then(async (data) => {
        const items = (data && data.items) || []
        if (!items.length) return
        const detailed = await Promise.all(
          items.map((it) =>
            fetch(`/api/news/${it.id}`).then((r) => (r.ok ? r.json() : null)).catch(() => null)
          )
        )
        const list = detailed
          .filter(Boolean)
          .map((a) => ({ title: a.title, body: a.body || '', image: a.image_url, caption: a.image_caption_html }))
        if (mounted && list.length) setStars(list)
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const v = heroVid.current
    if (v) {
      v.muted = true
      try { v.load() } catch {}
      const p = v.play?.()
      if (p && p.catch) p.catch(() => {})
    }
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
        <video ref={heroVid} className="hero-img absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto">
          <source src="/sinterklaas-trailer.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

        {/* Bottom: one continuous partner marquee floating over the video, cue below it */}
        <HeroPartners onTrailer={() => setTrailerOpen(true)} />
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
          <div className="relative w-full max-w-[1100px]" onClick={(e) => e.stopPropagation()}>
            <video
              src="/sinterklaas-trailer.mp4"
              controls
              autoPlay
              playsInline
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* NIEUWS — bovenaan, met boog omhoog in de hero (zoals de hoofdsite) */}
      <ShowNews />

      {/* HET VERHAAL — tekst met Sinterklaas ernaast (gestapeld op mobiel) */}
      <section id="verhaal" className="relative z-10 bg-show-reddeep px-6 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-reddeep" />
        <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-8 lg:flex-row-reverse lg:items-end lg:gap-12">
          <div className="w-full max-w-[720px] pb-12 text-center lg:max-w-none lg:flex-1 lg:pb-28 lg:text-left">
            <Eyebrow className="text-show-gold [&]:justify-center lg:[&]:justify-start">Het verhaal</Eyebrow>
            <TitleReveal lines={["Eén grote talentenshow"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center lg:[&>span]:mx-0 lg:[&>span>span]:justify-start" />
            <div data-fade className="mx-auto mt-8 max-w-[720px] space-y-5 text-left text-lg leading-relaxed text-show-cream/85 md:text-center lg:mx-0 lg:text-left">
              <p>In <em>De Grote Sinterklaasshow</em> nemen verschillende kandidaten het tegen elkaar op met hun meest originele Sinterklaasact. Muziek, humor, dans en magie wisselen elkaar af, terwijl het publiek via de applausmeter mee bepaalt wie doorgaat.</p>
              <p>Rob Vanoudenhoven volgt als backstagereporter alles van dichtbij en neemt het publiek mee achter de schermen van deze bijzondere tv-show.</p>
              <p>Maar daar loopt niet alles volgens plan. Barones Boterkoek en haar dochters willen koste wat het kost winnen en spelen daarbij niet bepaald eerlijk. Acts lopen mis, kandidaten verdwijnen en zelfs de applausmeter lijkt gemanipuleerd.</p>
              <p>De Pieten gaan op onderzoek uit en tijdens de grote finale komt de waarheid aan het licht. Sinterklaas grijpt in, waarna de show eindigt zoals het hoort: met muziek, feest en het hele publiek op de dansvloer.</p>
            </div>
            <div className="mt-9 flex flex-col items-center gap-4 lg:items-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-sm text-show-cream/80"><MapPin className="h-4 w-4 text-show-gold" /> Schouwburg — Stadhuis Genk</span>
              <TicketButton className="rounded-full bg-show-gold px-8 py-4 font-semibold text-show-bg hover:scale-[1.03] hover:bg-white">Bestel je tickets</TicketButton>
            </div>
          </div>

          <div className="w-full max-w-[440px] sm:max-w-[520px] lg:w-[600px] lg:max-w-none lg:flex-shrink-0 lg:self-end">
            <img src="/sinterklaas.png" alt="Sinterklaas — De Grote Sinterklaasshow" className="mx-auto block h-auto w-full object-contain drop-shadow-[0_-6px_36px_rgba(0,0,0,0.35)]" />
          </div>
        </div>
      </section>

      {/* VIER WERELDEN — compact, 4 sterretjes */}
      <section className="relative z-10 bg-show-bg px-6 py-24 md:px-10 md:py-28">
        <ArchDivider color="fill-show-bg" flip />
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
        </div>
      </section>

      {/* WIE IS WIE — netter, zonder iconen */}
      <section className="relative z-10 bg-show-reddeep px-6 py-24 md:px-10 md:py-28">
        <ArchDivider color="fill-show-reddeep" />
        <div className="mx-auto max-w-[1050px]">
          <div className="mb-14 text-center">
            <Eyebrow className="text-show-gold [&]:justify-center">Wie is wie</Eyebrow>
            <TitleReveal lines={["De finalisten van de show"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          {stars.length > 0 ? (
            <div className="mx-auto max-w-3xl space-y-10">
              {stars.map((s, idx) => (
                <div key={idx} data-fade className="overflow-hidden rounded-3xl border border-show-gold/15 bg-black/25 transition-all duration-300 hover:border-show-gold/40">
                  {s.image && (
                    <figure className="m-0 flex justify-center bg-black/20">
                      <img src={s.image} alt={s.title} className="max-h-[560px] w-auto max-w-full object-contain" />
                    </figure>
                  )}
                  <div className="p-7 md:p-9">
                    <h4 className="font-display text-2xl leading-tight text-show-cream md:text-3xl">{s.title}</h4>
                    <div
                      className="clara-body mt-4 space-y-3 text-sm leading-relaxed text-show-cream/75 [&_a]:text-show-gold [&_a]:underline [&_.clara-image-credit]:hidden [&_figure]:my-4 [&_figcaption]:mt-1.5 [&_figcaption]:text-xs [&_figcaption]:text-show-cream/45 [&_img]:rounded-xl"
                      dangerouslySetInnerHTML={{ __html: s.body }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>

      {/* FAQ — verticaal gecentreerd */}
      <section id="faq" className="relative z-10 bg-show-bg px-6 pt-24 md:px-10 md:pt-28">
        <ArchDivider color="fill-show-bg" flip />
        <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center gap-8 lg:flex-row lg:items-end lg:gap-12">
          <div className="w-full max-w-[820px] pb-12 lg:flex-1 lg:pb-28">
            <div className="mb-12 text-center lg:text-left">
              <Eyebrow className="text-show-gold [&]:justify-center lg:[&]:justify-start">Praktisch</Eyebrow>
              <TitleReveal lines={["Veelgestelde vragen"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center lg:[&>span]:mx-0 lg:[&>span>span]:justify-start" />
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="overflow-hidden rounded-2xl border border-show-gold/15 bg-black/20 px-5 transition-colors data-[state=open]:border-show-gold/45 data-[state=open]:bg-black/30">
                  <AccordionTrigger className="py-5 text-left text-base font-medium text-show-cream hover:text-show-gold hover:no-underline md:text-lg">{f.q}</AccordionTrigger>
                  <AccordionContent className="pb-5 text-show-cream/75">
                    <p className="m-0">{f.a}</p>
                    {f.link && (
                      <a href={f.link} target="_blank" rel="noopener noreferrer" data-cursor="hover" className="mt-4 inline-flex items-center gap-2 rounded-full bg-show-gold px-5 py-2.5 text-sm font-semibold text-show-bg transition-all duration-300 hover:scale-[1.03] hover:bg-white">
                        <Ticket className="h-4 w-4" /> {f.linkLabel || 'Naar Flextickets'}
                      </a>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="w-full max-w-[440px] sm:max-w-[520px] lg:w-[600px] lg:max-w-none lg:flex-shrink-0 lg:self-end">
            <img src="/presentator.png" alt="Presentator — De Grote Sinterklaasshow" className="mx-auto block h-auto w-full object-contain drop-shadow-[0_-6px_36px_rgba(0,0,0,0.35)]" />
          </div>
        </div>
      </section>

      {/* FOTO'S */}
      <section id="fotos" className="relative z-10 bg-show-reddeep px-6 pb-40 pt-24 md:px-10 md:pb-48 md:pt-28">
        <ArchDivider color="fill-show-reddeep" />
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-12 text-center">
            <Eyebrow className="text-show-gold [&]:justify-center">Foto's</Eyebrow>
            <TitleReveal lines={["Beleef de magie"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          </div>
          <PhotoGallery images={galleryPhotos.length ? galleryPhotos : PHOTOS} accent="text-white" ringClass="ring-show-gold/20" />
        </div>
        <ArchDivider color="fill-show-reddeep" position="bottom" />
      </section>
    </div>
  )
}

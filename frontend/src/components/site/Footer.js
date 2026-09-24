'use client'
import { Heart, Mail, Facebook, Instagram } from 'lucide-react'
import { useSite } from './ctx'

const NEWSLETTER_URL = 'https://campaigns.koodh.com/subscribe/clr_WcRPtVz4nCzPYvTD5dSQE6iqA351oJPC'

const SOCIALS = [
  { href: 'https://www.facebook.com/wonderlandgenk', Icon: Facebook, label: 'Facebook' },
  { href: 'https://www.instagram.com/studio.wonderland.show/', Icon: Instagram, label: 'Instagram' },
]

function Socials({ className = '', ring = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIALS.map(({ href, Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          aria-label={label}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 ${ring}`}
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  )
}

export default function Footer() {
  const { route, articleOrigin = 'show', navigate } = useSite()
  const world = route === 'article' ? articleOrigin : route

  // ---- De Grote Sinterklaasshow ----
  if (world === 'show') {
    return (
      <footer className="relative z-20 border-t border-show-gold/60 bg-show-reddeep px-6 py-24 text-show-cream md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <img src="/sinterklaas-show-logo.png" alt="De Grote Sinterklaasshow" className="h-28 w-auto md:h-36" />
            <p className="mt-6 max-w-md text-show-cream/70">De Grote Sinterklaasshow — een spectaculaire liveshow vol muziek, humor, dans en magie. Schouwburg, Stadhuis Genk.</p>
            <a href="mailto:info@sinterklaasgenk.be" data-cursor="hover" className="mt-6 inline-block font-medium text-show-gold underline-offset-4 hover:underline">info@sinterklaasgenk.be</a>
            <Socials className="mt-6" ring="border-show-gold/40 text-show-gold hover:border-show-gold hover:bg-show-gold hover:text-show-bg" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-show-cream/50">De show</h4>
            <ul className="mt-4 space-y-3">
              <li><button onClick={() => navigate('show', 'verhaal')} data-cursor="hover" className="hover:text-show-gold">Het verhaal</button></li>
              <li><button onClick={() => navigate('show', 'faq')} data-cursor="hover" className="hover:text-show-gold">Veelgestelde vragen</button></li>
              <li><button onClick={() => navigate('show', 'fotos')} data-cursor="hover" className="hover:text-show-gold">Foto's</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-show-cream/50">Tickets</h4>
            <ul className="mt-4 space-y-3">
              <li><a href="https://events.flextickets.nl/event/de-grote-sinterklaasshow" target="_blank" rel="noopener noreferrer" data-cursor="hover" className="hover:text-show-gold">Bestel je tickets</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-[1400px] flex-col items-center gap-5 rounded-2xl border border-show-gold/25 bg-black/25 p-8 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h4 className="font-display text-2xl text-show-cream md:text-3xl">Blijf op de hoogte</h4>
            <p className="mt-1 text-show-cream/70">Schrijf je in op onze nieuwsbrief en mis niets van De Grote Sinterklaasshow.</p>
          </div>
          <a href={NEWSLETTER_URL} target="_blank" rel="noopener noreferrer" data-cursor="hover" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-show-gold px-7 py-3.5 font-semibold text-show-bg transition-all duration-300 hover:scale-[1.03] hover:bg-white">
            <Mail className="h-5 w-5" /> Abonneer op de nieuwsbrief
          </a>
        </div>
        <div className="mx-auto mt-14 flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t border-show-gold/20 pt-8 text-xs text-show-cream/50 md:flex-row">
          <span>&copy; {new Date().getFullYear()} De Grote Sinterklaasshow &middot; Studio Wonderland &middot; Ondernemingsnummer: BE1008.607.780</span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <button onClick={() => navigate('privacy')} data-cursor="hover" className="hover:text-show-gold">Privacybeleid</button>
            <button onClick={() => navigate('cookies')} data-cursor="hover" className="hover:text-show-gold">Cookiebeleid</button>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              Website gemaakt met <Heart className="h-3.5 w-3.5 fill-current text-show-red" /> door
              <a href="https://koodh.com" target="_blank" rel="noopener noreferrer" data-cursor="hover" className="inline-flex items-center">
                <img src="/koodh-logo.png" alt="Koodh" className="h-3.5 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
              </a>
            </span>
          </div>
        </div>
      </footer>
    )
  }

  // ---- Het Huis van de Kerstman ----
  if (world === 'xmas') {
    return (
      <footer className="relative z-20 border-t border-xmas-gold/60 bg-xmas-green px-6 py-24 text-xmas-cream md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <button onClick={() => navigate('xmas')} data-cursor="hover" className="font-display text-3xl text-xmas-gold md:text-4xl">Huis van de Kerstman</button>
            <p className="mt-6 max-w-md text-xmas-cream/70">Stap zelf het verhaal binnen en maak de magische reis naar Het Huis van de Kerstman — een warme kerstbeleving voor het hele gezin in Genk.</p>
            <a href="mailto:info@hethuisvandekerstman.be" data-cursor="hover" className="mt-6 inline-block font-medium text-xmas-gold underline-offset-4 hover:underline">info@hethuisvandekerstman.be</a>
            <Socials className="mt-6" ring="border-xmas-gold/40 text-xmas-gold hover:border-xmas-gold hover:bg-xmas-gold hover:text-xmas-green" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-xmas-cream/50">De beleving</h4>
            <ul className="mt-4 space-y-3">
              <li><button onClick={() => navigate('xmas', 'verhaal')} data-cursor="hover" className="hover:text-xmas-gold">Het verhaal</button></li>
              <li><button onClick={() => navigate('xmas', 'golden')} data-cursor="hover" className="hover:text-xmas-gold">Golden Ticket</button></li>
              <li><button onClick={() => navigate('xmas', 'tickets')} data-cursor="hover" className="hover:text-xmas-gold">Data</button></li>
              <li><button onClick={() => navigate('xmas', 'fotos')} data-cursor="hover" className="hover:text-xmas-gold">Foto's</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-xmas-cream/50">Tickets</h4>
            <ul className="mt-4 space-y-3">
              <li><button onClick={() => navigate('xmas', 'golden')} data-cursor="hover" className="hover:text-xmas-gold">Golden Ticket</button></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t border-xmas-gold/20 pt-8 text-xs text-xmas-cream/50 md:flex-row">
          <span>&copy; {new Date().getFullYear()} Het Huis van de Kerstman &middot; Studio Wonderland &middot; Ondernemingsnummer: BE1008.607.780</span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <button onClick={() => navigate('privacy')} data-cursor="hover" className="hover:text-xmas-gold">Privacybeleid</button>
            <button onClick={() => navigate('cookies')} data-cursor="hover" className="hover:text-xmas-gold">Cookiebeleid</button>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              Website gemaakt met <Heart className="h-3.5 w-3.5 fill-current text-xmas-red" /> door
              <a href="https://koodh.com" target="_blank" rel="noopener noreferrer" data-cursor="hover" className="inline-flex items-center">
                <img src="/koodh-logo.png" alt="Koodh" className="h-3.5 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
              </a>
            </span>
          </div>
        </div>
      </footer>
    )
  }

  // ---- Studio Wonderland ----
  return (
    <footer className="relative border-t border-wonder-gold/30 bg-wonder-bg px-6 py-16 text-wonder-ink md:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src="/studio-wonderland-badge.png" alt="Studio Wonderland" className="h-28 w-auto md:h-32" />
          <p className="mt-4 max-w-md text-wonder-muted">Wij maken werelden waar families samen in kunnen stappen. Bijzondere livebelevingen voor jong en oud.</p>
          <a href="mailto:info@studiowonderland.eu" data-cursor="hover" className="mt-6 inline-block font-medium text-wonder-gold underline-offset-4 hover:underline">info@studiowonderland.eu</a>
          <Socials className="mt-6" ring="border-wonder-gold/40 text-wonder-gold hover:border-wonder-gold hover:bg-wonder-gold hover:text-white" />
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-wonder-muted">Studio Wonderland</h4>
          <ul className="mt-4 space-y-3">
            <li><button onClick={() => navigate('about')} data-cursor="hover" className="hover:text-wonder-gold">Over ons</button></li>
            <li><button onClick={() => navigate('contact')} data-cursor="hover" className="hover:text-wonder-gold">Contact</button></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t border-wonder-gold/20 pt-8 text-xs text-wonder-muted md:flex-row">
        <span>&copy; {new Date().getFullYear()} Studio Wonderland &middot; Ondernemingsnummer: BE1008.607.780 &middot; Alle rechten voorbehouden.</span>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <button onClick={() => navigate('privacy')} data-cursor="hover" className="hover:text-wonder-gold">Privacybeleid</button>
          <button onClick={() => navigate('cookies')} data-cursor="hover" className="hover:text-wonder-gold">Cookiebeleid</button>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            Website gemaakt met <Heart className="h-3.5 w-3.5 fill-current text-wonder-pinkdeep" /> door
            <a href="https://koodh.com" target="_blank" rel="noopener noreferrer" data-cursor="hover" className="inline-flex items-center">
              <img src="/koodh-logo.png" alt="Koodh" className="h-4 w-auto" />
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

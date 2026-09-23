'use client'
import { useSite } from './ctx'

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
        <div className="mx-auto mt-14 flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t border-show-gold/20 pt-8 text-xs text-show-cream/50 md:flex-row">
          <span>&copy; {new Date().getFullYear()} De Grote Sinterklaasshow &middot; Studio Wonderland &middot; Ondernemingsnummer: BE1008.607.780</span>
          <div className="flex items-center gap-5">
            <button onClick={() => navigate('privacy')} data-cursor="hover" className="hover:text-show-gold">Privacybeleid</button>
            <button onClick={() => navigate('cookies')} data-cursor="hover" className="hover:text-show-gold">Cookiebeleid</button>
            <a href="https://koodh.com" target="_blank" rel="noopener noreferrer" data-cursor="hover" className="inline-block">
              <img src="/koodh-logo.png" alt="Koodh" className="h-4 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            </a>
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
          <div className="flex items-center gap-5">
            <button onClick={() => navigate('privacy')} data-cursor="hover" className="hover:text-xmas-gold">Privacybeleid</button>
            <button onClick={() => navigate('cookies')} data-cursor="hover" className="hover:text-xmas-gold">Cookiebeleid</button>
            <a href="https://koodh.com" target="_blank" rel="noopener noreferrer" data-cursor="hover" className="inline-block">
              <img src="/koodh-logo.png" alt="Koodh" className="h-4 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
            </a>
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
        <div className="flex items-center gap-5">
          <button onClick={() => navigate('privacy')} data-cursor="hover" className="hover:text-wonder-gold">Privacybeleid</button>
          <button onClick={() => navigate('cookies')} data-cursor="hover" className="hover:text-wonder-gold">Cookiebeleid</button>
          <a href="https://koodh.com" target="_blank" rel="noopener noreferrer" data-cursor="hover" className="inline-block">
            <img src="/koodh-logo.png" alt="Koodh" className="h-5 w-auto" />
          </a>
        </div>
      </div>
    </footer>
  )
}

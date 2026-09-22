'use client'
import { useSite } from './ctx'

export default function Footer() {
  const { route, navigate } = useSite()
  const isShow = route === 'show' || route === 'article'

  if (isShow) {
    return (
      <footer className="relative border-t-2 border-show-gold/40 bg-show-reddeep px-6 py-24 text-show-cream md:px-10 md:py-28">
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
              <li><button onClick={() => navigate('home')} data-cursor="hover" className="text-show-cream/60 hover:text-show-gold">Studio Wonderland</button></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t border-show-gold/20 pt-8 text-xs text-show-cream/50 md:flex-row">
          <span>&copy; {new Date().getFullYear()} De Grote Sinterklaasshow &middot; Studio Wonderland &middot; Ondernemingsnummer: BE1008.607.780</span>
          <div className="flex items-center gap-5">
            <button onClick={() => navigate('privacy')} data-cursor="hover" className="hover:text-show-gold">Privacybeleid</button>
            <button onClick={() => navigate('cookies')} data-cursor="hover" className="hover:text-show-gold">Cookiebeleid</button>
            <a href="https://koodh.com" target="_blank" rel="noopener noreferrer" data-cursor="hover" className="inline-block rounded bg-show-cream px-2.5 py-1.5">
              <img src="/koodh-logo.png" alt="Koodh" className="h-4 w-auto" />
            </a>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="relative border-t border-wonder-gold/20 bg-wonder-bg px-6 py-16 text-wonder-ink md:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src="/studio-wonderland-logo.png" alt="Studio Wonderland" className="h-16 w-auto md:h-20" />
          <p className="mt-4 max-w-md text-wonder-muted">Wij maken werelden waar families samen in kunnen stappen. Bijzondere livebelevingen voor jong en oud.</p>
          <a href="mailto:info@studiowonderland.eu" data-cursor="hover" className="mt-6 inline-block font-medium text-wonder-gold underline-offset-4 hover:underline">info@studiowonderland.eu</a>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-wonder-muted">Belevenissen</h4>
          <ul className="mt-4 space-y-3">
            <li><button onClick={() => navigate('show')} data-cursor="hover" className="hover:text-wonder-gold">De Grote Sinterklaasshow</button></li>
            <li><button onClick={() => navigate('xmas')} data-cursor="hover" className="hover:text-wonder-gold">Huis van de Kerstman 2026</button></li>
            <li><button onClick={() => navigate('productions')} data-cursor="hover" className="hover:text-wonder-gold">Eerder te beleven</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-wonder-muted">Studio</h4>
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

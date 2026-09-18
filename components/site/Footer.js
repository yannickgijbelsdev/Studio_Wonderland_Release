'use client'
import { useSite } from './ctx'

export default function Footer() {
  const { navigate } = useSite()
  return (
    <footer className="relative border-t border-white/10 bg-wonder-bg px-6 py-16 text-wonder-cream md:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-display text-3xl">Studio Wonderland</h3>
          <p className="mt-4 max-w-md text-wonder-muted">Wij maken werelden waar families samen in kunnen stappen. Bijzondere livebelevingen voor jong en oud.</p>
          <a href="mailto:info@studiowonderland.eu" data-cursor="hover" className="mt-6 inline-block text-wonder-gold underline-offset-4 hover:underline">info@studiowonderland.eu</a>
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
            <li><button onClick={() => navigate('admin')} data-cursor="hover" className="text-wonder-muted/70 hover:text-wonder-gold">Beheer</button></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-[1400px] flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-wonder-muted md:flex-row">
        <span>&copy; {new Date().getFullYear()} Studio Wonderland. Alle rechten voorbehouden.</span>
        <span>Wij maken werelden waar families samen in kunnen stappen.</span>
      </div>
    </footer>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { Menu, X, Ticket, ArrowUpRight } from 'lucide-react'
import { useSite } from './ctx'
import { Magnetic } from './ui'

const WORLDS = {
  show: {
    logo: '/sinterklaas-show-logo.png',
    logoAlt: 'De Grote Sinterklaasshow',
    pill: 'bg-show-reddeep/95',
    text: 'text-show-cream/80',
    textHover: 'hover:text-show-gold',
    active: 'text-show-gold',
    divider: 'border-show-gold/20',
    cta: 'bg-show-gold text-show-bg hover:bg-white',
    overlay: 'bg-show-bg',
    ctaLabel: 'Bestel je tickets',
    ticketAnchor: 'verhaal',
    ticketUrl: 'https://events.flextickets.nl/event/de-grote-sinterklaasshow',
  },
  xmas: {
    logo: null,
    logoText: 'Huis van de Kerstman',
    logoAlt: 'Huis van de Kerstman',
    pill: 'bg-xmas-green/95',
    text: 'text-xmas-cream/80',
    textHover: 'hover:text-xmas-gold',
    active: 'text-xmas-gold',
    divider: 'border-xmas-gold/20',
    cta: 'bg-xmas-red text-white hover:bg-white hover:text-xmas-green',
    overlay: 'bg-xmas-bg',
    ctaLabel: 'Tickets & info',
    ticketAnchor: 'tickets',
  },
}

const SECTION_LINKS = {
  show: [
    { label: 'Verhaal', a: 'verhaal' },
    { label: 'FAQ', a: 'faq' },
    { label: "Foto's", a: 'fotos' },
  ],
  xmas: [
    { label: 'Verhaal', a: 'verhaal' },
    { label: 'Golden Ticket', a: 'golden' },
    { label: 'Data', a: 'tickets' },
    { label: "Foto's", a: 'fotos' },
  ],
}

function WorldNav({ route }) {
  const { navigate } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const w = WORLDS[route]
  const links = SECTION_LINKS[route] || SECTION_LINKS.show

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 50)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (a) => { setOpen(false); navigate(route, a) }
  const home = () => { setOpen(false); navigate('home') }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] px-4 pt-4 md:px-6 md:pt-5">
        <div className={`mx-auto flex items-center justify-between rounded-full px-4 py-2 shadow-xl shadow-black/25 backdrop-blur-md transition-all duration-500 md:px-6 md:py-2.5 ${w.pill} ${scrolled ? 'max-w-[1120px]' : 'max-w-[1320px]'}`}>
          <button onClick={home} data-cursor="hover" className="flex items-center">
            {w.logo ? (
              <img src={w.logo} alt={w.logoAlt} className="h-9 w-auto md:h-11" />
            ) : (
              <span className={`font-display text-lg ${w.active} md:text-xl`}>{w.logoText}</span>
            )}
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <button
                key={l.a}
                onClick={() => go(l.a)}
                data-cursor="hover"
                className={`text-sm font-medium tracking-wide transition-colors ${w.text} ${w.textHover}`}
              >
                {l.label}
              </button>
            ))}
            <span className={`h-4 w-px ${w.divider} border-l`} />
            <button onClick={home} data-cursor="hover" className={`inline-flex items-center gap-1 text-sm font-medium ${w.text} ${w.textHover}`}>
              Studio Wonderland <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
            {w.ticketUrl ? (
              <a href={w.ticketUrl} target="_blank" rel="noopener noreferrer" data-cursor="hover" onClick={() => setOpen(false)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${w.cta}`}>
                <Ticket className="h-4 w-4" /> {w.ctaLabel}
              </a>
            ) : (
              <Magnetic as="button" onClick={() => go(w.ticketAnchor)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${w.cta}`}>
                <Ticket className="h-4 w-4" /> {w.ctaLabel}
              </Magnetic>
            )}
          </nav>

          <button onClick={() => setOpen(true)} data-cursor="hover" className={`${w.active} md:hidden`}>
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-[90] flex flex-col ${w.overlay} transition-all duration-500 md:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="flex items-center justify-between px-6 py-6">
          {w.logo ? (
            <img src={w.logo} alt={w.logoAlt} className="h-10 w-auto" />
          ) : (
            <span className={`font-display text-xl ${w.active}`}>{w.logoText}</span>
          )}
          <button onClick={() => setOpen(false)} className={w.active}><X className="h-7 w-7" /></button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
          {links.map((l) => (
            <button key={l.a} onClick={() => go(l.a)} className={`border-b ${w.divider} py-5 text-left font-display text-3xl ${w.active}`}>
              {l.label}
            </button>
          ))}
          {w.ticketUrl ? (
            <a href={w.ticketUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full py-4 text-center font-semibold ${w.cta}`}>
              <Ticket className="h-5 w-5" /> {w.ctaLabel}
            </a>
          ) : (
            <button onClick={() => go(w.ticketAnchor)} className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full py-4 text-center font-semibold ${w.cta}`}>
              <Ticket className="h-5 w-5" /> {w.ctaLabel}
            </button>
          )}
          <button onClick={home} className={`mt-4 inline-flex items-center justify-center gap-1 py-3 text-center font-medium ${w.text}`}>
            Studio Wonderland <ArrowUpRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </>
  )
}

function MainNav() {
  const { route, navigate } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 50)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const links = [
    { label: 'Belevenissen', r: 'home', a: 'belevenissen' },
    { label: 'Eerder te beleven', r: 'productions' },
    { label: 'Over ons', r: 'about' },
    { label: 'Contact', r: 'contact' },
  ]

  const go = (r, a) => { setOpen(false); navigate(r, a) }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] px-4 pt-4 md:px-6 md:pt-5">
        <div className={`mx-auto flex items-center justify-between rounded-full bg-white/95 px-5 py-2.5 shadow-xl shadow-black/10 backdrop-blur-md transition-all duration-500 md:px-7 md:py-3 ${scrolled ? 'max-w-[1120px]' : 'max-w-[1320px]'}`}>
          <button onClick={() => go('home')} data-cursor="hover" className="flex items-center">
            <img src="/studio-wonderland-logo.png" alt="Studio Wonderland" className="h-8 w-auto md:h-9" />
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.r, l.a)}
                data-cursor="hover"
                className={`text-sm font-medium tracking-wide transition-colors ${route === l.r ? 'text-wonder-pinkdeep' : 'text-wonder-ink/75 hover:text-wonder-ink'}`}
              >
                {l.label}
              </button>
            ))}
            <Magnetic as="button" onClick={() => go('contact')} className="rounded-full bg-wonder-pinkdeep px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-wonder-plum">
              Boek een beleving
            </Magnetic>
          </nav>

          <button onClick={() => setOpen(true)} data-cursor="hover" className="text-wonder-ink md:hidden">
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-[90] flex flex-col bg-wonder-bg transition-all duration-500 md:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="flex items-center justify-between px-6 py-6">
          <img src="/studio-wonderland-logo.png" alt="Studio Wonderland" className="h-7 w-auto" />
          <button onClick={() => setOpen(false)} className="text-wonder-ink"><X className="h-7 w-7" /></button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
          {links.map((l) => (
            <button key={l.label} onClick={() => go(l.r, l.a)} className="border-b border-wonder-gold/15 py-5 text-left font-display text-3xl text-wonder-ink">
              {l.label}
            </button>
          ))}
          <button onClick={() => go('contact')} className="mt-8 rounded-full bg-wonder-pinkdeep py-4 text-center font-medium text-white">Boek een beleving</button>
        </nav>
      </div>
    </>
  )
}

export default function Nav() {
  const { route } = useSite()
  const worldRoute = route === 'article' ? 'show' : route
  if (worldRoute === 'show' || worldRoute === 'xmas') return <WorldNav route={worldRoute} />
  return <MainNav />
}

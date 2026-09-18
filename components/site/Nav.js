'use client'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useSite } from './ctx'
import { Magnetic } from './ui'

export default function Nav() {
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
      <header className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${scrolled ? 'glass border-b border-white/10 py-3' : 'py-6'}`}>
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 md:px-10">
          <button onClick={() => go('home')} data-cursor="hover" className="group flex flex-col leading-none">
            <span className="font-display text-lg font-600 tracking-tight text-wonder-cream md:text-xl">Studio Wonderland</span>
            <span className="mt-0.5 text-[9px] uppercase tracking-[0.4em] text-wonder-gold/80">Live belevingen</span>
          </button>

          <nav className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.r, l.a)}
                data-cursor="hover"
                className={`group relative text-sm tracking-wide transition-colors ${route === l.r ? 'text-wonder-gold' : 'text-wonder-cream/80 hover:text-wonder-cream'}`}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-wonder-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <Magnetic as="button" onClick={() => go('contact')} className="rounded-full border border-wonder-gold/60 px-5 py-2 text-sm font-medium text-wonder-gold transition-colors hover:bg-wonder-gold hover:text-wonder-bg">
              Boek een beleving
            </Magnetic>
          </nav>

          <button onClick={() => setOpen(true)} data-cursor="hover" className="text-wonder-cream md:hidden">
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-[90] flex flex-col bg-wonder-bg transition-all duration-500 md:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="flex items-center justify-between px-6 py-6">
          <span className="font-display text-lg text-wonder-cream">Studio Wonderland</span>
          <button onClick={() => setOpen(false)} className="text-wonder-cream"><X className="h-7 w-7" /></button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
          {links.map((l) => (
            <button key={l.label} onClick={() => go(l.r, l.a)} className="border-b border-white/10 py-5 text-left font-display text-3xl text-wonder-cream">
              {l.label}
            </button>
          ))}
          <button onClick={() => go('contact')} className="mt-8 rounded-full bg-wonder-gold py-4 text-center font-medium text-wonder-bg">Boek een beleving</button>
        </nav>
      </div>
    </>
  )
}

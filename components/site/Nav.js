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
                className={`group relative text-sm font-medium tracking-wide transition-colors ${route === l.r ? 'text-wonder-pinkdeep' : 'text-wonder-ink/75 hover:text-wonder-ink'}`}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-wonder-pinkdeep transition-all duration-300 group-hover:w-full" />
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

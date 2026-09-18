'use client'
import { useRef } from 'react'
import { useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { Eyebrow, Magnetic } from './ui'
import { useSite } from './ctx'

export default function About() {
  const scope = useRef(null)
  const { navigate } = useSite()
  useSectionAnimations(scope, [])
  return (
    <div ref={scope} className="min-h-screen px-6 pt-32 md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <Eyebrow className="text-wonder-gold">Over ons</Eyebrow>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.02] text-wonder-cream md:text-7xl">
          <span className="block overflow-hidden"><span data-reveal className="block">De studio achter</span></span>
          <span className="block overflow-hidden"><span data-reveal className="block text-gradient-gold">de verwondering</span></span>
        </h1>

        <div data-img className="mt-12 aspect-[16/8] overflow-hidden rounded-3xl">
          <img src={IMG.showAudience} alt="Studio Wonderland" className="h-full w-full object-cover" />
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div>
            <h2 data-fade className="font-display text-3xl text-wonder-cream">Onze missie</h2>
            <p data-fade className="mt-4 leading-relaxed text-wonder-cream/80">Studio Wonderland maakt werelden waar families samen in kunnen stappen. Wij geloven dat de mooiste herinneringen ontstaan wanneer generaties samen iets beleven — niet als toeschouwer, maar als deel van het verhaal.</p>
          </div>
          <div>
            <h2 data-fade className="font-display text-3xl text-wonder-cream">Onze aanpak</h2>
            <p data-fade className="mt-4 leading-relaxed text-wonder-cream/80">Van liveshow tot immersieve winterwereld: elke belevenis krijgt een eigen identiteit, vakmanschap en detail. [Deze tekst wordt later aangeleverd en kan hier eenvoudig worden ingevuld.]</p>
          </div>
        </div>

        <div className="my-20 grid gap-6 border-y border-white/10 py-12 md:grid-cols-3">
          {[
            { t: 'Verwondering', d: 'Alles start bij het gevoel van magie en verbeelding.' },
            { t: 'Vakmanschap', d: 'Theater, licht, muziek en verhaal op het hoogste niveau.' },
            { t: 'Samen', d: 'Belevenissen die generaties met elkaar verbinden.' },
          ].map((v, i) => (
            <div key={i} data-fade>
              <h3 className="font-display text-2xl text-wonder-gold">{v.t}</h3>
              <p className="mt-2 text-wonder-muted">{v.d}</p>
            </div>
          ))}
        </div>

        <div className="pb-28 text-center">
          <h3 data-fade className="font-display text-3xl text-wonder-cream md:text-4xl">Zin om samen te werken of te beleven?</h3>
          <Magnetic as="button" onClick={() => navigate('contact')} className="mt-8 rounded-full bg-wonder-gold px-8 py-4 font-medium text-wonder-bg">Neem contact op</Magnetic>
        </div>
      </div>
    </div>
  )
}

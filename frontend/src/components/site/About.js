'use client'
import { useRef } from 'react'
import { useSectionAnimations } from '@/lib/site/anim'
import { IMG } from '@/lib/site/media'
import { Magnetic, PageHeader, ArchDivider } from './ui'
import { useSite } from './ctx'

export default function About() {
  const scope = useRef(null)
  const { navigate } = useSite()
  useSectionAnimations(scope, [])
  return (
    <div ref={scope}>
      <PageHeader eyebrow="Over ons" lines={["De studio achter", "de verwondering"]} />

      <section className="relative z-10 bg-wonder-bg px-6 pb-28 pt-20 md:px-10 md:pt-24">
        <ArchDivider color="fill-wonder-bg" />
        <div className="mx-auto max-w-[1100px]">
          <div data-img className="aspect-[16/8] overflow-hidden rounded-[1.5rem]">
            <img src={IMG.showAudience} alt="Studio Wonderland" className="h-full w-full object-cover" />
          </div>

          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <div>
              <h2 data-fade className="font-display text-3xl text-wonder-ink">Onze missie</h2>
              <p data-fade className="mt-4 leading-relaxed text-wonder-ink/80">Studio Wonderland maakt werelden waar families samen in kunnen stappen. Wij geloven dat de mooiste herinneringen ontstaan wanneer generaties samen iets beleven — niet als toeschouwer, maar als deel van het verhaal.</p>
            </div>
            <div>
              <h2 data-fade className="font-display text-3xl text-wonder-ink">Onze aanpak</h2>
              <p data-fade className="mt-4 leading-relaxed text-wonder-ink/80">Van liveshow tot immersieve winterwereld: elke belevenis krijgt een eigen identiteit, vakmanschap en detail. [Deze tekst wordt later aangeleverd en kan hier eenvoudig worden ingevuld.]</p>
            </div>
          </div>

          <div className="my-20 grid gap-6 border-y border-wonder-pink/40 py-12 md:grid-cols-3">
            {[
              { t: 'Verwondering', d: 'Alles start bij het gevoel van magie en verbeelding.' },
              { t: 'Vakmanschap', d: 'Theater, licht, muziek en verhaal op het hoogste niveau.' },
              { t: 'Samen', d: 'Belevenissen die generaties met elkaar verbinden.' },
            ].map((v, i) => (
              <div key={i} data-fade>
                <h3 className="font-display text-2xl text-wonder-pinkdeep">{v.t}</h3>
                <p className="mt-2 text-wonder-muted">{v.d}</p>
              </div>
            ))}
          </div>

          <div className="pb-4 text-center">
            <h3 data-fade className="font-display text-3xl text-wonder-ink md:text-4xl">Zin om samen te werken of te beleven?</h3>
            <Magnetic as="button" onClick={() => navigate('contact')} className="mt-8 rounded-full bg-wonder-pinkdeep px-8 py-4 font-medium text-white">Neem contact op</Magnetic>
          </div>
        </div>
      </section>
    </div>
  )
}

'use client'
import { useRef } from 'react'
import { Mail, MapPin, Ticket } from 'lucide-react'
import { useSectionAnimations } from '@/lib/site/anim'
import { PageHeader, ArchDivider } from './ui'

export default function Contact() {
  const scope = useRef(null)
  useSectionAnimations(scope, [])

  return (
    <div ref={scope}>
      <PageHeader eyebrow="Contact" lines={["Laten we", "samen dromen"]} />

      <section className="relative z-10 bg-wonder-bg px-6 pb-28 pt-20 md:px-10 md:pt-24">
        <ArchDivider color="fill-wonder-bg" />
        <div className="mx-auto max-w-[760px] text-center">
          <p data-fade className="mx-auto max-w-lg text-lg text-wonder-ink/80">Vragen over een belevenis, een boeking of samenwerking? Neem gerust contact met ons op — we horen graag van je.</p>

          <div className="mt-10 grid gap-5 text-left sm:grid-cols-2">
            <a href="mailto:info@studiowonderland.eu" data-cursor="hover" data-fade className="flex items-center gap-4 rounded-2xl border border-wonder-pink/40 bg-wonder-panel p-6 transition-colors hover:border-wonder-pinkdeep/60">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wonder-pinkdeep/15 text-wonder-pinkdeep"><Mail className="h-6 w-6" /></span>
              <span>
                <span className="block text-xs uppercase tracking-[0.3em] text-wonder-muted">Mail ons</span>
                <span className="block font-display text-xl text-wonder-ink">info@studiowonderland.eu</span>
              </span>
            </a>

            <div data-fade className="flex items-center gap-4 rounded-2xl border border-wonder-pink/40 bg-wonder-panel p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wonder-pinkdeep/15 text-wonder-pinkdeep"><MapPin className="h-6 w-6" /></span>
              <span>
                <span className="block text-xs uppercase tracking-[0.3em] text-wonder-muted">Locatie</span>
                <span className="block font-display text-xl text-wonder-ink">Schouwburg — Stadhuis Genk</span>
              </span>
            </div>
          </div>

          <div data-fade className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-wonder-pink/40 bg-wonder-panel p-6 text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wonder-pinkdeep/15 text-wonder-pinkdeep"><Ticket className="h-6 w-6" /></span>
            <span>
              <span className="block text-xs uppercase tracking-[0.3em] text-wonder-muted">Tickets</span>
              <span className="block font-display text-xl text-wonder-ink">Verkrijgbaar via FlexTickets</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

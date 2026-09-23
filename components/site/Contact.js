'use client'
import { useRef } from 'react'
import { Mail, Ticket, Lock } from 'lucide-react'
import { useSectionAnimations } from '@/lib/site/anim'
import { PageHeader, ArchDivider } from './ui'

const EMAILS = [
  { label: 'Studio Wonderland', email: 'info@studiowonderland.eu' },
  { label: 'De Grote Sinterklaasshow', email: 'info@sinterklaasgenk.be' },
  { label: 'Het Huis van de Kerstman', email: 'info@hethuisvandekerstman.be' },
]

export default function Contact() {
  const scope = useRef(null)
  useSectionAnimations(scope, [])

  return (
    <div ref={scope}>
      <PageHeader eyebrow="Contact" lines={["Laten we", "samen dromen"]} />

      <section className="relative z-10 bg-wonder-bg px-6 pb-28 pt-20 md:px-10 md:pt-24">
        <ArchDivider color="fill-wonder-bg" />
        <div className="mx-auto max-w-[900px] text-center">
          <p data-fade className="mx-auto max-w-lg text-lg text-wonder-ink/80">Vragen over een belevenis, een boeking of samenwerking? Neem gerust contact met ons op — we horen graag van je.</p>

          {/* E-mailadressen */}
          <div className="mt-10 grid gap-5 text-left sm:grid-cols-3">
            {EMAILS.map((e) => (
              <a
                key={e.email}
                href={`mailto:${e.email}`}
                data-cursor="hover"
                data-fade
                className="flex flex-col gap-3 rounded-2xl border border-wonder-pink/40 bg-wonder-panel p-5 transition-colors hover:border-wonder-pinkdeep/60"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wonder-pinkdeep/15 text-wonder-pinkdeep"><Mail className="h-5 w-5" /></span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.22em] text-wonder-muted">{e.label}</span>
                  <span className="mt-1.5 block whitespace-nowrap text-sm text-wonder-ink">{e.email}</span>
                </span>
              </a>
            ))}
          </div>

          {/* Tickets */}
          <h3 data-fade className="mt-14 text-xs uppercase tracking-[0.3em] text-wonder-muted">Tickets</h3>
          <div className="mt-5 grid gap-5 text-left sm:grid-cols-2">
            <a
              href="https://events.flextickets.nl/event/de-grote-sinterklaasshow"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              data-fade
              className="flex items-center gap-4 rounded-2xl border border-wonder-pink/40 bg-wonder-panel p-6 transition-colors hover:border-wonder-pinkdeep/60"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wonder-pinkdeep/15 text-wonder-pinkdeep"><Ticket className="h-6 w-6" /></span>
              <span>
                <span className="block text-xs uppercase tracking-[0.22em] text-wonder-muted">De Grote Sinterklaasshow</span>
                <span className="mt-1 block font-medium text-wonder-ink">Bestel je tickets →</span>
              </span>
            </a>

            <div
              data-fade
              className="flex items-center gap-4 rounded-2xl border border-dashed border-wonder-pink/50 bg-wonder-panel/50 p-6 opacity-80"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wonder-pinkdeep/10 text-wonder-pinkdeep/60"><Lock className="h-6 w-6" /></span>
              <span>
                <span className="block text-xs uppercase tracking-[0.22em] text-wonder-muted">Het Huis van de Kerstman</span>
                <span className="mt-1 block font-medium text-wonder-ink/70">Binnenkort beschikbaar</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

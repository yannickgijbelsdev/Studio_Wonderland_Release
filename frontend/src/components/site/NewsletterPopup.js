'use client'
import { useEffect, useState } from 'react'
import { Mail, X } from 'lucide-react'

const NEWSLETTER_URL = 'https://campaigns.koodh.com/subscribe/clr_WcRPtVz4nCzPYvTD5dSQE6iqA351oJPC'
const KEY = 'sw_newsletter_seen'

export default function NewsletterPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let seen = false
    try { seen = localStorage.getItem(KEY) === '1' } catch (e) { /* ignore */ }
    if (seen) return
    const t = setTimeout(() => setShow(true), 6000)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    setShow(false)
    try { localStorage.setItem(KEY, '1') } catch (e) { /* ignore */ }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-show-gold/40 bg-show-reddeep p-8 text-center text-show-cream shadow-2xl">
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-show-gold/15 blur-3xl" />
        <button onClick={dismiss} data-cursor="hover" aria-label="Sluiten" className="absolute right-4 top-4 text-show-cream/60 transition-colors hover:text-show-gold">
          <X className="h-5 w-5" />
        </button>
        <div className="relative">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-show-gold/15 text-show-gold">
            <Mail className="h-7 w-7" />
          </div>
          <h3 className="mt-5 font-display text-3xl text-show-cream">Mis niets van de show!</h3>
          <p className="mt-3 text-show-cream/75">Schrijf je in op onze nieuwsbrief en ontvang het laatste nieuws, extra data en verrassingen van De Grote Sinterklaasshow.</p>
          <a
            href={NEWSLETTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            data-cursor="hover"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-show-gold px-7 py-3.5 font-semibold text-show-bg transition-all duration-300 hover:scale-[1.02] hover:bg-white"
          >
            <Mail className="h-5 w-5" /> Abonneer op de nieuwsbrief
          </a>
          <button onClick={dismiss} data-cursor="hover" className="mt-3 text-sm text-show-cream/50 hover:text-show-cream/80">
            Nee, bedankt
          </button>
        </div>
      </div>
    </div>
  )
}

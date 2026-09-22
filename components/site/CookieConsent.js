'use client'
import { useEffect, useState } from 'react'
import { Cookie } from 'lucide-react'
import { useSite } from './ctx'

const KEY = 'sw-cookie-consent'

export default function CookieConsent() {
  const { navigate } = useSite()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY)
      if (!v) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const choose = (value) => {
    try { localStorage.setItem(KEY, value) } catch {}
    // Non-essential cookies would be enabled/disabled here based on choice.
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9000] p-4 md:p-6">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-4 rounded-2xl border border-black/10 bg-white/95 p-5 shadow-2xl backdrop-blur-md md:flex-row md:items-center md:gap-6 md:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wonder-pink/40 text-wonder-pinkdeep"><Cookie className="h-5 w-5" /></span>
          <p className="text-sm leading-relaxed text-wonder-ink/80">
            We gebruiken enkel noodzakelijke cookies om de site te laten werken, en optionele cookies om je bezoek te verbeteren. Lees meer in ons{' '}
            <button onClick={() => { setVisible(false); navigate('cookies') }} className="font-semibold text-wonder-pinkdeep underline underline-offset-2">cookiebeleid</button>{' '}en{' '}
            <button onClick={() => { setVisible(false); navigate('privacy') }} className="font-semibold text-wonder-pinkdeep underline underline-offset-2">privacybeleid</button>.
          </p>
        </div>
        <div className="flex shrink-0 gap-3 md:ml-auto">
          <button onClick={() => choose('essential')} data-cursor="hover" className="rounded-full border border-wonder-ink/20 px-5 py-2.5 text-sm font-medium text-wonder-ink transition-colors hover:bg-wonder-ink/5">
            Enkel noodzakelijke
          </button>
          <button onClick={() => choose('all')} data-cursor="hover" className="rounded-full bg-wonder-pinkdeep px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-wonder-plum">
            Alles accepteren
          </button>
        </div>
      </div>
    </div>
  )
}

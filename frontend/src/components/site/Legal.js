'use client'
import { ArrowLeft } from 'lucide-react'
import { useSite } from './ctx'
import { Sparkles, TitleReveal } from './ui'

const CONTENT = {
  privacy: {
    eyebrow: 'Juridisch',
    title: ['Privacybeleid'],
    intro: 'Studio Wonderland respecteert je privacy. Dit beleid legt uit welke gegevens we verzamelen, waarom en hoe we ze beschermen.',
    sections: [
      { h: 'Welke gegevens verzamelen we?', p: 'We verzamelen enkel gegevens die je zelf aan ons doorgeeft via het contactformulier, zoals je naam, e-mailadres en bericht. Daarnaast houden we anonieme, technische informatie bij die nodig is om de website te laten werken.' },
      { h: 'Waarvoor gebruiken we je gegevens?', p: 'We gebruiken je gegevens uitsluitend om je vraag te beantwoorden, je aanvraag te behandelen en je (indien gewenst) op de hoogte te houden. We verkopen je gegevens nooit aan derden.' },
      { h: 'Hoe lang bewaren we je gegevens?', p: 'We bewaren je gegevens niet langer dan nodig voor het doel waarvoor ze verzameld werden, tenzij we wettelijk verplicht zijn ze langer bij te houden.' },
      { h: 'Jouw rechten', p: 'Je hebt het recht om je gegevens in te kijken, te laten verbeteren of te laten verwijderen. Neem hiervoor contact op via info@studiowonderland.eu.' },
      { h: 'Contact', p: 'Vragen over dit privacybeleid? Mail ons via info@studiowonderland.eu.' },
    ],
  },
  cookies: {
    eyebrow: 'Juridisch',
    title: ['Cookiebeleid'],
    intro: 'Deze website gebruikt cookies om correct te functioneren en om je ervaring te verbeteren. Hieronder lees je welke soorten cookies we gebruiken.',
    sections: [
      { h: 'Wat zijn cookies?', p: 'Cookies zijn kleine tekstbestanden die op je toestel worden opgeslagen wanneer je een website bezoekt. Ze helpen de site om je voorkeuren te onthouden.' },
      { h: 'Noodzakelijke cookies', p: 'Deze cookies zijn essentieel om de website te laten werken, bijvoorbeeld om je cookievoorkeur te onthouden. Ze worden altijd geplaatst en kunnen niet uitgeschakeld worden.' },
      { h: 'Optionele cookies', p: 'Met optionele cookies kunnen we je bezoek verbeteren en anoniem meten hoe de site gebruikt wordt. Deze plaatsen we enkel wanneer je op "Alles accepteren" klikt.' },
      { h: 'Je keuze beheren', p: 'Je maakt je keuze via de cookiebanner onderaan de site. Wil je je keuze wijzigen? Wis dan de cookies/opslag van deze site in je browser, waarna de banner opnieuw verschijnt.' },
      { h: 'Contact', p: 'Vragen over ons cookiebeleid? Mail ons via info@studiowonderland.eu.' },
    ],
  },
}

export default function Legal({ type = 'privacy' }) {
  const { navigate } = useSite()
  const c = CONTENT[type] || CONTENT.privacy

  return (
    <div className="bg-wonder-bg text-wonder-ink">
      <section className="relative overflow-hidden bg-gradient-to-b from-wonder-pink via-wonder-pinkdeep to-wonder-plum px-6 pb-24 pt-36 text-center md:px-10 md:pb-28 md:pt-44">
        <Sparkles count={40} />
        <div className="relative mx-auto max-w-[900px]">
          <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/85">{c.eyebrow}</span>
          <TitleReveal lines={c.title} starClass="text-[#F8E7B0] drop-shadow-[0_0_12px_rgba(248,231,176,0.75)]" className="mt-4 text-5xl text-white md:text-6xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
          <p className="mx-auto mt-6 max-w-2xl text-white/85">{c.intro}</p>
        </div>
      </section>

      <section className="px-6 pb-28 pt-16 md:px-10">
        <div className="mx-auto max-w-[820px]">
          <button onClick={() => navigate('home')} data-cursor="hover" className="mb-10 inline-flex items-center gap-2 text-sm text-wonder-ink/70 hover:text-wonder-pinkdeep">
            <ArrowLeft className="h-4 w-4" /> Terug naar home
          </button>
          <div className="space-y-10">
            {c.sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-display text-2xl text-wonder-ink md:text-3xl">{s.h}</h2>
                <p className="mt-3 leading-relaxed text-wonder-ink/75">{s.p}</p>
              </div>
            ))}
          </div>
          <p className="mt-14 text-xs uppercase tracking-widest text-wonder-muted">Laatst bijgewerkt: {new Date().toLocaleDateString('nl-BE', { month: 'long', year: 'numeric' })}</p>
        </div>
      </section>
    </div>
  )
}

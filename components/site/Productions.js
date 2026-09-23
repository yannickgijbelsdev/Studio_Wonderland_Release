'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Newspaper } from 'lucide-react'
import { useSectionAnimations } from '@/lib/site/anim'
import { useSite } from './ctx'
import { PageHeader, ArchDivider } from './ui'

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

const WONDER_SITE = 'studio-wonderland'
const CATEGORY = 'eerder-te-beleven'

export default function Productions() {
  const scope = useRef(null)
  const { openArticle } = useSite()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  useSectionAnimations(scope, [items.length])

  // "Eerder te beleven" komt uit het Clara/koodh CMS van Studio Wonderland.
  useEffect(() => {
    let mounted = true
    fetch(`/api/news?site=${encodeURIComponent(WONDER_SITE)}&category=${encodeURIComponent(CATEGORY)}`)
      .then((r) => r.json())
      .then((data) => { if (mounted) setItems(Array.isArray(data?.items) ? data.items : []) })
      .catch(() => { if (mounted) setItems([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div ref={scope}>
      <PageHeader eyebrow="Eerder te beleven" lines={["Herinneringen aan", "eerdere producties"]} />

      <section className="relative z-10 bg-wonder-bg px-6 pb-28 pt-20 md:px-10 md:pt-24">
        <ArchDivider color="fill-wonder-bg" />
        <div className="mx-auto max-w-[1200px]">
          <p data-fade className="mx-auto max-w-xl text-center text-wonder-muted">Blader door de verhalen, foto's en herinneringen van voorgaande belevenissen van Studio Wonderland.</p>

          {loading ? (
            <div className="grid gap-8 py-16 md:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-3xl border border-wonder-pink/40 bg-wonder-panel">
                  <div className="aspect-[16/9] bg-wonder-pink/20" />
                  <div className="space-y-3 p-7"><div className="h-3 w-24 rounded bg-wonder-pink/20" /><div className="h-6 w-3/4 rounded bg-wonder-pink/20" /><div className="h-3 w-full rounded bg-wonder-pink/20" /></div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="mx-auto mt-16 max-w-md rounded-3xl border border-wonder-pink/40 bg-wonder-panel p-12 text-center">
              <Newspaper className="mx-auto h-10 w-10 text-wonder-pinkdeep/50" />
              <p className="mt-4 text-wonder-ink/80">Binnenkort delen we hier de herinneringen aan onze eerdere belevenissen.</p>
            </div>
          ) : (
            <div className="grid gap-8 py-16 md:grid-cols-2">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => openArticle(it.id, 'productions')}
                  data-fade
                  data-cursor="hover"
                  className="group flex flex-col overflow-hidden rounded-3xl border border-wonder-pink/40 bg-wonder-panel text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-wonder-pinkdeep/60 hover:shadow-[0_24px_60px_-24px_rgba(192,72,104,0.35)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {it.image_url ? (
                      <img src={it.image_url} alt={it.title} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-wonder-rose"><Newspaper className="h-12 w-12 text-wonder-pinkdeep/40" /></div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-7 md:p-8">
                    <span className="text-xs uppercase tracking-[0.2em] text-wonder-muted">{formatDate(it.published_at)}</span>
                    <h3 className="mt-3 font-display text-3xl leading-tight text-wonder-ink transition-colors group-hover:text-wonder-pinkdeep md:text-4xl">{it.title}</h3>
                    {it.excerpt && <p className="mt-4 line-clamp-3 text-base text-wonder-ink/70">{it.excerpt}</p>}
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-wonder-pinkdeep">Lees meer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

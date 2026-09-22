'use client'
import { useEffect, useState } from 'react'
import { ArrowRight, Newspaper } from 'lucide-react'
import { Eyebrow, TitleReveal, ArchDivider } from './ui'
import { useSite } from './ctx'

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function ShowNews({ archColor = 'fill-show-bg', archFlip = false, showArch = true }) {
  const { openArticle } = useSite()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch('/api/news?category=homepagina')
      .then((r) => r.json())
      .then((data) => { if (mounted) setItems(Array.isArray(data?.items) ? data.items : []) })
      .catch(() => { if (mounted) setItems([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  if (!loading && items.length === 0) return null

  return (
    <section id="nieuws" className="relative z-10 bg-show-bg px-6 pb-24 pt-24 md:px-10 md:pt-28">
      {showArch && <ArchDivider color={archColor} flip={archFlip} />}
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14 text-center">
          <Eyebrow className="text-show-gold [&]:justify-center">Nieuws</Eyebrow>
          <TitleReveal lines={["Vers van achter de schermen"]} starClass="text-show-gold" className="mt-4 text-4xl text-show-cream md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center" />
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-3xl border border-show-gold/15 bg-black/20">
                <div className="aspect-[16/10] bg-white/5" />
                <div className="space-y-3 p-6"><div className="h-3 w-24 rounded bg-white/10" /><div className="h-5 w-3/4 rounded bg-white/10" /><div className="h-3 w-full rounded bg-white/10" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => openArticle(it.id)}
                data-fade
                data-cursor="hover"
                className="group flex flex-col overflow-hidden rounded-3xl border border-show-gold/15 bg-black/20 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-show-gold/50 hover:shadow-[0_20px_50px_-20px_rgba(248,231,176,0.4)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {it.image_url ? (
                    <img src={it.image_url} alt={it.title} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-show-reddeep"><Newspaper className="h-12 w-12 text-show-gold/50" /></div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-7 md:p-8">
                  <span className="text-xs uppercase tracking-[0.2em] text-show-cream/50">{formatDate(it.published_at)}</span>
                  <h3 className="mt-3 font-display text-3xl leading-tight text-show-cream group-hover:text-show-gold md:text-4xl">{it.title}</h3>
                  {it.excerpt && <p className="mt-4 line-clamp-3 text-base text-show-cream/70">{it.excerpt}</p>}
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-show-gold">Lees meer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

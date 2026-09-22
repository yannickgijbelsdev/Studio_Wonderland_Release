'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowRight, Newspaper } from 'lucide-react'
import { Eyebrow, TitleReveal, ArchDivider } from './ui'

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function ShowNews({ archColor = 'fill-show-bg', archFlip = false }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null) // full article
  const [articleLoading, setArticleLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    let mounted = true
    fetch('/api/news?category=homepagina')
      .then((r) => r.json())
      .then((data) => { if (mounted) setItems(Array.isArray(data?.items) ? data.items : []) })
      .catch(() => { if (mounted) setItems([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const openArticle = async (id) => {
    setArticleLoading(true)
    setActive({ id, loading: true })
    try {
      const res = await fetch(`/api/news/${id}`)
      const data = await res.json()
      setActive(data)
    } catch {
      setActive(null)
    } finally {
      setArticleLoading(false)
    }
  }

  useEffect(() => {
    if (active) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [active])

  // Hide the whole section when there's nothing to show.
  if (!loading && items.length === 0) return null

  return (
    <section id="nieuws" className="relative z-10 bg-show-bg px-6 pb-24 pt-24 md:px-10 md:pt-28">
      <ArchDivider color={archColor} flip={archFlip} />
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14 text-center">
          <Eyebrow className="text-show-gold">Nieuws</Eyebrow>
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
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => openArticle(it.id)}
                data-fade
                data-cursor="hover"
                className="group flex flex-col overflow-hidden rounded-3xl border border-show-gold/15 bg-black/20 text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-show-gold/50 hover:shadow-[0_20px_50px_-20px_rgba(248,231,176,0.4)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {it.image_url ? (
                    <img src={it.image_url} alt={it.title} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-show-reddeep"><Newspaper className="h-10 w-10 text-show-gold/50" /></div>
                  )}
                  {it.category?.name && (
                    <span className="absolute left-4 top-4 rounded-full bg-show-gold px-3 py-1 text-[11px] font-semibold text-show-bg">{it.category.name}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs uppercase tracking-[0.2em] text-show-cream/50">{formatDate(it.published_at)}</span>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-show-cream group-hover:text-show-gold">{it.title}</h3>
                  {it.excerpt && <p className="mt-3 line-clamp-3 text-sm text-show-cream/70">{it.excerpt}</p>}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-show-gold">Lees meer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Article modal */}
      {active && mounted && createPortal(
        <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm md:p-8" onClick={() => setActive(null)}>
          <div className="relative my-6 w-full max-w-[820px] overflow-hidden rounded-3xl bg-show-reddeep shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActive(null)} className="absolute right-4 top-4 z-10 rounded-full bg-black/40 p-2.5 text-show-cream transition hover:bg-black/70" aria-label="Sluiten">
              <X className="h-5 w-5" />
            </button>
            {articleLoading || active.loading ? (
              <div className="space-y-4 p-10">
                <div className="h-56 w-full animate-pulse rounded-2xl bg-white/5" />
                <div className="h-6 w-2/3 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
              </div>
            ) : (
              <article>
                {active.image_url && (
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img src={active.image_url} alt={active.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-7 md:p-10">
                  {active.category?.name && (
                    <span className="rounded-full bg-show-gold px-3 py-1 text-[11px] font-semibold text-show-bg">{active.category.name}</span>
                  )}
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-show-cream/50">{formatDate(active.published_at)}</p>
                  <h2 className="mt-2 font-display text-3xl leading-tight text-show-cream md:text-4xl">{active.title}</h2>
                  <div
                    className="clara-body mt-6 space-y-4 text-show-cream/85 [&_a]:text-show-gold [&_a]:underline [&_figure]:my-5 [&_figcaption]:mt-1.5 [&_figcaption]:text-xs [&_figcaption]:text-show-cream/50 [&_img]:rounded-xl [&_p]:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: active.body || '' }}
                  />
                </div>
              </article>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}

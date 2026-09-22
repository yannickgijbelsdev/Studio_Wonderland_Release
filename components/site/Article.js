'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Newspaper } from 'lucide-react'
import { useSite } from './ctx'

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function Article() {
  const { articleId, navigate } = useSite()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!articleId) return
    let mounted = true
    setLoading(true)
    setError(false)
    fetch(`/api/news/${articleId}`)
      .then((r) => { if (!r.ok) throw new Error('nok'); return r.json() })
      .then((data) => { if (mounted) setArticle(data) })
      .catch(() => { if (mounted) setError(true) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [articleId])

  return (
    <div className="spotlight-bg min-h-screen">
      <div className="mx-auto max-w-[820px] px-6 pb-28 pt-32 md:pt-36">
        <button onClick={() => navigate('show', 'nieuws')} data-cursor="hover" className="mb-8 inline-flex items-center gap-2 text-sm text-show-cream/80 hover:text-show-gold">
          <ArrowLeft className="h-4 w-4" /> Terug naar nieuws
        </button>

        {loading && (
          <div className="space-y-5">
            <div className="aspect-[16/9] w-full animate-pulse rounded-3xl bg-white/5" />
            <div className="h-8 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-show-gold/20 bg-black/25 p-10 text-center">
            <Newspaper className="mx-auto h-10 w-10 text-show-gold/50" />
            <p className="mt-4 text-show-cream/80">Dit artikel kon niet geladen worden.</p>
            <button onClick={() => navigate('show', 'nieuws')} className="mt-6 rounded-full bg-show-gold px-6 py-3 font-semibold text-show-bg hover:bg-white">Terug naar nieuws</button>
          </div>
        )}

        {!loading && !error && article && (
          <article>
            {article.image_url && (
              <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl">
                <img src={article.image_url} alt={article.title} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-show-cream/50">{formatDate(article.published_at)}</p>
              <h1 className="mt-2 font-display text-4xl leading-tight text-show-cream md:text-5xl">{article.title}</h1>
              <div
                className="clara-body mt-8 space-y-4 text-lg leading-relaxed text-show-cream/85 [&_a]:text-show-gold [&_a]:underline [&_figure]:my-6 [&_figcaption]:mt-1.5 [&_figcaption]:text-xs [&_figcaption]:text-show-cream/50 [&_img]:rounded-2xl [&_p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.body || '' }}
              />
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

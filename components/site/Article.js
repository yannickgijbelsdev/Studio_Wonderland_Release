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

// Remove the leading featured-image credit paragraph from the body — it is shown
// separately (small) right under the featured image instead.
function cleanBody(html) {
  if (!html) return ''
  return html.replace(/^\s*<p[^>]*class="[^"]*clara-image-credit[^"]*"[^>]*>[\s\S]*?<\/p>/i, '').trim()
}

export default function Article() {
  const { articleId, articleOrigin = 'show', navigate } = useSite()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const isProductions = articleOrigin === 'productions'
  const backLabel = isProductions ? 'Terug naar eerder te beleven' : 'Terug naar nieuws'
  const goBack = () => navigate(articleOrigin, isProductions ? undefined : 'nieuws')

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
        <button onClick={goBack} data-cursor="hover" className="mb-8 inline-flex items-center gap-2 text-sm text-show-cream/80 hover:text-show-gold">
          <ArrowLeft className="h-4 w-4" /> {backLabel}
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
            <button onClick={goBack} className="mt-6 rounded-full bg-show-gold px-6 py-3 font-semibold text-show-bg hover:bg-white">{backLabel}</button>
          </div>
        )}

        {!loading && !error && article && (
          <article>
            {article.image_url && (
              <figure className="m-0">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-3xl">
                  <img src={article.image_url} alt={article.title} className="h-full w-full object-cover" />
                </div>
                {article.image_caption_html && (
                  <figcaption
                    className="mt-1.5 text-xs text-show-cream/50 [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: article.image_caption_html }}
                  />
                )}
              </figure>
            )}
            <div className="mt-8">
              <h1 className="font-display text-4xl leading-tight text-show-cream md:text-5xl">{article.title}</h1>
              <div
                className="clara-body mt-8 space-y-4 text-lg leading-relaxed text-show-cream/85 [&_.clara-image-credit]:text-xs [&_.clara-image-credit]:text-show-cream/50 [&_a]:text-show-gold [&_a]:underline [&_figure]:my-6 [&_figcaption]:mt-1.5 [&_figcaption]:text-xs [&_figcaption]:text-show-cream/50 [&_img]:rounded-2xl [&_p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: cleanBody(article.body) }}
              />
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { ArrowRight, Newspaper } from 'lucide-react'
import { Eyebrow, TitleReveal, ArchDivider } from './ui'
import { useSite } from './ctx'

export default function ShowNews({
  site = 'sinterklaas-genk',
  category = 'homepagina',
  origin = 'show',
  archColor = 'fill-show-bg',
  archFlip = false,
  showArch = true,
  title = 'Ontdek hier alles over De Grote Sinterklaasshow',
  sectionBg = 'bg-show-bg',
  eyebrowCls = 'text-show-gold',
  titleCls = 'text-show-cream',
  titleStar = 'text-show-gold',
  cardBorder = 'border-show-gold/15',
  cardHover = 'hover:border-show-gold/50 hover:shadow-[0_20px_50px_-20px_rgba(248,231,176,0.4)]',
  headingCls = 'text-show-cream group-hover:text-show-gold',
  excerptCls = 'text-show-cream/70',
  btnCls = 'bg-show-gold text-show-bg hover:bg-white',
  imageBg = 'bg-show-reddeep',
  fallbackBg = 'bg-show-reddeep',
  iconCls = 'text-show-gold/50',
}) {
  const { openArticle } = useSite()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch(`/api/news?site=${encodeURIComponent(site)}&category=${encodeURIComponent(category)}`)
      .then((r) => r.json())
      .then((data) => { if (mounted) setItems(Array.isArray(data?.items) ? data.items : []) })
      .catch(() => { if (mounted) setItems([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [site, category])

  if (!loading && items.length === 0) return null

  return (
    <section id="nieuws" className={`relative z-10 ${sectionBg} px-6 pb-24 pt-24 md:px-10 md:pt-28`}>
      {showArch && <ArchDivider color={archColor} flip={archFlip} />}
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14 text-center">
          <Eyebrow className={`${eyebrowCls} [&]:justify-center`}>Nieuws</Eyebrow>
          <TitleReveal lines={[title]} starClass={titleStar} className={`mt-4 text-4xl ${titleCls} md:text-5xl [&>span]:mx-auto [&>span>span]:flex [&>span>span]:items-center [&>span>span]:justify-center`} />
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`animate-pulse overflow-hidden rounded-3xl border ${cardBorder} bg-black/20`}>
                <div className="aspect-[16/10] bg-white/5" />
                <div className="space-y-3 p-6"><div className="h-3 w-24 rounded bg-white/10" /><div className="h-5 w-3/4 rounded bg-white/10" /><div className="h-3 w-full rounded bg-white/10" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid items-start gap-8 md:grid-cols-2">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => openArticle(it.id, origin)}
                data-fade
                data-cursor="hover"
                className={`group flex flex-col overflow-hidden rounded-3xl border ${cardBorder} bg-black/20 text-left transition-all duration-300 hover:-translate-y-1.5 ${cardHover}`}
              >
                <div className={`relative w-full overflow-hidden ${imageBg}`}>
                  {it.image_url ? (
                    <img src={it.image_url} alt={it.title} className="block h-auto w-full object-contain transition-transform duration-1000 group-hover:scale-[1.03]" />
                  ) : (
                    <div className={`flex aspect-[16/9] w-full items-center justify-center ${fallbackBg}`}><Newspaper className={`h-12 w-12 ${iconCls}`} /></div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-7 md:p-8">
                  <h3 className={`font-display text-3xl leading-tight ${headingCls} md:text-4xl`}>{it.title}</h3>
                  {it.excerpt && <p className={`mt-4 line-clamp-3 text-base ${excerptCls}`}>{it.excerpt}</p>}
                  <span className={`mt-6 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 group-hover:scale-[1.03] ${btnCls}`}>Lees meer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

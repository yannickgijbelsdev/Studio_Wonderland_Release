'use client'
import { useEffect, useRef, useState } from 'react'
import { Play, Images } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useSectionAnimations } from '@/lib/site/anim'
import { PageHeader, ArchDivider } from './ui'

export default function Productions() {
  const scope = useRef(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null)
  useSectionAnimations(scope, [items.length])

  useEffect(() => {
    fetch('/api/productions')
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div ref={scope}>
      <PageHeader eyebrow="Eerder te beleven" lines={["Herinneringen aan", "eerdere producties"]} />

      <section className="relative z-10 bg-wonder-bg px-6 pb-28 pt-20 md:px-10 md:pt-24">
        <ArchDivider color="fill-wonder-bg" />
        <div className="mx-auto max-w-[1400px]">
          <p data-fade className="mx-auto max-w-xl text-center text-wonder-muted">Blader door foto's, video's en herinneringen van voorgaande belevenissen van Studio Wonderland.</p>

          {loading ? (
            <div className="grid gap-6 py-16 md:grid-cols-3">
              {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-wonder-panel" />)}
            </div>
          ) : (
            <div className="grid gap-6 py-16 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <button key={p.id} data-fade data-cursor="hover" onClick={() => setActive(p)} className="group relative overflow-hidden rounded-2xl border border-wonder-pink/40 text-left">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 w-full p-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-wonder-goldlight">{p.year}</span>
                    <h3 className="mt-1 font-display text-2xl text-white">{p.title}</h3>
                    <span className="mt-3 inline-flex items-center gap-2 text-xs text-white/70">
                      <Images className="h-4 w-4" /> {(p.gallery?.length || 0)} foto's
                      {p.videos?.length ? <><Play className="ml-2 h-4 w-4" /> {p.videos.length} video's</> : null}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-wonder-pink/40 bg-wonder-panel text-wonder-ink">
          {active && (
            <div data-native-cursor>
              <DialogTitle className="font-display text-3xl text-wonder-ink">{active.title}</DialogTitle>
              <p className="mt-1 text-sm uppercase tracking-[0.3em] text-wonder-pinkdeep">{active.year}</p>
              <p className="mt-4 text-wonder-ink/80">{active.description}</p>
              {active.videos?.length > 0 && (
                <div className="mt-6 grid gap-4">
                  {active.videos.map((v, i) => (
                    <div key={i} className="aspect-video overflow-hidden rounded-xl bg-black">
                      <video src={v} controls className="h-full w-full" />
                    </div>
                  ))}
                </div>
              )}
              {active.gallery?.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {active.gallery.map((g, i) => (
                    <img key={i} src={g} alt="" className="aspect-square w-full rounded-xl object-cover" />
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

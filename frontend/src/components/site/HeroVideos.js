'use client'
import { useEffect, useRef, useState } from 'react'
import { IMG } from '@/lib/site/media'

const tryPlay = (v) => { const p = v?.play?.(); if (p && p.catch) p.catch(() => {}) }

// Pause hero video(s) while they're scrolled out of view — decoding 1080p video
// in the background is one of the biggest causes of scroll jank.
function usePauseOffscreen(ref, getActive) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => {
      const v = getActive()
      if (!v) return
      if (entry.isIntersecting) tryPlay(v)
      else v.pause?.()
    }, { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// Crossfading dual-video hero (Studio Wonderland homepage) OR, when a single
// source is passed via props, one looping video (used by the Christmas world).
export default function HeroVideos({ webm, mp4 }) {
  const a = useRef(null)
  const b = useRef(null)
  const single = useRef(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const va = a.current, vb = b.current
    if (!va || !vb) return
    tryPlay(va)
    const onEndA = () => { vb.currentTime = 0; tryPlay(vb); activeRef.current = 1; setActive(1) }
    const onEndB = () => { va.currentTime = 0; tryPlay(va); activeRef.current = 0; setActive(0) }
    va.addEventListener('ended', onEndA)
    vb.addEventListener('ended', onEndB)
    return () => { va.removeEventListener('ended', onEndA); vb.removeEventListener('ended', onEndB) }
  }, [])

  usePauseOffscreen(mp4 ? single : a, () => (mp4 ? single.current : (activeRef.current === 0 ? a.current : b.current)))

  // Single looping video mode
  if (mp4) {
    return (
      <video ref={single} className="hero-img absolute inset-0 h-full w-full object-cover will-change-transform" autoPlay muted loop playsInline preload="auto">
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
    )
  }

  return (
    <>
      <video ref={a} className={`hero-img absolute inset-0 h-full w-full object-cover will-change-transform transition-opacity duration-1000 ${active === 0 ? 'opacity-100' : 'opacity-0'}`} autoPlay muted playsInline preload="auto">
        <source src="/sinterklaas-hero.mp4" type="video/mp4" />
      </video>
      <video ref={b} className={`hero-img absolute inset-0 h-full w-full object-cover will-change-transform transition-opacity duration-1000 ${active === 1 ? 'opacity-100' : 'opacity-0'}`} muted playsInline preload="auto">
        <source src="/hero-2.webm" type="video/webm" />
        <source src={IMG.heroVideoAlt} type="video/mp4" />
      </video>
    </>
  )
}

export function HeroScrollCue() {
  return (
    <div className="hero-cue absolute bottom-[112px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-white md:bottom-[132px]">
      <span className="text-[11px] font-medium uppercase tracking-[0.3em] [text-shadow:_0_1px_10px_rgba(0,0,0,0.55)]">Scroll om te ontdekken</span>
      <span className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/80 p-1.5 [box-shadow:_0_1px_10px_rgba(0,0,0,0.35)]">
        <span className="h-2 w-1 animate-bounce rounded-full bg-white" />
      </span>
    </div>
  )
}

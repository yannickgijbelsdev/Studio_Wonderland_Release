'use client'
import { useEffect, useRef, useState } from 'react'
import { IMG } from '@/lib/site/media'

// Crossfading dual-video hero (Studio Wonderland homepage) OR, when a single
// source is passed via props, one looping video (used by the Christmas world).
export default function HeroVideos({ webm, mp4 }) {
  const a = useRef(null)
  const b = useRef(null)
  const [active, setActive] = useState(0)
  useEffect(() => {
    const va = a.current, vb = b.current
    if (!va || !vb) return
    const tryPlay = (v) => { const p = v.play?.(); if (p && p.catch) p.catch(() => {}) }
    tryPlay(va)
    const onEndA = () => { vb.currentTime = 0; tryPlay(vb); setActive(1) }
    const onEndB = () => { va.currentTime = 0; tryPlay(va); setActive(0) }
    va.addEventListener('ended', onEndA)
    vb.addEventListener('ended', onEndB)
    return () => { va.removeEventListener('ended', onEndA); vb.removeEventListener('ended', onEndB) }
  }, [])

  // Single looping video mode
  if (mp4) {
    return (
      <video className="hero-img absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto">
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
    )
  }

  return (
    <>
      <video ref={a} className={`hero-img absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${active === 0 ? 'opacity-100' : 'opacity-0'}`} autoPlay muted playsInline preload="auto">
        <source src="/sinterklaas-trailer.mp4" type="video/mp4" />
      </video>
      <video ref={b} className={`hero-img absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${active === 1 ? 'opacity-100' : 'opacity-0'}`} muted playsInline preload="auto">
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

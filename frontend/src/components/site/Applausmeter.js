'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/site/anim'
import { useSite } from '@/components/site/ctx'
import { ArrowLeft, Volume2, PartyPopper } from 'lucide-react'

const LABELS = [
  { t: 0, txt: 'Stil…', color: 'rgba(245,240,220,0.5)' },
  { t: 22, txt: 'Zacht applaus', color: 'rgba(245,240,220,0.85)' },
  { t: 48, txt: 'Luid!', color: '#F8E7B0' },
  { t: 72, txt: 'Oorverdovend!!', color: '#F8E7B0' },
  { t: 92, txt: 'TE LUID!!!', color: '#f87171' },
]

// Static tick markers next to the meter (top → bottom)
const TICKS = ['💥', 'Oorverdovend', 'Luid', 'Zacht', 'Stil']

const labelFor = (v) => {
  let l = LABELS[0]
  for (const it of LABELS) if (v >= it.t) l = it
  return l
}

export default function Applausmeter() {
  const { navigate } = useSite()
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState('rising') // 'rising' | 'boom'
  const [level, setLevel] = useState(0)

  const rootRef = useRef(null)
  const cardRef = useRef(null)
  const flashRef = useRef(null)
  const confettiRef = useRef(null)

  const burst = () => {
    const c = confettiRef.current
    if (!c) return
    const colors = ['#F8E7B0', '#E4222E', '#ffffff', '#f5c542', '#ff6b6b']
    for (let i = 0; i < 120; i++) {
      const p = document.createElement('div')
      const size = 8 + Math.random() * 12
      Object.assign(p.style, {
        position: 'absolute', left: '50%', top: '50%',
        width: `${size}px`, height: `${size * (0.4 + Math.random() * 0.5)}px`,
        background: colors[i % colors.length],
        borderRadius: Math.random() > 0.5 ? '2px' : '50%', willChange: 'transform,opacity',
      })
      c.appendChild(p)
      const angle = Math.random() * Math.PI * 2
      const dist = 160 + Math.random() * 540
      gsap.fromTo(p, { x: 0, y: 0, opacity: 1, rotation: 0 }, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist + 140 + Math.random() * 280,
        rotation: Math.random() * 900 - 450, opacity: 0,
        duration: 1.3 + Math.random() * 1.1, ease: 'power2.out', onComplete: () => p.remove(),
      })
    }
  }

  const explode = () => {
    setPhase('boom')
    setLevel(100)
    if (flashRef.current) gsap.fromTo(flashRef.current, { opacity: 0.9 }, { opacity: 0, duration: 0.8, ease: 'power2.out' })
    if (rootRef.current) {
      gsap.fromTo(rootRef.current, { x: 0, y: 0 }, {
        x: 'random(-16, 16)', y: 'random(-12, 12)', duration: 0.05, repeat: 14, yoyo: true,
        repeatRefresh: true, ease: 'none', onComplete: () => gsap.set(rootRef.current, { x: 0, y: 0 }),
      })
    }
    if (cardRef.current) gsap.fromTo(cardRef.current, { scale: 1 }, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' })
    burst()
  }

  useEffect(() => {
    setPhase('rising')
    setLevel(0)
    let running = true
    let raf
    let startTimer
    const start = performance.now()
    let lvl = 0
    let target = 6
    let nextRetargetAt = 600
    let shaking = false
    const MAX_TIME = 13000 // calm build-up before it blows

    const loop = (now) => {
      if (!running) return
      const t = now - start
      const prog = Math.min(1, t / MAX_TIME)

      // Occasionally pick a new target: overall upward trend, but sometimes dip back down.
      if (t >= nextRetargetAt) {
        const base = prog * 95
        const dip = Math.random() < 0.42
        target = dip
          ? Math.max(4, base - (10 + Math.random() * 18))
          : Math.min(96, base + (Math.random() * 16 - 3))
        nextRetargetAt = t + 550 + Math.random() * 750
      }

      // Calm easing toward the target.
      lvl += (target - lvl) * 0.045
      setLevel(lvl)

      // Start a subtle rattle in the final stretch.
      if (!shaking && prog > 0.8 && cardRef.current) {
        shaking = true
        gsap.fromTo(cardRef.current, { x: 0, y: 0 }, {
          x: 'random(-5,5)', y: 'random(-3,3)', duration: 0.07, repeat: 34, yoyo: true,
          repeatRefresh: true, ease: 'none', onComplete: () => cardRef.current && gsap.set(cardRef.current, { x: 0, y: 0 }),
        })
      }

      if (t >= MAX_TIME) { running = false; explode(); return }
      raf = requestAnimationFrame(loop)
    }

    startTimer = setTimeout(() => { raf = requestAnimationFrame(loop) }, 500)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      clearTimeout(startTimer)
      if (cardRef.current) gsap.set(cardRef.current, { x: 0, y: 0 })
      if (rootRef.current) gsap.set(rootRef.current, { x: 0, y: 0 })
      if (confettiRef.current) confettiRef.current.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const lab = phase === 'boom' ? LABELS[LABELS.length - 1] : labelFor(level)
  const shown = phase === 'boom' ? 100 : level

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden bg-show-reddeep text-show-cream">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 55% at 50% 42%, rgba(226,34,46,0.28), transparent 70%)' }} />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-show-gold/10 blur-3xl" />

      <div ref={flashRef} className="pointer-events-none absolute inset-0 z-40 bg-white opacity-0" />
      <div ref={confettiRef} className="pointer-events-none absolute inset-0 z-30" />

      <button
        onClick={() => navigate('show')}
        data-cursor="hover"
        className="absolute left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border border-show-gold/30 bg-black/30 px-4 py-2 text-sm text-show-cream/80 backdrop-blur transition-colors hover:border-show-gold/60 hover:text-show-cream md:left-8 md:top-8"
      >
        <ArrowLeft className="h-4 w-4" /> Terug
      </button>

      <div className="relative z-20 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-show-gold/25 bg-black/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-show-gold">
          <Volume2 className="h-4 w-4" /> De Grote Sinterklaasshow
        </div>
        <h1 className="font-display text-4xl text-show-cream md:text-6xl">Applausmeter</h1>
        <p className="mt-3 max-w-md text-show-cream/60">Hoe hard klapt de persoon die aan het klappen is? Kijk hoe de meter oploopt… tot het écht te luid wordt.</p>

        <div className="mt-10 flex items-end justify-center gap-6 md:gap-10">
          <div className="flex h-[46vh] max-h-[440px] min-h-[300px] flex-col justify-between py-2 text-right text-[11px] font-medium uppercase tracking-wide text-show-cream/45 md:text-xs">
            {TICKS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <div ref={cardRef} className="relative flex h-[46vh] max-h-[440px] min-h-[300px] w-[80px] items-end overflow-hidden rounded-full border border-show-gold/25 bg-black/40 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] md:w-[100px]">
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex-1 border-b border-white/5" />
              ))}
            </div>
            <div
              className="relative w-full rounded-b-full"
              style={{
                height: `${shown}%`,
                background: 'linear-gradient(to top, #6d0a12 0%, #8E0E17 30%, #E11D2A 62%, #f5952e 82%, #F8E7B0 100%)',
                boxShadow: '0 0 28px rgba(245,197,66,0.55)',
              }}
            >
              <div className="absolute left-0 right-0 top-0 h-1 bg-white/80 blur-[1px]" />
            </div>
          </div>

          <div className="flex h-[46vh] max-h-[440px] min-h-[300px] w-[128px] flex-col items-start justify-center">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-5xl tabular-nums text-show-gold md:text-7xl">{Math.round(shown * 1.3)}</span>
              <span className="text-xl text-show-cream/60 md:text-2xl">dB</span>
            </div>
            <span className="mt-2 text-lg font-semibold transition-colors duration-300 md:text-xl" style={{ color: lab.color }}>{lab.txt}</span>
          </div>
        </div>

        <div className="mt-12 flex min-h-[120px] flex-col items-center">
          {phase === 'boom' ? (
            <>
              <div className="animate-pulse font-display text-3xl text-red-400 md:text-5xl">💥 TE LUID! 💥</div>
              <p className="mt-2 text-show-cream/70">De meter is ontploft van het applaus!</p>
              <button
                onClick={() => setRound((r) => r + 1)}
                data-cursor="hover"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-show-gold px-8 py-4 font-semibold text-show-bg transition-all duration-300 hover:scale-[1.04] hover:bg-white"
              >
                <PartyPopper className="h-5 w-5" /> Nog een keer!
              </button>
            </>
          ) : (
            <p className="text-show-cream/50">👏 De persoon die aan het klappen is, begint…</p>
          )}
        </div>
      </div>
    </div>
  )
}

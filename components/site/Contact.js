'use client'
import { useRef, useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useSectionAnimations } from '@/lib/site/anim'
import { Eyebrow, Magnetic, TitleReveal } from './ui'

export default function Contact() {
  const scope = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  useSectionAnimations(scope, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Vul je naam, e-mailadres en bericht in.')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      toast.success('Bedankt! Je bericht is verstuurd.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Er ging iets mis. Probeer het later opnieuw.')
    } finally {
      setSending(false)
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div ref={scope} className="min-h-screen px-6 pt-32 md:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-14 pb-28 md:grid-cols-2">
        <div>
          <Eyebrow className="text-wonder-gold">Contact</Eyebrow>
          <TitleReveal lines={["Laten we", "samen dromen"]} className="mt-5 text-5xl text-wonder-ink md:text-7xl [&>span:last-child>span]:text-gradient-gold" />
          <p data-fade className="mt-6 max-w-md text-wonder-muted">Vragen over een belevenis, een boeking of samenwerking? We horen graag van je.</p>
          <a href="mailto:info@studiowonderland.eu" data-cursor="hover" data-fade className="mt-10 flex items-center gap-4 rounded-2xl border border-wonder-gold/25 bg-wonder-panel p-6 transition-colors hover:border-wonder-gold/60">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-wonder-gold/15 text-wonder-gold"><Mail className="h-6 w-6" /></span>
            <span>
              <span className="block text-xs uppercase tracking-[0.3em] text-wonder-muted">Mail ons</span>
              <span className="block font-display text-xl text-wonder-ink">info@studiowonderland.eu</span>
            </span>
          </a>
        </div>

        <form onSubmit={submit} data-fade data-native-cursor className="rounded-3xl border border-wonder-gold/20 bg-wonder-panel p-8">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-wonder-ink/80">Naam</Label>
              <Input id="name" value={form.name} onChange={set('name')} placeholder="Jouw naam" className="border-wonder-gold/25 bg-white/70 text-wonder-ink placeholder:text-wonder-muted/70" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-wonder-ink/80">E-mail</Label>
              <Input id="email" type="email" value={form.email} onChange={set('email')} placeholder="jij@voorbeeld.be" className="border-wonder-gold/25 bg-white/70 text-wonder-ink placeholder:text-wonder-muted/70" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject" className="text-wonder-ink/80">Onderwerp</Label>
              <Input id="subject" value={form.subject} onChange={set('subject')} placeholder="Waarover gaat het?" className="border-wonder-gold/25 bg-white/70 text-wonder-ink placeholder:text-wonder-muted/70" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" className="text-wonder-ink/80">Bericht</Label>
              <Textarea id="message" value={form.message} onChange={set('message')} placeholder="Vertel ons meer..." rows={5} className="border-wonder-gold/25 bg-white/70 text-wonder-ink placeholder:text-wonder-muted/70" />
            </div>
            <Magnetic as="button" type="submit" disabled={sending} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-wonder-gold px-7 py-3.5 font-medium text-white disabled:opacity-60">
              <Send className="h-4 w-4" /> {sending ? 'Versturen...' : 'Verstuur bericht'}
            </Magnetic>
          </div>
        </form>
      </div>
    </div>
  )
}

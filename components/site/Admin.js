'use client'
import { useEffect, useState } from 'react'
import { Trash2, Plus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Eyebrow } from './ui'

const empty = { title: '', year: new Date().getFullYear(), description: '', cover: '', gallery: '', videos: '' }

export default function Admin() {
  const [items, setItems] = useState([])
  const [messages, setMessages] = useState([])
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/productions').then((r) => r.json()).then((d) => setItems(Array.isArray(d) ? d : []))
    fetch('/api/contact').then((r) => r.json()).then((d) => setMessages(Array.isArray(d) ? d : []))
  }
  useEffect(() => { load() }, [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const create = async (e) => {
    e.preventDefault()
    if (!form.title) { toast.error('Titel is verplicht.'); return }
    setSaving(true)
    const payload = {
      title: form.title,
      year: Number(form.year) || new Date().getFullYear(),
      description: form.description,
      cover: form.cover,
      gallery: form.gallery.split('\n').map((s) => s.trim()).filter(Boolean),
      videos: form.videos.split('\n').map((s) => s.trim()).filter(Boolean),
    }
    try {
      const res = await fetch('/api/productions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      toast.success('Productie toegevoegd.')
      setForm(empty)
      load()
    } catch { toast.error('Toevoegen mislukt.') } finally { setSaving(false) }
  }

  const remove = async (id) => {
    try {
      await fetch(`/api/productions/${id}`, { method: 'DELETE' })
      toast.success('Verwijderd.')
      load()
    } catch { toast.error('Verwijderen mislukt.') }
  }

  return (
    <div data-native-cursor className="min-h-screen px-6 pt-32 md:px-10">
      <div className="mx-auto max-w-[1200px] pb-28">
        <div className="flex items-center justify-between">
          <div>
            <Eyebrow className="text-wonder-gold">CMS · Beheer</Eyebrow>
            <h1 className="mt-4 font-display text-4xl text-wonder-cream md:text-5xl">Producties &amp; berichten</h1>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-wonder-cream/80 hover:text-wonder-gold"><RefreshCw className="h-4 w-4" /> Vernieuwen</button>
        </div>

        <Tabs defaultValue="productions" className="mt-10">
          <TabsList className="bg-wonder-panel">
            <TabsTrigger value="productions">Producties ({items.length})</TabsTrigger>
            <TabsTrigger value="messages">Berichten ({messages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="productions" className="mt-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <form onSubmit={create} className="rounded-2xl border border-white/10 bg-wonder-panel p-6">
                <h3 className="font-display text-2xl text-wonder-cream">Nieuwe productie</h3>
                <div className="mt-5 grid gap-4">
                  <div className="grid gap-2"><Label className="text-wonder-cream/80">Titel</Label><Input value={form.title} onChange={set('title')} className="border-white/15 bg-black/30 text-wonder-cream" /></div>
                  <div className="grid gap-2"><Label className="text-wonder-cream/80">Jaar</Label><Input type="number" value={form.year} onChange={set('year')} className="border-white/15 bg-black/30 text-wonder-cream" /></div>
                  <div className="grid gap-2"><Label className="text-wonder-cream/80">Omschrijving</Label><Textarea rows={3} value={form.description} onChange={set('description')} className="border-white/15 bg-black/30 text-wonder-cream" /></div>
                  <div className="grid gap-2"><Label className="text-wonder-cream/80">Coverfoto (URL)</Label><Input value={form.cover} onChange={set('cover')} className="border-white/15 bg-black/30 text-wonder-cream" /></div>
                  <div className="grid gap-2"><Label className="text-wonder-cream/80">Galerij (één URL per lijn)</Label><Textarea rows={3} value={form.gallery} onChange={set('gallery')} className="border-white/15 bg-black/30 text-wonder-cream" /></div>
                  <div className="grid gap-2"><Label className="text-wonder-cream/80">Video's (één URL per lijn)</Label><Textarea rows={2} value={form.videos} onChange={set('videos')} className="border-white/15 bg-black/30 text-wonder-cream" /></div>
                  <button type="submit" disabled={saving} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-wonder-gold px-6 py-3 font-medium text-wonder-bg disabled:opacity-60"><Plus className="h-4 w-4" /> {saving ? 'Opslaan...' : 'Toevoegen'}</button>
                </div>
              </form>

              <div className="space-y-4">
                {items.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-wonder-panel p-4">
                    <img src={p.cover} alt={p.title} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="font-display text-lg text-wonder-cream">{p.title}</div>
                      <div className="text-xs text-wonder-muted">{p.year} · {(p.gallery?.length || 0)} foto's · {(p.videos?.length || 0)} video's</div>
                    </div>
                    <button onClick={() => remove(p.id)} className="rounded-full p-2 text-wonder-muted hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-5 w-5" /></button>
                  </div>
                ))}
                {items.length === 0 && <p className="text-wonder-muted">Nog geen producties.</p>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-8">
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="rounded-2xl border border-white/10 bg-wonder-panel p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-wonder-cream">{m.name} <span className="text-wonder-muted">&lt;{m.email}&gt;</span></div>
                    <div className="text-xs text-wonder-muted">{new Date(m.created_at).toLocaleString('nl-BE')}</div>
                  </div>
                  {m.subject && <div className="mt-1 text-sm text-wonder-gold">{m.subject}</div>}
                  <p className="mt-2 text-wonder-cream/80">{m.message}</p>
                </div>
              ))}
              {messages.length === 0 && <p className="text-wonder-muted">Nog geen berichten.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

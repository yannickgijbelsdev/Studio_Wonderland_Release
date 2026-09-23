const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://studiowonderland.eu'

export default function sitemap() {
  const now = new Date()
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/degrotesinterklaasshow', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/hethuisvandekerstman', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/eerder-te-beleven', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/over-ons', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  ]
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}

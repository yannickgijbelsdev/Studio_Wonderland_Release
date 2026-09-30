// Vite plugin: server-side Open Graph tags for article deep-links.
//
// Social crawlers (Facebook, WhatsApp, X, LinkedIn, ...) do NOT run JavaScript,
// so a client-side SPA can't give them a per-article share preview. This plugin
// intercepts article URLs on the server, fetches the article from the Koodh CMS
// and injects the correct og:title / og:description / og:image into the HTML that
// is returned for that first full-page request — exactly what a crawler fetches.

import fs from 'node:fs'
import path from 'node:path'

const WORLD_BASE = {
  show: '/degrotesinterklaasshow',
  xmas: '/hethuisvandekerstman',
  productions: '/eerder-te-beleven',
}
const CMS = 'https://clr.koodh.com/api/news'

// Public canonical domain (used for absolute URLs in the sitemap).
const SITE_ORIGIN = 'https://studiowonderland.eu'

// Static routes that should always be in the sitemap.
const STATIC_PATHS = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/degrotesinterklaasshow', priority: '0.9', changefreq: 'weekly' },
  { path: '/hethuisvandekerstman', priority: '0.9', changefreq: 'weekly' },
  { path: '/eerder-te-beleven', priority: '0.6', changefreq: 'monthly' },
  { path: '/over-ons', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/applausmeter', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacybeleid', priority: '0.2', changefreq: 'yearly' },
  { path: '/cookiebeleid', priority: '0.2', changefreq: 'yearly' },
]

// Where each world's articles live in the CMS + how their URL is built.
const ARTICLE_SOURCES = [
  { site: 'sinterklaas-genk', category: 'homepagina', prefix: '/degrotesinterklaasshow/nieuws/' },
  { site: 'het-huis-van-de-kerstman', category: 'nieuws', prefix: '/hethuisvandekerstman/nieuws/' },
  { site: 'studio-wonderland', category: 'eerder-te-beleven', prefix: '/eerder-te-beleven/' },
]

async function fetchNewsList(site, category) {
  try {
    const r = await fetch(`${CMS}/${site}/${category}`, { headers: { Accept: 'application/json' } })
    if (!r.ok) return []
    const data = await r.json()
    return Array.isArray(data?.items) ? data.items : []
  } catch {
    return []
  }
}

const xmlEsc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

async function buildSitemap() {
  const urls = []
  const today = new Date().toISOString().slice(0, 10)

  for (const s of STATIC_PATHS) {
    urls.push(
      `  <url>\n    <loc>${xmlEsc(SITE_ORIGIN + s.path)}</loc>\n    <changefreq>${s.changefreq}</changefreq>\n    <priority>${s.priority}</priority>\n  </url>`
    )
  }

  const lists = await Promise.all(ARTICLE_SOURCES.map((src) => fetchNewsList(src.site, src.category)))
  ARTICLE_SOURCES.forEach((src, i) => {
    for (const it of lists[i]) {
      const slug = it.slug || it.id
      if (!slug) continue
      const loc = xmlEsc(SITE_ORIGIN + src.prefix + slug)
      const lastmod = (it.published_at || '').slice(0, 10) || today
      const imageTag = it.image_url
        ? `\n    <image:image>\n      <image:loc>${xmlEsc(it.image_url)}</image:loc>\n      <image:title>${xmlEsc(it.title || '')}</image:title>\n    </image:image>`
        : ''
      urls.push(
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>${imageTag}\n  </url>`
      )
    }
  })

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`
}

// Mirror of ctx.parseArticlePath — returns { origin, slug } or null.
function parseArticlePath(rawUrl) {
  const pathname = (rawUrl || '/').split('?')[0]
  const clean = pathname.replace(/\/+$/, '') || '/'
  for (const [origin, base] of Object.entries(WORLD_BASE)) {
    if (origin !== 'productions' && clean.startsWith(`${base}/nieuws/`)) {
      const seg = clean.slice(`${base}/nieuws/`.length).split('/')[0]
      if (seg && !seg.includes('.')) return { origin, slug: decodeURIComponent(seg) }
    }
    if (origin === 'productions' && clean !== base && clean.startsWith(`${base}/`)) {
      const seg = clean.slice(`${base}/`.length).split('/')[0]
      if (seg && !seg.includes('.')) return { origin, slug: decodeURIComponent(seg) }
    }
  }
  return null
}

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  eacute: 'é', egrave: 'è', ecirc: 'ê', euml: 'ë', agrave: 'à', acirc: 'â',
  auml: 'ä', ccedil: 'ç', iuml: 'ï', icirc: 'î', ocirc: 'ô', ouml: 'ö',
  uuml: 'ü', ugrave: 'ù', hellip: '…', mdash: '—', ndash: '–',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', euro: '€',
}

const decodeEntities = (s) =>
  String(s ?? '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) =>
      Object.prototype.hasOwnProperty.call(NAMED, name.toLowerCase())
        ? NAMED[name.toLowerCase()]
        : m
    )

const stripHtml = (s) =>
  decodeEntities(String(s ?? '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()

async function fetchArticle(slug) {
  try {
    const r = await fetch(`${CMS}/articles/${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
    })
    if (!r.ok) return null
    return await r.json()
  } catch {
    return null
  }
}

function injectMeta(html, { title, description, image, url }) {
  const SITE = 'Studio Wonderland'
  const t = esc(title ? `${SITE} | ${title}` : SITE)
  const d = esc(description || '')
  const img = esc(image || '')
  const u = esc(url || '')

  const rep = (re, str) => {
    if (re.test(html)) html = html.replace(re, str)
  }

  rep(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`)
  rep(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${d}" />`)
  rep(/<meta\s+property="og:type"[^>]*>/i, `<meta property="og:type" content="article" />`)
  rep(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${t}" />`)
  rep(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${d}" />`)
  if (u) rep(/<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${u}" />`)
  if (img) rep(/<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${img}" />`)
  // Article images have unknown dimensions — drop the fixed size hints, keep alt.
  rep(/\s*<meta\s+property="og:image:width"[^>]*>/i, '')
  rep(/\s*<meta\s+property="og:image:height"[^>]*>/i, '')
  rep(/<meta\s+property="og:image:alt"[^>]*>/i, `<meta property="og:image:alt" content="${t}" />`)
  rep(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${t}" />`)
  rep(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${d}" />`)
  if (img) rep(/<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${img}" />`)
  return html
}

// Build a clean, share-friendly description from an article object.
function articleDescription(article) {
  const cleanBody = String(article.body || '').replace(
    /^\s*<p[^>]*class="[^"]*clara-image-credit[^"]*"[^>]*>[\s\S]*?<\/p>/i,
    ''
  )
  return stripHtml(article.excerpt) || stripHtml(cleanBody).slice(0, 200)
}

export default function articleOgPlugin() {
  const root = process.cwd()
  let outDir = path.resolve(root, 'build')

  const handle = (readTemplate, transform) => async (req, res, next) => {
    try {
      if (req.method && req.method !== 'GET' && req.method !== 'HEAD') return next()
      const parsed = parseArticlePath(req.url)
      if (!parsed) return next()

      const article = await fetchArticle(parsed.slug)
      if (!article) return next()

      let template = readTemplate()
      if (transform) template = await transform(req.originalUrl || req.url, template)

      const proto = req.headers['x-forwarded-proto'] || 'https'
      const host = req.headers['x-forwarded-host'] || req.headers.host || 'studiowonderland.eu'
      const fullUrl = `${proto}://${host}${req.url}`

      const html = injectMeta(template, {
        title: article.title,
        description: articleDescription(article),
        image: article.image_url,
        url: fullUrl,
      })

      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(html)
    } catch {
      next()
    }
  }

  const sitemapMiddleware = async (req, res, next) => {
    try {
      const pathname = (req.url || '').split('?')[0].replace(/\/+$/, '') || '/'
      if (pathname !== '/sitemap.xml') return next()
      const xml = await buildSitemap()
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/xml; charset=utf-8')
      res.end(xml)
    } catch {
      next()
    }
  }

  return {
    name: 'article-og-tags',
    // Capture the resolved build output dir (defaults to /build).
    configResolved(config) {
      outDir = path.resolve(config.root, config.build?.outDir || 'build')
    },
    // BUILD (vite build): prerender a static HTML file per article with the
    // correct OG tags, and write a real static sitemap.xml. This is what makes
    // social sharing + fast indexing work on a static build served by nginx.
    async closeBundle() {
      try {
        const indexFile = path.join(outDir, 'index.html')
        if (!fs.existsSync(indexFile)) return
        const baseHtml = fs.readFileSync(indexFile, 'utf-8')

        // 1) Static sitemap.xml
        try {
          const xml = await buildSitemap()
          fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8')
          console.log('[article-og] wrote sitemap.xml')
        } catch (e) {
          console.warn('[article-og] sitemap generation failed:', e?.message || e)
        }

        // 2) Per-article prerendered HTML with OG tags
        const lists = await Promise.all(
          ARTICLE_SOURCES.map((s) => fetchNewsList(s.site, s.category))
        )
        let count = 0
        for (let i = 0; i < ARTICLE_SOURCES.length; i++) {
          const src = ARTICLE_SOURCES[i]
          for (const item of lists[i]) {
            const slug = item.slug || item.id
            if (!slug) continue
            // Fetch the full article to get an accurate description (body).
            const full = (await fetchArticle(slug)) || item
            const url = SITE_ORIGIN + src.prefix + slug
            const html = injectMeta(baseHtml, {
              title: full.title || item.title,
              description: articleDescription(full),
              image: full.image_url || item.image_url,
              url,
            })
            const relDir = (src.prefix.replace(/^\/+|\/+$/g, '') + '/' + slug).split('/')
            const dir = path.join(outDir, ...relDir)
            fs.mkdirSync(dir, { recursive: true })
            fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8')
            count++
          }
        }
        console.log(`[article-og] prerendered ${count} article page(s)`) 
      } catch (e) {
        console.warn('[article-og] prerender failed:', e?.message || e)
      }
    },
    // DEV server (vite): read source index.html + run vite's html transform.
    configureServer(server) {
      const indexPath = path.resolve(root, 'index.html')
      server.middlewares.use(sitemapMiddleware)
      server.middlewares.use(
        handle(
          () => fs.readFileSync(indexPath, 'utf-8'),
          (url, tmpl) => server.transformIndexHtml(url, tmpl)
        )
      )
    },
    // PREVIEW server (vite preview): serve the built index.html.
    configurePreviewServer(server) {
      server.middlewares.use(sitemapMiddleware)
      const builtIndex = path.resolve(outDir, 'index.html')
      if (!fs.existsSync(builtIndex)) return
      server.middlewares.use(handle(() => fs.readFileSync(builtIndex, 'utf-8'), null))
    },
  }
}

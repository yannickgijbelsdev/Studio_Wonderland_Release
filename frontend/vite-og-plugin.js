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
  const t = esc(title ? `${title} · ${SITE}` : SITE)
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

export default function articleOgPlugin() {
  const root = process.cwd()

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

      const cleanBody = String(article.body || '').replace(
        /^\s*<p[^>]*class="[^"]*clara-image-credit[^"]*"[^>]*>[\s\S]*?<\/p>/i,
        ''
      )
      const description =
        stripHtml(article.excerpt) || stripHtml(cleanBody).slice(0, 200)

      const html = injectMeta(template, {
        title: article.title,
        description,
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

  return {
    name: 'article-og-tags',
    // DEV server (vite): read source index.html + run vite's html transform.
    configureServer(server) {
      const indexPath = path.resolve(root, 'index.html')
      server.middlewares.use(
        handle(
          () => fs.readFileSync(indexPath, 'utf-8'),
          (url, tmpl) => server.transformIndexHtml(url, tmpl)
        )
      )
    },
    // PREVIEW server (vite preview): serve the built index.html.
    configurePreviewServer(server) {
      const builtIndex = path.resolve(root, 'build', 'index.html')
      if (!fs.existsSync(builtIndex)) return
      server.middlewares.use(handle(() => fs.readFileSync(builtIndex, 'utf-8'), null))
    },
  }
}

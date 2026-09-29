'use client'
import { createContext, useContext } from 'react'

export const SiteContext = createContext({ route: 'home', navigate: () => {} })
export const useSite = () => useContext(SiteContext)

// Pretty URL mapping for each route
export const ROUTE_TO_PATH = {
  home: '/',
  show: '/degrotesinterklaasshow',
  xmas: '/hethuisvandekerstman',
  productions: '/eerder-te-beleven',
  about: '/over-ons',
  contact: '/contact',
  applausmeter: '/applausmeter',
  privacy: '/privacybeleid',
  cookies: '/cookiebeleid',
}

export const PATH_TO_ROUTE = Object.fromEntries(
  Object.entries(ROUTE_TO_PATH).map(([route, path]) => [path, route])
)

export const pathForRoute = (route) => ROUTE_TO_PATH[route] || '/'

// --- Shareable article URLs -------------------------------------------------
// Each article gets its own pretty, shareable URL that encodes the "world"
// (for correct theming/back-navigation) plus the article id and a readable slug.
export const WORLD_BASE = {
  show: '/degrotesinterklaasshow',
  xmas: '/hethuisvandekerstman',
  productions: '/eerder-te-beleven',
}

export const articlePath = (origin = 'show', id = '') => {
  const base = WORLD_BASE[origin] || WORLD_BASE.show
  const seg = origin === 'productions' ? '' : '/nieuws'
  return `${base}${seg}/${id}`
}

// Try to parse a path into an article location. Returns { origin, id } or null.
// `id` is the readable article slug used both in the URL and to fetch the article.
export const parseArticlePath = (path) => {
  const clean = (path || '/').replace(/\/+$/, '') || '/'
  for (const [origin, base] of Object.entries(WORLD_BASE)) {
    // show/xmas: /<base>/nieuws/<slug>
    if (origin !== 'productions' && clean.startsWith(`${base}/nieuws/`)) {
      const rest = clean.slice(`${base}/nieuws/`.length).split('/')
      if (rest[0]) return { origin, id: decodeURIComponent(rest[0]) }
    }
    // productions: /<base>/<slug>  (but NOT the bare list path)
    if (origin === 'productions' && clean.startsWith(`${base}/`)) {
      const rest = clean.slice(`${base}/`.length).split('/')
      if (rest[0]) return { origin, id: decodeURIComponent(rest[0]) }
    }
  }
  return null
}

// Resolve any browser path into an app location.
export const resolveLocation = (path) => {
  const article = parseArticlePath(path)
  if (article) return { route: 'article', articleId: article.id, articleOrigin: article.origin }
  return { route: routeForPath(path) }
}

export const routeForPath = (path) => {
  const clean = (path || '/').replace(/\/+$/, '') || '/'
  return PATH_TO_ROUTE[clean] || 'home'
}

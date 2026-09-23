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

export const routeForPath = (path) => {
  const clean = (path || '/').replace(/\/+$/, '') || '/'
  return PATH_TO_ROUTE[clean] || 'home'
}

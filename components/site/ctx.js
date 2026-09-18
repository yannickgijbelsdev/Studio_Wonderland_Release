'use client'
import { createContext, useContext } from 'react'

export const SiteContext = createContext({ route: 'home', navigate: () => {} })
export const useSite = () => useContext(SiteContext)

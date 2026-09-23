import './globals.css'
import { Providers } from './providers'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://studiowonderland.eu'

const KEYWORDS = [
  'Studio Wonderland',
  'De Grote Sinterklaasshow',
  'De Grote Sinterklaas Show',
  'Sinterklaasshow',
  'Sinterklaas Genk',
  'Sinterklaas in Genk',
  'Sinterklaas Limburg',
  'Sinterklaas België',
  'Sint ontmoeten',
  'Het Huis van de Kerstman',
  'Huis van de Kerstman',
  'Huis van de Kerstman 2026',
  'Kerst in Genk',
  'Kerstman Genk',
  'Kerstman ontmoeten',
  'Kerstbeleving Limburg',
  'Kerst België',
  'Visit Genk',
  'Genk',
  'Limburg',
  'familievoorstelling Genk',
  'kindervoorstelling Limburg',
  'familie-uitje Genk',
  'kinderevenement Genk',
  'familie entertainment',
  'live beleving voor gezinnen',
  'dagje uit met kinderen Limburg',
  'kerstevenement Limburg',
  'sinterklaasfeest Genk',
]

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Studio Wonderland — De Grote Sinterklaasshow & Het Huis van de Kerstman | Genk, Limburg',
    template: '%s | Studio Wonderland Genk',
  },
  description:
    'Studio Wonderland maakt magische livebelevingen voor families in Genk, Limburg. Beleef De Grote Sinterklaasshow en stap binnen in Het Huis van de Kerstman 2026 — Sinterklaas en Kerst in Genk om nooit te vergeten.',
  keywords: KEYWORDS,
  applicationName: 'Studio Wonderland',
  authors: [{ name: 'Studio Wonderland' }],
  creator: 'Studio Wonderland',
  publisher: 'Studio Wonderland',
  category: 'entertainment',
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'nl_BE',
    url: SITE_URL,
    siteName: 'Studio Wonderland',
    title: 'Studio Wonderland — De Grote Sinterklaasshow & Het Huis van de Kerstman in Genk',
    description:
      'Magische livebelevingen voor het hele gezin in Genk, Limburg. Ontdek De Grote Sinterklaasshow en Het Huis van de Kerstman 2026.',
    images: [
      {
        url: '/sinterklaasshow-home.webp',
        width: 1200,
        height: 630,
        alt: 'Studio Wonderland — De Grote Sinterklaasshow in Genk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Wonderland — Sinterklaas & Kerst in Genk',
    description:
      'De Grote Sinterklaasshow en Het Huis van de Kerstman 2026 — magische familiebelevingen in Genk, Limburg.',
    images: ['/sinterklaasshow-home.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'geo.region': 'BE-VLI',
    'geo.placename': 'Genk, Limburg',
    'geo.position': '50.9659;5.5006',
    ICBM: '50.9659, 5.5006',
  },
}

export const viewport = {
  themeColor: '#F4C7D4',
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Studio Wonderland',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.png`,
      description:
        'Studio Wonderland creëert magische livebelevingen voor families in Genk, Limburg, waaronder De Grote Sinterklaasshow en Het Huis van de Kerstman.',
      email: 'info@studiowonderland.eu',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Genk',
        addressRegion: 'Limburg',
        addressCountry: 'BE',
      },
      areaServed: ['Genk', 'Limburg', 'België'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Studio Wonderland',
      inLanguage: 'nl-BE',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'TheaterEvent',
      name: 'De Grote Sinterklaasshow',
      description:
        'Een spectaculaire liveshow vol muziek, dans, humor en magie voor het hele gezin in Genk.',
      url: `${SITE_URL}/degrotesinterklaasshow`,
      image: `${SITE_URL}/sinterklaasshow-home.webp`,
      startDate: '2026-11-29',
      endDate: '2026-12-06',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'Genk',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Genk',
          addressRegion: 'Limburg',
          addressCountry: 'BE',
        },
      },
      organizer: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'Event',
      name: 'Het Huis van de Kerstman 2026',
      description:
        'Stap zelf het verhaal binnen en maak de magische reis naar het Huis van de Kerstman — een kerstbeleving voor het hele gezin in Genk.',
      url: `${SITE_URL}/hethuisvandekerstman`,
      startDate: '2026-12-12',
      endDate: '2026-12-24',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'Genk',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Genk',
          addressRegion: 'Limburg',
          addressCountry: 'BE',
        },
      },
      organizer: { '@id': `${SITE_URL}/#organization` },
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl-BE">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

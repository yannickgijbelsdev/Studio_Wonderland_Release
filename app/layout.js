import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Studio Wonderland — Wij maken werelden waar families samen in kunnen stappen',
  description: 'Studio Wonderland creëert bijzondere livebelevingen voor jong en oud. Ontdek De Grote Sinterklaasshow en Huis van de Kerstman 2026.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

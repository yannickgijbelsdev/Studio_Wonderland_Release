# Studio Wonderland — PRD (kort)

Stack: React SPA (Vite) + FastAPI (Koodh-proxy). Live: statische Vite-build via Nginx. `vite-og-plugin.js` prerendert artikelpagina's (OG-tags) + sitemap — niet breken.
Taal met gebruiker: Nederlands.

## Gedaan
- Sub-werelden Sinterklaasshow & Huis van de Kerstman, nieuws/galerij via Koodh, slugs, OG-prerender, sitemap, dynamische titels.
- (okt 2026) Scroll/muis-performance opgelost:
  - Cursor-sparkles via één canvas (dirty-rect), geen DOM-nodes met filters meer; native cursor op touch + "minder beweging".
  - Gedeelde, gedebouncete ScrollTrigger.refresh (niet tijdens scrollen; ResizeObserver alleen bij echte hoogtewijziging).
  - Hero-video's pauzeren buiten beeld; video op GPU-laag.
  - Scroll-lock (Lenis stop) bij nieuwsbrief-popup, trailer-modal, fotolightbox; achtergrondvideo pauzeert achter popup.
  - Korrel-overlay = vooraf gerenderde PNG (/grain.png) i.p.v. live SVG-filter.
  - Onzichtbare backdrop-blur verwijderd uit nav-balk en cookiebalk (95% dekkend).
  - Lenis syncTouch uit (native touch-scroll).

## Backlog
- P1: Kersttickets ontgrendelen (pas op verzoek).
- P2: Echte FlexTickets-URL Kerst (wacht op gebruiker).
- P3: Vallende gouden sterren op achtergronden ("later").

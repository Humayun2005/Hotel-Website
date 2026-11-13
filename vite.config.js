import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Content-Security-Policy for the production build only (the dev server needs inline scripts).
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com',
  "img-src 'self' data:",
  "connect-src 'self' https://photon.komoot.io https://nominatim.openstreetmap.org https://router.project-osrm.org",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const securityHeaders = {
  name: 'security-meta',
  apply: 'build',
  transformIndexHtml: (html) => html.replace('<meta name="referrer"', `<meta http-equiv="Content-Security-Policy" content="${csp}" />\n    <meta name="referrer"`),
}

export default defineConfig({
  plugins: [react(), tailwindcss(), securityHeaders],
})

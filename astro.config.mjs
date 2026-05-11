// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/** URL canónica del sitio en producción (sin barra final). Sobrescribe con PUBLIC_SITE_URL en .env */
const site =
  typeof process.env.PUBLIC_SITE_URL === 'string' && process.env.PUBLIC_SITE_URL.length > 0
    ? process.env.PUBLIC_SITE_URL.replace(/\/$/, '')
    : 'https://www.hydraulicsistem.com';

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

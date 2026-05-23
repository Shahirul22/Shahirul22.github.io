import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Update `site` to your final URL. If deploying under username.github.io,
// keep base "/" (root). For project pages (username.github.io/portfolio),
// set base: '/portfolio/'.
export default defineConfig({
  site: 'https://shahirul22.github.io',
  base: '/',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {},
});

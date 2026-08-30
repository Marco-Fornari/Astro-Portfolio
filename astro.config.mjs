import { defineConfig } from 'astro/config';

// Static output — Netlify serves the built files from dist/ with no adapter needed.
export default defineConfig({
  site: 'https://mfornaridev.netlify.app', // dominio di produzione (una riga da cambiare se passi a un dominio custom)
  output: 'static',
  build: {
    // keeps a clean /about-style URL structure if you add pages later
    format: 'directory',
  },
  compressHTML: true,
});

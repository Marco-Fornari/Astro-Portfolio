import { defineConfig } from 'astro/config';

// Static output — Netlify serves the built files from dist/ with no adapter needed.
export default defineConfig({
  site: 'https://marcofornari.dev', // change to your real domain
  output: 'static',
  build: {
    // keeps a clean /about-style URL structure if you add pages later
    format: 'directory',
  },
  compressHTML: true,
});

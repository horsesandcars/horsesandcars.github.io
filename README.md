# HorsesAndCars.com

Built with [Astro](https://astro.build) and hosted on Netlify (see `netlify.toml`; redirects in `public/_redirects`).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/
npm run preview
```

- Blog posts: `src/content/posts/*.md` — the `permalink` front matter is the URL, `image` is relative to `src/assets/images/`.
- Pages: `src/pages/about.md`, `src/pages/policies.md`
- Site settings and authors: `src/config.ts`

# Vercel Tracker Starter

This is a small Next.js demo that creates a consent-first trackable redirect link.

## Local dev

1. Install:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import project into Vercel.
3. Set an environment variable in Vercel: `ADMIN_TOKEN` with a secret value.
4. Deploy.

## Production notes
- Replace in-memory store with a persistent DB (Supabase/PlanetScale/MongoDB).
- Use a paid IP-geo provider if you need higher reliability.
- Respect user privacy: show clear consent and a privacy policy.

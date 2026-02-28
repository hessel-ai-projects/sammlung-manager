# Project Status: Sammlung Manager

## Current Phase
🟡 **Implementation** — Developer implementing Auth, RLS, robust scraping, cron, charts

## What We're Building
Dashboard für Zippo-Sammlung mit automatischen eBay-Preisen:
- ~260 Zippos in 8-9 Kollektionen
- Tageswert pro Zippo und Kollektion
- Preisverlauf über Zeit

## Completed
- [x] Product Spec (PLAN.md)
- [x] Inventar aus Fotos dokumentiert
- [x] Tech Stack definiert
- [x] Architektur finalisiert
- [x] Code im Workspace
- [x] Auth/RLS implementiert
- [x] Robustes eBay Scraping
- [x] Preis-Historie Charts
- [x] Vercel Cron für automatische Updates
- [x] Dashboard mit Wertverlauf

## Was implementiert wurde

### 1. Auth/RLS
- `middleware.ts` - Route Protection
- `app/(auth)/login/page.tsx` - Login Page
- `app/api/auth/signout/route.ts` - Signout Handler
- `lib/auth.ts` - Auth Helper Functions
- `supabase/migrations/001_auth_rls.sql` - Database Migration
- `lib/db.ts` - Changed to use anon key instead of service role

### 2. Robustes eBay Scraping
- `lib/ebay-scraper-robust.ts` - New robust scraper with:
  - Exponential backoff (1s, 2s, 4s)
  - User-Agent Rotation (5 different UAs)
  - Timeout handling (15s)
  - Graceful fallback to last known price

### 3. Preis-Historie
- `lib/prices.ts` - Updated to save to price_history
- `components/charts/PriceHistoryChart.tsx` - Recharts components
- `app/page.tsx` - Dashboard with value history chart

### 4. Automatische Updates (Vercel Cron)
- `app/api/cron/update-prices/route.ts` - Cron job endpoint
- `vercel.json` - Cron schedule (daily at 6am)
- Rate limiting: 5 zippos/minute (12s delay between each)

## Next Steps
- [ ] Run migration `supabase/migrations/001_auth_rls.sql` in Supabase SQL Editor
- [ ] Set up user in Supabase Auth (Email/Password)
- [ ] Set CRON_SECRET environment variable in Vercel
- [ ] Deploy to Vercel and test

## Decision Log
| Date | Decision | By |
|------|----------|-----|
| 2026-02-22 | Next.js 15 + Supabase | Initial |
| 2026-02-28 | Auth required (nicht nur simple password) | PO |
| 2026-02-28 | eBay Web Scraping (keine API verfügbar) | Architect |
| 2026-02-28 | Kein Proxy, aber Retry-Logik + User-Agent Rotation | PO |
| 2026-02-28 | All features implemented | Developer |

## Inventar
- Kollektion 1: The Beatles (~100 Stück)
- Kollektion 2: Guy Harvey Marine Art (~20 Stück)
- Kollektion 3: Scrimshaw / Natur (~20 Stück)
- Kollektion 4: Josef Bauer "Femina Universa" + Teki (~20 Stück)
- Kollektion 5: Windy Girl (~40 Stück)
- Kollektion 6: Landmarks & Animals & Jeans (~20 Stück)
- Kollektion 7: Native American Chiefs + Tiere (~20 Stück)
- Kollektion 8: West Zigaretten + Gold Jubiläum + Adler (~20 Stück)

**Gesamt: ~260 Zippos**

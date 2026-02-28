# Architecture: Sammlung Manager

## Ist-Stand (existierender Code)

**Was funktioniert:**
- Next.js 15 + Supabase + Tailwind
- Dashboard mit Gesamtwert + Kollektions-Grid
- Kollektionen CRUD
- Zippos CRUD  
- eBay Web Scraping für Preise (manueller Button)
- Preis-Snapshots in DB

**Kritische Lücken:**
- ❌ Keine Auth/RLS (App ist öffentlich)
- ❌ Keine automatischen Preis-Updates
- ❌ Keine Preis-Historie (nur aktueller Snapshot)
- ❌ Scraping ist fragil (keine Retry-Logik)

## Tech Stack (final)

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Backend/DB | Supabase |
| Charts | Recharts |
| Preis-Daten | eBay Web Scraping (robust) |
| Cron | Vercel Cron |

## Auth (neu)

- Supabase Auth mit Email/Password
- RLS auf allen Tabellen
- Single-User (Hessel)

## DB Schema Erweiterungen

**Existierende Tabellen bleiben, neue Felder:**

```sql
-- user_id zu collections hinzufügen
alter table collections add column user_id uuid references auth.users(id);

-- user_id zu zippos hinzufügen  
alter table zippos add column user_id uuid references auth.users(id);

-- Preis-Historie (neu)
create table price_history (
  id bigint generated always as identity primary key,
  zippo_id bigint references zippos(id) on delete cascade,
  avg_price decimal(10,2) not null,
  min_price decimal(10,2),
  max_price decimal(10,2),
  num_sold int,
  recorded_at timestamptz default now()
);

-- Index für schnelle Chart-Abfragen
create index idx_price_history_zippo_date on price_history(zippo_id, recorded_at);

-- RLS aktivieren
alter table collections enable row level security;
alter table zippos enable row level security;
alter table price_snapshots enable row level security;
alter table price_history enable row level security;

-- Policies
create policy "Users can CRUD own collections"
  on collections for all using (auth.uid() = user_id);

create policy "Users can CRUD own zippos"
  on zippos for all using (auth.uid() = user_id);

create policy "Users can view own price_snapshots"
  on price_snapshots for all using (
    exists (select 1 from zippos where zippos.id = price_snapshots.zippo_id and zippos.user_id = auth.uid())
    or exists (select 1 from collections where collections.id = price_snapshots.collection_id and collections.user_id = auth.uid())
  );

create policy "Users can view own price_history"
  on price_history for all using (
    exists (select 1 from zippos where zippos.id = price_history.zippo_id and zippos.user_id = auth.uid())
  );
```

## Robustes Web Scraping

**Neue Implementation in `lib/ebay-scraper-robust.ts`:**

```typescript
interface ScrapeConfig {
  maxRetries: 3;
  baseDelay: 1000; // 1s
  userAgents: string[]; // Rotieren
}

// Features:
// - Exponential backoff: 1s, 2s, 4s
// - User-Agent Rotation
// - Timeout handling
// - Graceful fallback zu letztem bekannten Preis
// - Logging für Debugging
```

## Automatische Updates

**Vercel Cron (täglich):**
```typescript
// app/api/cron/update-prices/route.ts
// - Alle Zippos holen
// - Batch-Verarbeitung (5 Zippos/Minute um Rate Limits zu respektieren)
// - Preis in price_snapshots UND price_history speichern
// - Fehler-Logging
```

## Preis-Historie Charts

**Neue Komponenten:**
- `components/charts/PriceHistoryChart.tsx` – Recharts Line Chart
- Zeigt Wertverlauf pro Zippo (letzte 12 Monate)
- Zeigt Gesamtwert-Verlauf der Sammlung

## Migration-Plan

1. **Auth Setup**
   - Supabase Auth konfigurieren
   - Login-Page erstellen
   - Middleware für Route-Protection

2. **RLS Migration**
   - `user_id` zu bestehenden Daten hinzufügen
   - Policies aktivieren
   - Service Role Key durch Auth-Client ersetzen

3. **Robustes Scraping**
   - Neue Scraper-Implementation
   - Retry-Logik
   - Error Handling

4. **Preis-Historie**
   - `price_history` Tabelle erstellen
   - Migration bestehender Snapshots
   - Chart-Komponenten

5. **Cron Job**
   - Vercel Cron einrichten
   - Batch-Update Logik

6. **Dashboard Erweiterung**
   - Charts für Wertverlauf
   - "Zuletzt aktualisiert" Anzeige

## Umgebungsvariablen

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= # Nur für Migrationen

# Cron Secret (für Vercel Cron)
CRON_SECRET= # Zufälliger String zum Absichern des Cron Endpoints
```

## Dateien zu ändern/erstellen

**Neu:**
- `app/(auth)/login/page.tsx`
- `app/(auth)/layout.tsx`
- `app/api/cron/update-prices/route.ts`
- `lib/ebay-scraper-robust.ts`
- `lib/auth.ts`
- `components/charts/PriceHistoryChart.tsx`
- `middleware.ts`

**Ändern:**
- `lib/db.ts` – Auth-Client statt Service Role
- `lib/collections.ts` – User-Filter hinzufügen
- `lib/zippos.ts` – User-Filter hinzufügen
- `lib/prices.ts` – Preis-Historie speichern
- `app/layout.tsx` – Auth Provider
- `app/page.tsx` – Charts hinzufügen
- `vercel.json` – Cron konfigurieren

# Sammlung Manager — Product Spec

## Vision
Dashboard öffnen → sofort sehen: "Deine Sammlung ist heute **€X.XXX** wert."
Breakdown pro Kollektion und pro Einzelstück. Preise basierend auf tatsächlichen eBay-Verkäufen.

## User
Single user (Hessel). Kein Multi-User, kein Auth nötig (oder simple password protection).

## Core Concepts

### Zippo (einzelnes Feuerzeug)
- Name / Beschreibung
- Foto (Upload oder URL)
- Suchbegriff für eBay (z.B. "Zippo Beatles Abbey Road")
- Zustand: Neu/Unbenutzt + OVP (default, da alle so sind)
- Kaufpreis (optional)
- Bottom Stamp Code (optional — Monat/Jahr der Produktion)
- Notizen (optional)

### Kollektion (Gruppe von Zippos)
- Name (z.B. "The Beatles", "Windy Girl", "West Tiger")
- Beschreibung
- Foto (Rahmen-Foto)
- Enthält: Liste von Zippos
- Vollständig: ja/nein (Flag — wichtig für Bewertung)
- Kollektion-Suchbegriff für eBay (z.B. "Zippo Beatles Collection complete" — für den Sammlungs-Aufschlag)

### Preisdaten
- Pro Zippo: Durchschnittlicher Verkaufspreis (eBay sold listings, letzte 90 Tage)
- Pro Zippo: Preisspanne (min/max)
- Pro Zippo: Anzahl Verkäufe gefunden
- Pro Kollektion: Summe Einzelwerte + separater "Kollektionswert" (falls als Set verkauft)
- Gesamt: Summe aller Kollektionen

### Preis-Refresh
- Automatisch: 1x pro Woche (Cron/scheduled job)
- Manuell: Button "Preise aktualisieren" (einzeln oder alle)
- Historisch: Preisverlauf speichern (Datum → Wert), für Trend-Anzeige

## Initiales Inventar (aus Fotos abgeleitet)

### Kollektion 1: The Beatles (~100 Stück)
Großer Display-Rahmen. Enthält u.a.:
- Album-Cover-Serie (Please Please Me, With the Beatles, A Hard Day's Night, Beatles for Sale, Help!, Rubber Soul, Revolver, Sgt. Pepper, Magical Mystery Tour, White Album, Yellow Submarine, Abbey Road, Let It Be)
- Apple Records Logo (grüner Apfel)
- Beatles Logo-Varianten
- "Love" Album
- John Lennon "Imagine Peace" Serie (4+ Stück)
- Ägypten/Pharao Relief-Serie (unten im Rahmen, ~10 Stück Gold + Silber)
- Diverse Einzelmotive (Cartoon-Stil, Foto-Stil, etc.)

### Kollektion 2: Guy Harvey Marine Art (~20 Stück)
- Fisch-Motive: Marlin, Mahi-Mahi, Shark, Tarpon, Tuna, Bass
- Native American Landscape Relief (obere Reihe, 5 Stück — evtl. separate Kollektion)
- Rote Frau (Pop-Art-Stil)
- Signiert "Guy Harvey"

### Kollektion 3: Scrimshaw / Natur (~20 Stück)
- Scrimshaw-Stil Gravuren: Löwe, Bär, Tiger, Adler, Welle, Landschaften
- Kompass + Segelschiff Paare
- Wal + Orca
- Montreux Jazz Festival
- Tattoo Snake (rote Kobra)
- Windy 1937
- BMW
- Kölner Dom
- Southern Comfort (SoCo)

### Kollektion 4: Josef Bauer "Femina Universa" + Teki (~20 Stück)
- Femina Universa Städte-Serie: Vienna, New York, Berlin, Milano, Tokyo, Paris, Moscow, London
- Teki Serie (mehrere Motive)
- Alles Josef Bauer Artwork

### Kollektion 5: Windy Girl (~40 Stück, 2 Rahmen)
- Windy Girl in verschiedenen Mantelfarben: Rosa, Grün, Weiß, Gelb, Schwarz, Türkis, Grau, Lila, Rot, Braun
- 3D Relief Windy (Messing)
- Zippo Logo + Windy Kombis
- "1936" Vintage-Werbung Motiv
- "1982" Motiv
- Ca. 20 verschiedene Farbvarianten

### Kollektion 6: Landmarks & Animals & Jeans (~20 Stück)
- Landmarks Serie (rot graviert): Big Ben, Freiheitsstatue, Eiffelturm, Kolosseum
- Jeans/Denim Serie (3-4 Stück mit Zippo-Logo auf Jeans-Motiv)
- Tier-Gravuren: Zebra, Wolf, Bison, Adler, Löwe, Husky, Kobra, Leopard, Hirsch

### Kollektion 7: Native American Chiefs + Tiere (~20 Stück)
- Native American Chief Paare (je Silber + Messing, ~10 Stück)
- Tier-Fotodruck: Adler, Tiger, Schneeleopard, Wolf
- Meerestiere (blau): Orca, Delfin, Hai
- Motorrad-Serie (3 Stück)

### Kollektion 8: West Zigaretten + Gold Jubiläum + Adler (~20 Stück)
- West Tiger Serie (5 Stück, verschiedene Raubkatzen)
- Gold Zippo Jubiläums-Serie: 1996, Stars, 1995, "Welcome 21st Century", 2000 Eagle, 2001, Sunburst, "10 Years"
- West Adler Serie (5 Stück, Chrome mit Adler-Motiven)

## Geschätzt: ~260 Zippos in 8-9 Kollektionen

## Tech Stack

### Frontend
- **Next.js 15** (App Router) — lightweight, SSR
- **Tailwind CSS** — schnelles Styling
- **shadcn/ui** — fertige Komponenten

### Backend / DB
- **Supabase** (bereits vorhanden vom Bullet Journal Projekt)
  - PostgreSQL für alle Daten
  - Supabase Storage für Fotos
  - Edge Functions für eBay-Scraping

### eBay Preisdaten
- **eBay Browse API** (öffentlich, kein OAuth nötig für Suche)
  - Endpoint: `findCompletedItems` / `sold` filter
  - Suchbegriff pro Zippo
  - Fallback: eBay Web Scraping via Bright Data o.ä. falls API zu restriktiv
- Alternative: **eBay Kleinanzeigen** ist weniger relevant (Angebotspreise ≠ Verkaufspreise)

### Hosting
- **Vercel** (wie Bullet Journal)

### Scheduled Jobs
- **Vercel Cron** oder **Supabase pg_cron** — wöchentlicher Preis-Refresh

## DB Schema (Draft)

```
collections
  id UUID PK
  name TEXT
  description TEXT
  photo_url TEXT
  search_term TEXT (für eBay Kollektions-Suche)
  is_complete BOOLEAN
  created_at TIMESTAMP
  updated_at TIMESTAMP

zippos
  id UUID PK
  collection_id UUID FK → collections
  name TEXT
  description TEXT
  photo_url TEXT
  search_term TEXT (für eBay Einzel-Suche)
  condition TEXT DEFAULT 'new_with_box'
  purchase_price DECIMAL (optional)
  bottom_stamp TEXT (optional)
  notes TEXT
  position INTEGER (Reihenfolge im Display)
  created_at TIMESTAMP
  updated_at TIMESTAMP

price_snapshots
  id UUID PK
  zippo_id UUID FK → zippos (nullable)
  collection_id UUID FK → collections (nullable)
  avg_price DECIMAL
  min_price DECIMAL
  max_price DECIMAL
  num_sold INTEGER
  source TEXT DEFAULT 'ebay'
  fetched_at TIMESTAMP

price_history (materialized/aggregated view for charts)
  date DATE
  zippo_id UUID (nullable)
  collection_id UUID (nullable)
  avg_price DECIMAL
```

## UI Pages

### 1. Dashboard (Startseite)
- **Gesamtwert** groß oben: "€ 12.450"
- Trend-Pfeil (↑↓) vs. letzte Woche
- Grid der Kollektionen als Karten mit:
  - Rahmen-Foto
  - Name
  - Anzahl Zippos
  - Kollektionswert
  - "Vollständig ✓" Badge

### 2. Kollektion-Detail
- Header mit Foto + Name + Gesamtwert
- Grid der enthaltenen Zippos
- Kollektions-Aufschlag anzeigen (Set-Wert vs. Summe Einzelwerte)
- "Preise aktualisieren" Button

### 3. Zippo-Detail
- Foto
- Name, Beschreibung, Bottom Stamp
- Aktueller geschätzter Wert
- Preisverlauf Chart (letzte 12 Monate)
- Letzte eBay-Verkäufe (Links)
- Bearbeiten-Button

### 4. Zippo hinzufügen/bearbeiten
- Formular mit allen Feldern
- Foto-Upload
- eBay-Suchbegriff mit "Testen" Button (zeigt Preview der Ergebnisse)

### 5. Einstellungen
- Preis-Refresh Frequenz
- Währung (EUR default)
- Export (CSV/PDF für Versicherung)

## MVP Scope (Phase 1)
1. DB Schema + CRUD für Kollektionen und Zippos
2. Dashboard mit Kollektions-Übersicht
3. Manuelles Hinzufügen von Zippos
4. eBay Preis-Lookup (on-demand per Button)
5. Gesamtwert-Berechnung

## Phase 2
6. Automatischer wöchentlicher Preis-Refresh
7. Preisverlauf-Chart
8. Foto-Upload (Supabase Storage)
9. Kollektions-Aufschlag Berechnung
10. CSV/PDF Export

## Phase 3
11. Initiales Inventar aus Fotos (Bulk-Import)
12. Smart Search Term Suggestions
13. Mobile-optimiertes Layout
14. Benachrichtigungen bei starken Preisänderungen

## Entscheidungen
- **Währung:** EUR (USD-Preise von eBay werden konvertiert)
- **Fotos:** Einzelzippos werden aus den Rahmenfotos ausgeschnitten (AI Crop)
- **eBay Zugang:** Web Scraping (kein Developer Account)

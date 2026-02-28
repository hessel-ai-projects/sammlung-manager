-- Migration: Multi-User ohne RLS-Check (Option 3)
-- Alle authentifizierten Nutzer sehen alle Daten

-- 1. Add user_id to collections table (optional - für Audit Trail)
ALTER TABLE collections ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Add user_id to zippos table (optional - für Audit Trail)
ALTER TABLE zippos ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 3. Create price_history table
CREATE TABLE IF NOT EXISTS price_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  zippo_id bigint REFERENCES zippos(id) ON DELETE CASCADE,
  avg_price decimal(10,2) NOT NULL,
  min_price decimal(10,2),
  max_price decimal(10,2),
  num_sold int,
  recorded_at timestamptz DEFAULT now()
);

-- 4. Create index for price history queries
CREATE INDEX IF NOT EXISTS idx_price_history_zippo_date 
ON price_history(zippo_id, recorded_at DESC);

-- 5. Enable RLS on all tables
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE zippos ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if any
DROP POLICY IF EXISTS "Users can CRUD own collections" ON collections;
DROP POLICY IF EXISTS "Users can CRUD own zippos" ON zippos;
DROP POLICY IF EXISTS "Users can view own price_snapshots" ON price_snapshots;
DROP POLICY IF EXISTS "Users can view own price_history" ON price_history;

-- 7. NEW: All authenticated users can access all data
CREATE POLICY "All authenticated users can CRUD collections" 
  ON collections FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can CRUD zippos" 
  ON zippos FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can view price_snapshots" 
  ON price_snapshots FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can view price_history" 
  ON price_history FOR SELECT 
  USING (auth.role() = 'authenticated');

-- 8. Optional: Setze alle bestehenden Zippos/Kollektionen auf den ersten User
-- (Falls du schon Daten hast und sie einem User zuweisen willst)
-- UPDATE collections SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;
-- UPDATE zippos SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

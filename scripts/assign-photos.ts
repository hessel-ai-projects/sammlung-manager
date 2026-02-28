import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const db = new Database(path.join(process.cwd(), 'data', 'sammlung.db'));

// Map collection names to photo prefixes and grid configs
const MAPPINGS: Record<string, { prefix: string; rows: number; cols: number }> = {
  'The Beatles': { prefix: 'r1-beatles', rows: 11, cols: 10 },
  'Guy Harvey Marine Art': { prefix: 'r2-guy-harvey', rows: 4, cols: 5 },
  'Scrimshaw & Natur': { prefix: 'r3-scrimshaw', rows: 5, cols: 5 },
  'Josef Bauer Femina Universa & Teki': { prefix: 'r4-femina-universa', rows: 4, cols: 5 },
  'Windy Girl': { prefix: 'r5-windy-girl-1', rows: 4, cols: 5 },
  'Landmarks & Animals & Jeans': { prefix: 'r7-landmarks-animals', rows: 4, cols: 5 },
  'Native American Chiefs & Tiere': { prefix: 'r8-chiefs-animals', rows: 4, cols: 5 },
  'West Tiger & Gold Jubiläum & Adler': { prefix: 'r9-west-gold-eagles', rows: 4, cols: 5 },
};

const photoDir = path.join(process.cwd(), 'public', 'zippo-photos');
const update = db.prepare('UPDATE zippos SET photo_url = ? WHERE id = ?');

for (const [collName, config] of Object.entries(MAPPINGS)) {
  const col = db.prepare('SELECT id FROM collections WHERE name = ?').get(collName) as { id: number } | undefined;
  if (!col) { console.log(`Collection not found: ${collName}`); continue; }

  const zippos = db.prepare('SELECT id, position FROM zippos WHERE collection_id = ? ORDER BY position').all(col.id) as { id: number; position: number }[];

  let assigned = 0;
  zippos.forEach((z, index) => {
    // Convert linear position to row/col
    const row = Math.floor(index / config.cols) + 1;
    const colNum = (index % config.cols) + 1;
    const filename = `${config.prefix}_r${row}c${colNum}.jpg`;
    const filePath = path.join(photoDir, filename);

    if (fs.existsSync(filePath)) {
      update.run(`/zippo-photos/${filename}`, z.id);
      assigned++;
    }
  });

  console.log(`${collName}: ${assigned}/${zippos.length} photos assigned`);
}

db.close();

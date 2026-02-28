import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, 'sammlung.db'));

const insert = db.prepare(`
  INSERT INTO zippos (collection_id, name, search_term, position)
  VALUES (?, ?, ?, ?)
`);

// Get collection IDs by name
const getCol = db.prepare('SELECT id FROM collections WHERE name = ?');
function colId(name: string): number {
  const row = getCol.get(name) as { id: number } | undefined;
  if (!row) throw new Error(`Collection not found: ${name}`);
  return row.id;
}

function bulkInsert(collectionName: string, zippos: [string, string][]) {
  const cid = colId(collectionName);
  // Clear existing
  db.prepare('DELETE FROM zippos WHERE collection_id = ?').run(cid);
  const tx = db.transaction(() => {
    zippos.forEach(([name, searchTerm], i) => {
      insert.run(cid, name, searchTerm, i + 1);
    });
  });
  tx();
  console.log(`${collectionName}: ${zippos.length} zippos imported`);
}

// ============================================================
// WEST TIGER & GOLD JUBILÄUM & ADLER
// ============================================================
bulkInsert('West Tiger & Gold Jubiläum & Adler', [
  // Row 1 - Predator faces
  ['West Tiger', 'Zippo West Tiger Feuerzeug'],
  ['West Bär', 'Zippo West Bär Bear Feuerzeug'],
  ['West Wolf', 'Zippo West Wolf Feuerzeug'],
  ['West Leopard', 'Zippo West Leopard Jaguar Feuerzeug'],
  ['West Tiger (Variante)', 'Zippo West Tiger Wildkatze Feuerzeug'],
  // Row 2 - Gold commemorative
  ['West 1999 Aztec Sun', 'Zippo West 1999 Gold Schwarz'],
  ['West 1998 Gold', 'Zippo West 1998 Gold Schwarz'],
  ['West Sterne Gold', 'Zippo West Sterne Stars Gold Schwarz'],
  ['West 1995 Zippo', 'Zippo West 1995 Gold Schwarz'],
  ['West Zippo Since 1932 Flag', 'Zippo West Since 1932 American Flag Gold'],
  // Row 3 - Gold millennium
  ['West Welcome 21st Century', 'Zippo West Welcome 21st Century Gold'],
  ['West 2000 Adler Gold', 'Zippo West 2000 Eagle Gold Schwarz'],
  ['West 2000 Millennium', 'Zippo West 2000 Millennium Gold'],
  ['West 2001 Sunburst', 'Zippo West 2001 Sunburst Gold'],
  ['West 10 Years 2003', 'Zippo West 10 Years 2003 Gold Jubiläum'],
  // Row 4 - Eagle portraits
  ['West Adler Birke', 'Zippo West Adler Eagle Birke Chrome'],
  ['West Adler Palmen', 'Zippo West Adler Eagle Chrome'],
  ['West Adler Meer', 'Zippo West Adler Eagle Ocean Chrome'],
  ['West Adler Berge', 'Zippo West Adler Eagle Mountains Chrome'],
  ['West Adler Winter', 'Zippo West Adler Eagle Winter Snow Chrome'],
]);

// ============================================================
// GUY HARVEY MARINE ART
// ============================================================
bulkInsert('Guy Harvey Marine Art', [
  // Row 1 - Native American brass emblems (sub-series)
  ['Heulender Wolf Messing', 'Zippo brass emblem howling wolf'],
  ['Kaktus Wüste Mond Messing', 'Zippo brass emblem saguaro cactus desert'],
  ['Heulender Kojote Mond', 'Zippo brass emblem coyote howling moon'],
  ['Indian Head Nickel Messing', 'Zippo brass emblem Indian Head nickel arrows'],
  ['Zia Kreuz Symbol Silber', 'Zippo Native American Zia cross sun symbol'],
  // Row 2 - Guy Harvey fish
  ['Guy Harvey Fliegender Fisch', 'Zippo Guy Harvey flying fish color'],
  ['Guy Harvey Segelfisch', 'Zippo Guy Harvey sailfish chrome'],
  ['Guy Harvey Mahi-Mahi', 'Zippo Guy Harvey mahi dorado black matte'],
  ['Guy Harvey Marlin', 'Zippo Guy Harvey marlin jumping chrome'],
  ['Guy Harvey Forelle', 'Zippo Guy Harvey trout leaping color'],
  // Row 3
  ['Guy Harvey Barsch', 'Zippo Guy Harvey largemouth bass'],
  ['Guy Harvey Blauer Marlin', 'Zippo Guy Harvey blue marlin chrome'],
  ['Guy Harvey Delfine Grün', 'Zippo Guy Harvey dolphins teal green'],
  ['Guy Harvey Riff-Szene', 'Zippo Guy Harvey reef scene coral fish'],
  ['Guy Harvey Hai Gold', 'Zippo Guy Harvey shark brass gold'],
  // Row 4
  ['Guy Harvey Frau Rot', 'Zippo Guy Harvey blue face woman red'],
  ['Guy Harvey Meeresschildkröten', 'Zippo Guy Harvey sea turtles navy blue'],
  ['Guy Harvey Marlin Chrome', 'Zippo Guy Harvey marlin satin chrome'],
  ['Guy Harvey Hai Chrome', 'Zippo Guy Harvey shark satin chrome'],
  ['Guy Harvey Thunfisch', 'Zippo Guy Harvey tuna color chrome'],
]);

// ============================================================
// SCRIMSHAW & NATUR
// ============================================================
bulkInsert('Scrimshaw & Natur', [
  // Row 1
  ['Scrimshaw Wüstenlandschaft', 'Zippo scrimshaw desert landscape'],
  ['Scrimshaw Waldlandschaft', 'Zippo scrimshaw forest landscape'],
  ['Scrimshaw Tiger', 'Zippo scrimshaw tiger'],
  ['Scrimshaw Adlerkopf', 'Zippo scrimshaw eagle head'],
  ['Scrimshaw Segelschiff', 'Zippo scrimshaw tall ship sailing'],
  // Row 2
  ['Scrimshaw Grizzlybär', 'Zippo scrimshaw grizzly bear'],
  ['Scrimshaw Kompass & Schiff', 'Zippo scrimshaw compass ship'],
  ['Scrimshaw Kompass & Berge', 'Zippo scrimshaw compass mountains'],
  ['Scrimshaw Wal', 'Zippo scrimshaw whale humpback'],
  ['Scrimshaw Orca', 'Zippo scrimshaw orca killer whale'],
  // Row 3
  ['Montreux Jazz Festival', 'Zippo Montreux Jazz Festival'],
  ['Tattoo Snake Rote Kobra', 'Zippo tattoo snake red cobra'],
  ['Adler im Flug Gravur', 'Zippo engraved eagle flight'],
  ['Windy 1937', 'Zippo Windy 1937'],
  ['Sonne Mond Gesicht', 'Zippo sun moon face celestial'],
  // Row 4
  ['Kölner Dom', 'Zippo Kölner Dom Cologne Cathedral'],
  ['BMW Logo', 'Zippo BMW logo'],
  ['Zippo Logo Collage', 'Zippo logo collage text SOCO'],
  ['Holographisch/Dunkel', 'Zippo holographic design'],
]);

// ============================================================
// JOSEF BAUER FEMINA UNIVERSA & TEKI
// ============================================================
bulkInsert('Josef Bauer Femina Universa & Teki', [
  // Row 1
  ['Femina Universa Vienna', 'Zippo Josef Bauer Femina Universa Vienna'],
  ['Femina Universa New York', 'Zippo Josef Bauer Femina Universa New York'],
  ['Femina Universa Grünes Haar', 'Zippo Femina Universa green hair'],
  ['Teki Mond Orange', 'Zippo Teki blue woman orange moon Barrett Smythe'],
  ['Femina Universa Silber', 'Zippo Femina Universa chrome silver'],
  // Row 2
  ['Femina Universa Berlin', 'Zippo Josef Bauer Femina Universa Berlin'],
  ['Femina Universa Milano', 'Zippo Josef Bauer Femina Universa Milano'],
  ['Femina Universa Dunkel', 'Zippo Femina Universa blue hair dark'],
  ['Teki Tänzerin', 'Zippo Teki orange woman dancing Barrett Smythe'],
  ['Femina Universa Blau', 'Zippo Femina Universa blue face'],
  // Row 3
  ['Femina Universa Tokyo', 'Zippo Josef Bauer Femina Universa Tokyo'],
  ['Femina Universa Paris', 'Zippo Josef Bauer Femina Universa Paris'],
  ['Femina Universa Maske', 'Zippo Femina Universa mask face'],
  ['Teki Rot', 'Zippo Teki red woman Barrett Smythe'],
  ['Femina Universa Rot', 'Zippo Femina Universa red background'],
  // Row 4
  ['Femina Universa Moscow', 'Zippo Josef Bauer Femina Universa Moscow'],
  ['Femina Universa London', 'Zippo Josef Bauer Femina Universa London'],
  ['Femina Universa Schmetterling', 'Zippo Femina Universa butterfly'],
  ['Teki Sitzend', 'Zippo Teki seated woman bamboo Barrett Smythe'],
  ['Femina Universa Bambus', 'Zippo Femina Universa bamboo border'],
]);

// ============================================================
// WINDY GIRL (both frames combined)
// ============================================================
bulkInsert('Windy Girl', [
  // Frame 1 Row 1
  ['Windy Girl Rosa Groß', 'Zippo Windy Girl pink coat'],
  ['Windy Girl Grün Groß', 'Zippo Windy Girl green coat'],
  ['Windy 1936 Replica', 'Zippo Windy 1936 advertisement replica'],
  ['Windy Girl Rosa Klein', 'Zippo Windy Girl pink vintage'],
  ['Windy Girl Grün Klein', 'Zippo Windy Girl green vintage'],
  // Frame 1 Row 2
  ['Windy Girl Gelb', 'Zippo Windy Girl yellow gold coat'],
  ['Windy Girl Schwarz/Rot', 'Zippo Windy Girl black coat red hat'],
  ['Windy Girl 3D Messing', 'Zippo Windy Girl 3D brass emblem raised'],
  ['Windy Girl Türkis', 'Zippo Windy Girl teal turquoise coat'],
  ['Windy Girl Grau', 'Zippo Windy Girl grey silver coat'],
  // Frame 1 Row 3
  ['Windy Girl Lila', 'Zippo Windy Girl purple plum coat'],
  ['Windy Girl Rot', 'Zippo Windy Girl red coat'],
  ['Windy Girl Blau Zippo Text', 'Zippo Windy Girl blue Zippo text'],
  ['Windy Girl Rot Groß', 'Zippo Windy Girl red coat full color'],
  ['Windy Girl Rosa/Mauve', 'Zippo Windy Girl pink mauve coat'],
  // Frame 1 Row 4
  ['Windy Girl Beige', 'Zippo Windy Girl tan beige coat'],
  ['Windy Girl Schwarz Klassisch', 'Zippo Windy Girl black coat classic'],
  ['Windy Girl 1982 Blau', 'Zippo Windy Girl 1982 blue purple circle'],
  ['Windy Girl 1982 Gold', 'Zippo Windy Girl 1982 gold tan coat'],
  ['Windy Girl Grau Klein', 'Zippo Windy Girl grey coat chrome'],
  // Frame 2 - mostly same as frame 1 but let me add unique ones
  // (Photos 5 and 6 appear to be the same frame from different angles)
]);

// ============================================================
// LANDMARKS & ANIMALS & JEANS
// ============================================================
bulkInsert('Landmarks & Animals & Jeans', [
  // Row 1
  ['Big Ben London Rot', 'Zippo Big Ben London red etched'],
  ['Big Ben London Chrome', 'Zippo Big Ben London engraved chrome'],
  ['Zippo Jeans Denim 1', 'Zippo jeans denim pocket blue'],
  ['Zebra Gravur', 'Zippo zebra etched engraved'],
  ['Wolf Kopf Gravur', 'Zippo wolf head engraved'],
  // Row 2
  ['Freiheitsstatue Rot', 'Zippo Statue of Liberty red etched'],
  ['Büffel/Bison Kopf', 'Zippo buffalo bison head engraved'],
  ['Zippo Jeans Denim 2', 'Zippo jeans denim red label'],
  ['Adler Ausgebreitet', 'Zippo eagle spread wings engraved'],
  ['Weißkopfseeadler Farbe', 'Zippo bald eagle head color painted'],
  // Row 3
  ['Eiffelturm Paris Rot', 'Zippo Eiffel Tower Paris red etched'],
  ['Löwe Kopf Gravur', 'Zippo lion head face engraved'],
  ['Zippo Jeans Denim 3', 'Zippo jeans denim red tag'],
  ['Weißer Wolf Laufend', 'Zippo white wolf running'],
  ['Springender Barsch', 'Zippo bass fish jumping'],
  // Row 4
  ['Kolosseum Rom Rot', 'Zippo Colosseum Rome red etched'],
  ['Kobra Schlange Gravur', 'Zippo cobra snake head engraved'],
  ['Zippo Jeans Denim 4', 'Zippo jeans denim pocket variant'],
  ['Leopard Gesicht', 'Zippo leopard jaguar face'],
  ['Hirsch Geweih', 'Zippo whitetail deer buck head'],
]);

// ============================================================
// NATIVE AMERICAN CHIEFS & TIERE
// ============================================================
bulkInsert('Native American Chiefs & Tiere', [
  // Row 1
  ['Chief mit Stab Chrome', 'Zippo Native American chief emblem chrome'],
  ['Chief mit Stab Messing', 'Zippo Native American chief emblem brass'],
  ['Weißkopfseeadler Foto', 'Zippo bald eagle portrait color photo'],
  ['Orca Blau', 'Zippo orca killer whale blue'],
  ['Motorrad Rennfahrer 1', 'Zippo motorcycle racer engraved'],
  // Row 2
  ['Chief Kopfschmuck Chrome', 'Zippo Native American chief headdress chrome'],
  ['Chief Kopfschmuck Messing', 'Zippo Native American chief headdress brass'],
  ['Tiger Gesicht Farbe', 'Zippo tiger face roaring color photo'],
  ['Delfine Blau', 'Zippo dolphins blue pair'],
  ['Motorrad Rennfahrer 2', 'Zippo motorcycle racer sport bike'],
  // Row 3
  ['Chief mit Pfeife Chrome', 'Zippo Native American chief pipe chrome'],
  ['Chief mit Pfeife Messing', 'Zippo Native American chief pipe brass'],
  ['Eule Gesicht S/W', 'Zippo owl face black white photo'],
  ['Hai Blau', 'Zippo shark blue'],
  ['Motorrad Action 3', 'Zippo motorcycle rider action engraved'],
  // Row 4
  ['Chief Cigars Chrome', 'Zippo Native American cigars chrome'],
  ['Chief Cigars Messing', 'Zippo Native American cigars brass'],
  ['Wolf Gesicht Foto', 'Zippo wolf face close up color photo'],
  ['Marlin Blau Zippo', 'Zippo marlin swordfish blue'],
  ['Motorrad Cruiser', 'Zippo motorcycle cruiser rider'],
]);

// ============================================================
// THE BEATLES (big one)
// ============================================================
bulkInsert('The Beatles', [
  // Row 1
  ['Beatles Logo Weiß', 'Zippo Beatles logo white'],
  ['Beatles Gruppenfoto früh', 'Zippo Beatles group photo early'],
  ['Beatles Gruppenfoto Variante', 'Zippo Beatles band photo suits'],
  ['The Beatles Text Logo', 'Zippo The Beatles text logo white'],
  ['Beatles Anzüge Foto', 'Zippo Beatles suits photo'],
  ['Beatles Logo Klassisch', 'Zippo Beatles logo classic design'],
  ['The Beatles Text Weiß', 'Zippo Beatles white text logo'],
  ['Beatles Text Variante', 'Zippo Beatles simple logo'],
  ['Beatles Kragenlose Anzüge', 'Zippo Beatles collarless suits photo'],
  ['Beatles Script Logo', 'Zippo Beatles script logo stylized'],
  // Row 2
  ['With the Beatles', 'Zippo Beatles With The Beatles album cover'],
  ['Let It Be', 'Zippo Beatles Let It Be album'],
  ['Beatles for Sale', 'Zippo Beatles For Sale album cover'],
  ['The Beatles Story', 'Zippo Beatles Story album'],
  ['Beatles Text Design', 'Zippo Beatles text design white'],
  ['Beatles Logo Variante', 'Zippo Beatles logo variant'],
  ['Beatles Text Variante 2', 'Zippo Beatles text design variant'],
  ['Rubber Soul', 'Zippo Beatles Rubber Soul album'],
  ['Beatles Frühes Gruppenfoto', 'Zippo Beatles early group photo'],
  ['Beatles Stilisiertes Logo', 'Zippo Beatles stylized logo'],
  // Row 3
  ['A Hard Day\'s Night', 'Zippo Beatles Hard Days Night album'],
  ['Help!', 'Zippo Beatles Help album cover'],
  ['Beatles 1 Rot/Gelb', 'Zippo Beatles 1 number one hits red'],
  ['Beatles 1 Orange', 'Zippo Beatles 1 album orange'],
  ['Beatles Gruppenbild', 'Zippo Beatles group image color'],
  ['Beatles Blau Design', 'Zippo Beatles blue colorful design'],
  ['Yellow Submarine Text', 'Zippo Beatles Yellow Submarine text'],
  ['Beatles Anthology', 'Zippo Beatles Anthology'],
  ['Beatles Psychedelisch', 'Zippo Beatles psychedelic design'],
  ['Beatles Retro Kreise', 'Zippo Beatles retro circles target'],
  // Row 4
  ['Revolver', 'Zippo Beatles Revolver album cover'],
  ['Magical Mystery Tour', 'Zippo Beatles Magical Mystery Tour'],
  ['Beatles Ornament', 'Zippo Beatles ornate design'],
  ['Beatles Dunkel Logo', 'Zippo Beatles dark logo matte'],
  ['Apple Corps Grün', 'Zippo Beatles Apple Corps green apple'],
  ['Apple Rosa/Rot', 'Zippo Beatles Apple pink red'],
  ['Apple Grün Variante', 'Zippo Beatles green apple variant'],
  ['Beatles Blau Gruppe', 'Zippo Beatles blue background group'],
  ['Get Back', 'Zippo Beatles Get Back album'],
  ['Beatles Retro Streifen', 'Zippo Beatles retro stripe design'],
  // Row 5
  ['Beatles Einfach Text', 'Zippo Beatles simple text logo'],
  ['Beatles Stehend Gruppe', 'Zippo Beatles standing group photo'],
  ['Beatles Band Stehend', 'Zippo Beatles band standing photo'],
  ['Beatles Revolver Artwork', 'Zippo Beatles Revolver artwork'],
  ['Beatles Dunkles Foto', 'Zippo Beatles dark group photo'],
  ['Help! Semaphore', 'Zippo Beatles Help silhouette semaphore'],
  ['All You Need Is Love', 'Zippo Beatles All You Need Is Love'],
  ['Beatles Cartoon', 'Zippo Beatles cartoon illustrated'],
  ['Love Songs', 'Zippo Beatles Love Songs compilation'],
  ['Beatles Illustriert Bunt', 'Zippo Beatles illustrated colorful'],
  // Row 6
  ['Beatles Drum Logo', 'Zippo Beatles drum bass logo'],
  ['Beatles Rarities', 'Zippo Beatles Rarities Past Masters'],
  ['Beatles Schwarz Matt', 'Zippo Beatles black matte design'],
  ['Let It Be Film', 'Zippo Beatles Let It Be movie poster'],
  ['Beatles Portraits', 'Zippo Beatles faces portraits design'],
  ['Beatles Walking', 'Zippo Beatles walking candid photo'],
  ['Abbey Road', 'Zippo Beatles Abbey Road crossing'],
  ['Beatles Weiß Design', 'Zippo Beatles white clean design'],
  ['Yellow Submarine Film', 'Zippo Beatles Yellow Submarine movie art'],
  ['Beatles Cartoon Design', 'Zippo Beatles cartoon art design'],
  // Row 7
  ['Yellow Submarine Bild', 'Zippo Beatles Yellow Submarine submarine image'],
  ['Yellow Submarine Variante', 'Zippo Beatles Yellow Submarine variant'],
  ['Yellow Submarine Chrome', 'Zippo Beatles Yellow Submarine chrome silver'],
  ['Yellow Submarine Bunt', 'Zippo Beatles Yellow Submarine colorful'],
  ['Sgt. Pepper Bunt', 'Zippo Beatles Sgt Pepper colorful group'],
  ['Beatles Spät Foto', 'Zippo Beatles late era photo'],
  ['Beatles Klassisch Weiß', 'Zippo Beatles classic white text'],
  ['Love Album', 'Zippo Beatles Love album Cirque'],
  ['Beatles Farbbalken', 'Zippo Beatles color bars stripe'],
  ['Beatles Design', 'Zippo Beatles collection design'],
  // Row 8 - John Lennon + Brass
  ['John Lennon Portrait', 'Zippo John Lennon portrait photo'],
  ['John Lennon Imagine Peace 1', 'Zippo John Lennon Imagine Peace Statue Liberty'],
  ['John Lennon Brille', 'Zippo John Lennon glasses round'],
  ['John Lennon Imagine Peace 2', 'Zippo John Lennon Imagine Peace variant'],
  ['John Lennon Design', 'Zippo John Lennon design collection'],
  ['John Lennon Variante', 'Zippo John Lennon portrait variant'],
  ['Beatles Messing Relief 1', 'Zippo Beatles brass etched relief'],
  ['Beatles Messing Relief 2', 'Zippo Beatles brass antique etched'],
  ['Beatles Ägypten Relief 1', 'Zippo Beatles Egyptian brass relief'],
  ['Beatles Messing Relief 3', 'Zippo Beatles brass collectible relief'],
  // Row 9 - Silver/Gold reliefs
  ['Beatles Silber Relief 1', 'Zippo Beatles pewter silver embossed'],
  ['Beatles Silber Relief 2', 'Zippo Beatles silver etched artistic'],
  ['Beatles Silber Relief 3', 'Zippo Beatles silver embossed relief'],
  ['Beatles Silber Relief 4', 'Zippo Beatles silver detailed relief'],
  ['Beatles Silber Relief 5', 'Zippo Beatles silver artistic relief'],
  ['Beatles Silber Sgt Pepper', 'Zippo Beatles silver Sgt Pepper'],
  ['Beatles Silber Relief 6', 'Zippo Beatles silver collectible'],
  ['Beatles Gold Relief 1', 'Zippo Beatles gold brass etched relief'],
  ['Beatles Gold Relief 2', 'Zippo Beatles gold brass relief artistic'],
  ['Beatles Gold Relief 3', 'Zippo Beatles gold brass collectible'],
  // Row 10 - Bottom color designs
  ['Beatles Lila Bunt', 'Zippo Beatles purple colorful design'],
  ['Beatles Ornament Dunkel', 'Zippo Beatles ornate dark artistic'],
  ['Beatles Farb-Gruppenfoto', 'Zippo Beatles color group photo'],
  ['Beatles Sepia Vintage', 'Zippo Beatles vintage sepia photo'],
  ['Beatles Gold Stern', 'Zippo Beatles gold star design'],
  ['Beatles Landschaft', 'Zippo Beatles landscape nature'],
  ['Beatles Sonnenuntergang', 'Zippo Beatles sunset silhouette'],
]);

console.log('\n✅ Bulk import complete!');
const total = db.prepare('SELECT COUNT(*) as count FROM zippos').get() as { count: number };
console.log(`Total zippos in database: ${total.count}`);

db.close();

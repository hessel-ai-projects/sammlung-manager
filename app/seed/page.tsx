'use client';

import { useState } from 'react';

const collections = [
  {
    name: "The Beatles",
    description: "~100 Stück - Album-Cover, Logos, John Lennon Serie",
    zippos: [
      { name: "Please Please Me", search_term: "Zippo Beatles Please Please Me" },
      { name: "With the Beatles", search_term: "Zippo Beatles With the Beatles" },
      { name: "A Hard Day's Night", search_term: "Zippo Beatles A Hard Day's Night" },
      { name: "Beatles for Sale", search_term: "Zippo Beatles for Sale" },
      { name: "Help!", search_term: "Zippo Beatles Help" },
      { name: "Rubber Soul", search_term: "Zippo Beatles Rubber Soul" },
      { name: "Revolver", search_term: "Zippo Beatles Revolver" },
      { name: "Sgt. Pepper", search_term: "Zippo Beatles Sgt Pepper" },
      { name: "Magical Mystery Tour", search_term: "Zippo Beatles Magical Mystery Tour" },
      { name: "White Album", search_term: "Zippo Beatles White Album" },
      { name: "Yellow Submarine", search_term: "Zippo Beatles Yellow Submarine" },
      { name: "Abbey Road", search_term: "Zippo Beatles Abbey Road" },
      { name: "Let It Be", search_term: "Zippo Beatles Let It Be" },
      { name: "Apple Records Logo", search_term: "Zippo Apple Records" },
      { name: "Beatles Logo", search_term: "Zippo Beatles Logo" },
      { name: "Love Album", search_term: "Zippo Beatles Love" },
      { name: "John Lennon Imagine 1", search_term: "Zippo John Lennon Imagine Peace" },
      { name: "John Lennon Imagine 2", search_term: "Zippo John Lennon Peace" },
      { name: "John Lennon Imagine 3", search_term: "Zippo Lennon Imagine" },
      { name: "John Lennon Imagine 4", search_term: "Zippo John Lennon" },
      { name: "Ägypten Gold 1", search_term: "Zippo Egypt Pharaoh Gold" },
      { name: "Ägypten Gold 2", search_term: "Zippo Egyptian Pharaoh" },
      { name: "Ägypten Gold 3", search_term: "Zippo Egypt Gold" },
      { name: "Ägypten Gold 4", search_term: "Zippo Pharaoh Relief" },
      { name: "Ägypten Gold 5", search_term: "Zippo Egypt Relief" },
      { name: "Ägypten Silber 1", search_term: "Zippo Egypt Pharaoh Silver" },
      { name: "Ägypten Silber 2", search_term: "Zippo Egyptian Silver" },
      { name: "Ägypten Silber 3", search_term: "Zippo Egypt Silver" },
      { name: "Ägypten Silber 4", search_term: "Zippo Pharaoh Silver" },
      { name: "Ägypten Silber 5", search_term: "Zippo Silver Egypt" },
      { name: "Beatles Cartoon 1", search_term: "Zippo Beatles Cartoon" },
      { name: "Beatles Cartoon 2", search_term: "Zippo Beatles Animation" },
      { name: "Beatles Foto 1", search_term: "Zippo Beatles Photo" },
      { name: "Beatles Foto 2", search_term: "Zippo Beatles Picture" },
      { name: "Beatles Foto 3", search_term: "Zippo Beatles Bild" },
      { name: "Beatles Vintage 1", search_term: "Zippo Beatles Vintage" },
      { name: "Beatles Vintage 2", search_term: "Zippo Beatles Retro" },
      { name: "Beatles Limited 1", search_term: "Zippo Beatles Limited Edition" },
      { name: "Beatles Limited 2", search_term: "Zippo Beatles Collector" },
    ]
  },
  {
    name: "Guy Harvey Marine Art",
    description: "~20 Stück - Fische, Meerestiere",
    zippos: [
      { name: "Marlin", search_term: "Zippo Guy Harvey Marlin" },
      { name: "Mahi-Mahi", search_term: "Zippo Guy Harvey Mahi Mahi" },
      { name: "Shark", search_term: "Zippo Guy Harvey Shark" },
      { name: "Tarpon", search_term: "Zippo Guy Harvey Tarpon" },
      { name: "Tuna", search_term: "Zippo Guy Harvey Tuna" },
      { name: "Bass", search_term: "Zippo Guy Harvey Bass" },
      { name: "Native Landscape 1", search_term: "Zippo Guy Harvey Landscape" },
      { name: "Native Landscape 2", search_term: "Zippo Guy Harvey Native" },
      { name: "Native Landscape 3", search_term: "Zippo Guy Harvey Indian" },
      { name: "Native Landscape 4", search_term: "Zippo Guy Harvey Chief" },
      { name: "Native Landscape 5", search_term: "Zippo Guy Harvey Tribe" },
      { name: "Rote Frau Pop Art", search_term: "Zippo Guy Harvey Woman Pop Art" },
      { name: "Guy Harvey Signiert", search_term: "Zippo Guy Harvey signed" },
      { name: "Guy Harvey Logo", search_term: "Zippo Guy Harvey Logo" },
      { name: "Guy Harvey Collection", search_term: "Zippo Guy Harvey Collection" },
      { name: "Dolphin", search_term: "Zippo Guy Harvey Dolphin" },
      { name: "Sailfish", search_term: "Zippo Guy Harvey Sailfish" },
      { name: "Swordfish", search_term: "Zippo Guy Harvey Swordfish" },
      { name: "Redfish", search_term: "Zippo Guy Harvey Redfish" },
      { name: "Snook", search_term: "Zippo Guy Harvey Snook" },
    ]
  },
  {
    name: "Scrimshaw / Natur",
    description: "~20 Stück - Scrimshaw-Stil, Tiere",
    zippos: [
      { name: "Scrimshaw Löwe", search_term: "Zippo Scrimshaw Lion" },
      { name: "Scrimshaw Bär", search_term: "Zippo Scrimshaw Bear" },
      { name: "Scrimshaw Tiger", search_term: "Zippo Scrimshaw Tiger" },
      { name: "Scrimshaw Adler", search_term: "Zippo Scrimshaw Eagle" },
      { name: "Scrimshaw Welle", search_term: "Zippo Scrimshaw Wave" },
      { name: "Scrimshaw Landschaft", search_term: "Zippo Scrimshaw Landscape" },
      { name: "Kompass + Segelschiff", search_term: "Zippo Compass Ship" },
      { name: "Wal", search_term: "Zippo Whale" },
      { name: "Orca", search_term: "Zippo Orca" },
      { name: "Montreux Jazz Festival", search_term: "Zippo Montreux Jazz" },
      { name: "Tattoo Snake Kobra", search_term: "Zippo Tattoo Snake Cobra" },
      { name: "Windy 1937", search_term: "Zippo Windy 1937" },
      { name: "BMW", search_term: "Zippo BMW" },
      { name: "Kölner Dom", search_term: "Zippo Cologne Cathedral" },
      { name: "Southern Comfort SoCo", search_term: "Zippo Southern Comfort" },
      { name: "Scrimshaw Wolf", search_term: "Zippo Scrimshaw Wolf" },
      { name: "Scrimshaw Hirsch", search_term: "Zippo Scrimshaw Deer" },
      { name: "Scrimshaw Adler 2", search_term: "Zippo Scrimshaw Eagle" },
      { name: "Scrimshaw Bison", search_term: "Zippo Scrimshaw Bison" },
      { name: "Scrimshaw Elch", search_term: "Zippo Scrimshaw Moose" },
    ]
  },
  {
    name: "Josef Bauer Femina Universa",
    description: "~20 Stück - Städte-Serie, Teki",
    zippos: [
      { name: "Femina Universa Vienna", search_term: "Zippo Femina Universa Vienna" },
      { name: "Femina Universa New York", search_term: "Zippo Femina Universa New York" },
      { name: "Femina Universa Berlin", search_term: "Zippo Femina Universa Berlin" },
      { name: "Femina Universa Milano", search_term: "Zippo Femina Universa Milano" },
      { name: "Femina Universa Tokyo", search_term: "Zippo Femina Universa Tokyo" },
      { name: "Femina Universa Paris", search_term: "Zippo Femina Universa Paris" },
      { name: "Femina Universa Moscow", search_term: "Zippo Femina Universa Moscow" },
      { name: "Femina Universa London", search_term: "Zippo Femina Universa London" },
      { name: "Teki 1", search_term: "Zippo Teki" },
      { name: "Teki 2", search_term: "Zippo Teki Series" },
      { name: "Teki 3", search_term: "Zippo Teki Art" },
      { name: "Teki 4", search_term: "Zippo Teki Design" },
      { name: "Teki 5", search_term: "Zippo Teki Collection" },
      { name: "Teki 6", search_term: "Zippo Teki Limited" },
      { name: "Teki 7", search_term: "Zippo Teki Special" },
      { name: "Teki 8", search_term: "Zippo Teki Edition" },
      { name: "Josef Bauer Logo", search_term: "Zippo Josef Bauer" },
      { name: "Josef Bauer Signature", search_term: "Zippo Josef Bauer signed" },
      { name: "Femina Universa Complete", search_term: "Zippo Femina Universa Collection" },
      { name: "Teki Complete", search_term: "Zippo Teki Complete" },
    ]
  },
  {
    name: "Windy Girl",
    description: "~40 Stück - Windy Girl in verschiedenen Farben",
    zippos: [
      { name: "Windy Girl Rosa", search_term: "Zippo Windy Girl Pink" },
      { name: "Windy Girl Grün", search_term: "Zippo Windy Girl Green" },
      { name: "Windy Girl Weiß", search_term: "Zippo Windy Girl White" },
      { name: "Windy Girl Gelb", search_term: "Zippo Windy Girl Yellow" },
      { name: "Windy Girl Schwarz", search_term: "Zippo Windy Girl Black" },
      { name: "Windy Girl Türkis", search_term: "Zippo Windy Girl Turquoise" },
      { name: "Windy Girl Grau", search_term: "Zippo Windy Girl Grey" },
      { name: "Windy Girl Lila", search_term: "Zippo Windy Girl Purple" },
      { name: "Windy Girl Rot", search_term: "Zippo Windy Girl Red" },
      { name: "Windy Girl Braun", search_term: "Zippo Windy Girl Brown" },
      { name: "Windy Girl Orange", search_term: "Zippo Windy Girl Orange" },
      { name: "Windy Girl Blau", search_term: "Zippo Windy Girl Blue" },
      { name: "Windy Girl Beige", search_term: "Zippo Windy Girl Beige" },
      { name: "Windy Girl Hot Pink", search_term: "Zippo Windy Girl Hot Pink" },
      { name: "Windy Girl Navy", search_term: "Zippo Windy Girl Navy" },
      { name: "Windy Girl Mint", search_term: "Zippo Windy Girl Mint" },
      { name: "Windy Girl 3D Relief", search_term: "Zippo Windy Girl 3D" },
      { name: "Windy Girl Messing", search_term: "Zippo Windy Girl Brass" },
      { name: "Windy Girl Vintage", search_term: "Zippo Windy Girl Vintage" },
      { name: "Windy Girl 1936", search_term: "Zippo Windy Girl 1936" },
      { name: "Windy Girl 1982", search_term: "Zippo Windy Girl 1982" },
      { name: "Windy Logo + Girl", search_term: "Zippo Windy Logo" },
      { name: "Windy Collection", search_term: "Zippo Windy Collection" },
      { name: "Windy Limited", search_term: "Zippo Windy Limited" },
      { name: "Windy Special", search_term: "Zippo Windy Special Edition" },
      { name: "Windy Girl Light", search_term: "Zippo Windy Girl Light" },
      { name: "Windy Girl Dark", search_term: "Zippo Windy Girl Dark" },
      { name: "Windy Girl Classic", search_term: "Zippo Windy Girl Classic" },
      { name: "Windy Girl Modern", search_term: "Zippo Windy Girl Modern" },
      { name: "Windy Girl Art", search_term: "Zippo Windy Girl Art" },
      { name: "Windy Girl Style", search_term: "Zippo Windy Girl Style" },
      { name: "Windy Girl Fashion", search_term: "Zippo Windy Girl Fashion" },
      { name: "Windy Girl Chic", search_term: "Zippo Windy Girl Chic" },
      { name: "Windy Girl Elegant", search_term: "Zippo Windy Girl Elegant" },
      { name: "Windy Girl Retro", search_term: "Zippo Windy Girl Retro" },
      { name: "Windy Girl Nostalgie", search_term: "Zippo Windy Girl Nostalgic" },
      { name: "Windy Girl Tradition", search_term: "Zippo Windy Girl Traditional" },
      { name: "Windy Girl Heritage", search_term: "Zippo Windy Girl Heritage" },
      { name: "Windy Girl Legacy", search_term: "Zippo Windy Girl Legacy" },
      { name: "Windy Girl Original", search_term: "Zippo Windy Girl Original" },
    ]
  },
  {
    name: "Landmarks & Animals & Jeans",
    description: "~20 Stück - Landmark-Serie, Jeans/Denim, Tiere",
    zippos: [
      { name: "Landmark Big Ben", search_term: "Zippo Landmark Big Ben" },
      { name: "Landmark Freiheitsstatue", search_term: "Zippo Landmark Statue of Liberty" },
      { name: "Landmark Eiffelturm", search_term: "Zippo Landmark Eiffel Tower" },
      { name: "Landmark Kolosseum", search_term: "Zippo Landmark Colosseum" },
      { name: "Jeans Denim 1", search_term: "Zippo Jeans Denim" },
      { name: "Jeans Denim 2", search_term: "Zippo Denim Style" },
      { name: "Jeans Denim 3", search_term: "Zippo Jeans Logo" },
      { name: "Jeans Denim 4", search_term: "Zippo Denim Edition" },
      { name: "Tier Zebra", search_term: "Zippo Zebra" },
      { name: "Tier Wolf", search_term: "Zippo Wolf" },
      { name: "Tier Bison", search_term: "Zippo Bison" },
      { name: "Tier Adler", search_term: "Zippo Eagle Animal" },
      { name: "Tier Löwe", search_term: "Zippo Lion" },
      { name: "Tier Husky", search_term: "Zippo Husky" },
      { name: "Tier Kobra", search_term: "Zippo Cobra" },
      { name: "Tier Leopard", search_term: "Zippo Leopard" },
      { name: "Tier Hirsch", search_term: "Zippo Deer" },
      { name: "Landmark Komplett", search_term: "Zippo Landmark Collection" },
      { name: "Jeans Komplett", search_term: "Zippo Jeans Collection" },
      { name: "Tiere Komplett", search_term: "Zippo Animals Collection" },
    ]
  },
  {
    name: "Native American Chiefs",
    description: "~20 Stück - Native American Chiefs, Tiere, Meerestiere",
    zippos: [
      { name: "Chief Silber 1", search_term: "Zippo Native American Chief Silver" },
      { name: "Chief Silber 2", search_term: "Zippo Indian Chief Silver" },
      { name: "Chief Silber 3", search_term: "Zippo Chief Silver" },
      { name: "Chief Silber 4", search_term: "Zippo Native Chief Silver" },
      { name: "Chief Silber 5", search_term: "Zippo American Chief Silver" },
      { name: "Chief Messing 1", search_term: "Zippo Native American Chief Brass" },
      { name: "Chief Messing 2", search_term: "Zippo Indian Chief Brass" },
      { name: "Chief Messing 3", search_term: "Zippo Chief Brass" },
      { name: "Chief Messing 4", search_term: "Zippo Native Chief Brass" },
      { name: "Chief Messing 5", search_term: "Zippo American Chief Brass" },
      { name: "Tier Adler", search_term: "Zippo Eagle Photo" },
      { name: "Tier Tiger", search_term: "Zippo Tiger Photo" },
      { name: "Tier Schneeleopard", search_term: "Zippo Snow Leopard" },
      { name: "Tier Wolf", search_term: "Zippo Wolf Photo" },
      { name: "Meer Orca", search_term: "Zippo Orca Blue" },
      { name: "Meer Delfin", search_term: "Zippo Dolphin" },
      { name: "Meer Hai", search_term: "Zippo Shark Blue" },
      { name: "Motorrad 1", search_term: "Zippo Motorcycle" },
      { name: "Motorrad 2", search_term: "Zippo Biker" },
      { name: "Motorrad 3", search_term: "Zippo Motorbike" },
    ]
  },
  {
    name: "West Zigaretten & Gold Jubiläum",
    description: "~20 Stück - West Tiger, West Adler, Gold Zippo Jubiläum",
    zippos: [
      { name: "West Tiger 1", search_term: "Zippo West Tiger" },
      { name: "West Tiger 2", search_term: "Zippo West Cat" },
      { name: "West Tiger 3", search_term: "Zippo West Raubkatze" },
      { name: "West Tiger 4", search_term: "Zippo West Löwe" },
      { name: "West Tiger 5", search_term: "Zippo West Leopard" },
      { name: "Gold Jubiläum 1996", search_term: "Zippo Gold Anniversary 1996" },
      { name: "Gold Stars", search_term: "Zippo Gold Stars" },
      { name: "Gold Jubiläum 1995", search_term: "Zippo Gold Anniversary 1995" },
      { name: "Gold Welcome 21st Century", search_term: "Zippo Gold Welcome 21st Century" },
      { name: "Gold Eagle 2000", search_term: "Zippo Gold Eagle 2000" },
      { name: "Gold 2001", search_term: "Zippo Gold 2001" },
      { name: "Gold Sunburst", search_term: "Zippo Gold Sunburst" },
      { name: "Gold 10 Years", search_term: "Zippo Gold 10 Years" },
      { name: "West Adler 1", search_term: "Zippo West Eagle Chrome" },
      { name: "West Adler 2", search_term: "Zippo West Eagle" },
      { name: "West Adler 3", search_term: "Zippo West Adler" },
      { name: "West Adler 4", search_term: "Zippo Eagle Chrome" },
      { name: "West Adler 5", search_term: "Zippo West Chrome" },
      { name: "West Komplett", search_term: "Zippo West Collection" },
      { name: "Gold Komplett", search_term: "Zippo Gold Collection" },
    ]
  },
];

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [results, setResults] = useState<any[]>([]);

  async function seedDatabase() {
    setIsLoading(true);
    setProgress('Starte Import...');
    setResults([]);

    const allResults = [];

    for (const collection of collections) {
      setProgress(`Erstelle Kollektion: ${collection.name}...`);
      
      try {
        // Create collection
        const colRes = await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: collection.name,
            description: collection.description,
          }),
        });

        if (!colRes.ok) {
          throw new Error('Failed to create collection');
        }

        const colData = await colRes.json();
        const collectionId = colData.id;

        // Create zippos
        let createdCount = 0;
        for (let i = 0; i < collection.zippos.length; i++) {
          const zippo = collection.zippos[i];
          try {
            await fetch('/api/zippos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                collection_id: collectionId,
                name: zippo.name,
                search_term: zippo.search_term,
                condition: 'new_unused_with_box',
                position: i + 1,
              }),
            });
            createdCount++;
          } catch (error) {
            console.error(`Failed to create ${zippo.name}:`, error);
          }
        }

        allResults.push({
          collection: collection.name,
          status: 'success',
          zipposCreated: createdCount,
          total: collection.zippos.length,
        });
      } catch (error: any) {
        allResults.push({
          collection: collection.name,
          status: 'error',
          error: error.message,
        });
      }
    }

    setResults(allResults);
    setProgress('Import abgeschlossen!');
    setIsLoading(false);
  }

  const totalZippos = collections.reduce((sum, c) => sum + c.zippos.length, 0);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Datenbank Import</h1>
      
      <p className="text-muted-foreground mb-6">
        Diese Funktion importiert alle {collections.length} Kollektionen mit insgesamt {totalZippos} Zippos 
        in die Datenbank. Dies kann einige Minuten dauern.
      </p>

      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Zu importierende Kollektionen:</h2>
        <ul className="text-sm text-muted-foreground space-y-1">
          {collections.map(c => (
            <li key={c.name}>{c.name} ({c.zippos.length} Zippos)</li>
          ))}
        </ul>
      </div>

      <button
        onClick={seedDatabase}
        disabled={isLoading}
        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? 'Import läuft...' : 'Jetzt importieren'}
      </button>

      {progress && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm">{progress}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold">Ergebnisse:</h3>
          {results.map((r, i) => (
            <div key={i} className={`p-3 rounded-lg text-sm ${r.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <strong>{r.collection}:</strong>{' '}
              {r.status === 'success' 
                ? `${r.zipposCreated} von ${r.total} Zippos erstellt`
                : `Fehler: ${r.error}`
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

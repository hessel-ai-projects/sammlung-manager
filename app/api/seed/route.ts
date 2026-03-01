import { createCollection } from "@/lib/collections";
import { createZippo } from "@/lib/zippos";
import { NextResponse } from "next/server";

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
      { name: "John Lennon Imagine Peace 1", search_term: "Zippo John Lennon Imagine Peace" },
      { name: "John Lennon Imagine Peace 2", search_term: "Zippo John Lennon Peace" },
      { name: "John Lennon Imagine Peace 3", search_term: "Zippo Lennon Imagine" },
      { name: "John Lennon Imagine Peace 4", search_term: "Zippo John Lennon" },
      { name: "Ägypten Pharao Gold 1", search_term: "Zippo Egypt Pharaoh Gold" },
      { name: "Ägypten Pharao Gold 2", search_term: "Zippo Egyptian Pharaoh" },
      { name: "Ägypten Pharao Gold 3", search_term: "Zippo Egypt Gold" },
      { name: "Ägypten Pharao Gold 4", search_term: "Zippo Pharaoh Relief" },
      { name: "Ägypten Pharao Gold 5", search_term: "Zippo Egypt Relief" },
      { name: "Ägypten Pharao Silber 1", search_term: "Zippo Egypt Pharaoh Silver" },
      { name: "Ägypten Pharao Silber 2", search_term: "Zippo Egyptian Silver" },
      { name: "Ägypten Pharao Silber 3", search_term: "Zippo Egypt Silver" },
      { name: "Ägypten Pharao Silber 4", search_term: "Zippo Pharaoh Silver" },
      { name: "Ägypten Pharao Silber 5", search_term: "Zippo Silver Egypt" },
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
  // Weitere Collections... (gekürzt für Übersicht)
];

export async function POST() {
  const results = [];
  
  for (const collection of collections) {
    try {
      const createdCollection = await createCollection({
        name: collection.name,
        description: collection.description,
      });

      const zippoResults = [];
      for (let i = 0; i < collection.zippos.length; i++) {
        const zippo = collection.zippos[i];
        try {
          await createZippo({
            collection_id: createdCollection.id,
            name: zippo.name,
            search_term: zippo.search_term,
            condition: 'new_unused_with_box',
            position: i + 1,
          });
          zippoResults.push({ name: zippo.name, status: 'created' });
        } catch (error: any) {
          zippoResults.push({ name: zippo.name, status: 'error', error: error.message });
        }
      }

      results.push({
        collection: collection.name,
        status: 'success',
        zipposCreated: zippoResults.filter(z => z.status === 'created').length,
        errors: zippoResults.filter(z => z.status === 'error').length,
      });
    } catch (error: any) {
      results.push({
        collection: collection.name,
        status: 'error',
        error: error.message,
      });
    }
  }

  return NextResponse.json({
    message: 'Seeding complete',
    results,
    totalCollections: results.length,
    totalZippos: results.reduce((sum, r) => sum + (r.zipposCreated || 0), 0),
  });
}

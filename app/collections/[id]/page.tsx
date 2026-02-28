import { getCollectionById } from "@/lib/collections";
import { getZipposByCollection } from "@/lib/zippos";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UpdatePricesButton } from "./update-prices-button";
import { DeleteZippoButton } from "./delete-zippo-button";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = await getCollectionById(Number(id));
  if (!collection) notFound();

  const zippos = await getZipposByCollection(Number(id));
  const totalValue = zippos.reduce((sum, z) => sum + (z.avg_price || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Zurück</Link>
      </div>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          <p className="text-muted-foreground mt-1">{collection.description}</p>
          <p className="mt-2 text-lg font-medium">
            Wert: {totalValue > 0 ? `€ ${totalValue.toLocaleString("de-DE", { minimumFractionDigits: 2 })}` : "—"}
            <span className="text-sm text-muted-foreground ml-2">({zippos.length} Zippos)</span>
          </p>
        </div>
        <div className="flex gap-2">
          <UpdatePricesButton collectionId={Number(id)} />
          <Link href={`/collections/${id}/zippos/new`} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            + Zippo
          </Link>
        </div>
      </div>

      {zippos.length === 0 ? (
        <p className="text-muted-foreground">Noch keine Zippos in dieser Kollektion.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {zippos.map((z) => (
            <div key={z.id} className="group relative rounded-xl border border-border bg-card p-3">
              {z.photo_url && (
                <div className="mb-2 aspect-square overflow-hidden rounded-lg bg-muted">
                  <img src={z.photo_url} alt={z.name} className="h-full w-full object-cover" />
                </div>
              )}
              <h3 className="text-sm font-medium">{z.name}</h3>
              {z.search_term && <p className="text-xs text-muted-foreground truncate">{z.search_term}</p>}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {z.avg_price ? `€ ${z.avg_price.toLocaleString("de-DE", { minimumFractionDigits: 2 })}` : "—"}
                </span>
                {z.num_sold && z.num_sold > 0 && (
                  <span className="text-xs text-muted-foreground">{z.num_sold} verkauft</span>
                )}
              </div>
              {z.min_price && z.max_price && (
                <p className="text-xs text-muted-foreground">
                  € {z.min_price.toLocaleString("de-DE")} – € {z.max_price.toLocaleString("de-DE")}
                </p>
              )}
              <div className="mt-2 flex gap-1">
                <Link href={`/collections/${id}/zippos/${z.id}/edit`} className="text-xs text-muted-foreground hover:text-foreground">
                  Bearbeiten
                </Link>
                <span className="text-muted-foreground">·</span>
                <DeleteZippoButton zippoId={z.id} collectionId={Number(id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

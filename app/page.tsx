import { getAllCollections } from "@/lib/collections";
import { getTotalValue, getTotalValueHistory } from "@/lib/prices";
import { getPriceHistory } from "@/lib/prices";
import Link from "next/link";
import { TotalValueChart } from "@/components/charts/PriceHistoryChart";
import UpdatePricesButton from "@/components/update-prices-button";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const collections = await getAllCollections();
  const totalValue = await getTotalValue();
  const valueHistory = await getTotalValueHistory();

  // Get last update time from any zippo
  const lastUpdated = collections.length > 0 
    ? collections.reduce((latest, c) => {
        // In a real app, we'd get this from the database
        return latest;
      }, '')
    : null;

  return (
    <div>
      <div className="mb-8 rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground mb-1">Gesamtwert deiner Sammlung</p>
        <p className="text-5xl font-bold">
          {totalValue > 0 ? `€ ${totalValue.toLocaleString("de-DE", { minimumFractionDigits: 2 })}` : "— noch keine Preise —"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {collections.reduce((sum, c) => sum + c.zippo_count, 0)} Zippos in {collections.length} Kollektionen
        </p>
      </div>

      {/* Wertverlauf Chart */}
      {valueHistory.length > 1 && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Wertverlauf (12 Monate)</h2>
          <TotalValueChart data={valueHistory} />
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Kollektionen</h2>
        <div className="flex items-center gap-3">
          <UpdatePricesButton />
          <Link href="/collections/new" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            + Kollektion
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {collections.map((c) => (
          <Link key={c.id} href={`/collections/${c.id}`} className="group rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors">
            {c.photo_url && (
              <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-muted">
                <img src={c.photo_url} alt={c.name} className="h-full w-full object-cover" />
              </div>
            )}
            <h3 className="font-semibold group-hover:text-primary">{c.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{c.description}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{c.zippo_count} Zippos</span>
              <span className="font-medium">
                {c.total_value > 0 ? `€ ${c.total_value.toLocaleString("de-DE", { minimumFractionDigits: 2 })}` : "—"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { getCollectionById } from "@/lib/collections";
import { getZippoById, updateZippo } from "@/lib/zippos";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditZippoPage({ params }: { params: Promise<{ id: string; zippoId: string }> }) {
  const { id, zippoId } = await params;
  const collection = await getCollectionById(Number(id));
  const zippo = await getZippoById(Number(zippoId));
  if (!collection || !zippo) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateZippo(Number(zippoId), {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      search_term: (formData.get("search_term") as string) || undefined,
      purchase_price: formData.get("purchase_price") ? Number(formData.get("purchase_price")) : undefined,
      bottom_stamp: (formData.get("bottom_stamp") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    });
    redirect(`/collections/${id}`);
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link href={`/collections/${id}`} className="text-sm text-muted-foreground hover:text-foreground">← Zurück</Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">Zippo bearbeiten – {zippo.name}</h1>
      <form action={handleUpdate} className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Name *</label><input name="name" required defaultValue={zippo.name} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">Beschreibung</label><textarea name="description" rows={2} defaultValue={zippo.description || ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">eBay Suchbegriff</label><input name="search_term" defaultValue={zippo.search_term || ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Kaufpreis (€)</label><input name="purchase_price" type="number" step="0.01" defaultValue={zippo.purchase_price || ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Bottom Stamp</label><input name="bottom_stamp" defaultValue={zippo.bottom_stamp || ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Notizen</label><textarea name="notes" rows={2} defaultValue={zippo.notes || ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        <button type="submit" className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Speichern</button>
      </form>
    </div>
  );
}

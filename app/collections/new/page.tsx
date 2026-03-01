import { createCollection } from "@/lib/collections";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NewCollectionPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    const c = await createCollection({
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      search_term: (formData.get("search_term") as string) || undefined,
    });
    redirect(`/collections/${c.id}`);
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Zurück</Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">Neue Kollektion</h1>
      <form action={handleCreate} className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Name *</label><input name="name" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">Beschreibung</label><textarea name="description" rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">eBay Suchbegriff</label><input name="search_term" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
        <button type="submit" className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Erstellen</button>
      </form>
    </div>
  );
}

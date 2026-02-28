"use client";

import { useRouter } from "next/navigation";

export function DeleteZippoButton({ zippoId, collectionId }: { zippoId: number; collectionId: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Zippo wirklich löschen?")) return;
    await fetch(`/api/zippos/${zippoId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-xs text-destructive hover:text-destructive/80">
      Löschen
    </button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UpdatePricesButton({ collectionId }: { collectionId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(`/api/collections/${collectionId}/update-prices`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch (e) {
      alert("Preise konnten nicht aktualisiert werden");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
    >
      {loading ? "Lädt..." : "🔄 Preise aktualisieren"}
    </button>
  );
}

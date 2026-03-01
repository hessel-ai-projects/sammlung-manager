'use client';

import { useState } from 'react';

export default function UpdatePricesButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ updated: number; errors: number } | null>(null);

  const handleUpdate = async () => {
    if (!confirm('Preise für alle Zippos aktualisieren? Das kann einige Minuten dauern.')) {
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/update-prices', {
        method: 'POST',
      });

      const data = await res.json();

      if (data.success) {
        setResult({ updated: data.updated, errors: data.errors });
        alert(`Preise aktualisiert: ${data.updated} Zippos, ${data.errors} Fehler`);
        window.location.reload();
      } else {
        alert('Fehler: ' + data.error);
      }
    } catch (error) {
      alert('Fehler beim Aktualisieren');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleUpdate}
        disabled={isLoading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? 'Aktualisiere...' : 'Preise aktualisieren'}
      </button>
      
      {result && (
        <span className="text-sm text-muted-foreground">
          {result.updated} aktualisiert
          {result.errors > 0 && `, ${result.errors} Fehler`}
        </span>
      )}
    </div>
  );
}

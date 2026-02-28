'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PriceHistoryChartProps {
  data: {
    recorded_at: string;
    total_value: number;
  }[];
}

export function TotalValueChart({ data }: PriceHistoryChartProps) {
  // Format data for chart - take last 12 months
  const chartData = data
    .slice(-365) // Last year
    .map((d) => ({
      date: new Date(d.recorded_at).toLocaleDateString('de-DE', {
        month: 'short',
        year: '2-digit',
      }),
      value: d.total_value,
    }));

  // Aggregate by month if too many data points
  const aggregatedData = aggregateByMonth(chartData);

  if (aggregatedData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        Noch keine Preis-Historie verfügbar
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={aggregatedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          stroke="#9CA3AF" 
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#F9FAFB' }}
          formatter={(value) => [
            `€ ${Number(value).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
            'Gesamtwert'
          ]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#EF4444"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ZippoPriceChartProps {
  data: {
    recorded_at: string;
    avg_price: number;
    min_price: number;
    max_price: number;
  }[];
}

export function ZippoPriceChart({ data }: ZippoPriceChartProps) {
  const chartData = data.map((d) => ({
    date: new Date(d.recorded_at).toLocaleDateString('de-DE', {
      month: 'short',
      day: 'numeric',
    }),
    avg: d.avg_price,
    min: d.min_price,
    max: d.max_price,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        Noch keine Preis-Historie verfügbar
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF" 
          tick={{ fontSize: 10 }}
          tickLine={false}
        />
        <YAxis 
          stroke="#9CA3AF" 
          tick={{ fontSize: 10 }}
          tickLine={false}
          tickFormatter={(value) => `€${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#F9FAFB' }}
          formatter={(value) => [`€ ${Number(value).toFixed(2)}`, '']}
        />
        <Line
          type="monotone"
          dataKey="avg"
          stroke="#EF4444"
          strokeWidth={2}
          dot={false}
          name="Durchschnitt"
        />
        <Line
          type="monotone"
          dataKey="min"
          stroke="#6B7280"
          strokeWidth={1}
          strokeDasharray="3 3"
          dot={false}
          name="Min"
        />
        <Line
          type="monotone"
          dataKey="max"
          stroke="#6B7280"
          strokeWidth={1}
          strokeDasharray="3 3"
          dot={false}
          name="Max"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Helper to aggregate data by month
function aggregateByMonth(data: { date: string; value: number }[]) {
  if (data.length <= 12) return data;

  const byMonth: Record<string, number[]> = {};
  
  data.forEach((d) => {
    const monthKey = d.date.slice(0, 4); // "Mär 26" -> "Mär"
    if (!byMonth[monthKey]) {
      byMonth[monthKey] = [];
    }
    byMonth[monthKey].push(d.value);
  });

  return Object.entries(byMonth).map(([date, values]) => ({
    date,
    value: values.reduce((a, b) => a + b, 0) / values.length,
  }));
}

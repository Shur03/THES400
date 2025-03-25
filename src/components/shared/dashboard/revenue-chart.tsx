"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function RevenueChart({
  revenue,
}: {
  revenue: { month: string; revenue: number }[];
}) {
  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart data={revenue}>
        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={true} />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={true}
          tickFormatter={(value: number) => `$${value}`}
        />
        <Bar
          dataKey="revenue"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

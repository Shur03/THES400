"use client";
import { Line } from "react-chartjs-2";
import React from "react";
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler
);

interface StockChartProps {
  trend?: "up" | "down" | "neutral";
}

export default function StockChart({ trend = "neutral" }: StockChartProps) {
  // Generate different data based on trend
  const generateData = () => {
    const base = Math.floor(Math.random() * 20) + 5;
    if (trend === "up") {
      return Array(7)
        .fill(0)
        .map((_, i) => base + i * (Math.random() * 3 + 1));
    } else if (trend === "down") {
      return Array(7)
        .fill(0)
        .map((_, i) => base - i * (Math.random() * 3 + 1));
    }
    return Array(7)
      .fill(0)
      .map(() => base + (Math.random() * 10 - 5));
  };

  const lineColor =
    trend === "up"
      ? "rgba(16, 185, 129, 0.8)"
      : trend === "down"
      ? "rgba(239, 68, 68, 0.8)"
      : "rgba(156, 163, 175, 0.8)";

  return (
    <Line
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false,
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
          },
          y: {
            display: false,
            grid: {
              display: false,
            },
          },
        },
        elements: {
          line: {
            borderWidth: 2,
            tension: 0.4,
            fill: {
              target: "origin",
              above:
                trend === "up"
                  ? "rgba(16, 185, 129, 0.05)"
                  : trend === "down"
                  ? "rgba(239, 68, 68, 0.05)"
                  : "rgba(156, 163, 175, 0.05)",
            },
          },
          point: {
            radius: 0,
            hoverRadius: 0,
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      }}
      data={{
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Trend",
            backgroundColor: "transparent",
            borderColor: lineColor,
            borderCapStyle: "round",
            data: generateData(),
          },
        ],
      }}
    />
  );
}

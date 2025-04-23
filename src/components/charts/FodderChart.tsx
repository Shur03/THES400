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
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
  Legend
);

interface FodderChartProps {
  height?: string;
  firstDatasetLabel?: string;
  secondDatasetLabel?: string;
  firstDatasetData?: number[];
  secondDatasetData?: number[];
}

export default function FodderChart({
  height = "120px",
  firstDatasetLabel = "Өвс",
  secondDatasetLabel = "Тэжээл",
  firstDatasetData,
  secondDatasetData,
}: FodderChartProps) {
  // Generate data if not provided
  const generateData = (base: number, variation: number) => {
    return Array(7)
      .fill(0)
      .map(
        (_, i) =>
          Math.round(
            Math.max(
              5,
              base + (Math.random() * variation * 2 - variation) + i * 0.5
            ) * 10
          ) / 10
      );
  };

  const supplyData = firstDatasetData || generateData(20, 5);
  const demandData = secondDatasetData || generateData(15, 7);

  return (
    <div style={{ height }}>
      <Line
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12,
                },
              },
            },
            tooltip: {
              enabled: true,
              mode: "index",
              intersect: false,
              callbacks: {
                label: (context) => {
                  return `${context.dataset.label}: ${context.parsed.y} tons`;
                },
              },
              displayColors: true,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              titleFont: {
                size: 12,
              },
              bodyFont: {
                size: 12,
              },
              padding: 8,
            },
          },
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
                // drawBorder: false,
              },
              ticks: {
                display: true,
                color: "#6B7280",
                font: {
                  size: 10,
                },
              },
            },
            y: {
              min: 0,
              suggestedMax: Math.max(...supplyData, ...demandData) * 1.2,
              grid: {
                display: true,
                color: "rgba(209, 213, 219, 0.3)",
                // drawBorder: false,
              },
              ticks: {
                display: true,
                color: "#6B7280",
                font: {
                  size: 10,
                },
                callback: (value) => `${value} t`,
              },
            },
          },
          elements: {
            line: {
              borderWidth: 2,
              tension: 0.3,
            },
            point: {
              radius: 0,
              hoverRadius: 5,
              hoverBorderWidth: 2,
            },
          },
          interaction: {
            intersect: false,
            mode: "nearest",
          },
        }}
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: firstDatasetLabel,
              backgroundColor: "rgba(74, 222, 128, 0.1)",
              borderColor: "rgba(74, 222, 128, 0.8)",
              borderCapStyle: "round",
              borderJoinStyle: "round",
              data: supplyData,
              fill: {
                target: "origin",
                above: "rgba(74, 222, 128, 0.05)",
              },
            },
            {
              label: secondDatasetLabel,
              backgroundColor: "rgba(248, 113, 113, 0.1)",
              borderColor: "rgba(248, 113, 113, 0.8)",
              borderCapStyle: "round",
              borderJoinStyle: "round",
              data: demandData,
              fill: {
                target: "origin",
                above: "rgba(248, 113, 113, 0.05)",
              },
            },
          ],
        }}
      />
    </div>
  );
}

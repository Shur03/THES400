"use client";

import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale
);

type StockData = {
  id: number;
  stock_type: string;
  counts: number;
  date: string;
  event_type: "inc" | "dec";
};

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    tension?: number;
  }[];
};

export default function EventChart() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/livestock/trends");
        const data: StockData[] = await response.json();

        // Filter data by selected stock type if not "all"
        const filteredData =
          selectedStock === "all"
            ? data
            : data.filter((item) => item.stock_type === selectedStock);

        // Group data by date and calculate net change
        const dateMap = new Map<string, number>();

        filteredData.forEach((item) => {
          const change = item.event_type === "inc" ? item.counts : -item.counts;
          const current = dateMap.get(item.date) || 0;
          dateMap.set(item.date, current + change);
        });

        // Sort dates chronologically
        const sortedDates = Array.from(dateMap.keys()).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        // Calculate cumulative counts
        let cumulativeCount = 0;
        const cumulativeData = sortedDates.map((date) => {
          cumulativeCount += dateMap.get(date) || 0;
          return cumulativeCount;
        });

        const colors = {
          bar: {
            inc: "rgba(75, 192, 192, 0.6)",
            dec: "rgba(255, 99, 132, 0.6)",
            net: "rgba(54, 162, 235, 0.6)",
          },
          line: {
            trend: "rgba(153, 102, 255, 0.6)",
          },
        };

        setChartData({
          labels: sortedDates,
          datasets: [
            {
              label: chartType === "bar" ? "Нийт өөрчлөлт" : "Хувьсал",
              data: cumulativeData,
              backgroundColor:
                chartType === "bar" ? colors.bar.net : colors.line.trend,
              borderColor:
                chartType === "bar"
                  ? colors.bar.net.replace("0.6", "1")
                  : colors.line.trend.replace("0.6", "1"),
              borderWidth: 2,
              tension: chartType === "line" ? 0.4 : undefined,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching livestock data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chartType, timeRange, selectedStock]);

  if (loading)
    return <div className="text-center py-8">Өгөгдөл ачаалж байна...</div>;
  if (!chartData)
    return <div className="text-center py-8">Өгөгдөл олдсонгүй</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Малын тооны өөрчлөлтийн график
        </h2>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white text-sm"
          >
            <option value="all">Бүх төрөл</option>
            <option value="sheep">Хонь</option>
            <option value="goat">Ямаа</option>
            <option value="cow">Үхэр</option>
            <option value="horse">Адуу</option>
            <option value="camel">Тэмээ</option>
          </select>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
            {["week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === range
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {range === "week"
                  ? "7 хоног"
                  : range === "month"
                  ? "Сар"
                  : "Жил"}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-1 text-sm rounded ${
                chartType === "bar"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              Баар
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1 text-sm rounded ${
                chartType === "line"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              Шугаман
            </button>
          </div>
        </div>
      </div>

      <div className="h-96 w-full">
        {chartType === "bar" ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false,
                  title: {
                    display: true,
                    text: "Тоо толгой",
                    font: {
                      weight: "bold",
                    },
                  },
                  grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Огноо",
                    font: {
                      weight: "bold",
                    },
                  },
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.dataset.label || "";
                      const value = context.raw as number;
                      return `${label}: ${value} толгой`;
                    },
                  },
                },
                legend: {
                  position: "top",
                  labels: {
                    boxWidth: 12,
                    padding: 20,
                    font: {
                      size: 12,
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false,
                  title: {
                    display: true,
                    text: "Тоо толгой",
                    font: {
                      weight: "bold",
                    },
                  },
                  grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                  },
                },
                x: {
                  type: "time",
                  time: {
                    unit:
                      timeRange === "week"
                        ? "day"
                        : timeRange === "month"
                        ? "week"
                        : "month",
                    displayFormats: {
                      day: "MMM d",
                      week: "MMM d",
                      month: "MMM yyyy",
                    },
                  },
                  title: {
                    display: true,
                    text: "Огноо",
                    font: {
                      weight: "bold",
                    },
                  },
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.dataset.label || "";
                      const value = context.raw as number;
                      return `${label}: ${value} толгой`;
                    },
                    title: (items) => {
                      const date = new Date(items[0].label);
                      return date.toLocaleDateString("mn-MN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    },
                  },
                },
                legend: {
                  position: "top",
                  labels: {
                    boxWidth: 12,
                    padding: 20,
                    font: {
                      size: 12,
                    },
                  },
                },
              },
            }}
          />
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Сүүлийн шинэчлэлт: {new Date().toLocaleDateString("mn-MN")}</p>
      </div>
    </div>
  );
}

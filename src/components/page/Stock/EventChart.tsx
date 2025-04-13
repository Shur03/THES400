"use client";

import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
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
  ArcElement,
} from "chart.js";

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
  ArcElement
);

type EventData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
};

export default function EventChart() {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        const groupedData: Record<string, { inc: number; dec: number }> = {};

        data.forEach((event: any) => {
          if (!groupedData[event.stock.name]) {
            groupedData[event.stock.name] = { inc: 0, dec: 0 };
          }
          if (event.event_type === "inc") {
            groupedData[event.stock.name].inc += event.counts;
          } else {
            groupedData[event.stock.name].dec += event.counts;
          }
        });

        const labels = Object.keys(groupedData);
        const incData = labels.map((label) => groupedData[label].inc);
        const decData = labels.map((label) => groupedData[label].dec);

        const backgroundColors = [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ];

        setEventData({
          labels,
          datasets: [
            {
              label: "Нэмэгдсэн",
              data: incData,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map((color) =>
                color.replace("0.6", "1")
              ),
              borderWidth: 1,
            },
            {
              label: "Хорогдсон",
              data: decData,
              backgroundColor: backgroundColors.map((color) =>
                color.replace("0.6", "0.4")
              ),
              borderColor: backgroundColors.map((color) =>
                color.replace("0.6", "1")
              ),
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Тооцоолж байна...</div>;
  if (!eventData) return <div>Өгөгдөл олдсонгүй</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Малын тооны өөрчлөлт</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 rounded ${
              chartType === "bar" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Баар
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1 rounded ${
              chartType === "line" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Шугаман
          </button>
        </div>
      </div>

      <div className="h-96">
        {chartType === "bar" && (
          <Bar
            data={eventData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Тоо толгой",
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Малын төрөл",
                  },
                },
              },
            }}
          />
        )}

        {chartType === "line" && (
          <Line
            data={eventData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Тоо толгой",
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Малын төрөл",
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

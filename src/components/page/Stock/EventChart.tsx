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

type AnimalType = "sheep" | "goat" | "cow" | "horse" | "camel";

export default function EventChart() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line">("line");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<AnimalType | "all">("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = "/api/event/trend";
        if (selectedStock !== "all") {
          url += `?type=${selectedStock}`;
        }

        const response = await fetch(url);
        const data: StockData[] = await response.json();

        // Process data to get cumulative counts by date
        const dateMap = new Map<string, number>();
        let cumulativeCount = 0;

        // Sort by date ascending
        const sortedData = [...data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const labels: string[] = [];
        const counts: number[] = [];

        sortedData.forEach((item) => {
          const change = item.event_type === "inc" ? item.counts : -item.counts;
          cumulativeCount += change;

          // Format date based on time range
          const date = new Date(item.date);
          let formattedDate = date.toLocaleDateString("mn-MN", {
            day: "numeric",
            month: "short",
          });

          if (timeRange === "year") {
            formattedDate = date.toLocaleDateString("mn-MN", {
              month: "short",
              year: "numeric",
            });
          } else if (timeRange === "week") {
            formattedDate = date.toLocaleDateString("mn-MN", {
              weekday: "short",
              day: "numeric",
            });
          }

          labels.push(formattedDate);
          counts.push(cumulativeCount);
        });

        const colors = {
          all: {
            bg: "rgba(54, 162, 235, 0.6)",
            border: "rgba(54, 162, 235, 1)",
          },
          sheep: {
            bg: "rgba(75, 192, 192, 0.6)",
            border: "rgba(75, 192, 192, 1)",
          },
          goat: {
            bg: "rgba(255, 159, 64, 0.6)",
            border: "rgba(255, 159, 64, 1)",
          },
          cow: {
            bg: "rgba(153, 102, 255, 0.6)",
            border: "rgba(153, 102, 255, 1)",
          },
          horse: {
            bg: "rgba(255, 99, 132, 0.6)",
            border: "rgba(255, 99, 132, 1)",
          },
          camel: {
            bg: "rgba(255, 206, 86, 0.6)",
            border: "rgba(255, 206, 86, 1)",
          },
        };

        const selectedColor =
          selectedStock === "all" ? colors.all : colors[selectedStock];

        setChartData({
          labels,
          datasets: [
            {
              label:
                selectedStock === "all"
                  ? "Нийт малын тоо"
                  : `${getAnimalName(selectedStock)}-н тоо`,
              data: counts,
              backgroundColor: selectedColor.bg,
              borderColor: selectedColor.border,
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

  const getAnimalName = (type: AnimalType | "all"): string => {
    switch (type) {
      case "sheep":
        return "Хонь";
      case "goat":
        return "Ямаа";
      case "cow":
        return "Үхэр";
      case "horse":
        return "Адуу";
      case "camel":
        return "Тэмээ";
      default:
        return "Бүх төрөл";
    }
  };

  if (loading)
    return (
      <div className="text-center text-green-300 py-8">
        Өгөгдөл ачаалж байна...
      </div>
    );
  if (!chartData)
    return (
      <div className="text-center text-green-300 py-8">
        График харуулахад алдаа гарлаа
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Малын тооны өөрчлөлтийн график
        </h2>

        <div className="flex flex-wrap gap-3">
          <select
            value={selectedStock}
            onChange={(e) =>
              setSelectedStock(e.target.value as AnimalType | "all")
            }
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
                onClick={() => setTimeRange(range as "week" | "month" | "year")}
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
        )}
      </div>
    </div>
  );
}

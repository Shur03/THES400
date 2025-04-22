"use client";
import { Trash, Plus, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

class Item {
  name: string;
  count: number;
  price: number;
  constructor(name = "", price = 0, count = 0) {
    this.name = name;
    this.price = price;
    this.count = count;
  }
}

const stockLabels: Record<string, string> = {
  sheepPrice: "Хонь",
  goatPrice: "Ямаа",
  horsePrice: "Адуу",
  cattlePrice: "Үхэр",
  camelPrice: "Тэмээ",
  yakPrice: "Сарлаг",
};

export default function Calculator() {
  const [items, setItems] = useState<Item[]>([]);
  const [needAmount, setNeedAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const router = useRouter();
  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );

  const difference =
    needAmount !== "" ? parseFloat(needAmount) - totalAmount : 0;

  const addItem = () => {
    setItems([...items, new Item()]);
  };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const newItems = [...items];
    if (field === "name") {
      newItems[index][field] = value;
    } else {
      newItems[index][field] = parseFloat(value) || 0;
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const fetchPriceFromApi = async () => {
    if (selectedTypes.length === 0) {
      setError("Ядаж нэг төрөл сонгоно уу");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/get-price");
      if (!res.ok) throw new Error("Failed to fetch price");

      const data = await res.json();
      const newItems: Item[] = [];

      for (const [stock, priceString] of Object.entries(data)) {
        if (!selectedTypes.includes(stock)) continue;

        const label = stockLabels[stock] || stock;
        const numericPrice = parseInt(
          (priceString as string).split("-")[1].replace(/[^\d]/g, "")
        );
        if (isNaN(numericPrice)) {
          console.warn(`${label} үнэ буруу байна:`, priceString);
          continue;
        }
        newItems.push(new Item(label, numericPrice, 1));
      }

      if (newItems.length === 0) {
        setError("Сонгогдсон төрлүүдийн үнэ олдсонгүй");
        return;
      }

      setItems([...items, ...newItems]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Failed to fetch price:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
          Малын үнийн тооцоолуур
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Amount Input Section */}
          <div className="mb-6">
            <label
              htmlFor="amount"
              className="block text-sm lg:text-lg font-medium text-gray-700 mb-2"
            >
              Шаардлагатай үнийн дүн
            </label>
            <div className="flex flex-row gap-4">
              <input
                className="flex-1 h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                id="amount"
                value={needAmount}
                onChange={(e) => setNeedAmount(e.target.value)}
                placeholder="Дүнгээ оруулна уу"
              />
              <button
                className={`flex items-center justify-center gap-2 h-12 px-6 rounded-lg text-white ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } transition-colors font-medium min-w-fit ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                onClick={fetchPriceFromApi}
                disabled={isLoading}
              >
                <Download size={18} />
                <span className="hidden md:inline">
                  {isLoading ? "Татаж байна..." : "Үнэ татах"}
                </span>
              </button>
            </div>
          </div>

          {/* Animal Type Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Малын төрөл
            </p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stockLabels).map(([key, label]) => (
                <label
                  key={key}
                  className={`flex items-center px-4 py-2 rounded-full border ${
                    selectedTypes.includes(key)
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "bg-gray-50? border-gray-300 text-gray-700 hover:bg-gray-100"
                  } cursor-pointer transition-colors`}
                >
                  <input
                    type="checkbox"
                    value={key}
                    checked={selectedTypes.includes(key)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setSelectedTypes((prev) =>
                        checked
                          ? [...prev, value]
                          : prev.filter((v) => v !== value)
                      );
                    }}
                    className="hidden"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Items Table */}
            <div className="flex-1">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Төрөл
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Үнэ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Тоо
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Устгах
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-gray-900 divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(index, "name", e.target.value)
                            }
                            placeholder="Төрөл"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={item.price || ""}
                            onChange={(e) =>
                              updateItem(index, "price", e.target.value)
                            }
                            placeholder="Үнэ"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={item.count || ""}
                            onChange={(e) =>
                              updateItem(index, "count", e.target.value)
                            }
                            placeholder="Тоо"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <button
                            onClick={() => removeItem(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                className="w-full text-gray-900 bg-gray-200 rounded-lg py-2 text-sm lg:text-lg"
                onClick={addItem}
              >
                + Борлуулах төрөл нэмэх
              </button>
            </div>

            {/* Summary Cards */}
            <div className="w-full lg:w-80 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Нийт үнэ
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {totalAmount.toLocaleString()}₮
                </p>
                <div
                  className={`mt-3 text-sm font-medium ${
                    difference < 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {difference > 0 ? (
                    <span>{difference.toLocaleString()}₮ дутуу</span>
                  ) : (
                    <span>Үнийн дүнд хүрсэн</span>
                  )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Шаардлагатай дүн
                </h2>
                <p className="text-3xl font-bold text-gray-900">
                  {parseFloat(needAmount) > 0
                    ? `${parseFloat(needAmount).toLocaleString()}₮`
                    : "0₮"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

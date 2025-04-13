"use client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "react-bootstrap";

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

export default function Calculator() {
  const [items, setItems] = useState<Item[]>([]);
  const [needAmount, setNeedAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/get-price");
      if (!res.ok) throw new Error("Failed to fetch price");
      const data = await res.json();

      if (!data.sheepPrice) throw new Error("No sheep price found in response");

      //
      const numericPrice = parseInt(
        data.sheepPrice.split("-")[0].replace(/[^\d]/g, "")
      );
      if (isNaN(numericPrice)) throw new Error("Invalid price format");

      setItems([...items, new Item("Эр хонь", numericPrice, 1)]);

      // alert хийж харах (түр)
      alert(`Хонины үнэ: ${data.sheepPrice}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Failed to fetch price:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen text-gray-800">
      <div className="flex-1 p-8">
        <h1 className="text-xl lg:text-2xl text-center font-bold mb-4">
          Тооцоолуур
        </h1>

        <div className="flex flex-col lg:flex-row gap-4 items-end mb-6">
          <input
            className="w-full lg:w-2/3 h-10 bg-gray-200 text-sm lg:text-lg text-gray-700 px-5 pr-5 rounded-lg"
            type="number"
            id="amount"
            value={needAmount}
            onChange={(e) => setNeedAmount(e.target.value)}
            placeholder="Шаардлагатай үнийн дүнгээ оруулна уу"
          />
          <div className="1/3 lg:w-auto text-end">
            <Button
              className={`text-white content-end bg-green-400 rounded-lg p-2 w-full lg:w-auto ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={fetchPriceFromApi}
              disabled={isLoading}
            >
              {isLoading ? "Татаж байна..." : "Үнийн мэдээлэл татах"}
            </Button>
          </div>
        </div>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="p-4 border-4 border-blue-300 rounded-lg w-full lg:w-2/3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b py-2 gap-5"
              >
                <input
                  type="text"
                  className="w-full lg:w-2/3 h-8 text-center border rounded bg-gray-200"
                  placeholder="Эр хонь"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                />
                <input
                  type="number"
                  className="w-full lg:w-2/3 h-8 text-center border rounded bg-gray-200"
                  placeholder="200000"
                  value={item.price || ""}
                  onChange={(e) => updateItem(index, "price", e.target.value)}
                />
                <input
                  type="number"
                  className="w-full lg:w-2/3 h-8 text-center border rounded bg-gray-200"
                  placeholder="0"
                  value={item.count || ""}
                  onChange={(e) => updateItem(index, "count", e.target.value)}
                />
                <Button
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => removeItem(index)}
                >
                  <Trash />
                </Button>
              </div>
            ))}

            <div className="flex flex-col gap-2 mt-4">
              <button
                className="w-full text-gray-900 bg-gray-200 rounded-lg py-2 text-sm lg:text-lg"
                onClick={addItem}
              >
                + Борлуулах төрөл нэмэх
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
            <div className="p-4 border-4 border-blue-300 rounded-lg text-lg">
              <h1 className="font-bold text-gray-800 text-lg">Нийт үнэ</h1>
              <p className="text-2xl text-gray-800">
                {totalAmount.toLocaleString()}
              </p>
              <p
                className={
                  difference < 0
                    ? "text-green-500 text-end text-sm"
                    : "text-red-500 text-end text-sm"
                }
              >
                {difference > 0
                  ? `${difference.toLocaleString()} (Дутуу)`
                  : `(Үнийн дүнд хүрсэн)`}
              </p>
            </div>

            <div className="p-4 border-4 border-blue-300 rounded-lg text-lg mt-4">
              <h1 className="font-bold">Шаардлагатай</h1>
              <p className="text-2xl">
                {parseFloat(needAmount) > 0
                  ? `${parseFloat(needAmount).toLocaleString()}`
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

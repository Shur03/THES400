"use client";
import { Trash } from "lucide-react";
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

export default function Calculator() {
  const [items, setItems] = useState<Item[]>([]);
  const [needAmount, setNeedAmount] = useState("");

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

  return (
    <div className="flex flex-col lg:flex-row h-screen text-gray-800">
      <div className="flex-1 p-8">
        <h1 className="text-xl lg:text-2xl text-center font-bold mb-4">
          Тооцоолуур
        </h1>

        {/* Шаардлагатай байгаа мөнгөн дүнгээ оруулна */}
        <input
          className="w-full lg:w-2/3 h-10 bg-gray-200 text-sm lg:text-lg text-gray-700 px-5 pr-5 rounded-lg mb-6"
          type="number"
          id="amount"
          value={needAmount}
          onChange={(e) => setNeedAmount(e.target.value)}
          placeholder="Шаардлагатай үнийн дүнгээ оруулна уу"
        />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items Section */}
          <div className="p-4 border-4 border-blue-300 rounded-lg w-full lg:w-2/3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b py-2 gap-5"
              >
                <input
                  type="text"
                  id="name"
                  className="w-full lg:w-2/3 h-8 text-center border rounded bg-gray-200"
                  placeholder="Эр хонь"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                />
                <input
                  type="number"
                  className="w-full lg:w-2/3 h-8 text-center border rounded bg-gray-200"
                  placeholder="200000"
                  value={item.price}
                  onChange={(e) => updateItem(index, "price", e.target.value)}
                />
                <input
                  type="number"
                  className="w-full lg:w-2/3 h-8 text-center border rounded bg-gray-200"
                  placeholder="0"
                  value={item.count}
                  onChange={(e) => updateItem(index, "count", e.target.value)}
                />
                <button
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => removeItem(index)}
                >
                  <Trash />
                </button>
              </div>
            ))}

            {/* Add button */}
            <button
              className="mt-4 w-full text-gray-900 bg-gray-200 rounded-lg py-2"
              onClick={addItem}
            >
              + Борлуулах төрөл нэмэх
            </button>
          </div>

          {/* Information Section */}
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

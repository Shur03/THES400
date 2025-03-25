"use client";
import { Trash } from "lucide-react";
import { useState } from "react";
import { number, string } from "zod";

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
  const [items, setItems] = useState([]);
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

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "name" ? value : parseFloat(value) || 0;
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen text-gray-800">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Тооцоолуур</h1>

        {/* Шаардлагатай байгаа мөнгөн дүнгээ оруулна */}
        <input
          className="w-2/3 h-10 bg-gray-200 text-gray-700 mx-5 px-5 rounded-lg"
          type="number"
          id="amount"
          value={needAmount}
          onChange={(e) => setNeedAmount(e.target.value)}
          placeholder="Та өөрт шаардлагатай байгаа үнийн дүнгээ оруулна уу"
        />

        <div className="flex gap-6 mt-6 mx-5">
          <div className="p-4 border-4 border-blue-300 rounded-lg w-2/3">
            {items.length >= 0 ? (
              items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b py-2 gap-5"
                >
                  <input
                    type="text"
                    className="w-32 h-8 text-center border rounded bg-gray-200"
                    placeholder="Эр хонь"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-24 h-8 text-center border rounded bg-gray-200"
                    placeholder="200000"
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-24 h-8 text-center border rounded bg-gray-200"
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
              ))
            ) : (
              <p className="text-center text-gray-500">No items available</p>
            )}

            {/* Add button */}
            <button
              className="mt-4 w-full text-gray-900 bg-gray-200 rounded-lg py-2"
              onClick={addItem}
            >
              + Борлуулах төрөл нэмэх
            </button>
          </div>

          {/* Information Section */}
          <div className="rounded-lg w-1/3">
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
                {needAmount > 0 ? `${needAmount.toLocaleString()}` : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

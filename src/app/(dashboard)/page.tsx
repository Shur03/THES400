import StockChart from "@/components/charts/StockChart";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const data = [
    { title: "Хонь", value: "300" },
    { title: "Ямаа", value: "500" },
    { title: "Үхэр", value: "20" },
    { title: "Морь", value: "39" },
    { title: "Тэмээ", value: "10" },
  ];
  const session = await auth();
  if (!session) redirect("/sign-in");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-blue-300 rounded-xl p-4 shadow-md flex items-center justify-between"
        >
          <div>
            <h4 className="text-gray-700 text-lg font-semibold">
              {item.title}
            </h4>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
          <div className="w-12 h-8 ">
            <StockChart />
          </div>
        </div>
      ))}
    </div>
  );
}

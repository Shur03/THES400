"use client";
import StockChart from "@/components/charts/StockChart";
import { signIn, useSession } from "next-auth/react";
import WeatherChart from "@/components/charts/WeatherChart";
import Footer from "@/components/footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/header/Header";
import { Spinner } from "react-bootstrap";

export default function Dashboard() {
  // Dashboard-д зориулж доорх талбаруудыг харуулна.
  interface LivestockData {
    stock_type: string;
    _count: {
      stock_type: number;
    };
  }
  const data = [
    { title: "Хонь", value: "300" },
    { title: "Ямаа", value: "500" },
    { title: "Үхэр", value: "20" },
    { title: "Морь", value: "39" },
    { title: "Тэмээ", value: "10" },
  ];

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [livestockLoading, setLivestockLoading] = useState(true);
  const city = "Ulaanbaatar";
  const [livestockData, setLivestockData] = useState<LivestockData[]>([]);

  const { data: session, status } = useSession();
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`;

      try {
        const response = await axios.get(url);
        setWeather(response.data);
      } catch {
        setError("Алдаа гарлаа. Дахин оролдоно уу.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Нэвтэрнэ үү.</p>;
  }

  return (
    <div>
      <Header username={session.user?.name || "Guest"} />
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
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {livestockLoading ? (
          <div className="col-span-full text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Малын мэдээлэл ачааллаж байна...</p>
          </div>
        ) : livestockData.length > 0 ? (
          livestockData.map((item, index) => (
            <div
              key={index}
              className="bg-blue-100 rounded-xl p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <h4 className="text-gray-700 text-lg font-semibold">
                  {item.stock_type}
                </h4>
                <p className="text-2xl font-bold text-gray-800">
                  {item._count.stock_type}
                </p>
              </div>
              <div className="w-12 h-8">
                <StockChart />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-5 text-gray-500">
            Малын мэдээлэл олдсонгүй
          </div>
        )}
      </div> */}
      <div className="px-5 w-full text-gray-800 rounded-lg">
        {loading && <p className="text-white text-center">Уншиж байна...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {weather && <WeatherChart data={weather} />}
      </div>
      <Footer />
    </div>
  );
}

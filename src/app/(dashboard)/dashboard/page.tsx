"use client";
import StockChart from "@/components/charts/StockChart";
import { signIn, useSession } from "next-auth/react";
import WeatherChart from "@/components/charts/WeatherChart";
import Footer from "@/components/footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/header/Header";
import { Spinner } from "react-bootstrap";
import { useStock } from "@/app/hooks/useStock";

export default function Dashboard() {
  // Dashboard-д зориулж доорх талбаруудыг харуулна.
  interface LivestockData {
    stock_type: string;
    _count: {
      stock_type: number;
    };
  }
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { liveStock } = useStock();
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
        {liveStock.map((stock, index) => (
          <div
            key={index}
            className="bg-blue-300 rounded-xl p-4 shadow-md flex items-center justify-between"
          >
            <div>
              <h4 className="text-gray-700 text-lg font-semibold">
                {stock.stock_type}
              </h4>
              <p className="text-2xl font-bold text-gray-800">{stock.counts}</p>
            </div>
            <div className="w-12 h-8 ">
              <StockChart />
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 w-full text-gray-800 rounded-lg">
        {loading && <p className="text-white text-center">Уншиж байна...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {weather && <WeatherChart data={weather} />}
      </div>
      <Footer />
    </div>
  );
}

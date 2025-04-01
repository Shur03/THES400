"use client";
import StockChart from "@/components/charts/StockChart";
import { signIn, useSession } from "next-auth/react";
import WeatherChart from "@/components/charts/WeatherChart";
import Footer from "@/components/footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/header/Header";

export default function Dashboard() {
  const data = [
    { title: "Хонь", value: "300" },
    { title: "Ямаа", value: "500" },
    { title: "Үхэр", value: "20" },
    { title: "Морь", value: "39" },
    { title: "Тэмээ", value: "10" },
  ];

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const city = "Ulaanbaatar"; // Fixed city for weather display

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <p>Нэвтэрнэ үү.</p>
        <button onClick={() => signIn()}>Нэвтрэх</button>
      </div>
    );
  }
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`;

      try {
        const response = await axios.get(url);
        setWeather(response.data);
      } catch (err) {
        setError("Алдаа гарлаа. Дахин оролдоно уу.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);
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
      <div className="px-5 w-full text-gray-800 rounded-lg">
        {loading && <p className="text-white text-center">Уншиж байна...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {weather && <WeatherChart data={weather} />}
      </div>
      <Footer />
    </div>
  );
}

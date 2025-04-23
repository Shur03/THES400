"use client";
import { signIn, useSession } from "next-auth/react";
import WeatherChart from "@/components/charts/WeatherChart";
import Footer from "@/components/footer/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/header/Header";
import StockList from "@/components/page/Stock/StockList";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import AddButton from "@/components/shared/buttons/addButton";

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const city = "Ulaanbaatar";
  const router = useRouter();
  const pageName = "Малчны бүртгэл";
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
    router.push("login");
    return <p className="text-gray-900">Нэвтэрнэ үү.</p>;
  }

  return (
    <div>
      <Header pageName={pageName} username={session.user?.name || "Guest"} />
      <div className="px-5">
        <AddButton path="stock" />
        <StockList />
      </div>
      <div className="px-5 w-full text-gray-800 rounded-lg mt-5">
        {loading && <p className="text-white text-center">Уншиж байна...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {weather && <WeatherChart data={weather} />}
      </div>
      <Footer />
    </div>
  );
}

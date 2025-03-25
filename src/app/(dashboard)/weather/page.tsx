"use client";
import Head from "next/head";
import axios from "axios";
import { useState } from "react";
import WeatherChart from "@/components/charts/WeatherChart";

export default function Page() {
  //   const [city, setCity] = useState("");
  const city = "Ulaanbaatar";
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!city) return; // Prevent empty request

    setLoading(true);
    setError(null);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`;

    try {
      const response = await axios.get(url);
      setWeather(response.data);
    } catch (err) {
      setError("City not found. Please try again.");
    } finally {
      setLoading(false);
    }

    // setCity("");
  };

  return (
    <div>
      <Head>
        <title>Weather - Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-[1]" />

      {/* Search */}
      <div className="relative flex justify-between items-center max-w-[500px] w-full m-auto pt-4 px-4 text-white z-10">
        <form
          onSubmit={fetchWeather}
          className="flex justify-between items-center w-full m-auto p-3 bg-transparent border border-gray-300 text-white rounded-2xl"
        >
          <input
            onChange={(e) => setCity(e.target.value)}
            value={city}
            className="bg-transparent border-none text-white focus:outline-none text-2xl"
            type="text"
            placeholder="Search city"
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Loading State */}
      {loading && <h1 className="text-white text-center mt-6">Loading...</h1>}

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mt-6">{error}</p>}

      {/* Weather Display */}
      {weather && <WeatherChart data={weather} />}
    </div>
  );
}

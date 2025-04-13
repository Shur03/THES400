import React from "react";

const WeatherChart = ({ data }) => {
  if (!data || !data.weather) return null; // Prevents crashes if data is empty

  return (
    <div className="relative max-w-[400px] w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
          {data.name}
        </span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>

      {/* Weather Info */}
      <div className="text-center mt-4">
        <p className="text-4xl font-bold">{data.main?.temp?.toFixed(0)}°C</p>
        <p className="text-md mt-1">
          High: {data.main?.temp_max?.toFixed(0)}° Low:{" "}
          {data.main?.temp_min?.toFixed(0)}°
        </p>
        <p className="text-lg mt-2">{data.weather[0]?.main}</p>
      </div>

      {/* Weather Details */}
      <div className="mt-6 flex justify-between items-center text-center text-white/80">
        <div>
          <p className="text-xl font-bold">
            {data.main?.feels_like?.toFixed(0)}°C
          </p>
          <p className="text-sm">Температур</p>
        </div>
        <div>
          <p className="text-xl font-bold">{data.main?.humidity}%</p>
          <p className="text-sm">Чийгшил</p>
        </div>
        <div>
          <p className="text-xl font-bold">
            {data.wind?.speed?.toFixed(0)} м/с
          </p>
          <p className="text-sm">Салхи</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherChart;

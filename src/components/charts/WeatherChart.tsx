import React from "react";
import {
  Sun,
  CloudRain,
  Cloud,
  Snowflake,
  Zap,
  CloudFog,
  Droplet,
  Wind,
  Thermometer,
  Calendar,
  Eye,
  Gauge,
} from "lucide-react";

const getWeatherIcon = (weatherType: string) => {
  const iconSize = 40;
  const iconClass = "text-white";

  switch (weatherType.toLowerCase()) {
    case "clear":
      return <Sun size={iconSize} className={`${iconClass} text-yellow-300`} />;
    case "rain":
    case "drizzle":
      return (
        <CloudRain size={iconSize} className={`${iconClass} text-blue-300`} />
      );
    case "clouds":
      return <Cloud size={iconSize} className={`${iconClass} text-gray-300`} />;
    case "snow":
      return (
        <Snowflake size={iconSize} className={`${iconClass} text-blue-100`} />
      );
    case "thunderstorm":
      return <Zap size={iconSize} className={`${iconClass} text-purple-300`} />;
    case "mist":
    case "fog":
    case "haze":
      return (
        <CloudFog size={iconSize} className={`${iconClass} text-gray-200`} />
      );
    default:
      return <Sun size={iconSize} className={`${iconClass} text-yellow-300`} />;
  }
};

interface WeatherData {
  name: string;
  sys?: {
    country?: string;
  };
  weather: Array<{
    main: string;
  }>;
  main?: {
    temp?: number;
    temp_max?: number;
    temp_min?: number;
    feels_like?: number;
    humidity?: number;
    pressure?: number;
  };
  wind?: {
    speed?: number;
  };
  visibility?: number;
}

const WeatherChart = ({ data }: { data: WeatherData }) => {
  if (!data || !data.weather)
    return (
      <div className="max-w-md w-full bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-xl shadow-md animate-pulse h-64">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-6 mx-auto"></div>
        <div className="flex justify-between mt-8">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    );

  const weatherType = data.weather[0]?.main || "Clear";
  const bgGradient =
    weatherType === "Rain" || weatherType === "Drizzle"
      ? "from-blue-600 to-blue-800"
      : weatherType === "Clear"
      ? "from-blue-400 to-indigo-600"
      : weatherType === "Clouds"
      ? "from-gray-500 to-gray-700"
      : weatherType === "Snow"
      ? "from-blue-200 to-blue-400"
      : "from-indigo-500 to-purple-700";

  return (
    <div
      className={`max-w-md w-full bg-gradient-to-br ${bgGradient} text-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {data.name}
          </span>
          <span className="text-sm opacity-90">{data.sys?.country}</span>
        </div>
        <div className="flex items-center gap-1 text-sm opacity-90">
          <Calendar size={16} />
          {new Date().toLocaleDateString("mn-MN", {
            weekday: "long", // "Даваа", "Мягмар" (full names)
            month: "long", // "Нэгдүгээр сар", "Тавдугаар сар"
            day: "numeric",
          })}
        </div>
      </div>

      {/* Main Weather Info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-4">
            <div>{getWeatherIcon(weatherType)}</div>
            <div>
              <p className="text-5xl font-bold">
                {data.main?.temp?.toFixed(0)}°
              </p>
              <p className="text-sm opacity-90 mt-1 capitalize">
                {weatherType.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm">
            <span className="text-red-200">
              H: {data.main?.temp_max?.toFixed(0)}°
            </span>{" "}
            /{" "}
            <span className="text-blue-200">
              L: {data.main?.temp_min?.toFixed(0)}°
            </span>
          </p>
          <p className="text-xs opacity-80 mt-1">
            Температур {data.main?.feels_like?.toFixed(0)}°
          </p>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer size={18} className="opacity-80" />
            <span className="text-sm opacity-90">Температур</span>
          </div>
          <p className="text-xl font-medium">
            {data.main?.feels_like?.toFixed(0)}°C
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <Droplet size={18} className="opacity-80" />
            <span className="text-sm opacity-90">Чийгшил</span>
          </div>
          <p className="text-xl font-medium">{data.main?.humidity}%</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <Wind size={18} className="opacity-80" />
            <span className="text-sm opacity-90">Салхи</span>
          </div>
          <p className="text-xl font-medium">
            {data.wind?.speed?.toFixed(1)} м/с
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 text-xs opacity-80 text-center flex justify-center gap-4">
        {data.visibility && (
          <span className="flex items-center gap-1">
            <Eye size={14} /> {(data.visibility / 1000).toFixed(1)} км
          </span>
        )}
        <span className="flex items-center gap-1">
          <Gauge size={14} /> {data.main?.pressure} Па
        </span>
      </div>
    </div>
  );
};

export default WeatherChart;

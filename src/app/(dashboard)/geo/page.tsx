"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import Header from "@/components/header/Header";
import { useSession } from "next-auth/react";
import L from "leaflet";
import { useRouter } from "next/navigation";

const customIcon = new L.Icon({
  iconUrl: "/img/custom-marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

type Point = {
  name: string;
  latitude: number;
  longitude: number;
};

type ApiResponse = {
  coordinates: {
    A: Point;
    B: Point;
    C: Point;
  };
  distances: {
    A_to_B: string;
    A_to_C: string;
  };
  radius: string;
  result: string;
};

export default function CoordinateRangeChecker() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customPoint, setCustomPoint] = useState<Point | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchData = async (pointC?: Point) => {
    try {
      setLoading(true);
      setError(null);

      let url = "/api/geo";
      if (pointC) {
        url += `?lat=${pointC.latitude}&lng=${pointC.longitude}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const newPoint: Point = {
      name: "Custom",
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
    };
    setCustomPoint(newPoint);
    fetchData(newPoint);
  };
  if (!session) {
    router.push("login");
    return <p className="text-gray-900">Нэвтэрнэ үү.</p>;
  }
  if (loading && !data)
    return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  const points = data
    ? [
        data.coordinates.A,
        data.coordinates.B,
        customPoint || data.coordinates.C,
      ]
    : [];

  const center =
    points.length > 0
      ? [points[0].latitude, points[0].longitude]
      : [46.354313, 94.222326];

  const radiusInMeters = data
    ? parseFloat(data.radius.split(" ")[0]) * 1000
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <Header username={session.user?.name || "Guest"} />
      <h1 className="text-2xl font-bold mb-6">Газар зүйн байршил хянах</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-96 w-full relative">
            <MapContainer
              center={center as [number, number]}
              zoom={8}
              style={{ height: "100%", width: "100%" }}
              whenCreated={(map) => {
                map.on("click", handleMapClick);
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* <MapPin /> */}

              {points.map((point, index) => (
                <Marker
                  key={`${point.name}-${index}`}
                  position={[point.latitude, point.longitude]}
                  icon={customIcon} // or use a hidden icon
                >
                  <Popup>
                    <div>
                      <strong>{point.name}</strong>
                      <br />
                      Өргөрөг: {point.latitude.toFixed(6)}
                      <br />
                      Уртраг: {point.longitude.toFixed(6)}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Draw radius circle */}
              {data && (
                <Circle
                  center={[
                    data.coordinates.A.latitude,
                    data.coordinates.A.longitude,
                  ]}
                  radius={radiusInMeters}
                  pathOptions={{ color: "green", fillOpacity: 0.2 }}
                />
              )}

              {/* Lines from A to B and A to C */}
              {/* {points.length >= 2 && (
                <Polyline
                  positions={points
                    .slice(0, 2)
                    .map((p) => [p.latitude, p.longitude])
                  }
                  color="black"
                />
              )} */}

              {points.length === 3 && (
                <Polyline
                  positions={[
                    [points[0].latitude, points[0].longitude],
                    [points[2].latitude, points[2].longitude],
                  ]}
                  color="red"
                  dashArray="5, 5"
                />
              )}
            </MapContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {data && (
            <>
              <h2 className="text-xl font-semibold mb-4">Үр дүн</h2>

              <div
                className={`p-4 mb-4 rounded-lg ${
                  data.result === "Бүсээс гарсан"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <p className="font-bold">Төлөв: {data.result}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Зай</h3>
                  <ul className="space-y-2">
                    <li>Бүс: {data.distances.A_to_B} км</li>
                    <li className="text-red-400">
                      Бүсээс гадагш: {data.distances.A_to_C}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Координат</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {Object.entries(data.coordinates).map(([key, point]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded">
                        <p className="font-semibold">{point.name}</p>
                        <p className="text-sm">
                          Өргөрөг: {point.latitude.toFixed(6)}
                        </p>
                        <p className="text-sm">
                          Уртраг: {point.longitude.toFixed(6)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

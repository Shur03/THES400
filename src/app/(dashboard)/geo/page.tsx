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
// import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle } from "react-bootstrap";
import { Button } from "@/components/ui/button";
import { InfoIcon, MapPinIcon, NavigationIcon } from "lucide-react";

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
    distance: string;
  };
  radius: string;
  result: string;
};

export default function CoordinateRangeChecker() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customPoint, setCustomPoint] = useState<Point | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const pageName = "Газар зүйн байршил хянах";

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
      name: "Custom Point",
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
    };
    setCustomPoint(newPoint);
    fetchData(newPoint);
  };

  const handleRecenter = () => {
    if (data && mapInitialized) {
      const center = [
        data.coordinates.A.latitude,
        data.coordinates.A.longitude,
      ] as [number, number];
    }
  };

  if (!session) {
    router.push("login");
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <div>
            <p className="text-gray-700">Please login to access this page.</p>
            <Button
              className="mt-4 w-full"
              onClick={() => router.push("login")}
            >
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Header pageName={pageName} username={session.user?.name || "Guest"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Header pageName={pageName} username={session.user?.name || "Guest"} />
        <Card className="mt-6 border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-600 flex items-center gap-2">
              <InfoIcon className="w-5 h-5" />
              Алдаа гарлаа
            </CardTitle>
          </CardHeader>
          <div className="pt-4">
            <p className="text-red-700">{error}</p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Дахин оролдохЫ
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
    <div className="container mx-auto px-4 py-8">
      <Header pageName={pageName} username={session.user?.name || "Guest"} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="h-[500px] w-full relative">
            <MapContainer
              center={center as [number, number]}
              zoom={8}
              style={{ height: "100%", width: "100%" }}
              whenCreated={(map) => {
                setMapInitialized(true);
                map.on("click", handleMapClick);
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {points.map((point, index) => (
                <Marker
                  key={`${point.name}-${index}`}
                  position={[point.latitude, point.longitude]}
                  icon={customIcon}
                >
                  <Popup className="text-sm">
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900">{point.name}</h4>
                      <p className="text-gray-700">
                        Өргөрөг: {point.latitude.toFixed(6)}
                      </p>
                      <p className="text-gray-700">
                        Уртраг: {point.longitude.toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}

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
            <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200 z-[1000]">
              <p className="text-sm text-gray-600 flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2" />
                Байршилаа тодорхойлох
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-gray-900">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Үр дүн</CardTitle>
            </CardHeader>
            <div>
              <div
                className={`p-4 rounded-lg ${
                  data?.result === "Бүсээс гарсан"
                    ? "bg-red-50 border border-red-100"
                    : "bg-green-50 border border-green-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      data?.result === "Бүсээс гарсан"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <InfoIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Төлөв</h3>
                    <p
                      className={`${
                        data?.result === "Бүсээс гарсан"
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {data?.result}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Зайны мэдээлэл</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Бүс:</span>
                  <span className="font-medium">
                    {data?.distances.A_to_B} км
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Бүсээс гадагш:</span>
                  <span className="font-medium text-red-600">
                    {data?.distances.distance} км
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Координатууд</CardTitle>
            </CardHeader>
            <div>
              <div className="space-y-4">
                {data &&
                  Object.entries(data.coordinates).map(([key, point]) => (
                    <div
                      key={key}
                      className="bg-gray-50 p-4 rounded-md border border-gray-100"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">
                        {point.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Өргөрөг:</p>
                          <p className="font-mono">
                            {point.latitude.toFixed(6)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Уртраг:</p>
                          <p className="font-mono">
                            {point.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

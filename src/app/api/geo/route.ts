// app/api/geo/route.ts
import { NextResponse } from "next/server";

type Point = {
  name: string;
  latitude: number;
  longitude: number;
};

function haversineDistance(p1: Point, p2: Point): number {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const R = 6371;

  const dLat = toRadians(p2.latitude - p1.latitude);
  const dLon = toRadians(p2.longitude - p1.longitude);
  const lat1 = toRadians(p1.latitude);
  const lat2 = toRadians(p2.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const A: Point = { name: "A", latitude: 46.354313, longitude: 94.222326 };
  const B: Point = {
    name: "B",
    latitude: A.latitude + 0.5,
    longitude: A.longitude + 0.5,
  };
  const C: Point = {
    name: "C",
    latitude: lat ? parseFloat(lat) : 46.354313,
    longitude: lng ? parseFloat(lng) : 95.222326,
  };

  const distanceAB = haversineDistance(A, B);
  const distanceAC = haversineDistance(A, C);

  const distance = distanceAC - distanceAB;
  const result = distanceAC <= distanceAB ? "Бүс дотор байна" : "Бүсээс гарсан";

  return NextResponse.json({
    coordinates: { A, B, C },
    distances: {
      A_to_B: `${distanceAB.toFixed(2)} `,
      A_to_C: `${distanceAC.toFixed(2)} `,
      distance : `${distance.toFixed(2)} `,
    },
    radius: `${distanceAB.toFixed(2)} `,
    result,
    
  });
}

"use client";

import { useEffect, useState } from "react";
import type { Coordinates, WindData } from "@/types/wind";

export function useWindData(coordinates: Coordinates | null) {
  const [data, setData] = useState<WindData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coordinates) return;
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const params = new URLSearchParams({
          latitude: coordinates.latitude.toString(),
          longitude: coordinates.longitude.toString(),
          current: "wind_speed_10m",
          hourly: "wind_speed_10m",
          forecast_days: "1",
          timezone: "auto",
        });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("weather request failed");
        const result = await response.json();
        if (typeof result.current?.wind_speed_10m !== "number" || !Array.isArray(result.hourly?.wind_speed_10m)) {
          throw new Error("weather data missing");
        }
        setData({
          currentSpeed: result.current.wind_speed_10m,
          hourly: result.hourly.time.slice(0, 24).map((time: string, index: number) => ({ time, speed: result.hourly.wind_speed_10m[index] })),
        });
      } catch (fetchError) {
        if ((fetchError as Error).name !== "AbortError") setError("気象データを取得できませんでした。通信状況を確認してください。");
      } finally { setLoading(false); }
    };
    load();
    return () => controller.abort();
  }, [coordinates]);

  return { data, loading, error };
}

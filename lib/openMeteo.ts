import type { Coordinates, WindData } from "@/types/wind";

export function buildOpenMeteoUrl(coordinates: Coordinates): string {
  const params = new URLSearchParams({
    latitude: coordinates.latitude.toString(),
    longitude: coordinates.longitude.toString(),
    current: "wind_speed_10m",
    hourly: "wind_speed_10m",
    forecast_days: "1",
    timezone: "auto",
  });

  return `https://api.open-meteo.com/v1/forecast?${params}`;
}

export function normalizeWindResponse(result: unknown): WindData {
  if (!result || typeof result !== "object") throw new Error("weather data missing");
  const response = result as { current?: { wind_speed_10m?: unknown }; hourly?: { time?: unknown; wind_speed_10m?: unknown } };
  const currentSpeed = response.current?.wind_speed_10m;
  const times = response.hourly?.time;
  const speeds = response.hourly?.wind_speed_10m;

  if (typeof currentSpeed !== "number" || !Array.isArray(times) || !Array.isArray(speeds)) {
    throw new Error("weather data missing");
  }

  const hourly = times.slice(0, 24).map((time, index) => {
    const speed = speeds[index];
    if (typeof time !== "string" || typeof speed !== "number") throw new Error("weather data invalid");
    return { time, speed };
  });

  return { currentSpeed, hourly };
}
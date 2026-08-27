import { describe, expect, it } from "vitest";
import { buildOpenMeteoUrl, normalizeWindResponse } from "@/lib/openMeteo";

describe("Open-Meteo integration helpers", () => {
  it("builds the documented request URL", () => {
    const url = new URL(buildOpenMeteoUrl({ latitude: 35.68, longitude: 139.76 }));

    expect(url.origin + url.pathname).toBe("https://api.open-meteo.com/v1/forecast");
    expect(url.searchParams.get("latitude")).toBe("35.68");
    expect(url.searchParams.get("longitude")).toBe("139.76");
    expect(url.searchParams.get("current")).toBe("wind_speed_10m");
    expect(url.searchParams.get("hourly")).toBe("wind_speed_10m");
    expect(url.searchParams.get("forecast_days")).toBe("1");
    expect(url.searchParams.get("timezone")).toBe("auto");
  });

  it("normalizes current and at most 24 hourly wind values", () => {
    const times = Array.from({ length: 25 }, (_, index) => `2026-08-27T${String(index).padStart(2, "0")}:00`);
    const speeds = times.map((_, index) => index + 1);
    const data = normalizeWindResponse({ current: { wind_speed_10m: 6.4 }, hourly: { time: times, wind_speed_10m: speeds } });

    expect(data.currentSpeed).toBe(6.4);
    expect(data.hourly).toHaveLength(24);
    expect(data.hourly[0]).toEqual({ time: times[0], speed: 1 });
    expect(data.hourly[23]).toEqual({ time: times[23], speed: 24 });
  });

  it.each([
    null,
    {},
    { current: {}, hourly: { time: [], wind_speed_10m: [] } },
    { current: { wind_speed_10m: "6.4" }, hourly: { time: [], wind_speed_10m: [] } },
  ])("rejects incomplete response: %j", (response) => {
    expect(() => normalizeWindResponse(response)).toThrow("weather data missing");
  });

  it("rejects a mismatched hourly value", () => {
    expect(() => normalizeWindResponse({ current: { wind_speed_10m: 4 }, hourly: { time: ["2026-08-27T00:00"], wind_speed_10m: [null] } })).toThrow("weather data invalid");
  });
});
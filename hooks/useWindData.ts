"use client";

import { useEffect, useState } from "react";
import { buildOpenMeteoUrl, normalizeWindResponse } from "@/lib/openMeteo";
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
        const response = await fetch(buildOpenMeteoUrl(coordinates), { signal: controller.signal });
        if (!response.ok) throw new Error("weather request failed");
        setData(normalizeWindResponse(await response.json()));
      } catch (fetchError) {
        if ((fetchError as Error).name !== "AbortError") setError("気象データを取得できませんでした。通信状況を確認してください。");
      } finally { setLoading(false); }
    };
    load();
    return () => controller.abort();
  }, [coordinates]);

  return { data, loading, error };
}

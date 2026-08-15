"use client";

import { useCallback, useEffect, useState } from "react";
import type { Coordinates } from "@/types/wind";

type GeolocationState = {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: true,
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ coordinates: null, loading: false, error: "このブラウザは位置情報に対応していません。" });
      return;
    }

    setState((current) => ({ ...current, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setState({
        coordinates: { latitude: coords.latitude, longitude: coords.longitude },
        loading: false,
        error: null,
      }),
      (positionError) => setState({
        coordinates: null,
        loading: false,
        error: positionError.code === positionError.PERMISSION_DENIED
          ? "位置情報の利用が許可されていません。ブラウザの設定を確認してください。"
          : "現在地を取得できませんでした。もう一度お試しください。",
      }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  useEffect(() => {
    const requestId = window.setTimeout(requestLocation, 0);
    return () => window.clearTimeout(requestId);
  }, [requestLocation]);
  return { ...state, requestLocation };
}

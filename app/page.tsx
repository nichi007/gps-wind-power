"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Activity, BatteryCharging, CloudSun, LocateFixed, MapPin, Moon, RefreshCw, Sun, Wind } from "lucide-react";
import { calculateWindPower } from "@/lib/calculateWindPower";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWindData } from "@/hooks/useWindData";

const WindMap = dynamic(() => import("@/components/WindMap"), { ssr: false });
const PowerChart = dynamic(() => import("@/components/PowerChart"), { ssr: false });

const formatNumber = (value: number, digits = 2) => new Intl.NumberFormat("ja-JP", { maximumFractionDigits: digits }).format(value);

export default function Home() {
  const { coordinates, loading: locationLoading, error: locationError, requestLocation } = useGeolocation();
  const { data: windData, loading: windLoading, error: windError } = useWindData(coordinates);
  const [rotorDiameter, setRotorDiameter] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const result = calculateWindPower(windData?.currentSpeed ?? 0, rotorDiameter);
  const isOperating = Boolean(windData && windData.currentSpeed >= 3 && windData.currentSpeed <= 25);
  const error = locationError ?? windError;

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  return <main className={darkMode ? "app-shell dark-mode" : "app-shell"}>
    <header className="topbar page-width"><div className="brand"><span className="brand-mark"><Wind size={20} /></span><div><strong>WIND / PULSE</strong><span>LOCAL ENERGY MONITOR</span></div></div><button className="icon-button" onClick={() => setDarkMode((mode) => !mode)} aria-label="テーマを切り替えます">{darkMode ? <Sun size={19} /> : <Moon size={19} />}</button></header>
    <section className="hero page-width"><div><p className="eyebrow"><Activity size={14} /> LIVE WIND RESOURCE</p><h1>風を、電力に。</h1><p className="hero-copy">現在地の風況から、あなたの風車が生み出せるエネルギーをリアルタイムに推定します。</p></div><div className="status-pill"><span className={windData ? "status-dot" : "status-dot muted"}></span>{windData ? "LIVE DATA" : locationLoading || windLoading ? "SYNCING" : "WAITING"}</div></section>
    {error && <div className="alert page-width"><CloudSun size={18} /><span>{error}</span><button onClick={requestLocation}><RefreshCw size={15} /> 再試行</button></div>}
    <section className="dashboard page-width">
      <div className="primary-card"><div className="card-heading"><div><span className="label">INSTANT OUTPUT</span><h2><span>{formatNumber(result.watts, 0)}</span> W</h2></div><span className={isOperating ? "live-tag" : "live-tag stopped"}>{isOperating ? "OPERATING" : "STANDBY"}</span></div><div className="power-bar"><span style={{ width: `${Math.min(result.kilowatts * 100, 100)}%` }} /></div><div className="metric-grid"><div><span>kW 換算</span><b>{formatNumber(result.kilowatts, 3)} kW</b></div><div><span>1時間発電量</span><b>{formatNumber(result.hourlyKWh, 3)} kWh</b></div><div><span>24時間予測</span><b>{formatNumber(result.dailyKWh, 2)} kWh</b></div></div></div>
      <div className="side-stack"><div className="mini-card"><span className="label">CURRENT WIND</span><div className="wind-reading"><Wind size={27} /><strong>{windData ? formatNumber(windData.currentSpeed, 1) : "--"}</strong><span>m/s</span></div><p>{isOperating ? "発電に適した風速帯です" : "カットイン 3 m/s · カットアウト 25 m/s"}</p></div><div className="mini-card location-card"><span className="label">YOUR LOCATION</span><div className="coord"><MapPin size={18} /><span>{coordinates ? `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}` : "現在地を取得中"}</span></div><button className="text-button" onClick={requestLocation}><LocateFixed size={15} /> 現在地を更新</button></div></div>
    </section>
    <section className="content-grid page-width"><div className="panel map-panel"><div className="panel-head"><div><span className="label">FIELD POSITION</span><h2>風車の現在地</h2></div><span className="source">OpenStreetMap</span></div>{coordinates ? <WindMap coordinates={coordinates} /> : <div className="map-placeholder"><MapPin size={26} />{locationLoading ? "現在地を確認しています" : "位置情報を許可すると地図が表示されます"}</div>}</div><div className="panel settings-panel"><div className="panel-head"><div><span className="label">TURBINE MODEL</span><h2>シミュレーション設定</h2></div><BatteryCharging size={21} /></div><label className="input-label" htmlFor="rotor">ローター直径 <output>{rotorDiameter.toFixed(1)} m</output></label><input id="rotor" type="range" min="1" max="10" step="0.1" value={rotorDiameter} onChange={(event) => setRotorDiameter(Number(event.target.value))} /><div className="range-labels"><span>1 m</span><span>10 m</span></div><div className="assumptions"><div><span>空気密度</span><b>1.225 kg/m³</b></div><div><span>パワー係数</span><b>0.35</b></div></div></div></section>
    <section className="panel chart-panel page-width"><div className="panel-head"><div><span className="label">NEXT 24 HOURS</span><h2>予測発電量</h2></div><span className="chart-unit">kW</span></div>{windData ? <div className="chart-wrap"><PowerChart points={windData.hourly} rotorDiameter={rotorDiameter} /></div> : <div className="chart-placeholder">風速データを取得すると予測が表示されます</div>}</section>
    <footer className="footer page-width">WIND / PULSE <span>Open-Meteo の公開気象データを使用しています</span></footer>
  </main>;
}

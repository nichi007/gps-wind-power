"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import type { WindPoint } from "@/types/wind";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function PowerChart({ points, rotorDiameter }: { points: WindPoint[]; rotorDiameter: number }) {
  const values = points.map(({ speed }) => speed < 3 || speed > 25 ? 0 : 0.5 * 1.225 * Math.PI * (rotorDiameter / 2) ** 2 * 0.35 * speed ** 3 / 1000);
  return <Line data={{ labels: points.map(({ time }) => new Date(time).toLocaleTimeString("ja-JP", { hour: "2-digit" })), datasets: [{ data: values, borderColor: "#0e7490", backgroundColor: "rgba(14,116,144,.12)", fill: true, tension: .35, pointRadius: 2 }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${Number(context.raw).toFixed(2)} kW` } } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { callback: (value) => `${value} kW` } } } }} />;
}

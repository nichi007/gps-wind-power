"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { Coordinates } from "@/types/wind";

const markerIcon = L.divIcon({ className: "location-marker", html: '<span></span>', iconSize: [22, 22], iconAnchor: [11, 11] });
function Recenter({ coordinates }: { coordinates: Coordinates }) { const map = useMap(); map.setView([coordinates.latitude, coordinates.longitude], 11); return null; }
export default function WindMap({ coordinates }: { coordinates: Coordinates }) {
  return <MapContainer center={[coordinates.latitude, coordinates.longitude]} zoom={11} scrollWheelZoom={false} className="wind-map"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><Marker position={[coordinates.latitude, coordinates.longitude]} icon={markerIcon} /><Recenter coordinates={coordinates} /></MapContainer>;
}

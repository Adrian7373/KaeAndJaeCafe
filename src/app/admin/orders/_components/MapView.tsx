"use client";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function MapView({ lat, lng }: { lat: number, lng: number }) {

    // GUARD CLAUSE: If lat or lng are invalid, return a placeholder
    if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">
                Location data unavailable
            </div>
        );
    }

    return (
        <MapContainer center={[lat, lng]} zoom={16} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lat, lng]} icon={markerIcon} />
        </MapContainer>
    );
}
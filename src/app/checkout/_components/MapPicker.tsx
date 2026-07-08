"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapPickerProps {
    hardwareGPS: { lat: number; lng: number; accuracy: number };
    currentPin: { lat: number; lng: number };
    onLocationSelect: (lat: number, lng: number) => void;
}

function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function ClickableMapEvents({ hardwareGPS, onLocationSelect }: { hardwareGPS: { lat: number, lng: number, accuracy: number }, onLocationSelect: (lat: number, lng: number) => void }) {

    const MAX_ADJUSTMENT_METERS = Math.max(150, hardwareGPS.accuracy);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;

            // Calculate distance from strict hardware GPS to the tap
            const distance = getDistanceInMeters(hardwareGPS.lat, hardwareGPS.lng, lat, lng);

            if (distance > MAX_ADJUSTMENT_METERS) {
                alert(`You can only adjust the pin within ${Math.round(MAX_ADJUSTMENT_METERS)} meters of your detected location.`);
                return;
            }

            // Move the pin
            onLocationSelect(lat, lng);
        },
    });
    return null;
}

export default function MapPicker({ hardwareGPS, currentPin, onLocationSelect }: MapPickerProps) {

    // Default fallback to Cabanatuan City center if GPS is somehow missing momentarily
    const mapCenter = useMemo(() =>
        hardwareGPS ? [hardwareGPS.lat, hardwareGPS.lng] : [15.4865, 120.9734],
        [hardwareGPS]);

    if (!hardwareGPS) return null;

    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden z-0 relative border-2 border-green-400 shadow-inner">
            <MapContainer
                center={mapCenter as [number, number]}
                zoom={17}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* 1. The Anti-Troll Geofence Circle */}
                <Circle
                    center={[hardwareGPS.lat, hardwareGPS.lng]}
                    radius={Math.max(150, hardwareGPS.accuracy)}
                    pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1, weight: 2 }}
                />

                {/* 2. The Invisible Click Listener */}
                <ClickableMapEvents hardwareGPS={hardwareGPS} onLocationSelect={onLocationSelect} />

                {/* 3. The Actual Pin */}
                <Marker position={[currentPin.lat, currentPin.lng]} icon={markerIcon}>
                    <Popup className="font-bold">Delivery Location</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
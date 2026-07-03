// components/MapPicker.tsx
"use client";

import { useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Next.js missing marker icon bugs
const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
    // Default map center: Cabanatuan City
    const [position, setPosition] = useState({ lat: 15.4865, lng: 120.9734 });
    const markerRef = useRef<L.Marker>(null);

    // This fires the exact moment the user lets go of the pin
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    setPosition(newPos);
                    // Send coordinates back to your checkout form!
                    onLocationSelect(newPos.lat, newPos.lng);
                }
            },
        }),
        [onLocationSelect]
    );

    return (
        // The z-0 ensures the map doesn't overlap your navbar or sticky order buttons
        <div className="h-64 w-full rounded-xl overflow-hidden z-0 relative border-2 border-gray-200">
            <MapContainer
                center={position}
                zoom={14}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                {/* The free OpenStreetMap tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                    draggable={true}
                    eventHandlers={eventHandlers}
                    position={position}
                    ref={markerRef}
                    icon={markerIcon}
                >
                    <Popup className="font-bold">
                        Drag me to your exact location!
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
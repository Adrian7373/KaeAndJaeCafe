"use client";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default Leaflet marker icons in Next.js
const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// --- NEW COMPONENT TO FIX THE GREY CHUNKS ---
// This listens for the fullscreen toggle and tells Leaflet to recalculate its grid
function MapResizer({ isFullscreen }: { isFullscreen?: boolean }) {
    const map = useMap();

    useEffect(() => {
        // We use a small 250ms delay so the CSS animation finishes expanding 
        // before Leaflet measures the new container size.
        const timeout = setTimeout(() => {
            map.invalidateSize();
        }, 250);

        return () => clearTimeout(timeout);
    }, [isFullscreen, map]);

    return null;
}

interface Rate {
    distance: number;
    price: number;
}

interface AdminRadiusMapProps {
    rates: Rate[];
    maxRadius: number;
    isFullscreen?: boolean; // <-- Added this
}

export default function AdminRadiusMap({ rates, maxRadius, isFullscreen }: AdminRadiusMapProps) {
    const CAFE_LAT = 15.486781;
    const CAFE_LNG = 121.035926;

    const sortedRates = [...rates].sort((a, b) => b.distance - a.distance);

    return (
        <div className="h-full w-full min-h-[400px] rounded-2xl overflow-hidden z-0 relative">
            <MapContainer
                center={[CAFE_LAT, CAFE_LNG]}
                zoom={13}
                className="h-full w-full z-0"
                scrollWheelZoom={true}
            >
                {/* --- INJECT THE RESIZER COMPONENT HERE --- */}
                <MapResizer isFullscreen={isFullscreen} />

                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={[CAFE_LAT, CAFE_LNG]} icon={customIcon}>
                    <Popup><strong>KAE CAFE</strong></Popup>
                </Marker>

                <Circle
                    center={[CAFE_LAT, CAFE_LNG]}
                    radius={maxRadius * 1000}
                    pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.05, dashArray: '5, 10' }}
                >
                    <Popup><strong>Max Delivery Limit:</strong> {maxRadius}km</Popup>
                </Circle>

                {sortedRates.map((rate, index) => (
                    <Circle
                        key={index}
                        center={[CAFE_LAT, CAFE_LNG]}
                        radius={rate.distance * 1000}
                        pathOptions={{ color: '#9333ea', weight: 2, fillColor: '#9333ea', fillOpacity: 0.08 }}
                    >
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold text-lg">₱{rate.price}</p>
                                <p className="text-gray-500">Up to {rate.distance}km</p>
                            </div>
                        </Popup>
                    </Circle>
                ))}
            </MapContainer>
        </div>
    );
}
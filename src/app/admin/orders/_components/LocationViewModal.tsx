"use client";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const MapView = dynamic(() => import("./MapView"), { ssr: false });

interface Props {
    lat: number;
    lng: number;
    name: string;
    onClose: () => void;
}

export default function LocationViewModal({ lat, lng, name, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">{name}'s Location</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-black"><X size={20} /></button>
                </div>

                {/* The Map Component */}
                <div className="h-80 w-full">
                    <MapView lat={lat} lng={lng} />
                </div>

                <div className="p-4 text-xs text-gray-500 text-center">
                    Coordinates: {lat}, {lng}
                </div>
            </div>
        </div>
    );
}
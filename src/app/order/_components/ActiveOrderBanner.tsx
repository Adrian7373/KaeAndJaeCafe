"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ActiveOrderBanner({ serverOrderId }: { serverOrderId?: string }) {

    const [orderId, setOrderId] = useState<string | null>(serverOrderId || null);

    useEffect(() => {
        if (!serverOrderId) {
            const localId = localStorage.getItem("active_order_id");
            if (localId) {
                setOrderId(localId);
            }
        }
    }, [serverOrderId]);

    if (!orderId) return null;

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <Link
                href={`/track/${orderId}`}
                className="pointer-events-auto flex items-center gap-3 bg-kae-pink text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform"
            >
                <div className="w-3 h-3 bg-kae-purple rounded-full animate-ping absolute"></div>
                <div className="w-3 h-3 bg-kae-purple rounded-full relative"></div>
                <span className="font-bold tracking-wide">View Active Order</span>
                <span>→</span>
            </Link>
        </div>
    );
}
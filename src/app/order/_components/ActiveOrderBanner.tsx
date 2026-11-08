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
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-6 md:justify-start md:px-12 2xl:px-30">
            <Link
                href={`/track/${orderId}`}
                className="pointer-events-auto flex items-center gap-3 rounded-full border-2 border-kae-dark bg-kae-gold px-5 py-3 font-body text-sm font-bold text-kae-dark shadow-[4px_4px_0_0_var(--color-kae-dark)] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-kae-dark)] active:translate-y-0"
            >
                <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-kae-gochujang opacity-70 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-kae-gochujang" />
                </span>
                Track your order
            </Link>
        </div>
    );
}

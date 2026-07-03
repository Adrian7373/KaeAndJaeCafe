"use client";

import { useEffect, useState } from "react";

export default function TrackingClientFeatures({ orderId }: { orderId: string }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        localStorage.setItem("active_order_id", orderId);
    }, [orderId]);

    const handleCopy = async () => {
        try {
            // Grabs the exact URL from their browser window
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000); // Reset after 3 seconds
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <div className="bg-kae-dark rounded-2xl p-6 text-center border border-gray-800">
            <p className="text-kae-light font-bold mb-2">Don't lose your order!</p>
            <p className="text-gray-400 text-sm mb-6">
                Take a screenshot of this page or copy your secure tracking link below.
            </p>

            <button
                onClick={handleCopy}
                className="w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
          bg-white text-kae-dark hover:bg-gray-200"
            >
                {copied ? (
                    <>
                        <span className="text-green-600"></span>
                        Copied to Clipboard!
                    </>
                ) : (
                    <>
                        <span></span>
                        Copy Tracking Link
                    </>
                )}
            </button>
        </div>
    );
}
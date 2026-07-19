"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useCart } from "../../../../context/CartContext";
import { createClient } from "../../../../lib/supabase";
import Image from "next/image";
import { AddOn } from "./MenuCatalog";

interface CartAddOnProps {
    addOns: AddOn[]
}

export default function CartAddOns({ addOns }: CartAddOnProps) {
    const { cart, addToCart } = useCart();

    // Optional: Filter out add-ons that are already in the cart
    const availableAddons = addOns.filter(
        (addon) => !cart.some((cartItem) => cartItem.id === addon.id)
    );

    console.log(addOns)
    if (availableAddons.length === 0) return null;

    return (
        <div className="w-full py-4 border-t border-gray-100 mt-4">
            <p className="text-sm font-bold text-gray-800 mb-3 px-1">You might also like...</p>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {availableAddons.map((item) => (
                    <div
                        key={item.id}
                        className="snap-start shrink-0 w-[140px] bg-white border border-gray-200 rounded-xl p-2 flex flex-col gap-2 shadow-sm"
                    >
                        <div className="w-full h-20 relative rounded-lg overflow-hidden bg-gray-50">
                            {/* Replace with standard <img> if not using next/image */}
                            <Image
                                src={item.image_url || "/placeholder-snack.jpg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex flex-col grow justify-between">
                            <p className="text-xs font-bold leading-tight text-gray-700 line-clamp-2">
                                {item.name}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-sm font-black text-kae-dark">₱{item.discount_price}</p>
                                <button
                                    onClick={() => addToCart({ ...item, qty: 1 })}
                                    className="bg-kae-purple/10 text-kae-purple hover:bg-kae-purple hover:text-white p-1.5 rounded-full transition-colors active:scale-95"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
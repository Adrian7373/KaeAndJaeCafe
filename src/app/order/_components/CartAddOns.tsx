"use client";
import { Plus } from "lucide-react";
import { useCart } from "../../../../context/CartContext";
import { AddOn } from "./MenuCatalog";

interface CartAddOnProps {
    addOns: AddOn[]
}

export default function CartAddOns({ addOns }: CartAddOnProps) {
    const { cart, addToCart } = useCart();

    const availableAddons = addOns.filter(
        (addon) => !cart.some((cartItem) => cartItem.id === addon.id)
    );

    if (availableAddons.length === 0) return null;

    return (
        <div className="border-t-2 border-dashed border-kae-dark/30 pt-4">
            <p className="ed-italic mb-3 text-xl text-kae-dark">Add something on the side</p>

            <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {availableAddons.map((item) => (
                    <li
                        key={item.id}
                        className="flex w-36 shrink-0 snap-start flex-col overflow-hidden rounded-xl border-2 border-kae-dark bg-white"
                    >
                        <div className="h-20 w-full bg-kae-pink-soft">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex grow flex-col justify-between gap-2 p-2.5">
                            <p className="line-clamp-2 text-sm leading-tight font-bold text-kae-dark">{item.name}</p>
                            <div className="flex items-center justify-between">
                                <span className="font-label text-sm text-kae-dark">₱{item.discount_price}</span>
                                <button
                                    type="button"
                                    onClick={() => addToCart({ ...item, imageUrl: item.image_url, price: item.discount_price, qty: 1 })}
                                    aria-label={`Add ${item.name}`}
                                    className="rounded-full bg-kae-purple p-1.5 text-kae-cream transition hover:bg-kae-pink hover:text-kae-dark active:scale-95"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

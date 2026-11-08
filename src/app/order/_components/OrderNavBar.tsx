"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { FlyingClone, useCart } from "@/../context/CartContext";

export default function OrderNavBar() {
    const { toggleCart, cartIconRef, flyingItems, cart } = useCart();
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);

    return (
        <header className="sticky top-0 z-50 border-b-2 border-kae-dark bg-kae-cream/90 backdrop-blur">
            <nav className="mx-auto flex max-w-[1920px] items-center justify-between px-5 py-3 md:px-12 2xl:px-30">
                <Link href="/" className="flex items-center gap-3" aria-label="Kae and Jae Cafe, home">
                    <img className="h-11 w-11" src="/logo.svg" alt="" />
                    <span className="font-pacifico text-lg leading-none text-kae-dark">
                        Kae and
                        <br />
                        Jae Cafe
                    </span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href="/"
                        className="rounded-full px-4 py-2 font-body text-sm font-bold text-kae-dark transition hover:bg-kae-dark hover:text-kae-cream"
                    >
                        Home
                    </Link>
                    <button
                        type="button"
                        onClick={toggleCart}
                        aria-label={`Open cart, ${totalItems} ${totalItems === 1 ? "item" : "items"}`}
                        className="flex items-center gap-2 rounded-full border-2 border-kae-dark bg-kae-pink px-4 py-2 font-body text-sm font-bold text-kae-dark transition hover:bg-kae-gold active:translate-y-px"
                    >
                        <ShoppingBag ref={cartIconRef} size={18} strokeWidth={2.4} />
                        <span className="hidden sm:inline">Cart</span>
                        <span className="min-w-6 rounded-full bg-kae-dark px-1.5 py-0.5 text-center font-label text-xs text-kae-cream">
                            {totalItems}
                        </span>
                    </button>
                </div>
            </nav>

            {flyingItems.map((item) => (
                <FlyingClone key={item.id} item={item} />
            ))}
        </header>
    );
}

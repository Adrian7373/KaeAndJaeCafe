"use client";

import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/../context/CartContext";
import { FlyingClone } from "@/../context/CartContext";
import { useRouter } from "next/navigation";

export default function OrderNavBar() {

    const { toggleCart, cartIconRef, flyingItems, cart, isOpen } = useCart();
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    const router = useRouter();

    return (
        <>
            <header className="fixed w-full max-w-9xl z-50">
                <nav className="flex py-2 px-4 items-center justify-between bg-kae-pink md:bg-kae-pink 2xl:px-30 2xl:py-5">
                    <div className="flex items-center gap-3">
                        <a href="#"><img className="w-15 h-15" src="logo.svg" alt="Kae and Jae logo" /></a>
                        <div className="flex flex-col font-pacifico">
                            <h1 className="hidden">Kae and Jae</h1>
                            <h1 className="text-kae-dark text-lg ">Kae and</h1>
                            <h1 className="text-kae-dark text-lg ">Jae Cafe</h1>
                        </div>
                    </div>
                    <div className="gap-5 flex items-center">
                        <button className="text-kae-dark font-semibold 2xl:text-lg transition duration-300 hover:bg-kae-dark hover:text-kae-light lg:py-2 lg:px-4 rounded-full" onClick={() => router.push("/")}>Home</button>

                        {isOpen ? (
                            <X onClick={toggleCart} />
                        ) : (
                            <div>
                                <ShoppingBag ref={cartIconRef} onClick={toggleCart} />
                                <p className="absolute top-10 right-3.5 text-kae-light rounded-full aspect-square text-[8px] bg-kae-dark px-1">{totalItems}</p>
                            </div>
                        )}


                    </div>
                </nav>

                {flyingItems.map((item) => (
                    <FlyingClone key={item.id} item={item} />
                ))}

            </header>

        </>
    )
}
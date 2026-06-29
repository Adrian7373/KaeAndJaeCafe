"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../../../context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

interface Product {
    imageUrl: string,
    id: string,
    name: string,
    image_path: string,
    price: number,
    discount_price: number,
    is_available: boolean,
    est_prep_time: string,
    category: string
}

interface MenuCatalogProps {
    products: Product[]
}

export default function MenuCatalog({ products }: MenuCatalogProps) {

    const { cart, addToCart, isOpen } = useCart();
    const [activeTab, setActiveTab] = useState('Chicken');
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const scrollRef = useRef(null);

    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    const totalPrice = cart.reduce((total, item) => total + item.price, 0);

    const categories = ["Featured", "Group Meals", "Chicken", "Waffles", "Corndogs",
        "Rice Meals", "Milk Tea", "Fruit Tea", "Noodles"];

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            setIsAtStart(scrollLeft <= 1);
            setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1);
        }
    }

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [])

    const scroll = (direction: string) => {
        if (scrollRef.current) {
            const scrollAmount = 150;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            })
        }
    }

    return (
        <>
            <section>
                {/* Mobile Screensize */}
                <div className="flex mt-19 justify-center border-b max-w-max">

                    {/* Left Chevron */}
                    <button
                        onClick={() => scroll('left')}
                        disabled={isAtStart}
                        className={`p-3 transition-colors
                                ${isAtStart ? "text-gray-300 cursor-not-allowed" : "text-[#2D0A4E] hover:bg-gray-100"}`}
                        aria-label="Scroll left"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Menu Categories */}
                    <div ref={scrollRef} onScroll={checkScroll} className="flex flex-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

                        <style dangerouslySetInnerHTML={{
                            __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}} />

                        {categories.map((category) => (
                            <button onClick={() => setActiveTab(category)} key={category} className={`shrink-0 px-3.5 py-2 text-base transition-colors
                                    ${activeTab === category
                                    ? "border-b-4 border-kae-pink"
                                    : ""
                                }`}>{category}</button>
                        ))}
                    </div>

                    {/* Right Chevron */}
                    <button
                        onClick={() => scroll('right')}
                        disabled={isAtEnd}
                        className={`p-3 transition-colors
                                ${isAtEnd ? "text-gray-300 cursor-not-allowed" : "text-[#2D0A4E] hover:bg-gray-100"}`}
                        aria-label="Scroll right"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                </div>

                {/* Menu list */}
                <div className="grid grid-cols-2 px-4 py-6 gap-2">
                    {products.filter(product => product.is_available && product.category === activeTab).map((product) => (
                        <div key={product.id} className="flex flex-col h-full bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative w-full aspect-square">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 300px"
                                />
                            </div>
                            <div className="flex flex-col flex-grow p-4 gap-1">
                                <p>{product.name}</p>
                                <div className="flex flex-col align-center mt-auto justify-between">
                                    <p className="font-semibold">₱{product.price}</p>
                                    <button onClick={() => addToCart(product)} className="bg-kae-dark text-kae-light px-2 py-1 rounded-md">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={`w-full bg-kae-light p-4 top-19 min-h-10/12 flex flex-col ${!isOpen ? "hidden" : "absolute"}`}>
                    <div className="flex flex-col bg-kae-light w-full flex-grow">
                        {cart?.map((item) => (
                            <div key={item.id} className="flex border-b align-center justify-between min-h-12 p-2">
                                <div className="flex gap-2 align-center">
                                    <div className="flex gap-1">
                                        {item.qty === 1 ? (
                                            <Trash2 height={"1rem"} width={"1rem"} className="m-auto" />
                                        ) : (
                                            <Minus height={"1rem"} width={"1rem"} className="m-auto" />
                                        )}

                                        <p className="h-max m-auto px-1 rounded-lg bg-kae-purple text-kae-light pr-1.5 pb-1">{item.qty}x</p>
                                        <Plus height={"1rem"} width={"1rem"} className="m-auto" />
                                    </div>
                                    <p>{item.name}</p>
                                </div>
                                <p>₱{item.price}</p>
                            </div>
                        ))}

                    </div>
                    <div className="flex flex-col justify-center gap-3">
                        <div>
                            <div className="flex justify-between">
                                <p>Subtotal</p>
                                <p>₱{totalPrice}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Delivery Fee</p>
                                <p>₱49</p>
                            </div>
                            <div className="flex justify-between font-bold">
                                <p>Total</p>
                                <p>₱{totalPrice + 49}</p>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-kae-dark text-kae-light text-xl rounded-lg">Proceed to Checkout</button>
                    </div>
                </div>
            </section>
        </>
    )
}
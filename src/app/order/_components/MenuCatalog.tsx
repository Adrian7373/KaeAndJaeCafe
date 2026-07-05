"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../../../context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export interface Product {
    imageUrl: string;
    id: string;
    name: string;
    image_path: string;
    price: number;
    discount_price: number;
    is_available: boolean;
    est_prep_time: string;
    product_category?: {
        name: string
    };
}

export interface MenuCatalogProps {
    products: Product[]
}

export default function MenuCatalog({ products }: MenuCatalogProps) {

    const { cart, addToCart, isOpen, incrementItem, decrementItem, toggleCart } = useCart();
    const [activeTab, setActiveTab] = useState('Chicken');
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);

    const categories = ["Featured", "Group Meals", "Chicken", "Waffles", "Corndogs",
        "Rice Meals", "Milk Tea", "Fruit Tea", "Noodles"];

    const router = useRouter();


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
                    {products.filter(product => product.is_available && product.product_category?.name === activeTab).map((product) => (
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
                                    <button onClick={(e) => addToCart(product, e)} className="bg-kae-dark text-kae-light px-2 py-1 rounded-md">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={`w-full bg-kae-light p-4 top-[72px] bottom-0 left-0 right-0 z-40 min-h-10/12 flex flex-col ${!isOpen ? "hidden" : "fixed"}`}>
                    <div className="flex flex-col bg-kae-light w-full flex-grow pt-5">
                        {cart.length === 0 ? (
                            <div className="flex flex-col justify-center items-center gap-5 m-auto">
                                <p className="text-xl font-semibold">Your Cart is Empty</p>
                                <button onClick={toggleCart} className="px-4 py-2 bg-kae-dark text-kae-light text-lg rounded-lg">+ Add items</button>
                            </div>
                        ) : (
                            cart?.map((item) => (
                                <div key={item.id} className="flex border-b align-center justify-between min-h-16 p-2">
                                    <div className="flex gap-2 items-center">
                                        <div className="flex gap-1">
                                            {item.qty === 1 ? (
                                                <Trash2 height={"1rem"} width={"1rem"} className="m-auto" onClick={() => decrementItem(item)} />
                                            ) : (
                                                <Minus height={"1rem"} width={"1rem"} className="m-auto" onClick={() => decrementItem(item)} />
                                            )}

                                            <p className="h-max m-auto px-1 rounded-lg bg-kae-purple text-kae-light pr-1.5 pb-1">{item.qty}x</p>
                                            <Plus height={"1rem"} width={"1rem"} className="m-auto" onClick={() => incrementItem(item)} />
                                        </div>
                                        <p className="px-2">{item.name}</p>
                                    </div>
                                    <p className="content-center">₱{item.price}</p>
                                </div>
                            ))
                        )}


                    </div>
                    <div className="flex flex-col justify-center gap-3">
                        <div>
                            <div className="flex justify-between">
                                <p>Subtotal</p>
                                <p>₱{totalPrice}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Delivery Fee</p>
                                <p>{cart.length === 0 ? "₱0" : "₱49"}</p>
                            </div>
                            <div className="flex justify-between font-bold">
                                <p>Total</p>
                                <p>{cart.length === 0 ? "₱0" : `₱${totalPrice + 49}`}</p>
                            </div>
                        </div>
                        <button disabled={cart.length === 0} onClick={() => { toggleCart(); router.push("/checkout") }} className={`px-6 py-3 text-kae-light text-xl rounded-lg ${cart.length === 0 ? "bg-gray-500" : "bg-kae-dark"}`}>Proceed to Checkout</button>
                    </div>
                </div>
            </section>
        </>
    )
}
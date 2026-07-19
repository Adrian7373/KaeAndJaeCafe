"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../../../context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CartAddOns from "./CartAddOns";

export interface AddOn {
    id: string,
    name: string,
    discount_price: number,
    image_path: string,
    image_url: string
}

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

export interface Category {
    id: string;
    name: string
}

export interface MenuCatalogProps {
    products: Product[]
    isStoreOpen: boolean
    categories: Category[]
    mode?: 'default' | 'replacement'
    onSelectReplacement?: (product: Product) => void
    addOns: AddOn[]
}


export default function MenuCatalog({ products, isStoreOpen, categories, mode = "default", onSelectReplacement, addOns }: MenuCatalogProps) {

    const { cart, addToCart, isOpen, incrementItem, decrementItem, toggleCart } = useCart();
    const [activeTab, setActiveTab] = useState('All Items');
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const totalPrice = cart.reduce((total, item) => total + item.discount_price * item.qty, 0);

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
            <section className="flex flex-col min-h-dvh">
                {/* Mobile Screensize */}
                <div className="flex mt-19 justify-center border-b 2xl:mt-25">

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
                    <div ref={scrollRef} onScroll={checkScroll} className="flex flex-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 xl:justify-center"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

                        <style dangerouslySetInnerHTML={{
                            __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}} />

                        <button
                            onClick={() => setActiveTab('All Items')}
                            className={`cursor-pointer hover:bg-gray-200 shrink-0 px-3.5 xl:px-5 py-2 snap-start text-base transition-colors lg:text-lg
                                ${activeTab === 'All Items'
                                    ? "border-b-4 border-kae-pink font-bold"
                                    : "text-gray-600"
                                }`}
                        >
                            All Items
                        </button>

                        {categories.map((category) => (
                            <button onClick={() => setActiveTab(category.name)} key={category.id} className={`cursor-pointer hover:bg-gray-200 shrink-0 px-3.5 xl:px-5 py-2 snap-start text-base transition-colors lg:text-lg
                                    ${activeTab === category.name
                                    ? "border-b-4 border-kae-pink"
                                    : ""
                                }`}>{category.name}</button>
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
                <div className="flex-grow max-h-dvh w-full overflow-x-auto">
                    {(() => {
                        const filteredProducts = products
                            .filter(product => {
                                if (!product.is_available) return false;
                                if (activeTab === 'All Items') return true;
                                return product.product_category?.name === activeTab;
                            })
                            .sort((a, b) => {
                                if (activeTab === 'All Items') {
                                    const catA = a.product_category?.name || "";
                                    const catB = b.product_category?.name || "";
                                    return catA.localeCompare(catB);
                                }
                                return 0;
                            });

                        if (filteredProducts.length === 0) {
                            return (
                                <div className="w-full flex flex-col items-center justify-center py-24 px-4 text-center">
                                    <p className="text-2xl font-bold text-gray-400">No products in this category yet</p>
                                    <p className="text-gray-500 mt-2">Check back later or explore other categories!</p>
                                </div>
                            );
                        }

                        return (
                            <div className="w-full grid grid-cols-2 px-4 py-6 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 xl:px-15 2xl:px-30 min-[1920px]:grid-cols-8">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="flex flex-col h-full bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="relative w-full aspect-square">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 300px"
                                            />
                                        </div>
                                        <div className="flex flex-col flex-grow p-4 gap-1">
                                            <p className="2xl:text-md">{product.name}</p>
                                            <div className="flex flex-col align-center mt-auto justify-between">
                                                <p className="line-through text-gray-400 decoration-2 text-sm 2xl:text-lg">₱{product.price}</p>
                                                <p className="font-semibold text-lg">₱{product.discount_price.toFixed(2)}</p>
                                                {/* Conditional button */}
                                                {mode === 'replacement' ? (
                                                    <button
                                                        onClick={() => onSelectReplacement?.(product)}
                                                        className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                                                    >
                                                        Select Replacement
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => addToCart(product, e)}
                                                        className="bg-kae-purple text-kae-light px-2 py-1 rounded-md hover:bg-purple-700 transition-colors duration-200 cursor-pointer"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
                {/* CART Overlay*/}
                {mode === "default" && (
                    <div
                        className={`
                        fixed top-[75px] bottom-0 right-0 z-[80] 
                        w-full md:w-[450px]  lg:w-[550px] 2xl:top-[100px]
                        bg-kae-light p-4 flex flex-col 
                        shadow-2xl md:shadow-[-4px_0_20px_-5px_rgba(0,0,0,0.15)] md:border-l border-gray-300
                        transition-transform duration-300 ease-in-out
                        ${isOpen ? "translate-x-0" : "translate-x-full"}
                    `}
                    >
                        <div className="flex flex-col bg-kae-light w-full flex-grow pt-5 overflow-y-auto">
                            {cart.length === 0 ? (
                                <div className="flex flex-col justify-center items-center gap-5 m-auto">
                                    <p className="text-xl font-semibold">Your Cart is Empty</p>
                                    <button onClick={toggleCart} className="px-4 py-2 bg-kae-dark text-kae-light text-lg rounded-lg cursor-pointer hover:bg-kae-purple transition-colors duration-200">
                                        + Add items
                                    </button>
                                </div>
                            ) : (
                                cart?.map((item) => (
                                    <div key={item.id} className="flex border-b align-center justify-between min-h-16 p-2">
                                        <div className="flex gap-2 items-center">
                                            <div className="flex gap-1">
                                                {item.qty === 1 ? (
                                                    <Trash2 className="m-auto w-8 h-8 cursor-pointer" onClick={() => decrementItem(item)} />
                                                ) : (
                                                    <Minus className="m-auto w-8 h-8 cursor-pointer" onClick={() => decrementItem(item)} />
                                                )}

                                                <p className="h-max m-auto px-1 rounded-lg bg-kae-purple text-kae-light pr-1.5 pb-1 sm:text-lg">{item.qty}x</p>
                                                <Plus className="m-auto w-8 h-8 cursor-pointer" onClick={() => incrementItem(item)} />
                                            </div>
                                            <p className="px-2 sm:text-lg">{item.name}</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="content-center text-sm line-through text-gray-400">₱{item.price}</p>
                                            <p className="content-center font-semibold text-md sm:text-lg">₱{item.discount_price}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <CartAddOns addOns={addOns} />
                        <div className="flex flex-col justify-center gap-3 mt-auto pt-4 bg-kae-light border-t border-gray-200">
                            {!isStoreOpen && (
                                <p className="text-center text-sm font-bold text-red-500">The store is currently closed. Please check again later.</p>
                            )}
                            <div>
                                <div className="flex justify-between text-lg px-2">
                                    <p className="font-semibold">Subtotal</p>
                                    <p className="font-bold">{cart.length === 0 ? "₱0" : `₱${totalPrice.toFixed(2)}`}</p>
                                </div>
                            </div>
                            <button
                                disabled={cart.length === 0 || !isStoreOpen}
                                onClick={() => { toggleCart(); router.push("/checkout") }}
                                className={`px-6 py-3 text-kae-light font-bold text-xl rounded-lg transition-colors duration-200 
                                ${(cart.length === 0 || !isStoreOpen)
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-kae-dark hover:bg-kae-purple shadow-md active:scale-95 cursor-pointer"
                                    }`}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}

            </section>
        </>
    )
}
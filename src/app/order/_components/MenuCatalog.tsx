"use client";

import { useEffect, useRef, useState } from "react";

interface Product {
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

    const [activeTab, setActiveTab] = useState('Chicken');
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const scrollRef = useRef(null);

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
                <div className="grid">
                    {products.filter(product => product.is_available && product.category === activeTab).map((product) => (
                        <div key={product.id}>
                            <p>image to</p>
                            <p>{product.name}</p>
                            <p>{product.price}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
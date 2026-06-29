"use client";

import { createContext, ReactNode, useContext, useState } from "react"

type CartItem = {
    id: string;
    name: string;
    price: number;
    qty: number;
    imageUrl: string;
}

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: any) => void;
    isOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const toggleCart = () => {
        setIsOpen(prev => !prev);
    }

    const addToCart = (product: any) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) => {
                    return item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                });
            }
            return [...prevCart, { ...product, qty: 1 }];
        })

    }

    return (
        <CartContext.Provider value={{ cart, addToCart, isOpen, toggleCart }} >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}

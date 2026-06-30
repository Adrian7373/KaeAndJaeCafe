"use client";

import { createContext, ReactNode, useContext, useState, useRef, useEffect } from "react"

type CartItem = {
    id: string;
    name: string;
    price: number;
    qty: number;
    imageUrl: string;
};

type FlyingItem = {
    id: number;
    image: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: any, event?: React.MouseEvent) => void;
    isOpen: boolean;
    toggleCart: () => void;
    incrementItem: (product: CartItem) => void;
    decrementItem: (product: CartItem) => void;
    cartIconRef: React.Ref<SVGSVGElement>;
    flyingItems: FlyingItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

    const cartIconRef = useRef<SVGSVGElement>(null);

    const toggleCart = () => {
        setIsOpen(prev => !prev);
    }

    const incrementItem = (product: CartItem) => {
        setCart((prevCart) => {
            return prevCart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
        })
    }

    const decrementItem = (product: CartItem) => {
        setCart((prevCart) => {
            if (product.qty === 1) {
                return prevCart.filter((item) => item.id !== product.id)
            }
            return prevCart.map((item) => item.id === product.id ? { ...item, qty: item.qty - 1 } : item)
        })
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
        });


        if (event && cartIconRef.current) {
            const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
            const cartRect = cartIconRef.current.getBoundingClientRect();

            const newFlyer = {
                id: Date.now(),
                image: product.imageUrl,
                startX: buttonRect.left,
                startY: buttonRect.top,
                endX: cartRect.left,
                endY: cartRect.top,
            };

            setFlyingItems((prev) => [...prev, newFlyer]);

            setTimeout(() => {
                setFlyingItems((prev) => prev.filter((item) => item.id !== newFlyer.id));
            }, 700);
        }
    };




    return (
        <CartContext.Provider value={{ cart, addToCart, isOpen, toggleCart, incrementItem, decrementItem, cartIconRef, flyingItems }} >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}

export function FlyingClone({ item }: { item: any }) {
    const [pos, setPos] = useState({ x: item.startX, y: item.startY, scale: 1, opacity: 1 });

    useEffect(() => {
        const timer = setTimeout(() => {
            setPos({ x: item.endX, y: item.endY, scale: 0.2, opacity: 0 });
        }, 10);

        return () => clearTimeout(timer);
    }, [item]);

    return (
        <img
            src={item.image}
            className="fixed z-[100] w-16 h-16 rounded-full object-cover shadow-2xl transition-all duration-700 ease-in-out pointer-events-none"
            style={{
                left: pos.x,
                top: pos.y,
                transform: `scale(${pos.scale})`,
                opacity: pos.opacity,
            }}
        />
    );
}

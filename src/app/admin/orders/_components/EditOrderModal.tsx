"use client";

import { useState } from "react";
import { ChevronLeft, MapPin, Phone, Square, Plus, Minus } from "lucide-react";
import { Order, OrderItem, Product } from "../page";

interface EditOrderModalProps {
    order: Order;
    catalog: Product[];
    onClose: () => void;
    onConfirm: (updatedItems: OrderItem[]) => Promise<void>;
}

export default function EditOrderModal({ order, onClose, onConfirm, catalog }: EditOrderModalProps) {

    // 1. Core Sandbox State: Tracks edits before they are sent to the database
    const [editableItems, setEditableItems] = useState<OrderItem[]>(() =>
        order.order_items
            ? order.order_items.map((item) => ({
                ...item,
                price_at_checkout: item.price_at_checkout ?? item.product.discount_price,
            }))
            : []
    );

    // 2. UI Control States
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingItem, setIsAddingItem] = useState(false);

    const handleAddNewItem = (product: Product) => {
        setEditableItems((prev) => {
            const existingIndex = prev.findIndex(item => item.product.id === product.id);

            if (existingIndex >= 0) {
                // It's already in the cart, just add 1
                const newItems = [...prev];
                newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + 1 };
                return newItems;
            }

            // Brand new item
            return [...prev, { quantity: 1, product }];
        });

        // Snap back to the order view immediately
        setIsAddingItem(false);
    };

    // 3. Handlers
    const handleQuantityChange = (index: number, delta: number) => {
        setEditableItems((prev) => {
            const newItems = [...prev];
            const currentQty = newItems[index].quantity;

            if (currentQty + delta > 0) {
                // Update quantity
                newItems[index] = { ...newItems[index], quantity: currentQty + delta };
            } else if (currentQty + delta === 0) {
                // Remove item completely if it hits 0
                newItems.splice(index, 1);
            }
            return newItems;
        });
    };

    const handleConfirmClick = async () => {
        setIsSaving(true);
        await onConfirm(editableItems);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[70] flex flex-col bg-pink-50/30 backdrop-blur-md animate-in slide-in-from-bottom-4">

            {/* Modal Container */}
            <div className="flex-1 flex flex-col bg-[#fffafc] w-full max-w-md mx-auto shadow-2xl overflow-hidden h-full">

                {/* HEADER */}
                <div className="bg-[#e89bbd] text-[#4a1c40] flex items-center p-4 shadow-sm z-10">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-2 -ml-2 mr-2 rounded-full hover:bg-black/10 transition-colors"
                    >
                        <ChevronLeft strokeWidth={3} />
                    </button>
                    <h1 className="font-extrabold tracking-widest text-lg">EDIT ORDER</h1>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">

                    {/* Customer Info Card */}
                    <div className="bg-white border border-orange-400 rounded-xl overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center p-3 border-b border-orange-400">
                            <div className="flex items-center gap-2">
                                <Square fill="#f97316" strokeWidth={0} size={16} />
                                <p className="font-bold text-sm text-gray-900">
                                    {order.first_name} {order.last_name}
                                </p>
                            </div>
                            <p className="text-xs font-bold text-gray-700">
                                {new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </p>
                        </div>
                        <div className="p-4 space-y-3 bg-white">
                            <p className="font-extrabold text-gray-900 text-sm tracking-wide">
                                {order.payment_method}
                            </p>
                            <div className="flex gap-3 text-sm text-gray-800 items-start font-medium">
                                <MapPin size={18} className="shrink-0 mt-0.5" strokeWidth={2.5} />
                                <p>{order.delivery_address || `Pickup at ${order.pickup_time}`}</p>
                            </div>
                            <div className="flex gap-3 text-sm text-gray-800 items-center font-medium">
                                <Phone size={18} className="shrink-0" strokeWidth={2.5} />
                                <p>{order.contact}</p>
                            </div>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-extrabold text-[#4a1c40] tracking-wider text-lg">
                                {isAddingItem ? "SELECT ITEM" : "ORDERS"}
                            </h2>
                            {isAddingItem && (
                                <button
                                    onClick={() => setIsAddingItem(false)}
                                    className="text-sm font-bold text-red-500 hover:text-red-700"
                                >
                                    CANCEL
                                </button>
                            )}
                        </div>

                        {!isAddingItem ? (
                            // --- NORMAL ORDER VIEW ---
                            <div className="space-y-3">
                                {editableItems.map((item, index) => (
                                    <div key={index} className="bg-[#b3b3b3] rounded-lg p-3 flex items-center shadow-sm">
                                        {/* Left: Quantity Controls */}
                                        <div className="flex items-center gap-3 mr-4">
                                            <button onClick={() => handleQuantityChange(index, -1)} className="text-gray-800 hover:text-black font-bold p-1 active:scale-95 transition-transform">
                                                <Minus size={20} strokeWidth={2.5} />
                                            </button>
                                            <span className="text-2xl font-medium w-4 text-center text-black">{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(index, 1)} className="text-gray-800 hover:text-black font-bold p-1 active:scale-95 transition-transform">
                                                <Plus size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                        {/* Middle: Item Details */}
                                        <div className="flex-1 pr-2">
                                            <p className="font-extrabold text-[13px] text-black leading-tight">{item.product.name}</p>
                                        </div>
                                        {/* Right: Price */}
                                        <p className="font-medium text-xs text-black">₱{((item.price_at_checkout ?? item.product.discount_price ?? 0) * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}

                                {/* The Toggle Button */}
                                <button
                                    onClick={() => setIsAddingItem(true)}
                                    className="w-full mt-2 flex items-center justify-center gap-2 py-4 border border-black bg-transparent hover:bg-black/5 rounded-lg text-black font-medium transition-colors"
                                >
                                    <Plus size={20} strokeWidth={1.5} />
                                    Add an Item
                                </button>
                            </div>
                        ) : (
                            // --- CATALOG SELECTION VIEW ---
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                {/* Optional: Search Bar could go here in the future! */}

                                {catalog.length === 0 ? (
                                    <p className="text-center text-gray-500 py-4">No products found in catalog.</p>
                                ) : (
                                    catalog.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleAddNewItem(product)}
                                            className="w-full bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm hover:border-orange-400 active:scale-[0.98] transition-all"
                                        >
                                            <p className="font-extrabold text-gray-900 text-sm text-left">{product.name}</p>
                                            <div className="flex items-center gap-3">
                                                <p className="font-medium text-gray-600">₱{product.discount_price.toFixed(2)}</p>
                                                <div className="bg-[#34a853] text-white p-1 rounded-md">
                                                    <Plus size={16} strokeWidth={3} />
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-5 bg-transparent flex gap-4 pb-8">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1 py-3.5 border border-red-500 text-red-600 font-bold tracking-wide rounded-xl bg-white hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleConfirmClick}
                        disabled={isSaving}
                        className="flex-1 py-3.5 bg-[#34a853] text-white font-bold tracking-wide rounded-xl hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50 flex justify-center"
                    >
                        {isSaving ? "SAVING..." : "CONFIRM"}
                    </button>
                </div>
            </div>
        </div>
    );
}
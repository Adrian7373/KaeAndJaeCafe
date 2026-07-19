"use client";

import { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Product, Category } from "../page";

interface ProductFormModalProps {
    product: Partial<Product>;
    categories: Category[];
    onClose: () => void;
    onSave: (updatedData: any, newImageFile: File | null) => Promise<void>;
}

export default function ProductFormModal({ product, categories, onClose, onSave }: ProductFormModalProps) {
    // Form States
    const [name, setName] = useState(product.name || "");
    const [price, setPrice] = useState(product.price?.toString() || "");
    const [discountPrice, setDiscountPrice] = useState(product.discount_price?.toString() || "");
    const [prepTime, setPrepTime] = useState(product.est_prep_time || "");
    const [categoryId, setCategoryId] = useState(product.product_category?.id || "");

    // NEW: Add-on State
    const [isAddon, setIsAddon] = useState(product.is_addon || false);

    // Image States
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(product.image_url || null);

    // UI States
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditing = !!product.id;

    // Handle Image Selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSaveClick = async () => {
        if (!name || !price) {
            alert("Name and Price are required.");
            return;
        }

        setIsSaving(true);

        const updatedData = {
            id: product.id,
            name,
            price: parseFloat(price),
            discount_price: discountPrice ? parseFloat(discountPrice) : null,
            est_prep_time: prepTime,
            category_id: categoryId || null,
            is_addon: isAddon, // <-- NEW: Included in save payload
        };

        await onSave(updatedData, imageFile);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-xl">
                        {isEditing ? "Edit Menu Item" : "New Menu Item"}
                    </h2>
                    <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-700 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">

                    {/* Image Upload Area */}
                    <div className="flex flex-col items-center gap-3">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden transition-colors relative group"
                        >
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                                        <Upload className="text-white" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="text-gray-400 mb-2" size={32} />
                                    <span className="text-xs font-bold text-gray-500">UPLOAD</span>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    {/* Inputs */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">ITEM NAME</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                            placeholder="e.g. Classic Waffle"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">CATEGORY</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500 bg-white font-medium"
                        >
                            <option value="" disabled>Select a category...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">PRICE (₱)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500 font-medium"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">DISCOUNT PRICE (₱)</label>
                            <input
                                type="number"
                                value={discountPrice}
                                onChange={(e) => setDiscountPrice(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500 font-medium"
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">ESTIMATED PREP TIME (MINS)</label>
                        <input
                            type="number"
                            value={prepTime}
                            onChange={(e) => setPrepTime(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-purple-500 font-medium"
                            placeholder="e.g. 15"
                        />
                    </div>

                    {/* NEW: Checkout Add-on Toggle */}
                    <div>
                        <label className="flex items-center justify-between cursor-pointer p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors">
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Checkout Add-on</p>
                                <p className="text-xs text-gray-500 mt-0.5">Show this item as a quick add-on in the cart</p>
                            </div>
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isAddon}
                                    onChange={(e) => setIsAddon(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="cursor-pointer flex-1 py-3.5 font-bold bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 duration-300"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleSaveClick}
                        disabled={isSaving}
                        className="cursor-pointer duration-300 flex-1 py-3.5 bg-[#34a853] text-white font-bold tracking-wide rounded-xl hover:bg-green-600 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center"
                    >
                        {isSaving ? "SAVING..." : "SAVE ITEM"}
                    </button>
                </div>

            </div>
        </div>
    );
}
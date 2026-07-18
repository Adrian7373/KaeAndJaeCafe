"use client";

import { Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteCategory } from "@/app/actions";

interface Category {
    id: string;
    name: string;
}

interface DeleteCategoryModalProps {
    categories: Category[];
}

export default function DeleteCategoryModal({ categories }: DeleteCategoryModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [isPending, startTransition] = useTransition();
    console.log(categories);

    const handleDelete = () => {
        if (!selectedCategoryId) return;

        const categoryToDelete = categories.find(c => String(c.id) === String(selectedCategoryId));

        // Final safety check before hitting the database
        const confirmed = window.confirm(
            `Are you sure you want to delete the "${categoryToDelete?.name}" category?\n\nProducts inside this category will NOT be deleted, but they will become uncategorized.`
        );

        if (confirmed) {
            startTransition(async () => {
                const result = await deleteCategory(selectedCategoryId);

                if (!result?.success) {
                    alert(`Error: ${result?.error}`);
                } else {
                    // Reset and close modal on success
                    setIsOpen(false);
                    setSelectedCategoryId("");
                }
            });
        }
    };

    return (
        <>
            {/* The Main Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 my-5 lg:my-0 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold transition-all hover:bg-red-500 hover:text-white active:scale-95"
            >
                <Trash2 size={20} />
                Delete a Category
            </button>

            {/* The Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b pb-3">
                            <h2 className="text-xl font-bold text-gray-800">Delete Category</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                disabled={isPending}
                                className="text-gray-400 hover:text-gray-800 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600">
                            Select a category to remove. Products inside will become uncategorized.
                        </p>

                        {/* Category Dropdown */}
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            disabled={isPending}
                            className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all disabled:opacity-50"
                        >
                            <option value="" disabled>-- Select Category --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {/* Modal Footer Actions */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setIsOpen(false)}
                                disabled={isPending}
                                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending || !selectedCategoryId}
                                className="flex items-center justify-center gap-2 px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                            >
                                {isPending ? (
                                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                ) : (
                                    "Confirm Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
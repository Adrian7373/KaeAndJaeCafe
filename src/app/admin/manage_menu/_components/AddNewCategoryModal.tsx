"use client";
import { X } from "lucide-react"
import { useState } from "react";

interface NewCategoryModalProps {
    toggleClose: () => void
    onSave: (newCategory: string) => void
}

export default function NewCategoryModal({ toggleClose, onSave }: NewCategoryModalProps) {

    const [newCategory, setNewCategory] = useState("");

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-white relative shadow-md px-6 py-6 flex flex-col gap-2 rounded-xl">
                    <p className="text-xl font-semibold">Add new Category</p>
                    <input onChange={(e) => setNewCategory(e.target.value)} className="border-1 border-gray-400 py-4 px-2 text-lg outline-none rounded-xl" type="text" />
                    <X onClick={toggleClose} className="w-8 h-8 absolute right-4 top-4 rounded-full hover:bg-gray-300 transition-colors duration-300" />
                    <div className="flex gap-2 justify-center">
                        <button onClick={toggleClose} className="hover:bg-kae-dark transition-colors duration-300 hover:text-kae-light text-md px-9 py-4 border-1 border-kae-dark text-kae-dark rounded-3xl font-semibold">CANCEL</button>
                        <button disabled={newCategory.length < 3} onClick={() => onSave(newCategory)} className={` ${newCategory.length < 3 ? "bg-gray-400 cursor-not-allowed" : "bg-kae-dark"} hover:bg-purple-900 text-md px-15 py-4 text-kae-light rounded-3xl font-semibold transition-colors duration-300`}>SAVE</button>
                    </div>
                </div>
            </div>
        </>
    )
}
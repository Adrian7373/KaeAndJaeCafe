"use client";
import { OrderItem } from "../page"

interface Item {
    orderItem: OrderItem,
    orderId: string,
    onClose: () => void,
    onProceed: (id: string, orderId: string) => void,
}

export default function RemoveItemModal({ orderItem, onClose, onProceed, orderId }: Item) {

    const { id, product } = orderItem;

    return (
        <>
            <div className="bg-black/50 fixed inset-0 z-40 flex justify-center items-center px-7">
                <div className="flex flex-col items-center justify-center p-6 bg-white w-content rounded-lg gap-4">
                    <p>Mark <b>{product.name}</b> as Out of Stock? This will send a notification to the customer.</p>
                    <div className="flex gap-3">
                        <button className="px-8 py-4 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 text-md font-semibold" onClick={onClose}>
                            CANCEL
                        </button>
                        <button className="px-8 py-4 bg-red-500 rounded-lg cursor-pointer hover:bg-red-700 text-md font-semibold text-kae-light" onClick={() => onProceed(id || "", orderId)}>
                            PROCEED
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
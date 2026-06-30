"use client";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import TimePicker from "./_components/TimePicker";
import { useCart } from "../../../context/CartContext";
import { useRouter } from "next/navigation";
import { placeOrder } from "../actions";


export default function CheckoutPage() {

    const [isDelivery, setIsDelivery] = useState(true);
    const { cart } = useCart();
    const router = useRouter();
    const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);

    return (
        <>
            <header className="fixed w-full max-w-9xl z-50">
                <nav className="flex py-2 px-4 items-center justify-between bg-kae-pink md:bg-kae-pink 2xl:px-30 2xl:py-5">
                    <div onClick={() => router.back()} className="flex h-10 items-center">
                        <ChevronLeft className="mt-0.5" />
                        <p>Back to Menu</p>
                    </div>
                </nav>
            </header>
            <form action={placeOrder} className="mt-14 px-4 py-5 flex flex-col gap-4">
                {/* Customer Details */}
                <div className="bg-kae-light px-4 py-4 flex flex-col gap-2">
                    <p className="border-b pb-3 mb-2 border-gray-400 text-lg">Customer Details</p>
                    <div className="flex flex-col gap-2">
                        <div className="relative">
                            <input autoFocus name="firstName" id="firstName" type="text" placeholder="First Name" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                            <label htmlFor="firstName" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">First Name</label>
                        </div>
                        <div className="relative">
                            <input name="lastName" id="lastName" type="text" placeholder="Last Name" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                            <label htmlFor="lastName" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Last Name</label>
                        </div>
                        <div className="relative">
                            <input name="contact" id="contact" type="text" placeholder="Mobile Number" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                            <label htmlFor="contact" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Mobile Number</label>
                        </div>
                    </div>
                </div>

                {/* Order Type */}
                <div className="bg-kae-light px-4 py-4 flex flex-col gap-2">
                    <p className="border-b pb-3 mb-2 border-gray-400 text-lg">Order Type</p>
                    <label className="border-1 border-gray-500  rounded-xl px-4 py-4 flex gap-2 cursor-pointer" htmlFor="delivery">
                        <input
                            name="orderType"
                            id="delivery"
                            type="radio"
                            value={"delivery"}
                            checked={isDelivery}
                            onChange={() => setIsDelivery(true)}
                        />
                        <span className="grow-1 pb-0.5">Delivery</span>
                    </label>
                    <label className="border-1 border-gray-500  rounded-xl px-4 py-4 flex gap-2 cursor-pointer" htmlFor="pickUp">
                        <input
                            name="orderType"
                            id="pickUp"
                            type="radio"
                            value={"pickUp"}
                            checked={!isDelivery}
                            onChange={() => setIsDelivery(false)}
                        />
                        <span className="grow-1 pb-0.5">Pick-Up</span>
                    </label>
                </div>

                {/* Address */}
                {isDelivery ? (
                    <div className="bg-kae-light px-4 py-4 flex flex-col gap-2">
                        <p className="border-b pb-3 mb-2 border-gray-400 text-lg">Deliver To</p>
                        <div className="relative">
                            <input name="cityBrgy" id="cityBrgy" type="text" placeholder="City, Barangay" className="border-gray-500  rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                            <label htmlFor="cityBrgy" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">City, Barangay</label>
                        </div>
                        <div className="relative">
                            <input name="street" id="street" type="text" placeholder="street" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                            <label htmlFor="cityBrgy" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Purok, Street, House no.</label>
                        </div>
                    </div>
                ) : (
                    // Pick Up
                    <div className="bg-kae-light px-4 py-4 flex flex-col gap-2">
                        <p className="border-b border-gray-500  pb-3 mb-2 border-gray-400 text-lg">Pick-Up time</p>
                        <TimePicker />
                    </div>
                )}

                {/* Payment Method */}
                <div className="bg-kae-light px-4 py-4 flex flex-col gap-2">
                    <p className="border-b pb-3 mb-2 border-gray-400 text-lg">Payment</p>
                    <label className="border-1 border-gray-500  rounded-xl px-4 py-4 flex gap-2 cursor-pointer" htmlFor="cash">
                        <input
                            name="paymentType"
                            id="cash"
                            type="radio"
                            value={"cash"}
                        />
                        <span className="grow-1 pb-0.5">Cash</span>
                    </label>
                    <label className="border-1 border-gray-500  rounded-xl px-4 py-4 flex gap-2 cursor-pointer" htmlFor="gcash">
                        <input
                            name="paymentType"
                            id="gcash"
                            type="radio"
                            value={"gcash"}
                        />
                        <span className="grow-1 pb-0.5">Gcash</span>
                    </label>
                </div>

                {/* Order Summary */}
                <div className="bg-kae-light px-4 py-4 flex flex-col gap-2 mb-20">
                    <div className="flex flex-col  w-full flex-grow pt-1 bg-kae-light">
                        <p className="border-b pb-3 mb-2 border-gray-400 text-lg">Order Summary</p>
                        {cart?.map((item) => (
                            <div key={item.id} className="flex border-b align-center justify-between min-h-16 p-2">
                                <div className="flex gap-2 items-center">
                                    <div className="flex gap-1">
                                        <p className="h-max m-auto px-1 rounded-lg bg-kae-purple text-kae-light pr-1.5 pb-1">{item.qty}x</p>
                                    </div>
                                    <p className="px-2">{item.name}</p>
                                </div>
                                <p className="content-center">₱{item.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="fixed flex flex-col justify-center gap-3 bottom-0 left-0 px-4 py-2 bg-white w-full z-45">
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
                    <button disabled={cart.length === 0} type="submit" className={`px-6 py-3 text-kae-light text-xl rounded-lg ${cart.length === 0 ? "bg-gray-500" : "bg-kae-dark"}`}>Proceed to Checkout</button>
                </div>
            </form >
        </>
    )
}
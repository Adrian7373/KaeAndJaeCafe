"use client";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import TimePicker from "./_components/TimePicker";


export default function CheckoutPage() {

    const [isDelivery, setIsDelivery] = useState(true);

    return (
        <>
            <header className="fixed w-full max-w-9xl z-50">
                <nav className="flex py-2 px-4 items-center justify-between bg-kae-pink md:bg-kae-pink 2xl:px-30 2xl:py-5">
                    <div className="flex h-10 items-center">
                        <ChevronLeft className="mt-0.5" />
                        <p>Back to Menu</p>
                    </div>
                </nav>
            </header>
            <form action="" className="mt-14 px-4 py-5 flex flex-col gap-4">
                {/* Customer Details */}
                <div className="bg-kae-light px-4 py-4 flex flex-col gap-2">
                    <p className="border-b pb-3 mb-2 border-gray-400 text-lg">Customer Details</p>
                    <div className="flex flex-col gap-2">
                        <div className="relative">
                            <input name="firstName" id="firstName" type="text" placeholder="First Name" className="rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                            <label htmlFor="firstName" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">First Name</label>
                        </div>
                        <div className="relative">
                            <input name="lastName" id="lastName" type="text" placeholder="Last Name" className="rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                            <label htmlFor="lastName" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Last Name</label>
                        </div>
                        <div className="relative">
                            <input name="contact" id="lastName" type="text" placeholder="Mobile Number" className="rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                            <label htmlFor="contact" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Mobile Number</label>
                        </div>
                    </div>
                </div>

                {/* Order Type */}
                <div className="bg-kae-light px-4 py-4 flex flex-col gap-2">
                    <p className="border-b pb-3 mb-2 border-gray-400 text-lg">Order Type</p>
                    <label className="border-1 rounded-xl px-4 py-4 flex gap-2 cursor-pointer" htmlFor="delivery">
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
                    <label className="border-1 rounded-xl px-4 py-4 flex gap-2 cursor-pointer" htmlFor="pickUp">
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
                            <input name="cityBrgy" id="cityBrgy" type="text" placeholder="City, Barangay" className="rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                            <label htmlFor="cityBrgy" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">City, Barangay</label>
                        </div>
                        <div className="relative">
                            <input name="street" id="street" type="text" placeholder="street" className="rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                            <label htmlFor="cityBrgy" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Purok, Street, House no.</label>
                        </div>
                    </div>
                ) : (
                    // Pick Up
                    <div className="bg-kae-light px-4 py-4 flex flex-col gap-2">
                        <p className="border-b pb-3 mb-2 border-gray-400 text-lg">Pick-Up time</p>
                        <TimePicker />
                    </div>
                )}

            </form>
        </>
    )
}
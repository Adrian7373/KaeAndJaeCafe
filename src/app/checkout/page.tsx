"use client";
import { AlertTriangle, ChevronLeft, MapPin } from "lucide-react";
import { useActionState, useState, useEffect } from "react";
import TimePicker from "./_components/TimePicker";
import { useCart } from "../../../context/CartContext";
import { useRouter } from "next/navigation";
import { placeOrder } from "../actions";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./_components/MapPicker"), {
    ssr: false,
    loading: () => (
        <div className="h-64 w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
            <span className="text-gray-400 font-bold">Loading Map...</span>
        </div>
    )
});

export default function CheckoutPage() {
    // --- LOCATION STATES ---
    const [hardwareGPS, setHardwareGPS] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
    const [isLocationVerified, setIsLocationVerified] = useState(false);
    const [locationError, setLocationError] = useState("");
    const [isLocating, setIsLocating] = useState(false);


    // --- FORM STATES ---
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [isDelivery, setIsDelivery] = useState(true);
    const { cart, selectedTime, clearCart } = useCart();
    const router = useRouter();
    const totalPrice = cart.reduce((total, item) => total + item.discount_price * item.qty, 0);
    const [state, formAction, isPending] = useActionState(placeOrder, null);

    // --- GEOLOCATION ENFORCER ---
    const requestLocation = () => {
        setIsLocating(true);
        setLocationError("");

        if (!navigator.geolocation) {
            setLocationError("Your browser does not support GPS location.");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const actualCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
                setHardwareGPS(actualCoords);
                setCoordinates(actualCoords);
                setIsLocationVerified(true);
                setIsLocating(false);
            },
            (err) => {
                setLocationError("You must allow location access to place an order (even for Pick-up) for security verification.");
                setIsLocationVerified(false);
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        requestLocation();
    }, []);

    return (
        <div className="flex flex-col items-center">
            <header className="fixed w-full max-w-9xl z-50">
                <nav className="flex py-2 px-4 items-center justify-between bg-kae-pink md:bg-kae-pink 2xl:px-30 2xl:py-5">
                    <div onClick={() => router.back()} className="flex h-10 items-center cursor-pointer">
                        <ChevronLeft className="mt-0.5" />
                        <p className="font-bold">Back to Menu</p>
                    </div>
                </nav>
            </header>

            <div className="mt-14 px-4 py-5 flex flex-col gap-4 justify-center w-full max-w-2xl">

                {/* --- THE GPS LOCK UX --- */}
                {!isLocationVerified ? (
                    <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex flex-col items-center text-center gap-4 mt-10">
                        <AlertTriangle className="text-red-500 w-10 h-10" />
                        <p className="text-sm text-red-700 font-bold">
                            {locationError || "We need your location to verify orders and prevent spam."}
                        </p>
                        <button
                            onClick={requestLocation}
                            disabled={isLocating}
                            className="bg-red-500 text-white px-8 py-3 rounded-lg font-bold shadow-md disabled:opacity-50"
                        >
                            {isLocating ? "LOCATING..." : "ALLOW LOCATION"}
                        </button>
                    </div>
                ) : (

                    /* --- THE CHECKOUT FORM (Only renders if verified) --- */
                    <form action={formAction} className="flex flex-col gap-4">
                        {/* Security Badge */}
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 font-bold text-sm">
                            <MapPin size={18} /> Location Verified Safely
                        </div>

                        {/* Customer Details */}
                        <div className="bg-kae-light px-4 py-4 flex flex-col gap-2 rounded-xl">
                            <p className="border-b pb-3 mb-2 border-gray-400 text-lg font-bold">Customer Details</p>
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    <input minLength={2} required name="firstName" id="firstName" type="text" placeholder="First Name" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                                    <label htmlFor="firstName" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">First Name</label>
                                </div>
                                <div className="relative">
                                    <input minLength={2} required name="lastName" id="lastName" type="text" placeholder="Last Name" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                                    <label htmlFor="lastName" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Last Name</label>
                                </div>
                                <div className="relative">
                                    <input minLength={11} required name="contact" id="contact" type="text" placeholder="Mobile Number" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                                    <label htmlFor="contact" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Mobile Number</label>
                                </div>
                            </div>
                        </div>

                        {/* Order Type */}
                        <div className="bg-kae-light px-4 py-4 flex flex-col gap-2 rounded-xl">
                            <p className="border-b pb-3 mb-2 border-gray-400 text-lg font-bold">Order Type</p>
                            <label className={`border-2 rounded-xl px-4 py-4 flex gap-2 cursor-pointer transition-all ${isDelivery ? "border-kae-purple bg-purple-50" : "border-gray-300"}`}>
                                <input required name="orderType" type="radio" value="delivery" checked={isDelivery} onChange={() => setIsDelivery(true)} className="hidden" />
                                <span className={`grow-1 font-bold ${isDelivery ? "text-kae-purple" : "text-gray-600"}`}>Delivery</span>
                            </label>
                            <label className={`border-2 rounded-xl px-4 py-4 flex gap-2 cursor-pointer transition-all ${!isDelivery ? "border-kae-purple bg-purple-50" : "border-gray-300"}`}>
                                <input required name="orderType" type="radio" value="pickUp" checked={!isDelivery} onChange={() => setIsDelivery(false)} className="hidden" />
                                <span className={`grow-1 font-bold ${!isDelivery ? "text-kae-purple" : "text-gray-600"}`}>Pick-Up</span>
                            </label>
                        </div>

                        {/* Dynamic Section: Delivery vs Pickup */}
                        {isDelivery ? (
                            <div className="bg-kae-light px-4 py-4 flex flex-col gap-2 rounded-xl">
                                <p className="border-b pb-3 mb-2 border-gray-400 text-lg font-bold">Deliver To</p>
                                <p className="text-xs text-gray-500 font-bold mb-2">TAP THE MAP TO PIN YOUR EXACT DOOR</p>

                                {/* Pass hardwareGPS and current pin position down */}
                                <LocationMap
                                    hardwareGPS={hardwareGPS!}
                                    currentPin={coordinates}
                                    onLocationSelect={(lat, lng) => setCoordinates({ lat, lng })}
                                />

                                <div className="relative mt-2">
                                    <input required name="cityBrgy" id="cityBrgy" type="text" placeholder="City, Barangay" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                                    <label htmlFor="cityBrgy" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">City, Barangay</label>
                                </div>
                                <div className="relative">
                                    <input required name="street" id="street" type="text" placeholder="street" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                                    <label htmlFor="street" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Purok, Street, House no.</label>
                                </div>
                                <div className="relative">
                                    <input name="notes" id="notes" type="text" placeholder="notes" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                                    <label htmlFor="notes" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Note to store/rider (optional)</label>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-kae-light px-4 py-4 flex flex-col gap-2 rounded-xl">
                                <p className="border-b border-gray-400 pb-3 mb-2 text-lg font-bold">Pick-Up time</p>
                                <div className="w-full flex justify-center">
                                    <TimePicker />
                                </div>
                            </div>
                        )}

                        {/* Payment Method */}
                        <div className="bg-kae-light px-4 py-4 flex flex-col gap-2 rounded-xl">
                            <p className="border-b pb-3 mb-2 border-gray-400 text-lg font-bold">Payment</p>
                            <label className="border-1 border-gray-500 rounded-xl px-4 py-4 flex gap-2 cursor-pointer" htmlFor="cash">
                                <input required name="paymentType" id="cash" type="radio" value="cash" className="accent-kae-purple w-5 h-5" />
                                <span className="grow-1 font-bold">Cash</span>
                            </label>
                            <label className="border-1 border-gray-500 rounded-xl px-4 py-4 flex gap-2 cursor-pointer" htmlFor="gcash">
                                <input required name="paymentType" id="gcash" type="radio" value="gcash" className="accent-kae-purple w-5 h-5" />
                                <span className="grow-1 font-bold">Gcash</span>
                            </label>
                        </div>

                        <input type="hidden" name="latitude" value={coordinates.lat} />
                        <input type="hidden" name="longitude" value={coordinates.lng} />
                        <input type="hidden" name="cartData" value={JSON.stringify(cart)} />
                        <input type="hidden" name="selectedTime" value={JSON.stringify(selectedTime)} />

                        {/* Order Summary */}
                        <div className="bg-kae-light px-4 py-4 flex flex-col gap-2 mb-40 rounded-xl">
                            <p className="border-b pb-3 mb-2 border-gray-400 text-lg font-bold">Order Summary</p>
                            {cart?.map((item) => (
                                <div key={item.id} className="flex border-b border-gray-200 align-center justify-between min-h-16 py-2">
                                    <div className="flex gap-2 items-center">
                                        <p className="h-max px-2 py-0.5 rounded-lg bg-kae-purple text-kae-light font-bold text-sm">{item.qty}x</p>
                                        <p className="font-medium">{item.name}</p>
                                    </div>
                                    <p className="font-bold">₱{item.discount_price * item.qty}</p>
                                </div>
                            ))}
                        </div>

                        {/* Floating Checkout Footer */}
                        {/* Floating Checkout Footer */}
                        <div className="fixed flex flex-col justify-center gap-3 bottom-0 inset-x-0 mx-auto w-full max-w-2xl px-4 py-4 bg-white border-t sm:border-x border-gray-200 z-45 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sm:rounded-t-2xl">
                            {state?.error && (
                                <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                    ⚠️ {state.error}
                                </div>
                            )}
                            <div className="space-y-1 text-gray-600">
                                <div className="flex justify-between font-medium">
                                    <p>Subtotal</p>
                                    <p>₱{totalPrice}</p>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <p>Delivery Fee</p>
                                    <p>{cart.length === 0 || !isDelivery ? "₱0" : "₱49"}</p>
                                </div>
                                <div className="flex justify-between font-black text-kae-dark text-lg pt-1 border-t border-gray-200 mt-1">
                                    <p>Total</p>
                                    <p>{cart.length === 0 ? "₱0" : isDelivery ? `₱${totalPrice + 49}` : `₱${totalPrice}`}</p>
                                </div>
                            </div>
                            <button disabled={cart.length === 0 || isPending} type="submit" className={`flex justify-center gap-2 items-center px-6 py-4 text-white font-bold text-xl rounded-xl transition-all ${cart.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-kae-dark hover:bg-gray-800 shadow-lg active:scale-95"}`}>
                                {isPending && <div className="rounded-full border-white border-t-transparent animate-spin w-5 h-5 border-2"></div>}
                                Place Order
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
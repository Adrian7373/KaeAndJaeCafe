"use client";
import { ArrowLeft, Bike, CircleCheck, CircleCheckBig, Hamburger, Menu, Store } from "lucide-react";
import { useState } from "react";


interface Order {
    name: string,
    quantity: string,
    price_at_checkout: string
}
interface OrderStatusProps {
    orderType: string,
    delivery_address: string,
    payment_method: string,
    status: string,
    first_name: string,
    orders: Order[]
}

export default function OrderStatus() {

    const [isShowingDetails, setIsShowingDetails] = useState(false);

    const toggleShow = () => {
        setIsShowingDetails(prev => !prev);
    }

    return (
        <>
            <div className="flex flex-col">
                <header>
                    <nav className="flex justify-between items-center bg-kae-pink px-4 py-4">
                        <ArrowLeft className="h-8 w-8" />
                        <Menu className="h-8 w-8" />
                    </nav>
                </header>
                <div>

                </div>
                <div className="flex flex-col justify-center border-1 rounded-t-3xl px-6 py-4 gap-5 bg-kae-light">
                    <p className={`text-center ${isShowingDetails && "hidden"} `}>Track your order</p>

                    <div className={`flex flex-col gap-5 ${isShowingDetails && "hidden"}`}>
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <Store />
                                <p>Order Accepted</p>
                            </div>
                            <CircleCheck fill="bg-kae-dark" color="white" />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <Hamburger />
                                <p>Order Ready</p>
                            </div>
                            <CircleCheck fill="bg-kae-dark" color="white" />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <Bike />
                                <p>Order Picked up</p>
                            </div>
                            <CircleCheck fill="bg-kae-dark" color="white" />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <CircleCheckBig />
                                <p>Order Delivered</p>
                            </div>
                        </div>
                    </div>

                    <div className={`${!isShowingDetails && "hidden"}`}>
                        <p className="text-center">Your Order</p>
                        <div>

                        </div>
                    </div>


                    <div className="flex justify-between border-1 rounded-xl px-4 py-3">
                        <p className={`${isShowingDetails && "order-1"} content-center`}>Total: ₱67.00</p>
                        <button onClick={toggleShow} className={`text-kae-dark ${isShowingDetails && "order-0"} bg-kae-pink px-2 py-1 rounded-lg text-kae-light`}>{isShowingDetails ? "Order Status" : "Order Details"}</button>
                    </div>
                </div>
            </div>
        </>
    )
}
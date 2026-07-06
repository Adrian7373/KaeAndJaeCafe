"use client";
import { ArrowLeft, Bike, CircleCheck, CircleCheckBig, Hamburger, Menu, Store } from "lucide-react";
import { useState } from "react";
import OrderAnimation from "./OrderAnimation";
import { useRouter } from "next/navigation";
import TrackingClientFeatures from "./TrackingClientFeatures";

export interface Order {
    id: string,
    quantity: number,
    price_at_checkout: number,
    product: {
        name: string
        est_prep_time: string
    }
}
interface OrderStatusProps {
    orderStatus: {
        orderType: string,
        delivery_address: string,
        payment_method: string,
        status: string,
        first_name: string,
        orderTotal: number,
        orderId: string,
        orderTimestamp: string,
        maxEstPrepTime: string,
        orders: Order[] | null
    }
}

export default function OrderStatus({ orderStatus }: OrderStatusProps) {
    const { first_name, status, payment_method, delivery_address, orderType, orders, orderTotal, orderId, orderTimestamp, maxEstPrepTime } = orderStatus;
    const normalizedStatus = status.toLowerCase();
    const normalizedOrderType = orderType?.toLowerCase();
    const isPickupOrder = normalizedOrderType === "pickup";
    const router = useRouter();

    const statusRank =
        normalizedStatus === "pending" ? 0
            : normalizedStatus === "cooking" ? 1
                : normalizedStatus === "prepared" ? 2
                    : normalizedStatus === "delivering" ? 3
                        : normalizedStatus === "success" ? 4
                            : 0;

    const isStepComplete = (stepRank: number) => statusRank >= stepRank;

    const [isShowingDetails, setIsShowingDetails] = useState(false);

    const toggleShow = () => {
        setIsShowingDetails(prev => !prev);
    }

    return (
        <>
            <div className="flex flex-col min-h-dvh">
                <header>
                    <nav className="flex justify-between items-center bg-kae-pink px-4 py-4">
                        <ArrowLeft onClick={() => router.push("/order")} className="h-8 w-8" />
                    </nav>
                </header>
                <div className="flex-grow justify-center items-center content-center my-6">
                    <OrderAnimation status={status} />
                    <p className="text-center text-xl">{normalizedStatus === "pending" ? "Order placed"
                        : normalizedStatus === "cooking" ? "Cooking Food"
                            : normalizedStatus === "prepared" ? "Food Prepared"
                                : normalizedStatus === "delivering" ? "Out for Delivery"
                                    : normalizedStatus === "success" ? "Food Delivered"
                                        : normalizedStatus === "cancelled" && "Order Cancelled"}</p>
                    <p className="text-center px-4">{normalizedStatus === "pending" ? "Waiting for cafe to accept your order"
                        : normalizedStatus === "cooking" ? `Your food is being prepared. Max estimated time: ${maxEstPrepTime}mins`
                            : normalizedStatus === "prepared" ? (isPickupOrder ? "Your food is prepared and ready for pick-up." : "Your food is prepared and is waiting for delivery")
                                : normalizedStatus === "delivering" ? `Your food is on the way. Delivery address: ${delivery_address}`
                                    : normalizedStatus === "success" ? "Thank you for ordering!"
                                        : normalizedStatus === "cancelled" && "Your order has been cancelled by the cafe"}</p>
                </div>
                <div className="flex flex-col justify-center border-1 border-gray-400 rounded-t-3xl px-6 py-4 gap-5 bg-kae-light">
                    <p className={`text-center ${isShowingDetails && "hidden"} `}>Track your order</p>

                    <div className={`flex flex-col gap-5 ${isShowingDetails && "hidden"}`}>
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <Store />
                                <p>Order Accepted</p>
                            </div>
                            <CircleCheck className={isStepComplete(1) ? "block" : "hidden"} fill="bg-kae-dark" color="white" />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <Hamburger />
                                <p>Order Ready</p>
                            </div>
                            <CircleCheck className={isStepComplete(2) ? "block" : "hidden"} fill="bg-kae-dark" color="white" />
                        </div>
                        {!isPickupOrder && (
                            <div className="flex justify-between">
                                <div className="flex gap-2">
                                    <Bike />
                                    <p>Order Picked up</p>
                                </div>
                                <CircleCheck className={isStepComplete(3) ? "block" : "hidden"} fill="bg-kae-dark" color="white" />
                            </div>
                        )}
                        <div className="flex justify-between">
                            <div className="flex gap-2">
                                <CircleCheckBig />
                                <p>{isPickupOrder ? "Order Picked up" : "Order Delivered"}</p>
                            </div>
                            <CircleCheck className={isStepComplete(isPickupOrder ? 3 : 4) ? "block" : "hidden"} fill="bg-kae-dark" color="white" />
                        </div>
                    </div>

                    <div className={`${!isShowingDetails && "hidden"} flex flex-col gap-4`}>
                        <p className="text-center">Your Order</p>
                        <div className="border-1 px-4 py-2 border-gray-400 rounded-xl">
                            <p>Order for <b>{first_name}</b></p>
                            <p>Order type: <b>{orderType}</b></p>
                            <p>Date ordered: <b>{orderTimestamp}</b></p>
                            <p>Payment: <b>{payment_method}</b></p>
                        </div>
                        <div>
                            {orders?.map((item: Order) => (
                                <div className="flex justify-between min-h-12 border-b items-center py-2" key={item.id}>
                                    <div className="flex gap-2 items-center">
                                        <p className="h-max bg-kae-dark text-sm text-kae-light px-2 py-1 content-center rounded-full">{item.quantity}x</p>
                                        <p>{item.product.name}</p>
                                    </div>
                                    <p className="flex-grow text-right">₱{item.price_at_checkout * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="flex justify-between border-1 border-gray-400 rounded-xl px-4 py-3">
                        <p className={`${isShowingDetails && "order-3"} content-center`}>Total: ₱{orderTotal.toFixed(2)}</p>
                        <button onClick={toggleShow} className={`text-kae-dark ${isShowingDetails && "order-0"} bg-kae-pink px-2 py-1 rounded-lg text-kae-lightz`}>{isShowingDetails ? "Order Status" : "Order Details"}</button>
                    </div>
                    <TrackingClientFeatures orderId={orderId} />
                </div>
            </div>
        </>
    )
}
"use client";
import { ArrowLeft, Bike, CircleCheck, CircleCheckBig, Hamburger, Menu, Store } from "lucide-react";
import { useEffect, useState } from "react";
import OrderAnimation from "./OrderAnimation";
import { useRouter } from "next/navigation";
import TrackingClientFeatures from "./TrackingClientFeatures";
import { DeleteOrderItem } from "@/app/actions";

export interface Order {
    id: string,
    quantity: number,
    price_at_checkout: number,
    status: string,
    product: {
        name: string
        est_prep_time: string
    }
}
interface OrderStatusProps {
    orderStatus: {
        orderType: string,
        payment_method: string,
        status: string,
        first_name: string,
        orderTotal: number,
        orderId: string,
        orderTimestamp: string,
        maxEstPrepTime: string,
        delivery_fee: number,
        orders: Order[]
    }
}

export default function OrderStatus({ orderStatus }: OrderStatusProps) {
    const { first_name, status, payment_method, orderType, orders, orderTotal, orderId, orderTimestamp, maxEstPrepTime, delivery_fee } = orderStatus;
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
    const [actionRequiredOrders, setActionRequiredOrders] = useState<Order[]>([]);

    const toggleShow = () => {
        setIsShowingDetails(prev => !prev);
    }

    useEffect(() => {
        const filterActionRequired = () => {
            const filtered = orders.filter((order) => order.status === 'action_required');
            console.log("Filtered orders:", filtered);
            setActionRequiredOrders(filtered);
        };

        filterActionRequired();
    }, [orders]);

    const handleRemoveItem = async (itemId: string) => {

        const response = await DeleteOrderItem(itemId);
        if (response?.error) {
            alert("Failed to remove item" + response.error)
        }

    }

    return (
        <>
            <div className="flex flex-col min-h-dvh items-center">
                <header className="w-full">
                    <nav className="flex justify-between items-center bg-kae-pink px-4 py-4">
                        <ArrowLeft onClick={() => router.push("/order")} className="h-8 w-8" />
                    </nav>
                </header>
                <div className="max-w-lg lg:max-w-5xl flex flex-col xl:flex-row xl:my-auto xl:gap-20">
                    <div className="flex-grow justify-center items-center content-center my-6 xl:order-2 xl:pb-20">
                        <OrderAnimation status={status} />
                        <p className="text-center text-xl font-semibold">{normalizedStatus === "pending" ? "Order placed"
                            : normalizedStatus === "cooking" ? "Cooking Food"
                                : normalizedStatus === "prepared" ? "Food Prepared"
                                    : normalizedStatus === "delivering" ? "Out for Delivery"
                                        : normalizedStatus === "success" ? "Food Delivered"
                                            : normalizedStatus === "cancelled" && "Order Cancelled"}</p>
                        <p className="text-center px-4">{normalizedStatus === "pending" ? "Waiting for cafe to accept your order"
                            : normalizedStatus === "cooking" ? `Your food is being prepared. Max estimated time: ${maxEstPrepTime}mins`
                                : normalizedStatus === "prepared" ? (isPickupOrder ? "Your food is prepared and ready for pick-up." : "Your food is prepared and is waiting for delivery")
                                    : normalizedStatus === "delivering" ? `Your food is on the way.`
                                        : normalizedStatus === "success" ? "Thank you for ordering!"
                                            : normalizedStatus === "cancelled" && "Your order has been cancelled by the cafe"}</p>
                    </div>
                    <div className="flex flex-col justify-center border-1 border-gray-400 rounded-t-3xl px-6 py-4 gap-5 bg-kae-light xl:order-1 xl:rounded-3xl">
                        <p className={`text-center ${isShowingDetails && "hidden"} font-semibold`}>Track your order</p>

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
                            <div className="xl:max-h-[30vh] xl:overflow-y-auto xl:px-2">
                                {orders?.map((item: Order) => (
                                    <div className="flex justify-between min-h-12 border-b items-center py-2" key={item.id}>
                                        <div className="flex gap-2 items-center">
                                            <p className="h-max bg-kae-dark text-sm text-kae-light px-2 py-1 content-center rounded-full">{item.quantity}x</p>
                                            <p>{item.product.name}</p>
                                        </div>
                                        <p className="flex-grow text-right">₱{item.price_at_checkout * item.quantity}</p>
                                    </div>
                                ))}
                                {delivery_fee !== 0 && (
                                    <div className="flex gap-2 items-center pl-8 py-2">
                                        <p>Delivery fee</p>
                                        <p className="flex-grow text-right">₱49</p>
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className="flex justify-between border-1 border-gray-400 rounded-xl px-4 py-3">
                            <p className={`${isShowingDetails && "order-3"} content-center font-semibold`}>Total: ₱{(orderTotal + delivery_fee).toFixed(2)}</p>
                            <button onClick={toggleShow} className={`text-kae-dark ${isShowingDetails && "order-0"} bg-kae-pink px-2 py-1 rounded-lg text-kae-lightz`}>{isShowingDetails ? "Order Status" : "Order Details"}</button>
                        </div>
                        <TrackingClientFeatures orderId={orderId} />
                    </div>
                </div>
                {actionRequiredOrders.length > 0 && (
                    <div className="fixed inset-0 z-[100] bg-kae-dark/80 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4">Item Unavailable</h3>
                            <p className="text-gray-600 mb-6">
                                Sorry! One or many of your items is out of stock. Would you like to:
                            </p>
                            <div className="flex flex-col max-h-md overflow-x-auto">
                                {actionRequiredOrders.map((item) => (
                                    <div key={item.id} className="flex flex-col border-b py-2 items-center">
                                        <p className="text-lg font-semibold">{item.product.name}</p>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="w-full bg-red-500 text-white py-3 rounded-lg font-bold"
                                            >
                                                Remove Item
                                            </button>
                                            <button
                                                //onClick={() => setShowReplacementCatalog(true)}
                                                className="w-full bg-kae-purple text-white py-3 rounded-lg font-bold"
                                            >
                                                Choose a Replacement
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            </div>

                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
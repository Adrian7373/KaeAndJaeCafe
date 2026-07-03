import { Square } from "lucide-react"
import TopSellersCard from "./_components/TopSellerCard"

export default function () {

    const pendingOrders = [{ status: "pending", customerName: "Adrian Gabriel Ablaza", orderType: "Pick-Up", orderTime: "11:34AM" },
    { status: "pending", customerName: "Krischa Mae Concepcion", orderType: "Delivery", orderTime: "01:34PM" },
    { status: "pending", customerName: "Adrian Gabriel Ablaza", orderType: "Pick-Up", orderTime: "02:55PM" },
    { status: "pending", customerName: "Adrian Gabriel Ablaza", orderType: "Pick-Up", orderTime: "04:12PM" },
    { status: "pending", customerName: "Adrian Gabriel Ablaza", orderType: "Pick-Up", orderTime: "04:12PM" },
    { status: "pending", customerName: "Adrian Gabriel Ablaza", orderType: "Pick-Up", orderTime: "04:12PM" },
    { status: "pending", customerName: "Adrian Gabriel Ablaza", orderType: "Pick-Up", orderTime: "04:12PM" }
    ]

    return (
        <>
            <div className="flex flex-col gap-3 pt-20 px-4 max-h-dvh">
                <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                    <p className="text-2xl">Good Morning, Adrian</p>
                </div>
                <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                    <p className="text-xl">Today's Revenue</p>
                    <p className="text-4xl">P5,678</p>
                </div>
                <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                    <p className="text-xl">Successful Orders</p>
                    <p className="text-4xl">13</p>
                </div>
                <div className="max-h-100 flex-grow flex flex-col border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                    <p className="text-xl">Pending Orders</p>
                    <div className="overflow-auto">
                        {pendingOrders.map((order) => (
                            <div className="flex gap-3 p-2" key={order.customerName}>
                                <Square fill="orange" />
                                <div>
                                    <p>{order.customerName}</p>
                                    <p>{order.orderType}</p>
                                    <p>{order.orderTime}</p>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
                <TopSellersCard />
            </div>
        </>
    )
}
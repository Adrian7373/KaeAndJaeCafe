"use client";
import { HandPlatter, MapPin, MoveRight, Phone, Search, Square, Wallet, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Order } from "../orders/page";
import { createClient } from "@/../lib/supabase";

export default function HistoryPage() {

    const supabase = createClient();
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: orders } = await supabase
                .from("orders")
                .select("id, first_name, last_name, created_at, payment_method, delivery_address, pickup_time, contact, order_type, order_items ( quantity, product ( name, price, id ), price_at_checkout)")
                .in("status", ["success", "cancelled"])
                .order("created_at", { ascending: false });
            setOrders((orders as unknown as Order[]) || []);
        }
        fetchOrders();
    }, [])

    return (
        <>
            <div className="pt-24 px-6">
                <p className="text-2xl font-bold">Past Orders</p>
                <div className="gap-2 flex flex-col my-4">
                    <div className="flex border-1 rounded-md">
                        <div className="border-r px-2 flex items-center gap-2">
                            <Search className="w-8 h-8" />
                            <input placeholder="Search customer name..." className="flex-grow py-3 text-lg outline-none" type="text" />
                        </div>
                        <select className="block flex-grow px-1" name="" id="">
                            <option value="">Success</option>
                            <option value="">Cancelled</option>
                        </select>
                    </div>
                    {/* Date range picker */}
                    <div className="flex items-center justify-between">
                        <div className=" text-center">
                            <input className="py-2 border-1 rounded-md" type="date" />
                        </div>
                        <div className="text-center flex-grow">
                            <p>To</p>
                            <MoveRight className="w-full h-8" />
                        </div>
                        <div className="text-center">
                            <input className="border-1 py-2 rounded-md" type="date" />
                        </div>
                    </div>
                    {/* Date range picker */}
                </div>
                <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-4 border-t-4 border-orange-500 snap-start">
                    <h2 className="font-bold text-orange-500 mb-4 tracking-wider text-sm">PENDING ({orders.length})</h2>
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="border border-orange-500 shadow-sm p-4 rounded-xl">
                                <div className='flex justify-between mb-3'>
                                    <div className='flex'>
                                        <Square fill='orange' strokeWidth={0} />
                                        <p className="font-bold text-gray-800">{order.first_name} {order.last_name}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                    <X onClick={() => setOrderToDelete(order)} />
                                </div>
                                <div>
                                    <div className='flex flex-col gap-2 border-t border-orange-500 py-2'>
                                        <div className='flex gap-2'>
                                            <Wallet />
                                            <p className='font-semibold'>{order.payment_method}</p>
                                        </div>
                                        {order.order_type === "delivery" ? (<div className='flex gap-2'>
                                            <MapPin />
                                            <p>{order.delivery_address}</p>
                                        </div>) : (<div className='flex gap-2'>
                                            <HandPlatter />
                                            <p>Pick-up {order.pickup_time}</p>
                                        </div>)}
                                        <div className='flex gap-2'>
                                            <Phone />
                                            <p>{order.contact}</p>
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <p className='text-md font-semibold'>ORDERS</p>
                                        {order.order_items?.map((item, index) => (
                                            <div className='flex justify-between border-b py-2 gap-2' key={index}>
                                                <p className='px-2 bg-kae-dark text-kae-light rounded-full h-max content-center'>{item.quantity}x</p>
                                                <p className='flex-grow'>{item.product.name}</p>
                                                <p>₱{item.product.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
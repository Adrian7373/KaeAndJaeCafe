"use client"; // <-- This is the magic line that fixes the crash!

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/../lib/supabase';
import { redirect, useRouter } from 'next/navigation';
import { updateOrderAction } from '@/app/actions';


// 1. Strict Types matching your database schema
export type OrderStatus = 'pending' | 'cooking' | 'prepared' | 'delivering' | 'success' | 'cancelled';

export interface OrderItem {
    quantity: number;
    product: { name: string; price: number };
}

export interface Order {
    id: string;
    created_at: string;
    status: OrderStatus;
    first_name: string;
    contact: string;
    delivery_address: string;
    order_items: OrderItem[];
}


export default function OrdersPage() {

    const router = useRouter();

    // 1. Initialize Supabase exactly ONCE for the entire component
    const supabase = useMemo(() => createClient(), []);

    // 2. The main state holding all active orders
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper to filter orders by column in the UI
    const pendingOrders = orders.filter((o) => o.status === 'pending');
    const cookingOrders = orders.filter((o) => o.status === 'cooking');
    const preparedOrders = orders.filter((o) => o.status === 'prepared');
    const deliveringOrders = orders.filter((o) => o.status === 'delivering');

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!user || error) {
                redirect("/login")
            }
        };
        checkAuth();
    }, [supabase, router]);

    // React Rule: The useEffect itself cannot be async, 
    // but you CAN define and call an async function inside it!
    useEffect(() => {
        const fetchActiveOrders = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          id, created_at, status, first_name, contact, delivery_address,
          order_items ( quantity, product ( name, price ) )
        `)
                .in('status', ['pending', 'prepared', 'cooking', 'delivering'])
                .order('created_at', { ascending: true }); // Oldest orders at the top

            if (error) {
                console.error("Error fetching initial orders:", error);
            } else {
                setOrders(data as Order[] || []);
            }
            setLoading(false);
        };

        fetchActiveOrders();

        // Set up the Realtime Subscription
        const orderChannel = supabase
            .channel('public:orders')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    const newOrder = payload.new as Order;
                    setOrders((currentOrders) => [...currentOrders, newOrder]);
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                (payload) => {
                    const updatedOrder = payload.new as Order;
                    setOrders((currentOrders) =>
                        currentOrders.map((order) =>
                            order.id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order
                        )
                    );
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(orderChannel);
        };
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {


        // 1. Optimistic UI Update: Snap the card to the next column instantly
        const previousOrders = [...orders];
        setOrders((currentOrders) =>
            currentOrders.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );

        // 2. Database Update: Only touch the status column
        const result = await updateOrderAction(orderId, newStatus);

        // 3. Rollback if the server fails
        if (!result.success) {
            console.error("Failed to update status:", result.error);
            alert("Failed to update order: " + result.error);
            setOrders(previousOrders); // Revert the UI
        }
    };

    if (loading) return <div className="p-8 text-center font-bold text-gray-500">Loading live orders...</div>;

    return (
        <div className="flex gap-4 w-full min-h-screen p-4 bg-gray-50 overflow-x-auto">

            {/* PENDING COLUMN */}
            <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow-sm p-4 border-t-4 border-orange-500">
                <h2 className="font-bold text-orange-500 mb-4 tracking-wider text-sm">PENDING ({pendingOrders.length})</h2>
                <div className="space-y-4">
                    {pendingOrders.map((order) => (
                        <div key={order.id} className="border border-gray-100 shadow-sm p-4 rounded-xl">
                            <p className="font-bold text-gray-800">{order.first_name}</p>
                            <p className="text-sm text-gray-500 mb-3">{order.order_items?.length} items</p>
                            <button
                                onClick={() => updateOrderStatus(order.id, 'cooking')}
                                className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold py-2 rounded-lg transition-colors"
                            >
                                START COOKING
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* COOKING COLUMN */}
            <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow-sm p-4 border-t-4 border-purple-600">
                <h2 className="font-bold text-purple-600 mb-4 tracking-wider text-sm">COOKING ({cookingOrders.length})</h2>
                <div className="space-y-4">
                    {cookingOrders.map((order) => (
                        <div key={order.id} className="border border-gray-100 shadow-sm p-4 rounded-xl">
                            <p className="font-bold text-gray-800">{order.first_name}</p>
                            <p className="text-sm text-gray-500 mb-3">{order.order_items?.length} items</p>
                            <button
                                onClick={() => updateOrderStatus(order.id, 'prepared')}
                                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-2 rounded-lg transition-colors"
                            >
                                ORDER PREPARED
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* PREPARED COLUMN */}
            <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow-sm p-4 border-t-4 border-blue-500">
                <h2 className="font-bold text-blue-500 mb-4 tracking-wider text-sm">PREPARED ({preparedOrders.length})</h2>
                <div className="space-y-4">
                    {preparedOrders.map((order) => (
                        <div key={order.id} className="border border-gray-100 shadow-sm p-4 rounded-xl">
                            <p className="font-bold text-gray-800">{order.first_name}</p>
                            <p className="text-sm text-gray-500 mb-3">{order.order_items?.length} items</p>
                            <button
                                onClick={() => updateOrderStatus(order.id, 'delivering')}
                                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2 rounded-lg transition-colors"
                            >
                                SEND TO DELIVERY
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* DELIVERING COLUMN */}
            <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow-sm p-4 border-t-4 border-green-500">
                <h2 className="font-bold text-green-500 mb-4 tracking-wider text-sm">DELIVERING ({deliveringOrders.length})</h2>
                <div className="space-y-4">
                    {deliveringOrders.map((order) => (
                        <div key={order.id} className="border border-gray-100 shadow-sm p-4 rounded-xl">
                            <p className="font-bold text-gray-800">{order.first_name}</p>
                            <p className="text-sm text-gray-500 mb-3">{order.order_items?.length} items</p>
                            <button
                                onClick={() => updateOrderStatus(order.id, 'success')}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors"
                            >
                                MARK COMPLETE
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
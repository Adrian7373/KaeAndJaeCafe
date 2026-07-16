"use client";

import { useEffect, useMemo, useState, useRef } from 'react';
import { createClient } from '@/../lib/supabase';
import { useRouter } from 'next/navigation';
import { cancelOrderAction, updateOrderAction, editOrderItemsAction, RemoveOrderItem } from '@/app/actions';
import { Bell, BellOff, Coins, HandPlatter, MapPin, Phone, Square, SquareX, Wallet, X } from 'lucide-react';
import EditOrderModal from './_components/EditOrderModal';
import LocationViewModal from './_components/LocationViewModal';
import RemoveItemModal from './_components/RemoveItemModal';


// 1. Strict Types matching your database schema
export type OrderStatus = 'pending' | 'cooking' | 'prepared' | 'delivering' | 'success' | 'cancelled';
export type OrderType = 'delivery' | 'pickup';

export interface OrderItem {
    id?: string
    quantity: number;
    product: { name: string; discount_price: number; id: string };
    price_at_checkout?: number;
    status: string;
}

export interface Order {
    id: string;
    created_at: string;
    status: OrderStatus;
    order_type: OrderType;
    first_name: string;
    last_name: string;
    contact: string;
    delivery_address: string;
    payment_method: string;
    pickup_time: string;
    delivery_lat: number;
    delivery_long: number;
    customer_note: string;
    is_paid: boolean;
    order_items?: OrderItem[];
}

export interface Product {
    id: string;
    name: string;
    discount_price: number;
}


export default function OrdersPage() {

    const router = useRouter();

    const supabase = useMemo(() => createClient(), []);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const isEnabledRef = useRef(notificationsEnabled);

    useEffect(() => {
        isEnabledRef.current = notificationsEnabled;
    }, [notificationsEnabled]);

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [catalog, setCatalog] = useState<Product[]>([]);
    const [viewLocation, setViewLocation] = useState<{ lat: number, lng: number, name: string } | null>(null);
    const [showedNote, setShowedNote] = useState("");
    const [itemToRemove, setItemToRemove] = useState<OrderItem | null>(null);
    const [orderIdItemToRemove, setOrderIdItemToRemove] = useState("");
    const [isDeletingItem, setIsDeletingItem] = useState(false);

    // Helper to filter orders by column in the UI
    const pendingOrders = orders.filter((o) => o.status === 'pending');
    const cookingOrders = orders.filter((o) => o.status === 'cooking');
    const isPickupOrder = (order: Order) => order.order_type.toLowerCase() === 'pickup';
    const preparedOrders = orders.filter((o) => o.status === 'prepared' && !isPickupOrder(o));
    const deliveringOrders = orders.filter(
        (o) => (o.status === 'delivering' && !isPickupOrder(o))
            || (o.status === 'prepared' && isPickupOrder(o))
    );

    const cancelRemoveItem = () => {
        setItemToRemove(null);
        setIsDeletingItem(false);
    }

    const removeItem = async (itemId: string, orderId: string) => {
        const previousOrders = [...orders];

        // Optimistic Update
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId
                    ? {
                        ...order,
                        order_items: order.order_items?.filter((item) => item.id !== itemId),
                    }
                    : order
            )
        );
        setIsDeleting(false);

        const response = await RemoveOrderItem(itemId)
        if (response?.error) {
            setOrders(previousOrders)
        }
        setItemToRemove(null);

    }

    const toggleCustomerNote = (orderId: string) => {
        if (orderId === showedNote) {
            setShowedNote("");
        } else {
            setShowedNote(orderId)
        }
    }

    useEffect(() => {
        audioRef.current = new Audio('/sounds/order-notif.mp3');
    }, []);

    const playNotificationSound = () => {
        if (!isEnabledRef.current || !audioRef.current) return;

        const audio = audioRef.current;

        audio.onended = null;

        let playCount = 0;
        const maxPlays = 3;

        const playNext = () => {
            playCount++;
            audio.currentTime = 0;
            audio.play().catch(e => console.error("Playback failed:", e));
        };

        audio.onended = () => {
            if (playCount < maxPlays) {
                playNext();
            } else {
                audio.onended = null;
            }
        };


        playNext();
    };

    const calculateTotal = (order: Order) => {
        const subtotal = (order.order_items || []).reduce((total, item) => {

            const unitPrice = item.price_at_checkout ?? item.product.discount_price ?? 0;

            return total + (unitPrice * item.quantity);

        }, 0);
        if (order.order_type === 'delivery') {
            return subtotal + 49;
        }
        return subtotal
    };

    const handleDeleteOrder = async () => {
        if (!orderToDelete) return;

        setIsDeleting(true);

        // 1. Optimistic UI Update: Instantly remove it from the screen
        const previousOrders = [...orders];
        setOrders((currentOrders) => currentOrders.filter(order => order.id !== orderToDelete.id));

        setIsDeleting(false);
        // 2. Execute the Server Action
        const result = await cancelOrderAction(orderToDelete.id);

        // 3. Rollback if the database fails
        if (!result.success) {
            alert("Failed to cancel order: " + result.error);
            setOrders(previousOrders); // Snap it back onto the screen
        }

        // 4. Close the modal and reset loading state
        setOrderToDelete(null);
    };

    const handleEditOrder = async (updatedItems: OrderItem[]) => {
        if (!editingOrder) return;

        const targetOrderId = editingOrder.id;

        setEditingOrder(null);

        const previousOrders = [...orders];
        setOrders((currentOrders) =>
            currentOrders.map((order) =>
                order.id === targetOrderId ? { ...order, order_items: updatedItems } : order
            )
        );

        const payload = updatedItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price_at_checkout: item.price_at_checkout ?? item.product.discount_price
        }));

        const result = await editOrderItemsAction(targetOrderId, payload);

        if (!result.success) {
            alert("Failed to save edits: " + result.error);
            setOrders(previousOrders);
        }
    };

    const getCookingAction = (order: Order) => ({
        label: isPickupOrder(order) ? 'READY FOR PICKUP' : 'ORDER PREPARED',
        nextStatus: 'prepared' as OrderStatus,
    });

    const getFinalAction = (order: Order) => ({
        label: isPickupOrder(order) ? 'PICKUP COMPLETE' : 'DELIVERY COMPLETE',
        nextStatus: 'success' as OrderStatus,
    });

    const renderOrderCard = (
        order: Order,
        actionButton: {
            label: string;
            className: string;
            onClick: () => void;
        },
        colors: {
            squareFill: string;
            className: string;
            primaryClassname: string;
        }
    ) => {
        const hasActionRequired = order.order_items?.some(item => item.status === 'action_required');
        return (
            <div key={order.id} className={`relative border border-${colors.squareFill}-400 shadow-sm p-4 rounded-xl`}>

                {/* The PAID Badge */}
                {order.is_paid && (
                    <div className="absolute top-16 right-4 bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full text-xs font-black tracking-widest shadow-sm">
                        PAID VIA GCASH
                    </div>
                )}

                <div className='flex justify-between mb-3'>
                    <div className='flex'>
                        <Square fill={colors.squareFill} strokeWidth={0} />
                        <p className="font-bold text-gray-800">{order.first_name} {order.last_name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    <X className='cursor-pointer hover:bg-kae-dark hover:text-kae-light rounded-full transition-colors duration-300' onClick={() => setOrderToDelete(order)} />
                </div>

                {/* THE WARNING BANNER */}
                {hasActionRequired && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg mb-3 text-sm font-bold flex items-center justify-center animate-pulse">
                        ⚠️ Waiting for customer to update items
                    </div>
                )}

                <div>
                    <div className={`flex flex-col gap-2 border-t border-${colors.squareFill}-500 py-2`}>
                        <div className='flex gap-2'>
                            <Wallet />
                            <p className='font-semibold'>{order.payment_method}</p>
                        </div>
                        {order.order_type === "delivery" ? (<div className='flex gap-2'>
                            <div className='flex items-center'>
                                <MapPin />
                                <p>{order.delivery_address}</p>
                            </div>
                            <button
                                onClick={() => setViewLocation({
                                    lat: order.delivery_lat,
                                    lng: order.delivery_long,
                                    name: `${order.first_name} ${order.last_name}`
                                })}
                                className="cursor-pointer hover:text-kae-light hover:bg-blue-600 rounded-lg transition-colors duration-300 text-blue-600 font-bold text-sm px-3 py-2"
                            >
                                View Map
                            </button>
                        </div>) : (<div className='flex gap-2'>
                            <HandPlatter />
                            <p>Pick-up {order.pickup_time}</p>
                        </div>)}
                        <div className='flex gap-2'>
                            <Phone />
                            <p>{order.contact}</p>
                        </div>
                        <div className='flex gap-2'>
                            <Coins />
                            <p className='font-bold text-xl'>₱{calculateTotal(order)}</p>
                        </div>
                        <div className='flex gap-2' hidden={order.order_type === "pickup"}>
                            <button className='border-1 border-gray-300 px-2 py-1 rounded-lg' onClick={() => toggleCustomerNote(order.id)}>{showedNote === order.id ? "Hide note" : "Show note"}</button>
                            <div hidden={showedNote !== order.id}>{order.customer_note}</div>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <p className='text-md font-semibold'>ORDERS</p>
                        {(order.order_items || [])
                            .filter((item) => item.status !== 'action_required')
                            .map((item, index) => (
                                <div className='flex justify-between border-b py-2 gap-2' key={index}>
                                    <p className='px-2 bg-kae-dark text-kae-light rounded-full h-max content-center'>
                                        {item.quantity}x
                                    </p>
                                    <p className='flex-grow'>{item.product.name}</p>
                                    <p className='font-bold'>
                                        ₱{((item.price_at_checkout ?? item.product.discount_price ?? 0) * item.quantity).toFixed(2)}
                                    </p>
                                    <SquareX
                                        className='h-8 w-8'
                                        fill='red'
                                        onClick={() => {
                                            setItemToRemove(item);
                                            setOrderIdItemToRemove(order.id);
                                            setIsDeletingItem(true);
                                        }}
                                    />
                                </div>
                            ))
                        }
                        {order.order_type === "delivery" && (
                            <div className='flex justify-between ml-10 py-2'>
                                <p>Delivery Fee</p>
                                <p className='font-semibold'>₱49</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex gap-2'>
                    <button onClick={() => setEditingOrder(order)}
                        className={colors.className}>
                        EDIT
                    </button>
                    <button
                        onClick={actionButton.onClick}
                        disabled={hasActionRequired}
                        className={`${colors.primaryClassname} ${hasActionRequired ? 'opacity-50 cursor-not-allowed hover:bg-gray-400 bg-gray-400 border-gray-400' : ''}`}
                    >
                        {actionButton.label}
                    </button>
                </div>
            </div>
        );
    };

    const upsertOrderInState = (nextOrder: Order) => {
        setOrders((currentOrders) => {
            const nextOrders = [...currentOrders.filter((order) => order.id !== nextOrder.id), nextOrder];
            return nextOrders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        });
    };

    const fetchOrderWithItems = async (orderId: string, maxAttempts = 5) => {
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id, created_at, status, is_paid, order_type, customer_note, first_name, last_name, delivery_lat, delivery_long, pickup_time, contact, delivery_address, payment_method,
                    order_items ( id, quantity, product ( name, discount_price, id ), price_at_checkout, status )
                `)
                .eq('id', orderId)
                .maybeSingle();

            if (error) {
                console.error('Error fetching inserted order:', error.message);
                return null;
            }

            const hydratedOrder = data as Order | null;

            if (hydratedOrder?.order_items?.length) {
                return hydratedOrder;
            }

            if (attempt < maxAttempts - 1) {
                await new Promise((resolve) => setTimeout(resolve, 250));
            }
        }

        return null;
    };

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!user || error) {
                router.push("/login")
            }
        };
        checkAuth();
    }, [supabase, router]);

    useEffect(() => {
        const fetchActiveOrders = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id, created_at, status, is_paid, order_type, customer_note, first_name,last_name,pickup_time, delivery_lat, delivery_long, contact, delivery_address,payment_method,
          order_items ( id, quantity, product ( name, discount_price, id ), price_at_checkout, status )
        `)
                .in('status', ['pending', 'prepared', 'cooking', 'delivering'])
                .or('payment_method.eq.cash,is_paid.eq.true')
                .order('created_at', { ascending: true }); // Oldest orders at the top

            if (error) {
                console.error("Error fetching initial orders:", error.message);
            } else {
                setOrders((data as unknown as Order[]) || []);
            }
            const { data: productsData } = await supabase.from('product').select('id, name, discount_price');
            setCatalog(productsData as Product[] || []);
            setLoading(false);
        };

        fetchActiveOrders();

        // Set up the Realtime Subscription
        const orderChannel = supabase
            .channel('public:orders')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                async (payload) => {
                    playNotificationSound();
                    const insertedOrder = await fetchOrderWithItems((payload.new as { id: string }).id);

                    if (!insertedOrder || (insertedOrder.payment_method === 'gcash' && !insertedOrder.is_paid)) {
                        return;
                    }

                    upsertOrderInState(insertedOrder);
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'order_items' },
                async (payload) => {
                    const orderId = (payload.new as { order_id?: string }).order_id;

                    if (!orderId) {
                        return;
                    }

                    const refreshedOrder = await fetchOrderWithItems(orderId);

                    if (refreshedOrder) {
                        upsertOrderInState(refreshedOrder);
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'order_items' },
                async (payload) => {
                    playNotificationSound();
                    const orderId = (payload.new as { order_id?: string }).order_id;

                    if (!orderId) return;

                    // Re-fetch to get the newly attached product details
                    const refreshedOrder = await fetchOrderWithItems(orderId);

                    if (refreshedOrder) {
                        upsertOrderInState(refreshedOrder);
                    }
                }
            )
            // 2. ADD DELETE LISTENER FOR REMOVALS
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'order_items' },
                (payload) => {
                    const deletedItemId = (payload.old as { id?: string }).id;

                    if (!deletedItemId) return;

                    // Filter the item out of the state locally
                    setOrders((currentOrders) =>
                        currentOrders.map((order) => ({
                            ...order,
                            order_items: order.order_items?.filter(
                                (item) => item.id !== deletedItemId
                            ),
                        }))
                    );
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                async (payload) => {
                    const updatedOrder = payload.new as Order;

                    // If a GCash order was just paid, it isn't on the screen yet. We need to fetch and add it.
                    if (updatedOrder.payment_method === 'gcash' && updatedOrder.is_paid) {
                        const fullOrder = await fetchOrderWithItems(updatedOrder.id);
                        playNotificationSound();
                        // Check if it's already in the state array to prevent duplicates
                        setOrders((current) => {
                            const exists = current.some(o => o.id === updatedOrder.id);
                            if (!exists && fullOrder) {
                                playNotificationSound(); // Ring the bell now that payment arrived!
                                return [...current, fullOrder].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                            }
                            return current;
                        });
                    }

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

        const previousOrders = [...orders];
        setOrders((currentOrders) =>
            currentOrders.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );

        const result = await updateOrderAction(orderId, newStatus);

        if (!result.success) {
            console.error("Failed to update status:", result.error);
            alert("Failed to update order: " + result.error);
            setOrders(previousOrders);
        }
    };

    if (loading) return <div className="p-8 text-center font-bold text-gray-500">Loading live orders...</div>;

    return (
        <div className="flex flex-row w-full pt-20 2xl:pt-27 bg-gray-50 overflow-x-auto snap-x snap-mandatory scroll-smooth">

            {/* PENDING COLUMN */}
            <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-4 border-t-4 border-orange-500 snap-start w-full md:w-1/2 xl:w-1/4">
                <div className='flex items-center gap-2'>
                    <h2 className="font-bold text-orange-500 mb-4 tracking-wider text-sm">PENDING ({pendingOrders.length})</h2>
                    <button
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`mb-3 flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${notificationsEnabled
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {notificationsEnabled ? (
                            <>
                                <Bell size={18} />
                                Alerts ON
                            </>
                        ) : (
                            <>
                                <BellOff size={18} />
                                Alerts OFF
                            </>
                        )}
                    </button>
                </div>
                <div className="space-y-4">
                    {pendingOrders.map((order) => {
                        const hasActionRequired = order.order_items?.some(item => item.status === 'action_required');
                        return (
                            <div key={order.id} className="relative border border-orange-500 shadow-sm p-4 rounded-xl">
                                {/* The PAID Badge */}
                                {order.is_paid && (
                                    <div className="absolute top-16 right-4 bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full text-xs font-black tracking-widest shadow-sm">
                                        PAID VIA GCASH
                                    </div>
                                )}
                                <div className='flex justify-between mb-3'>
                                    <div className='flex'>
                                        <Square fill='orange' strokeWidth={0} />
                                        <p className="font-bold text-gray-800">{order.first_name} {order.last_name}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                    <X className='cursor-pointer hover:bg-kae-dark hover:text-kae-light rounded-full transition-colors duration-300' onClick={() => setOrderToDelete(order)} />
                                </div>

                                {/* THE WARNING BANNER */}
                                {hasActionRequired && (
                                    <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg mb-3 text-sm font-bold flex items-center justify-center animate-pulse">
                                        ⚠️ Waiting for customer to update items
                                    </div>
                                )}

                                <div>
                                    <div className='flex flex-col gap-2 border-t border-orange-500 py-2'>
                                        <div className='flex gap-2'>
                                            <Wallet />
                                            <p className='font-semibold'>{order.payment_method}</p>
                                        </div>
                                        {order.order_type === "delivery" ? (<div className='flex gap-2'>
                                            <div className='flex gap-2 items-center'>
                                                <MapPin />
                                                <p>{order.delivery_address}</p>
                                            </div>
                                            <button
                                                onClick={() => setViewLocation({
                                                    lat: order.delivery_lat,
                                                    lng: order.delivery_long,
                                                    name: `${order.first_name} ${order.last_name}`
                                                })}
                                                className="cursor-pointer hover:text-kae-light hover:bg-blue-600 rounded-lg transition-colors duration-300 text-blue-600 font-bold text-sm px-3 py-2"
                                            >
                                                View Map
                                            </button>
                                        </div>) : (<div className='flex gap-2'>
                                            <HandPlatter />
                                            <p>Pick-up {order.pickup_time}</p>
                                        </div>)}
                                        <div className='flex gap-2'>
                                            <Phone />
                                            <p>{order.contact}</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <Coins />
                                            <p className='font-bold text-xl'>₱{calculateTotal(order)}</p>
                                        </div>
                                        <div hidden={order.order_type === "pickup"}>
                                            <button onClick={() => toggleCustomerNote(order.id)}>{showedNote === order.id ? "Hide note" : "Show note"}</button>
                                            <div hidden={showedNote !== order.id}>{order.customer_note}</div>
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <p className='text-md font-semibold'>ORDERS</p>
                                        {(order.order_items || [])
                                            .filter((item) => item.status !== 'action_required')
                                            .map((item, index) => (
                                                <div className='flex justify-between border-b py-2 gap-2' key={index}>
                                                    <p className='px-2 bg-kae-dark text-kae-light rounded-full h-max content-center'>{item.quantity}x</p>
                                                    <p className='flex-grow'>{item.product.name}</p>
                                                    <p className='font-semibold'>₱{((item.price_at_checkout ?? item.product.discount_price ?? 0) * item.quantity).toFixed(2)}</p>
                                                    <SquareX
                                                        className='h-8 w-8'
                                                        strokeWidth={1}
                                                        fill='red'
                                                        onClick={() => {
                                                            setItemToRemove(item);
                                                            setOrderIdItemToRemove(order.id);
                                                            setIsDeletingItem(true);
                                                        }}
                                                    />
                                                </div>

                                            ))}
                                        {order.order_type === "delivery" && (
                                            <div className='flex justify-between ml-10 py-2'>
                                                <p>Delivery Fee</p>
                                                <p className='font-semibold'>₱49</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <button onClick={() => setEditingOrder(order)}
                                        className='hover:text-kae-light hover:bg-orange-500 transition-colors duration-300 cursor-pointer mt-3 bg-kae-light text-orange-500 border-1 border-orange-500 font-bold py-2 px-4 rounded-lg transition-colors'>
                                        EDIT
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'cooking')}
                                        disabled={hasActionRequired}
                                        className={`w-full mt-3 font-bold py-2 rounded-lg transition-colors duration-300 ${hasActionRequired ? 'bg-gray-400 text-gray-200 cursor-not-allowed hover:bg-gray-400' : 'bg-orange-400 text-kae-light hover:bg-orange-600'}`}
                                    >
                                        START COOKING
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* COOKING COLUMN */}
            <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-4 border-t-4 border-purple-600 snap-start w-full md:w-1/2 xl:w-1/4">
                <h2 className="font-bold text-purple-600 mb-4 tracking-wider text-sm">COOKING ({cookingOrders.length})</h2>
                <div className="space-y-4">
                    {cookingOrders.map((order) => (
                        renderOrderCard(order, {
                            label: getCookingAction(order).label,
                            className: "w-full mt-3 bg-purple-600 text-kae-light font-bold py-2 rounded-lg transition-colors",
                            onClick: () => updateOrderStatus(order.id, getCookingAction(order).nextStatus),
                        }, {
                            squareFill: "purple", className: 'hover:text-kae-light hover:bg-purple-500 transition-colors duration-300 cursor-pointer mt-3 bg-kae-light text-purple-500 border-1 border-purple-500 font-bold py-2 px-4 rounded-lg transition-colors',
                            primaryClassname: "hover:bg-purple-800 w-full mt-3 bg-purple-600 text-kae-light font-bold py-2 rounded-lg transition-colors duration-300"
                        })
                    ))}
                </div>
            </div>

            {/* PREPARED COLUMN */}
            <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-4 border-t-4 border-blue-500 snap-start w-full md:w-1/2 xl:w-1/4">
                <h2 className="font-bold text-blue-500 mb-4 tracking-wider text-sm">PREPARED ({preparedOrders.length})</h2>
                <div className="space-y-4">
                    {preparedOrders.map((order) => (
                        renderOrderCard(order, {
                            label: 'SEND TO DELIVERY',
                            className: "w-full mt-3 bg-blue-600 text-kae-light font-bold py-2 rounded-lg transition-colors",
                            onClick: () => updateOrderStatus(order.id, 'delivering')

                        }, {
                            squareFill: "blue", className: 'hover:text-kae-light hover:bg-blue-500 transition-colors duration-300 cursor-pointer mt-3 bg-kae-light text-blue-500 border-1 border-blue-500 font-bold py-2 px-4 rounded-lg transition-colors',
                            primaryClassname: "hover:bg-blue-800 w-full mt-3 bg-blue-600 text-kae-light font-bold py-2 rounded-lg transition-colors duration-300"
                        })
                    ))}
                </div>
            </div>

            {/* DELIVERING COLUMN */}
            <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-4 border-t-4 border-green-500 snap-start w-full md:w-1/2 xl:w-1/4">
                <h2 className="font-bold text-green-500 mb-4 tracking-wider text-sm">DELIVERING ({deliveringOrders.length})</h2>
                <div className="space-y-4">
                    {deliveringOrders.map((order) => (
                        renderOrderCard(order, {
                            label: getFinalAction(order).label,
                            className: "w-full mt-3 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-colors",
                            onClick: () => updateOrderStatus(order.id, getFinalAction(order).nextStatus),

                        }, {
                            squareFill: "green", className: 'hover:text-kae-light hover:bg-green-500 transition-colors duration-300 cursor-pointer mt-3 bg-kae-light text-green-500 border-1 border-green-500 font-bold py-2 px-4 rounded-lg transition-colors',
                            primaryClassname: "hover:bg-green-800 w-full mt-3 bg-green-600 text-kae-light font-bold py-2 rounded-lg transition-colors duration-300"
                        })
                    ))}
                </div>
            </div>
            {orderToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center">

                        {/* Warning Icon Container */}
                        <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                            <X size={32} strokeWidth={3} />
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Are you sure you want to cancel the order for <span className="font-bold text-gray-800">{orderToDelete.first_name} {orderToDelete.last_name}</span>? This action cannot be undone.
                        </p>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setOrderToDelete(null)}
                                disabled={isDeleting}
                                className="cursor-pointer flex-1 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                            >
                                NO
                            </button>
                            <button
                                onClick={handleDeleteOrder}
                                disabled={isDeleting}
                                className="cursor-pointer flex-1 py-3 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center"
                            >
                                {isDeleting ? "CANCELLING..." : "PROCEED"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* THE EDIT OVERLAY */}
            {editingOrder && (
                <EditOrderModal
                    order={editingOrder}
                    catalog={catalog}
                    onClose={() => setEditingOrder(null)}
                    onConfirm={handleEditOrder}
                />
            )}
            {/* Map Overlay */}
            {viewLocation && (
                <LocationViewModal
                    lat={viewLocation.lat}
                    lng={viewLocation.lng}
                    name={viewLocation.name}
                    onClose={() => setViewLocation(null)}
                />
            )}
            {/* Remove Item Modal */}
            {itemToRemove && (
                <RemoveItemModal
                    orderItem={itemToRemove}
                    orderId={orderIdItemToRemove}
                    onClose={cancelRemoveItem}
                    onProceed={removeItem}
                />
            )}
        </div>
    );
}
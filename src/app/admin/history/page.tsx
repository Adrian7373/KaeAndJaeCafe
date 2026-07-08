"use client";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Coins, HandPlatter, Loader2, MapPin, Motorbike, MoveRight, Phone, RotateCcw, Search, Square, Wallet, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Order } from "../orders/page";
import { createClient } from "@/../lib/supabase";
import { permaDeleteOrder } from "@/app/actions";

export interface OrderItem {
    quantity: number;
    price_at_checkout: number;
    product: { name: string; price: number };
}

export interface HistoricalOrder {
    id: string;
    created_at: string;
    status: string;
    order_type: string;
    first_name: string;
    last_name: string;
    payment_method: string;
    order_items: OrderItem[];
}

interface Feedback {
    isSuccess: boolean,
    message: string,
    isVisible: boolean
}

export default function HistoryPage() {

    const supabase = useMemo(() => createClient(), []);

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [orders, setOrders] = useState<HistoricalOrder[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const [orderToDelete, setOrderToDelete] = useState<HistoricalOrder | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const [selectedOrder, setSelectedOrder] = useState<HistoricalOrder | null>(null);

    const calculateOrderTotal = (orderItems: OrderItem[] | undefined) => {
        return (orderItems ?? []).reduce((total, item) => {
            return total + Number(item.quantity) * Number(item.price_at_checkout);
        }, 0);
    };

    useEffect(() => {
        const searchTimeOut = setTimeout(() => {
            if (searchTerm !== searchInput) {
                setSearchTerm(searchInput);
                setCurrentPage(1); // Reset page only when the search actually triggers
            }
        }, 500);
        return () => clearTimeout(searchTimeOut);
    }, [searchInput, searchTerm]);

    useEffect(() => {
        const fetchHistoricalOrders = async () => {
            setLoading(true);

            let query = supabase
                .from("orders")
                .select(`
                    id, created_at, status, order_type, first_name, last_name, payment_method,
                    order_items ( quantity, price_at_checkout, product ( name, price ) )
                `, { count: "exact" })
                .in("status", ["success", "cancelled"]);

            if (searchTerm.trim() !== "") {
                query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
            }

            if (statusFilter !== "all") {
                query = query.eq("status", statusFilter);
            }

            if (startDate) {
                query = query.gte("created_at", `${startDate}T00:00:00`);
            }
            if (endDate) {
                query = query.lte("created_at", `${endDate}T23:59:59`);
            }

            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;

            query = query
                .order("created_at", { ascending: false })
                .range(from, to);

            const { data, count, error } = await query;

            if (error) {
                console.error("Error fetching historical data:", error.message);
            } else {
                setOrders((data as unknown as HistoricalOrder[]) || []);
                setTotalCount(count || 0);
            }
            setLoading(false);
        };

        fetchHistoricalOrders();
    }, [supabase, searchTerm, statusFilter, startDate, endDate, currentPage]);

    const handleFilterChange = (setter: (val: string) => void, value: string) => {
        setter(value);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

    const resetFilterState = () => {
        setCurrentPage(1);
        setStartDate("");
        setEndDate("");
        setSearchTerm("");
        setSearchInput("");
        setSelectedOrder(null);
        setStatusFilter("all");
    }

    const handleDeleteOrder = async () => {
        if (!orderToDelete) return;

        const targetId = orderToDelete.id;

        const previousOrders = [...orders];
        const previousCount = totalCount;

        setOrders(currentOrders => currentOrders.filter(order => order.id !== targetId));
        setTotalCount(prev => prev - 1);

        setOrderToDelete(null);

        const result = await permaDeleteOrder(targetId);

        if (result?.error) {
            setOrders(previousOrders);
            setTotalCount(previousCount);

            setFeedback({ isSuccess: false, message: "Failed to delete order: " + result.error.message, isVisible: true });
            setTimeout(() => {
                setFeedback(prev => prev ? { ...prev, isVisible: false } : null);
            }, 3000);
        } else {
            setFeedback({ isSuccess: true, message: "Order successfully deleted!", isVisible: true });
            setTimeout(() => {
                setFeedback(prev => prev ? { ...prev, isVisible: false } : null);
            }, 3000);
        }
    };

    return (
        <>
            <div className="pt-24 px-6">
                <p className="text-2xl font-bold">Past Orders</p>
                <div className="gap-2 flex flex-col my-4">
                    <div className="flex border-1 rounded-md grow-0">
                        <div className="border-r px-2 flex items-center gap-2">
                            <Search className="w-8 h-8" />
                            <input onChange={(e) => setSearchInput(e.target.value)} value={searchInput} placeholder="Search customer name..." className="flex-auto py-3 text-md outline-none" type="text" />
                        </div>
                        <select value={statusFilter} onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)} className="block px-1 grow-0" name="" id="">
                            <option value="all">All</option>
                            <option value="success">Success</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    {/* Date range picker */}
                    <div className="flex items-center justify-between">
                        <div className=" text-center">
                            <input value={startDate} onChange={(e) => handleFilterChange(setStartDate, e.target.value)} className="py-2 border-1 rounded-md" type="date" />
                        </div>
                        <div className="text-center flex-grow">
                            <p>To</p>
                            <MoveRight className="w-full h-8" />
                        </div>
                        <div className="text-center">
                            <input value={endDate} onChange={(e) => handleFilterChange(setEndDate, e.target.value)} className="border-1 py-2 rounded-md" type="date" />
                        </div>
                        <button onClick={resetFilterState} className="border-1 px-4 py-2 rounded-md"><RotateCcw /></button>
                    </div>
                    {/* Date range picker */}
                </div>
                <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-4 snap-start">
                    {loading ? (
                        <div>
                            <Loader2 className="w-8 h-8 animate-spin text-kae-dark" />
                            <p>Getting the logs...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <p className="font-medium">No archived logs matched these filter parameters.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className={`${order.status === "success" ? "border-green-500" : "border-red-500"} border-2 shadow-sm p-4 rounded-xl`}>
                                    <div className='flex justify-between mb-3'>
                                        <div className='flex'>
                                            <Square fill={order.status === "success" ? "green" : "red"} strokeWidth={0} />
                                            <p className="font-bold text-gray-800">{order.first_name} {order.last_name}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-US', { month: "long", day: "2-digit", year: "numeric" })}</p>
                                        <X onClick={() => setOrderToDelete(order)} />
                                    </div>
                                    <div>
                                        <div className={`flex flex-col gap-2 border-t ${order.status === "success" ? "border-green-500" : "border-red-500"} py-2`}>
                                            <div className='flex gap-2'>
                                                <Wallet />
                                                <p className='font-semibold'>{order.payment_method}</p>
                                            </div>
                                            <div>
                                                {order.order_type === "delivery" ? (<p className="flex gap-1"><Motorbike /> Delivery</p>) : (<p className="flex gap-1"><HandPlatter /> Pickup</p>)}
                                            </div>
                                            <div className="flex gap-1">
                                                <Coins />
                                                <p>₱{calculateOrderTotal(order.order_items)}</p>
                                            </div>
                                        </div>
                                        {selectedOrder === order && (
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
                                        )}

                                    </div>
                                    {selectedOrder === order ? (
                                        <button onClick={() => setSelectedOrder(null)} className="flex items-center flex-col relative py-1 mx-auto">
                                            <ChevronUp className="absolute top-5" />
                                            <p>Hide orders</p>
                                        </button>
                                    ) : (
                                        <button onClick={() => setSelectedOrder(order)} className="flex items-center flex-col relative py-1 mx-auto">
                                            <p>Show orders</p>
                                            <ChevronDown className="absolute top-5" />
                                        </button>
                                    )}

                                </div>
                            ))}
                        </div>
                    )}

                </div >

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-gray-500 tracking-wider">
                        SHOWING {orders.length} OF {totalCount} ENTRIES
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 border border-gray-300 rounded-lg bg-white disabled:opacity-40 transition-opacity"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-bold text-gray-700 px-2">
                            PAGE {currentPage} OF {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 border border-gray-300 rounded-lg bg-white disabled:opacity-40 transition-opacity"
                        >
                            <ChevronRight size={16} />
                        </button>
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
                                    className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleDeleteOrder}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center"
                                >
                                    {isDeleting ? "DELETING..." : "DELETE"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div
                    className={`
                    fixed bottom-10 left-19 px-6 py-4 rounded-xl text-kae-light font-bold shadow-2xl z-[100]
                    transition-all duration-500 ease-out transform
                    ${feedback?.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"}
                    ${feedback?.isSuccess ? "bg-green-500" : "bg-red-500"}
                `}
                >
                    {feedback?.message}
                </div>

            </div >

        </>
    )
}
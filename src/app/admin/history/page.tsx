"use client";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Coins, HandPlatter, Loader2, MapPin, Motorbike, MoveRight, Phone, RotateCcw, Search, Square, Wallet, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Order } from "../orders/page";
import { createClient } from "@/../lib/supabase";

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

export default function HistoryPage() {

    const supabase = useMemo(() => createClient(), []);

    // --- FILTER STATES ---
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // --- DATA & PAGINATION STATES ---
    const [orders, setOrders] = useState<HistoricalOrder[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // Clean number for desktop/tablet view
    const [orderToDelete, setOrderToDelete] = useState<HistoricalOrder | null>(null);

    // --- DETAILED MODAL STATE (Optional UX) ---
    const [selectedOrder, setSelectedOrder] = useState<HistoricalOrder | null>(null);

    // Calculate total order cost safely
    const calculateOrderTotal = (orderItems: OrderItem[] | undefined) => {
        return (orderItems ?? []).reduce((total, item) => {
            return total + Number(item.quantity) * Number(item.price_at_checkout);
        }, 0);
    };

    // --- THE POWERHOUSE EFFECT ---
    useEffect(() => {
        const fetchHistoricalOrders = async () => {
            setLoading(true);

            // 1. Build the base query requesting exact count rows
            let query = supabase
                .from("orders")
                .select(`
                    id, created_at, status, order_type, first_name, last_name, payment_method,
                    order_items ( quantity, price_at_checkout, product ( name, price ) )
                `, { count: "exact" })
                .in("status", ["success", "cancelled"]); // Only query completed/archived states

            // 2. Dynamic Text Search Filtering
            if (searchTerm.trim() !== "") {
                query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
            }

            // 3. Dynamic Status Filtering
            if (statusFilter !== "all") {
                query = query.eq("status", statusFilter);
            }

            // 4. Dynamic Date Range Filtering (Inclusive of full day bounds)
            if (startDate) {
                query = query.gte("created_at", `${startDate}T00:00:00`);
            }
            if (endDate) {
                query = query.lte("created_at", `${endDate}T23:59:59`);
            }

            // 5. Sorting & Pagination Math
            const from = (currentPage - 1) * itemsPerPage;
            const to = from + itemsPerPage - 1;

            query = query
                .order("created_at", { ascending: false }) // Newest history first
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

        // Trigger fetch. Debounce could be applied to searchTerm if desired, 
        // but resetting page on criteria modifications is mandatory.
        fetchHistoricalOrders();
    }, [supabase, searchTerm, statusFilter, startDate, endDate, currentPage]);

    // Reset pagination context safely if parameters shift
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
        setSelectedOrder(null);
        setStatusFilter("all");
    }

    return (
        <>
            <div className="pt-24 px-6">
                <p className="text-2xl font-bold">Past Orders</p>
                <div className="gap-2 flex flex-col my-4">
                    <div className="flex border-1 rounded-md grow-0">
                        <div className="border-r px-2 flex items-center gap-2">
                            <Search className="w-8 h-8" />
                            <input onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)} value={searchTerm} placeholder="Search customer name..." className="flex-auto py-3 text-md outline-none" type="text" />
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
            </div >

        </>
    )
}
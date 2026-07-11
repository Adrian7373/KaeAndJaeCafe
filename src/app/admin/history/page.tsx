"use client";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Coins, Download, HandPlatter, Loader2, MapPin, Motorbike, MoveRight, Phone, RotateCcw, Search, Square, Wallet, X } from "lucide-react";
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
    const [orderTypeFilter, setOrderTypeFilter] = useState("all");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isExporting, setIsExporting] = useState(false);

    const [orders, setOrders] = useState<HistoricalOrder[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const [orderToDelete, setOrderToDelete] = useState<HistoricalOrder | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const [selectedOrder, setSelectedOrder] = useState<HistoricalOrder | null>(null);

    const calculateOrderTotal = (orderItems: OrderItem[] | undefined, orderType: string) => {
        const subtotal = (orderItems ?? []).reduce((total, item) => {
            return total + Number(item.quantity) * Number(item.price_at_checkout);
        }, 0);
        if (orderType === "delivery") {
            return subtotal + 49
        }
        return subtotal
    };

    const handleExportCSV = async () => {
        setIsExporting(true);

        try {
            let query = supabase
                .from("orders")
                .select(`
                    id, created_at, status, order_type, first_name, last_name, delivery_fee, payment_method,
                    order_items ( quantity, price_at_checkout, product ( name, price ) )
                `)
                .in("status", ["success", "cancelled"])
                .order("created_at", { ascending: false });

            if (searchTerm.trim() !== "") {
                query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
            }
            if (statusFilter !== "all") {
                query = query.eq("status", statusFilter);
            }
            if (orderTypeFilter !== "all") {
                query = query.eq("order_type", orderTypeFilter);
            }
            if (paymentMethodFilter !== "all") {
                query = query.eq("payment_method", paymentMethodFilter);
            }
            if (startDate) {
                query = query.gte("created_at", `${startDate}T00:00:00+08:00`);
            }
            if (endDate) {
                query = query.lte("created_at", `${endDate}T23:59:59+08:00`);
            }

            const { data, error } = await query;

            if (error) throw error;
            if (!data || data.length === 0) {
                alert("No orders matched your filters to export.");
                setIsExporting(false);
                return;
            }

            const headers = [
                "Order ID", "Date", "Customer Name", "Order Type",
                "Status", "Payment Method", "Total Revenue (PHP)", "Items Ordered"
            ];

            const csvRows = data.map((order: any) => {
                const date = new Date(order.created_at).toLocaleDateString('en-US', { timeZone: 'Asia/Manila' });
                const customer = `${order.first_name} ${order.last_name}`;

                const total = calculateOrderTotal(order.order_items, order.order_type);

                const items = order.order_items?.map((item: any) =>
                    `${item.quantity}x ${item.product.name}`
                ).join('; ') || 'No items';

                return [
                    order.id,
                    date,
                    `"${customer}"`,
                    order.order_type,
                    order.status,
                    order.payment_method,
                    total,
                    `"${items}"`
                ].join(',');
            });

            // 5. Build and Download
            const csvContent = [headers.join(','), ...csvRows].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Cafe_Orders_Export_${new Date().toISOString().split('T')[0]}.csv`);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Export Error:", error);
            alert("An error occurred while exporting the data.");
        } finally {
            setIsExporting(false);
        }
    };

    useEffect(() => {
        const searchTimeOut = setTimeout(() => {
            if (searchTerm !== searchInput) {
                setSearchTerm(searchInput);
                setCurrentPage(1);
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
            if (orderTypeFilter !== "all") {
                query = query.eq("order_type", orderTypeFilter);
            }
            if (paymentMethodFilter !== "all") {
                query = query.eq("payment_method", paymentMethodFilter);
            }

            if (startDate) {
                query = query.gte("created_at", `${startDate}T00:00:00+08:00`);
            }
            if (endDate) {
                query = query.lte("created_at", `${endDate}T23:59:59+08:00`);
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
    }, [supabase, searchTerm, statusFilter, orderTypeFilter, paymentMethodFilter, startDate, endDate, currentPage]);

    const handleFilterChange = (setter: (val: string) => void, value: string) => {
        setter(value);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const resetFilterState = () => {
        setCurrentPage(1);
        setStartDate("");
        setEndDate("");
        setSearchTerm("");
        setSearchInput("");
        setSelectedOrder(null);
        setStatusFilter("all");
        setOrderTypeFilter("all");
        setPaymentMethodFilter("all");
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
            <div className="pt-24 2xl:pt-29 px-6 flex flex-col items-center">
                <div className="flex gap-3">
                    <p className="text-2xl font-bold">Past Orders</p>
                    <button
                        onClick={handleExportCSV}
                        disabled={isExporting || totalCount === 0}
                        className="cursor-pointer duration-300 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm min-w-[140px]"
                    >
                        {isExporting ? (
                            <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                        ) : (
                            <Download size={18} strokeWidth={2.5} />
                        )}
                        <span className="hidden sm:inline">
                            {isExporting ? "Exporting..." : "Export CSV"}
                        </span>
                    </button>
                </div>
                <div className="gap-2 flex flex-col my-4 max-w-md lg:flex-row lg:max-w-full">
                    <div className="flex border-1 rounded-md grow-0">
                        <div className="border-r px-2 flex items-center gap-2 w-[70%]">
                            <Search className="w-8 h-8" />
                            <input onChange={(e) => setSearchInput(e.target.value)} value={searchInput} placeholder="Search customer name..." className="flex-auto py-3 text-md outline-none" type="text" />
                        </div>
                        <select value={statusFilter} onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)} className="cursor-pointer block px-1 grow-0 w-[30%]" name="" id="">
                            <option value="all">All</option>
                            <option value="success">Success</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <select value={orderTypeFilter} onChange={(e) => handleFilterChange(setOrderTypeFilter, e.target.value)} className="flex-1 border-1 border-gray-300 bg-white rounded-md px-2 py-3 outline-none cursor-pointer">
                            <option value="all">All Order Types</option>
                            <option value="delivery">Delivery</option>
                            <option value="pickup">Pick-up</option>
                        </select>
                        <select value={paymentMethodFilter} onChange={(e) => handleFilterChange(setPaymentMethodFilter, e.target.value)} className="flex-1 border-1 border-gray-300 bg-white rounded-md px-2 py-3 outline-none cursor-pointer">
                            <option value="all">All Payments</option>
                            <option value="cash">Cash</option>
                            <option value="gcash">GCash</option>
                        </select>
                    </div>
                    {/* Date range picker */}
                    <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center justify-center">
                            <div className=" text-center">
                                <input value={startDate} onChange={(e) => handleFilterChange(setStartDate, e.target.value)} className="cursor-pointer py-2 border-1 rounded-md" type="date" />
                            </div>
                            <div className="text-center flex-grow">
                                <p>To</p>
                                <MoveRight className="w-full h-8" />
                            </div>
                            <div className="text-center">
                                <input value={endDate} onChange={(e) => handleFilterChange(setEndDate, e.target.value)} className="cursor-pointer border-1 py-2 rounded-md" type="date" />
                            </div>
                        </div>
                        <button onClick={resetFilterState} className="cursor-pointer hover:bg-gray-200 transition-colors duration-300 border-1 px-4 py-2 rounded-md"><RotateCcw /></button>
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
                        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-2 lg:grid-cols-3 2xl:grid-cols-4">
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
                                                <p>₱{calculateOrderTotal(order.order_items, order.order_type)}</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`grid transition-all duration-300 ease-in-out ${selectedOrder === order
                                                ? "grid-rows-[1fr] opacity-100 mt-4"
                                                : "grid-rows-[0fr] opacity-0 mt-0"
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className='text-md font-semibold mb-2'>ORDERS</p>
                                                {order.order_items?.map((item, index) => (
                                                    <div className='flex justify-between border-b border-gray-100 py-2 gap-2' key={index}>
                                                        <p className='px-2 bg-kae-dark text-kae-light rounded-full h-max content-center text-sm'>
                                                            {item.quantity}x
                                                        </p>
                                                        <p className='flex-grow text-gray-700 font-medium'>{item.product.name}</p>
                                                        <p className="font-bold text-gray-800">₱{item.price_at_checkout * item.quantity}</p>
                                                    </div>
                                                ))}
                                                {order.order_type === "delivery" && (
                                                    <div className="flex justify-between py-2">
                                                        <p>Delivery fee</p>
                                                        <p className="font-bold">₱49</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(selectedOrder === order ? null : order)}
                                        className="cursor-pointer flex flex-col items-center justify-center w-full mt-2 py-2 text-gray-500 hover:text-gray-800 transition-colors"
                                    >
                                        <p className="font-semibold text-sm">
                                            {selectedOrder === order ? "Hide orders" : "Show orders"}
                                        </p>
                                        <ChevronDown
                                            className={`transition-transform duration-300 ease-in-out mt-1 ${selectedOrder === order ? "rotate-180" : "rotate-0"
                                                }`}
                                            size={20}
                                        />
                                    </button>

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
                                    DELETE
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

import { Square } from "lucide-react"
import TopSellersCard from "./_components/TopSellerCard"
import { createServerClient } from "../../../../lib/supabase-server"
import { redirect } from "next/navigation"
import AutoRefresh from "@/app/track/[orderId]/_components/RefreshComponent"

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Order {
    first_name: string;
    last_name: string;
    order_type: string;
    created_at: string;
}

interface PendingOrder {
    customerName: string;
    order_type: string;
    orderTime: string;
}

export default async function DashboardPage() {
    const supabase = await createServerClient();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user || error) {
        redirect("/login")
    }

    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const phtDateString = formatter.format(new Date());

    const startOfDay = `${phtDateString}T00:00:00+08:00`;
    const endOfDay = `${phtDateString}T23:59:59+08:00`;

    const [pendingRes, detailedRes] = await Promise.all([
        supabase
            .from("orders")
            .select("first_name, last_name, order_type, created_at")
            .eq("status", "pending"),

        supabase
            .from("orders")
            .select(`
                id,
                status,
                order_items (
                    quantity,
                    price_at_checkout,
                    product (
                        id,
                        name,
                        image_path
                    )
                )
            `)
            .gte("created_at", startOfDay)
            .lte("created_at", endOfDay)
    ]);

    // Handle Pending Orders Mapping
    const pendingOrders: PendingOrder[] = pendingRes.data
        ? pendingRes.data.map((order: Order) => ({
            customerName: `${order.first_name} ${order.last_name}`,
            order_type: order.order_type,
            orderTime: new Date(order.created_at).toLocaleTimeString("en-US", {
                timeZone: "Asia/Manila",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }),
        }))
        : [];

    let todaysRevenue = 0;
    let todaysSuccessfulOrders = 0;
    let topSellers: { name: string; imageUrl: string; totalSold: number }[] = [];

    if (detailedRes.error) {
        console.error("Failed to fetch today's detailed orders:", detailedRes.error.message);
    } else if (detailedRes.data && detailedRes.data.length > 0) {
        const salesCount = new Map<string, { name: string; imageUrl: string; totalSold: number }>();

        detailedRes.data.forEach((order: any) => {
            const isSuccess = (order.status ?? "").toLowerCase() === "success";

            order.order_items?.forEach((item: any) => {
                const prod = item.product;
                const { data: { publicUrl } } = supabase
                    .storage
                    .from("product_images")
                    .getPublicUrl(prod.image_path);

                if (isSuccess) {
                    const current = salesCount.get(prod.id) || {
                        name: prod.name,
                        imageUrl: publicUrl,
                        totalSold: 0
                    };

                    salesCount.set(prod.id, {
                        ...current,
                        totalSold: current.totalSold + Number(item.quantity)
                    });

                    todaysRevenue += Number(item.quantity) * Number(item.price_at_checkout ?? 0);
                }
            });

            if (isSuccess) todaysSuccessfulOrders += 1;
        });

        topSellers = Array.from(salesCount.values())
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 3);
    }

    const revenueDisplay = `₱${Math.round(todaysRevenue).toLocaleString()}`;

    return (
        <div className="flex flex-col gap-3 pt-22 pb-4 px-4 max-h-dvh">
            <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                <p className="text-2xl font-bold text-kae-dark">Good Morning, Adrian</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                    <p className="text-sm font-bold text-gray-500 md:text-lg">Today's Revenue</p>
                    <p className="text-3xl font-black text-kae-dark md:text-4xl">{revenueDisplay}</p>
                </div>
                <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                    <p className="text-sm font-bold text-gray-500 md:text-lg">Successful Orders</p>
                    <p className="text-3xl font-black text-kae-dark md:text-4xl">{todaysSuccessfulOrders}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="max-h-100 flex-grow flex flex-col border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md overflow-hidden min-h-65 md:h-full md:max-h-150">
                    <p className="text-sm font-bold text-gray-500 md:text-lg">Pending Orders</p>
                    <div className="overflow-auto flex flex-col gap-2">
                        {pendingOrders.length === 0 && (
                            <p className="text-gray-500 text-sm font-medium py-4 text-center">No pending orders yet.</p>
                        )}
                        {pendingOrders.map((order) => (
                            <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100" key={order.customerName}>
                                <Square fill="orange" strokeWidth={0} className="mt-1" />
                                <div>
                                    <p className="font-bold text-gray-800">{order.customerName}</p>
                                    <p className="text-sm text-gray-600 capitalize">{order.order_type}</p>
                                    <p className="text-xs font-bold text-gray-400">{order.orderTime}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <TopSellersCard topSellers={topSellers} />
            </div>
            <AutoRefresh />
        </div>
    )
}
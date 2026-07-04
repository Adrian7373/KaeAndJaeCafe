import { Square } from "lucide-react"
import TopSellersCard from "./_components/TopSellerCard"
import { createServerClient } from "../../../../lib/supabase-server"
import { redirect } from "next/navigation"
import AutoRefresh from "@/app/track/[orderId]/_components/RefreshComponent"

interface Order {
    first_name: string,
    last_name: string,
    order_type: string,
    created_at: string
}

interface PendingOrder {
    customerName: string,
    order_type: string,
    orderTime: string
}

export default async function DashboardPage() {

    const supabase = await createServerClient();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user || error) {
        redirect("/login")
    }

    const { data: pending } = await supabase
        .from("orders")
        .select("first_name, last_name, order_type, created_at")
        .eq("status", "pending");

    const pendingOrders: PendingOrder[] = pending
        ? pending.map((order: Order) => ({
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

    // Calculate today's date range in PHT (Asia/Manila)
    const now = new Date();
    const phtDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));

    const startOfDay = new Date(phtDate.getFullYear(), phtDate.getMonth(), phtDate.getDate(), 0, 0, 0);
    const endOfDay = new Date(phtDate.getFullYear(), phtDate.getMonth(), phtDate.getDate(), 23, 59, 59);

    // Fetch today's orders
    // We'll fetch detailed orders (including order_items and product info)
    // and compute top sellers, today's revenue (from successful orders), and successful orders count.
    let todaysRevenue = 0;
    let todaysSuccessfulOrders = 0;
    let topSellers: { name: string; imageUrl: string; totalSold: number }[] = [];

    try {
        const { data: ordersDetailed, error: ordersError } = await supabase
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
            .gte("created_at", startOfDay.toISOString())
            .lte("created_at", endOfDay.toISOString());

        if (ordersError) {
            console.error("Failed to fetch today's detailed orders:", ordersError.message);
        } else if (ordersDetailed && ordersDetailed.length > 0) {
            const salesCount = new Map<string, { name: string; imageUrl: string; totalSold: number }>();

            ordersDetailed.forEach((order: any) => {
                const isSuccess = (order.status ?? "").toLowerCase() === "success";

                order.order_items?.forEach((item: any) => {
                    const prod = item.product;
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from("product_images")
                        .getPublicUrl(prod.image_path);

                    // Only count sales and revenue from successful orders
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
    } catch (err) {
        console.error("Error computing today's metrics:", err);
    }

    const revenueDisplay = `P${Math.round(todaysRevenue).toLocaleString()}`;

    return (
        <>
            <div className="flex flex-col gap-3 pt-20 px-4 max-h-dvh">
                <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                    <p className="text-2xl">Good Morning, Adrian</p>
                </div>
                <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                    <p className="text-xl">Today's Revenue</p>
                    <p className="text-4xl">{revenueDisplay}</p>
                </div>
                <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                    <p className="text-xl">Successful Orders</p>
                    <p className="text-4xl">{todaysSuccessfulOrders}</p>
                </div>
                <div className="max-h-100 flex-grow flex flex-col border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                    <p className="text-xl">Pending Orders</p>
                    <div className="overflow-auto">
                        {pendingOrders.length === 0 && (
                            <p className="text-gray-500">No pending orders yet</p>
                        )}
                        {pendingOrders.map((order) => (
                            <div className="flex gap-3 p-2" key={order.customerName}>
                                <Square fill="orange" />
                                <div>
                                    <p>{order.customerName}</p>
                                    <p>{order.order_type}</p>
                                    <p>{order.orderTime}</p>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
                <TopSellersCard topSellers={topSellers} />
                <AutoRefresh />
            </div>
        </>
    )
}
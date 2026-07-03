// components/dashboard/TopSellersCard.tsx
import Image from "next/image";
import { supabase } from "@/../lib/supabase";

export default async function TopSellersCard() {

    const now = new Date();
    const phtDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));

    const startOfDay = new Date(phtDate.getFullYear(), phtDate.getMonth(), phtDate.getDate(), 0, 0, 0);
    const endOfDay = new Date(phtDate.getFullYear(), phtDate.getMonth(), phtDate.getDate(), 23, 59, 59);

    const { data: orders, error } = await supabase
        .from("order")
        .select(`
      id,
      created_at,
      order_items (
        quantity,
        product (
          id,
          name,
          image_path
        )
      )
    `)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString());

    if (error || !orders) {
        return <div>Failed to load top sellers.</div>;
    }

    const salesCount = new Map<string, { name: string; imagePath: string; totalSold: number }>();

    orders.forEach((order: any) => {
        order.order_items.forEach((item: any) => {
            const prod = item.product;
            const current = salesCount.get(prod.id) || {
                name: prod.name,
                imagePath: prod.imagePath,
                totalSold: 0
            };

            salesCount.set(prod.id, {
                ...current,
                totalSold: current.totalSold + item.quantity
            });
        });
    });

    const topSellers = Array.from(salesCount.values())
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 3);

    return (
        <>

        </>
    );
}
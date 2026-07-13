import OrderStatus from "./_components/OrderStatus";
import { createServerClient } from "@/../lib/supabase-server";
import AutoRefresh from "./_components/RefreshComponent";
import { Order } from "./_components/OrderStatus";
import { Product, Category } from "@/app/order/_components/MenuCatalog";

export default async function TrackPage({ params }: { params: { orderId: string } }) {

    const supabase = await createServerClient();
    const { orderId } = await params;

    const { data: orderInfo, error: orderInfoError } = await supabase
        .from("orders")
        .select("order_type, payment_method, status, first_name, created_at, delivery_fee")
        .eq("id", orderId)
        .maybeSingle();

    if (orderInfoError) {
        throw new Error(`Failed to get order information: ${orderInfoError.message}`)
    }

    const { data: orderDetails, error: orderDetailsError } = await supabase
        .from("order_items")
        .select("id, quantity, status, price_at_checkout, product(name, est_prep_time)")
        .eq("order_id", orderId);

    if (!orderDetails || orderDetailsError) {
        throw new Error(`Failed to get order items: ${orderDetailsError.message}`)
    }

    const { data: menuItems, error: menuItemsError } = await supabase
        .from("product")
        .select("id, name, image_path, price, discount_price, is_available, est_prep_time, product_category(name)")
        .eq("is_archived", false);

    if (menuItemsError) {
        throw new Error(menuItemsError.message)
    }

    const { data: categories, error: catError } = await supabase
        .from("product_category")
        .select("*");

    const typedOrderDetails = (orderDetails as unknown as Order[]) || [];

    const orderTotal = (typedOrderDetails ?? []).reduce((total, item) => {
        return total + Number(item.quantity) * Number(item.price_at_checkout);
    }, 0);

    const maxEstPrepTime = (typedOrderDetails ?? []).reduce((maxTime, item) => {
        const itemPrepTime = Number(item.product?.est_prep_time) || 0;
        return Math.max(maxTime, itemPrepTime);
    }, 0);

    const date = new Date(orderInfo?.created_at.replace(" ", "T"));

    const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Manila'
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    console.log(formattedDate);

    const orderStatus = {
        orderType: orderInfo?.order_type || "",
        payment_method: orderInfo?.payment_method || "",
        status: orderInfo?.status || "pending",
        first_name: orderInfo?.first_name || "",
        orders: orderDetails as unknown as Order[],
        orderTotal: orderTotal,
        orderId: orderId,
        orderTimestamp: formattedDate,
        maxEstPrepTime: String(maxEstPrepTime),
        delivery_fee: orderInfo?.delivery_fee
    }

    return (
        <>
            <AutoRefresh />
            <OrderStatus orderStatus={orderStatus} />
        </>
    )
}
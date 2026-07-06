import OrderStatus from "./_components/OrderStatus";
import { createServerClient } from "@/../lib/supabase-server";
import AutoRefresh from "./_components/RefreshComponent";
import { Order } from "./_components/OrderStatus";

export default async function TrackPage({ params }: { params: { orderId: string } }) {

    const supabase = await createServerClient();
    const { orderId } = await params;

    const { data: orderInfo, error: orderInfoError } = await supabase
        .from("orders")
        .select("order_type, delivery_address, payment_method, status, first_name, created_at")
        .eq("id", orderId)
        .maybeSingle();

    if (orderInfoError) {
        throw new Error(`Failed to get order information: ${orderInfoError.message}`)
    }

    const { data: orderDetails, error: orderDetailsError } = await supabase
        .from("order_items")
        .select("id, quantity, price_at_checkout, product(name)")
        .eq("order_id", orderId);

    if (!orderDetails || orderDetailsError) {
        throw new Error(`Failed to get order items: ${orderDetailsError.message}`)
    }

    const orderTotal = (orderDetails ?? []).reduce((total, item) => {
        return total + Number(item.quantity) * Number(item.price_at_checkout);
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
        delivery_address: orderInfo?.delivery_address || "",
        payment_method: orderInfo?.payment_method || "",
        status: orderInfo?.status || "pending",
        first_name: orderInfo?.first_name || "",
        orders: orderDetails as unknown as Order[],
        orderTotal: orderTotal,
        orderId: orderId,
        orderTimestamp: formattedDate
    }

    return (
        <>
            <AutoRefresh />
            <OrderStatus orderStatus={orderStatus} />
        </>
    )
}
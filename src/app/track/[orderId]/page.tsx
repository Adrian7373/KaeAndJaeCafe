import OrderStatus from "./_components/OrderStatus";
import { supabase } from "@/../lib/supabase";

export default async function TrackPage({ params }: { params: { orderId: string } }) {

    const { orderId } = await params;

    const { data: orderInfo, error: orderInfoError } = await supabase
        .from("order")
        .select("order_type, delivery_address, payment_method, status, first_name")
        .eq("id", orderId)
        .maybeSingle();

    if (orderInfoError) {
        throw new Error(`Failed to get order information: ${orderInfoError.message}`)
    }

    const { data: orderDetails, error: orderDetailsError } = await supabase
        .from("order_items")
        .select("quantity, price_at_checkout, product(name)")
        .eq("order_id", orderId);

    if (orderDetailsError) {
        throw new Error(`Failed to get order items: ${orderDetailsError.message}`)
    }

    const orderTotal = (orderDetails ?? []).reduce((total, item) => {
        return total + Number(item.quantity) * Number(item.price_at_checkout);
    }, 0);

    const orderStatus = {
        orderType: orderInfo?.order_type,
        delivery_address: orderInfo?.delivery_address,
        payment_method: orderInfo?.payment_method,
        status: orderInfo?.status,
        first_name: orderInfo?.first_name,
        orders: orderDetails,
        orderTotal: orderTotal
    }

    return (
        <>
            <OrderStatus orderStatus={orderStatus} />
        </>
    )
}
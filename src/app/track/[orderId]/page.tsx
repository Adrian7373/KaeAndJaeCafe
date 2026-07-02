import OrderStatus from "./_components/OrderStatus";
import { supabase } from "@/../lib/supabase";

export default async function TrackPage({ params }: { params: { orderId: string } }) {

    const { orderId } = await params;

    const { data: orderInfo, error: orderInfoError } = await supabase
        .from("order")
        .select("order_type, delivery_address, payment_method, status, first_name")
        .eq("id", orderId)
        .maybeSingle;

    const { data: orderDetails, error: orderDetailsError } = await supabase
        .from("order_items")
        .select("quantity, price_at_checkout, product(name)")
        .eq("order_id", orderId);

    return (
        <>
            <OrderStatus />
        </>
    )
}
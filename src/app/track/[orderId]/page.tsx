import OrderStatus from "./_components/OrderStatus";
import OrderDetails from "./_components/OrderStatus"

export default function TrackPage({ params }: { params: { orderId: string } }) {

    const { orderId } = params;

    return (
        <>
            <OrderStatus />
        </>
    )
}
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/../lib/supabase-server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const eventType = body.data?.attributes?.type;
        const description = body.data?.attributes?.data?.attributes?.description || "";

        const orderId = description.split('#')[1]?.trim();

        if (!orderId) {
            console.error("WEBHOOK_ERROR: No orderId found. Description was:", description);
            return NextResponse.json({ error: 'No order ID' }, { status: 400 });
        }

        console.log(`WEBHOOK_PROCESSING_ORDER: ${orderId} | EVENT: ${eventType}`);

        const supabase = createAdminClient();

        if (eventType === 'checkout_session.payment.paid') {
            const { error } = await supabase
                .from('orders')
                .update({ is_paid: true })
                .eq('id', orderId);

            if (error) throw error;
            console.log("SUCCESSFULLY_UPDATED_ORDER_TO_PAID:", orderId);

        } else if (eventType === 'checkout_session.payment.failed' || eventType === 'checkout_session.expired') {
            const { error } = await supabase
                .from('orders')
                .update({ is_paid: false })
                .eq('id', orderId);

            if (error) throw error;
            console.log(`ORDER_PAYMENT_FAILED_OR_EXPIRED:`, orderId);

        } else {
            console.log("UNHANDLED_WEBHOOK_EVENT:", eventType);
        }

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("WEBHOOK_FATAL_ERROR:", err);
        return NextResponse.json({ error: 'Fatal error' }, { status: 500 });
    }
}
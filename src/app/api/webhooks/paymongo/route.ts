import { NextResponse } from 'next/server';
import { createServerClient } from '@/../lib/supabase-server';

export async function POST(req: Request) {
    const body = await req.json();
    const event = body.data?.attributes?.type;

    // Only process successful payments
    if (event === 'checkout.session.payment.paid') {
        const orderId = body.data.attributes.data.attributes.description.split('#')[1];

        const supabase = await createServerClient(true);

        // Update your order to reflect that it is paid
        const { error } = await supabase
            .from('orders')
            .update({ is_paid: true })
            .eq('id', orderId);

        if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
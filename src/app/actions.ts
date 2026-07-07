"use server";
import { createServerClient } from "../../lib/supabase-server";
import { CartItem } from "../../context/CartContext";
import z, { success } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";


const checkOutSchema = z.object({
    firstName: z.string().min(2, "Full name is required"),
    lastName: z.string().min(2, "Full last name is required"),
    contact: z.string().min(11, "Contact number must be atleast 11 digits."),
    orderType: z.string(),
    cityBrgy: z.string().optional(),
    street: z.string().optional(),
    pickUpTime: z.string().optional(),
    paymentType: z.string(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    notes: z.string().optional()
    /*cartData:z.array(z.object({
        id:z.string(),
        name:z.string(),
        price:z.string(),
        qty:z.string(),
        imageUrl:z.string()
    })),
    selectedTime:z.string() */
})

type ActionState = {
    error: string | null,
    success: boolean | null
}

export async function placeOrder(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = checkOutSchema.safeParse(rawData)
    if (!validatedFields.success) {
        console.error("Validation Failed:", validatedFields.error.flatten().fieldErrors);
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const summary = Object.values(fieldErrors).flat().slice(0, 3).join("; ") || "Please check your inputs and try again.";
        return { success: false, error: summary } as any;
    }
    const cleanData = validatedFields.data;
    const normalizedOrderType = cleanData.orderType.toLowerCase();

    //Retrieving selected time and cart items
    const selectedTime = formData.get("selectedTime");
    const rawCart = formData.get("cartData") as string;
    const cartArray = JSON.parse(rawCart);

    // Inserting order details first to get order_id
    const supabase = await createServerClient(true);

    // Build a safe delivery address: trim parts, omit empty, or set null
    const addressParts = [cleanData?.cityBrgy, cleanData?.street]
        .map((s) => (typeof s === "string" ? s.trim() : ""))
        .filter(Boolean);
    const deliveryAddress = addressParts.length ? addressParts.join(", ") : null;

    const { data: orderId, error: orderIdError } = await supabase
        .from("orders")
        .insert({
            first_name: cleanData.firstName,
            last_name: cleanData.lastName,
            contact: cleanData.contact,
            order_type: normalizedOrderType,
            delivery_address: deliveryAddress,
            payment_method: cleanData.paymentType,
            pickup_time: normalizedOrderType === "delivery" ? null : selectedTime,
            delivery_lat: cleanData.latitude,
            delivery_long: cleanData.longitude,
            customer_note: cleanData.notes,
            status: "pending",
            delivery_fee: normalizedOrderType === "delivery" ? 49 : 0
        })
        .select("id").maybeSingle();
    if (orderIdError || orderId === null) {
        return {
            success: false,
            error: `Failed to place order: ${orderIdError?.message}`
        } as any
    };

    const validatedCart = cartArray.map((item: CartItem) => {
        return {
            order_id: orderId?.id,
            product_id: item.id,
            quantity: item.qty,
            price_at_checkout: item.price
        }
    })

    //Inserting the cart to order_items using the order_id
    const { error: orderFillError } = await supabase
        .from("order_items")
        .insert(validatedCart)

    if (orderFillError) {
        return {
            success: false,
            error: `Failed to fill order: ${orderFillError.message}`,
        } as any;

    }

    const cookieStore = await cookies();
    cookieStore.set("active_order_id", orderId.id, {
        maxAge: 7200,
        httpOnly: true,
    });

    redirect(`/track/${orderId.id}`);
}

export async function loginAdmin(prevState: any, formData: FormData) {
    const password = formData.get("password") as string;
    const email = process.env.ADMIN_EMAIL;

    if (!email) {
        return { error: "Server configuration error" }
    }

    const supabase = await createServerClient(true);
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        return { error: "Invalid password" }
    }

    redirect("/admin/dashboard")

}

export async function updateOrderAction(orderId: string, newStatus: string) {
    const supabase = await createServerClient(true);

    const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

    if (error) {
        console.error("Server Action Update Failed:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function cancelOrderAction(orderId: string) {
    const supabase = await createServerClient(true);

    const { data, error } = await supabase
        .from('orders')
        .update({ status: "cancelled" })
        .eq('id', orderId)

    if (error) {
        console.error("Server Action Cancel Failed:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function editOrderItemsAction(orderId: string, newItems: { productId: string, quantity: number, price_at_checkout: number }[]) {
    const supabase = await createServerClient(true);

    if (newItems.some((item) => item.price_at_checkout == null)) {
        return {
            success: false,
            error: "Missing price_at_checkout for edited order items",
        };
    }

    const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

    if (deleteError) {
        console.error("Failed to delete old items:", deleteError);
        return { success: false, error: deleteError.message };
    }

    const itemsToInsert = newItems.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_checkout: item.price_at_checkout
    }));

    const { error: insertError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

    if (insertError) {
        console.error("Failed to insert new items:", insertError);
        return { success: false, error: insertError.message };
    }

    return { success: true };
}

export async function addCategoryAction(name: string) {
    const supabase = await createServerClient(true);
    const { data, error } = await supabase
        .from('product_category')
        .insert([{ name }])
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

export async function upsertProductAction(productData: any) {
    const supabase = await createServerClient(true);

    const { data, error } = await supabase
        .from('product')
        .upsert(productData)
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
}

export async function toggleProductAvailabilityAction(productId: string, isAvailable: boolean) {
    const supabase = await createServerClient(true);
    const { error } = await supabase
        .from('product')
        .update({ is_available: !isAvailable })
        .eq('id', productId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// Get the current status
export async function getStoreStatusAction() {
    const supabase = await createServerClient();
    const { data } = await supabase
        .from('store_settings')
        .select('is_accepting_orders')
        .eq('id', 1)
        .single();

    return data?.is_accepting_orders ?? false;
}

// Flip the switch
export async function toggleStoreStatusAction(newStatus: boolean) {
    const supabase = await createServerClient(true);
    const { error } = await supabase
        .from('store_settings')
        .update({ is_accepting_orders: newStatus })
        .eq('id', 1);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function permaDeleteOrder(orderId: string | null) {
    if (!orderId) return;

    const supabase = await createServerClient(true);
    const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId)

    if (error) {
        return { success: false, error: error }
    }
    return { success: true }
}

export async function deleteMenuItem(productId: string, imagePath: string) {
    const supabase = await createServerClient(true);

    const { error } = await supabase
        .from("product")
        .delete()
        .eq("id", productId);

    if (error) {
        return { success: false, error: error }
    }

    const { error: imageError } = await supabase
        .storage
        .from("product_images")
        .remove([imagePath]);

    if (imageError) {
        return { success: false, error: "Product deleted but failed to delete image" + imageError }
    }

    return { success: true }

}
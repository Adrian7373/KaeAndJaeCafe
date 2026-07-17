"use server";
import { createServerClient } from "../../lib/supabase-server";
import z, { success } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Product } from "./admin/manage_menu/page";
import { revalidatePath } from "next/cache";


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
    success: boolean | null,
    checkoutUrl?: string,
    orderId?: string
}

export async function placeOrder(prevState: any, formData: FormData): Promise<any> {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = checkOutSchema.safeParse(rawData);

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const summary = Object.values(fieldErrors).flat().slice(0, 3).join("; ") || "Please check your inputs and try again.";
        return { success: false, error: summary };
    }

    const cleanData = validatedFields.data;
    const normalizedOrderType = cleanData.orderType.toLowerCase();

    const selectedTime = formData.get("selectedTime");
    const rawCart = formData.get("cartData") as string;
    const cartArray = JSON.parse(rawCart);

    const cartTotal = cartArray.reduce((total: number, item: any) => total + (item.discount_price * item.qty), 0);
    const deliveryFee = normalizedOrderType === "delivery" ? 49 : 0;
    const totalAmount = cartTotal + deliveryFee;

    const supabase = await createServerClient(true);

    const addressParts = [cleanData?.cityBrgy, cleanData?.street].map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
    const deliveryAddress = addressParts.length ? addressParts.join(", ") : null;

    const paymentType = formData.get("paymentType") as string;

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
            delivery_fee: deliveryFee
        })
        .select("id").maybeSingle();

    if (orderIdError || orderId === null) {
        return { success: false, error: `Failed to place order: ${orderIdError?.message}` };
    }

    const validatedCart = cartArray.map((item: any) => ({
        order_id: orderId.id,
        product_id: item.id,
        quantity: item.qty,
        price_at_checkout: item.discount_price
    }));

    const { error: orderFillError } = await supabase.from("order_items").insert(validatedCart);

    if (orderFillError) {
        return { success: false, error: `Failed to fill order: ${orderFillError.message}` };
    }

    const cookieStore = await cookies();
    cookieStore.set("active_order_id", orderId.id, { maxAge: 7200, httpOnly: true });

    // --- GCASH LOGIC ---
    if (paymentType === "gcash") {
        let checkoutUrl = "";

        try {
            const secretKey = process.env.PAYMONGO_SECRET_KEY;
            const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');
            const amountInCentavos = Math.round(totalAmount * 100);

            const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
            const safeBaseUrl = rawSiteUrl?.replace(/\/$/, "");

            const payload = {
                data: {
                    attributes: {
                        billing: {
                            name: `${cleanData.firstName} ${cleanData.lastName}`.trim(),
                            phone: cleanData.contact,
                            email: ""
                        },
                        payment_method_types: ["gcash"],
                        send_email_receipt: false,
                        show_description: true,
                        show_line_items: true,
                        description: `Cafe Order #${orderId.id}`,
                        line_items: [
                            {
                                name: `Order ${orderId.id}`,
                                amount: amountInCentavos,
                                currency: "PHP",
                                quantity: 1
                            }
                        ],
                        success_url: `${safeBaseUrl}/track/${orderId.id}`,
                        cancel_url: `${safeBaseUrl}/order`
                    }
                }
            };

            const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${encodedKey}`
                },
                cache: 'no-store',
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.errors?.[0]?.detail || "Payment gateway error.";
                return { success: false, error: errorMessage };
            }

            checkoutUrl = data.data.attributes.checkout_url;
        } catch (error) {
            return { success: false, error: "Failed to connect to payment gateway." };
        }

        if (checkoutUrl) {
            return { success: true, orderId: orderId.id, checkoutUrl };
        }
    }

    // --- CASH LOGIC ---
    return { success: true, orderId: orderId.id };
}

export async function loginAdmin(prevState: any, formData: FormData) {
    const role = formData.get("role");
    const password = formData.get("password") as string;
    let email = "";

    if (role === "admin") {
        email = process.env.ADMIN_EMAIL || "";
    } else if (role === "cashier") {
        email = process.env.CASHIER_EMAIL || "";
    } else if (role === "rider") {
        email = process.env.RIDER_EMAIL || "";
    }

    if (!email) {
        return { error: "Server configuration error" }
    }

    const supabase = await createServerClient(true);
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        return { error: "Invalid password" }
    }

    const userId = data.user.id
    const { data: authenticatedRole, error: roleError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

    if (!authenticatedRole) {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return { error: `Failed to logout user` + error }
        }
        redirect("/login")
    }

    if (authenticatedRole.role === "rider") {
        redirect("/admin/orders")
    } else {
        redirect("/admin/dashboard")
    }

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
    const user = await getAuthenticatedUser();

    if (user?.role !== "owner") {
        return { success: false }
    }

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

    const user = await getAuthenticatedUser();

    if (user?.role !== "owner") {
        return { success: false }
    }

    const supabase = await createServerClient(true);
    const { error } = await supabase
        .from('store_settings')
        .update({ is_accepting_orders: newStatus })
        .eq('id', 1);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function archiveOrder(orderId: string) {
    const supabase = await createServerClient();

    const { error } = await supabase
        .from('orders')
        .update({ is_archived: true })
        .eq('id', orderId);

    if (error) return { success: false, error: error };

    revalidatePath('/history'); // Refresh the page
    return { success: true };
}

export async function deleteMenuItem(product: Product | null) {
    if (!product) return
    const supabase = await createServerClient(true);

    const { error } = await supabase
        .from("product")
        .update({ is_archived: true })
        .eq("id", product.id);

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true }

}

//Just Sets the status to "action_required"
export async function RemoveOrderItem(itemId: string) {
    if (!itemId) return;

    const supabase = await createServerClient(true);

    const { error } = await supabase
        .from("order_items")
        .update({ status: "action_required" })
        .eq("id", itemId)

    if (error) {
        return { success: false, error: error }
    }
    return { success: true }

}

//Permanently Delete an order_item record from database
export async function DeleteOrderItem(itemId: string) {
    if (!itemId) return;

    const supabase = await createServerClient(true);
    const { error } = await supabase
        .from("order_items")
        .delete()
        .eq("id", itemId)

    if (error) {
        return { success: false, error: error }
    }
    return { success: true }
}

export async function ReplaceOrderItem(itemToReplaceId: string, newProductId: string, newProductPrice: number) {
    if (!itemToReplaceId || !newProductId || !newProductPrice) return;

    const supabase = await createServerClient(true);

    const { error } = await supabase
        .from("order_items")
        .update({ product_id: newProductId, price_at_checkout: newProductPrice, status: "" })
        .eq("id", itemToReplaceId)

    if (error) {
        return { success: false, error: error }
    }
    return { success: true }
}

//Logout action
export async function logout() {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: `Failed to logout user` + error }
    }

    redirect('/login');
}

//Delete Category
export async function deleteCategory(categoryId: string) {
    const supabase = await createServerClient();

    try {
        const { error: deleteError } = await supabase
            .from('product_category')
            .delete()
            .eq('id', categoryId);

        if (deleteError) {
            throw new Error(`Failed to delete category: ${deleteError.message}`);
        }

        // Refresh the manage menu page so the category disappears
        revalidatePath('/manage_menu');
        return { success: true };

    } catch (error: any) {
        console.error("DELETE_CATEGORY_ERROR:", error);
        return { success: false, error: error.message };
    }
}

// Get user ROLE
export async function getCurrentUser() {
    const supabase = await createServerClient();

    // 1. Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    // 2. Fetch their specific role from the profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const role = profile as unknown as { role: string };

    if (!profile) {
        const { error } = await supabase.auth.signOut();
        redirect("/login")
    }

    return {
        id: user.id,
        email: user.email,
        role: role.role || 'rider' // Default to lowest privilege for safety
    };
}

//Authentication and role recognition action
export async function getAuthenticatedUser() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // We assume you have set the role in app_metadata via set_claim
    return {
        id: user.id,
        email: user.email,
        role: user.app_metadata.role || 'rider'
    };
}
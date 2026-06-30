"use server";
import { supabase } from "../../lib/supabase";
import { CartItem } from "../../context/CartContext";
import z, { success } from "zod";

const checkOutSchema = z.object({
    firstName: z.string().min(2, "Full name is required"),
    lastName: z.string().min(2, "Full last name is required"),
    contact: z.string().min(11, "Contact number must be atleast 11 digits."),
    orderType: z.string(),
    cityBrgy: z.string().optional(),
    street: z.string().optional(),
    pickUpTime: z.string().optional(),
    paymentType: z.string()
    /*cartData:z.array(z.object({
        id:z.string(),
        name:z.string(),
        price:z.string(),
        qty:z.string(),
        imageUrl:z.string()
    })),
    selectedTime:z.string() */
})

export async function placeOrder(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = checkOutSchema.safeParse(rawData)
    if (!validatedFields.success) {
        console.error("Validation Failed:", validatedFields.error.flatten().fieldErrors);
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const summary = Object.values(fieldErrors).flat().slice(0, 3).join("; ") || "Please check your inputs and try again.";
        return { success: false, message: `Validation failed: ${summary}`, errors: fieldErrors } as any;
    }
    const cleanData = validatedFields.data;

    //Retrieving selected time and cart items
    const selectedTime = formData.get("selectedTime");
    const rawCart = formData.get("cartData") as string;
    const cartArray = JSON.parse(rawCart);

    // Inserting order details first to get order_id
    const { data: orderId, error: orderIdError } = await supabase
        .from("order")
        .insert({
            customer_name: `${cleanData.firstName} ${cleanData.lastName}`,
            contact: cleanData.contact,
            order_type: cleanData.orderType,
            delivery_address: `${cleanData?.cityBrgy}, ${cleanData?.street}`,
            payment_method: cleanData.paymentType,
            pickup_time: cleanData.orderType === "delivery" ? null : selectedTime
        })
        .select("id").maybeSingle();
    if (orderIdError) {
        return {
            success: false,
            message: `Failed to place order: ${orderIdError.message}`,
            errors: orderIdError.details
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
            message: `Failed to fill order: ${orderFillError.message}`,
            errors: orderFillError.details
        } as any;

    }
}
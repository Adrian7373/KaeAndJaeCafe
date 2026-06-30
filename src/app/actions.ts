"use server";
import { supabase } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";
import z from "zod";

const checkOutSchema = z.object({
    firstName: z.string().min(2, "Full name is required"),
    lastName: z.string().min(2, "Full last name is required"),
    contact: z.string().min(11, "Contact number must be atleast 11 digits."),
    orderType: z.string(),
    cityBrgy: z.string().optional(),
    street: z.string().optional(),
    pickUpTime: z.string().optional(),
    paymentType: z.string()
})

export async function placeOrder(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

}
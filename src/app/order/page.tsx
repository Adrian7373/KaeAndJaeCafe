export const revalidate = 60;
import MenuCatalog from "./_components/MenuCatalog"
import { createServerClient } from "@/../lib/supabase-server"
import OrderNavBar from "./_components/OrderNavBar";
import { cookies } from "next/headers";
import ActiveOrderBanner from "./_components/ActiveOrderBanner";
import Footer from "@/components/Footer";
import { Product } from "./_components/MenuCatalog";
import { getStoreStatusAction } from "../actions";
import { Category } from "./_components/MenuCatalog";
import { AddOn } from "./_components/MenuCatalog";

export default async function OrderPage() {

    const supabase = await createServerClient();

    const cookieStore = await cookies();
    const activeOrderId = cookieStore.get("active_order_id")?.value;

    const { data: menuItems, error: menuItemsError } = await supabase
        .from("product")
        .select("id, name, image_path, price, discount_price, is_available, est_prep_time, product_category(name)")
        .eq("is_archived", false);

    if (menuItemsError) {
        throw new Error(menuItemsError.message)
    }

    const isStoreOpen = await getStoreStatusAction();

    const menuProducts: Product[] = menuItems.map((item) => {
        const { data: { publicUrl } } = supabase
            .storage
            .from("product_images")
            .getPublicUrl(item.image_path || "");

        return {
            ...item,
            imageUrl: publicUrl,
        } as unknown as Product;
    }) || [];

    console.log(menuProducts);

    const { data: categories, error: catError } = await supabase
        .from("product_category")
        .select("*");

    const { data: addOns } = await supabase
        .from("product")
        .select("id, name, discount_price, image_path")
        .eq("is_addon", true)
        .limit(5);

    const addOnsWithUrls = addOns?.map((product) => ({
        ...product,
        image_url: supabase.storage
            .from("product_images")
            .getPublicUrl(product.image_path || "").data.publicUrl
    }));

    return (
        <>
            <OrderNavBar />
            <MenuCatalog products={menuProducts} isStoreOpen={isStoreOpen} categories={categories as unknown as Category[]} addOns={addOnsWithUrls as unknown as AddOn[]} />
            <ActiveOrderBanner serverOrderId={activeOrderId} />
            <Footer />
        </>
    )
}
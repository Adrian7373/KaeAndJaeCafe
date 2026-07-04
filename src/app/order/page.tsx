export const revalidate = 60;
import MenuCatalog from "./_components/MenuCatalog"
import { createServerClient } from "@/../lib/supabase-server"
import OrderNavBar from "./_components/OrderNavBar";
import { cookies } from "next/headers";
import ActiveOrderBanner from "./_components/ActiveOrderBanner";
import Footer from "@/components/Footer";

export default async function OrderPage() {

    const supabase = await createServerClient();

    const cookieStore = await cookies();
    const activeOrderId = cookieStore.get("active_order_id")?.value;

    const { data: menuItems, error: menuItemsError } = await supabase
        .from("product")
        .select("id, name, image_path, price, discount_price, is_available, est_prep_time, category");

    if (menuItemsError) {
        throw new Error(menuItemsError.message)
    }

    const menuProducts = menuItems.map((item) => {
        const { data: { publicUrl } } = supabase
            .storage
            .from("product_images")
            .getPublicUrl(item.image_path);

        return {
            ...item,
            imageUrl: publicUrl,
        }
    }) || [];

    console.log(menuProducts);

    return (
        <>
            <OrderNavBar />
            <MenuCatalog products={menuProducts} />
            <ActiveOrderBanner />
            <Footer />
        </>
    )
}
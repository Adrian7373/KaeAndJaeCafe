export const revalidate = 60;
import MenuCatalog from "./_components/MenuCatalog"
import { supabase } from "../../../lib/supabase"
import OrderNavBar from "./_components/OrderNavBar";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function OrderPage() {

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
            {activeOrderId && (
                <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                    <Link
                        href={`/track/${activeOrderId}`}
                        className="pointer-events-auto flex items-center gap-3 bg-kae-dark text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform"
                    >
                        <div className="w-3 h-3 bg-kae-purple rounded-full animate-ping absolute"></div>
                        <div className="w-3 h-3 bg-kae-purple rounded-full relative"></div>
                        <span className="font-bold tracking-wide">View Active Order</span>
                        <span>→</span>
                    </Link>
                </div>
            )}
        </>
    )
}
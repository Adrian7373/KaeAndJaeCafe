export const revalidate = 60;
import MenuCatalog from "./_components/MenuCatalog"
import { supabase } from "../../../lib/supabase"
import OrderNavBar from "./_components/OrderNavBar";
import { CartProvider } from "../../../context/CartContext";

export default async function OrderPage() {

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
            <CartProvider>
                <OrderNavBar />
                <MenuCatalog products={menuProducts} />
                <h1>HELLO CUSTOMER</h1>
            </CartProvider>
        </>
    )
}
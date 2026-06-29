import OrderNavBar from "./_components/OrderNavBar"
import MenuCatalog from "./_components/MenuCatalog"
import { supabase } from "../../../lib/supabase"

export default async function OrderPage() {

    const { data: menuProducts, error: menuProductError } = await supabase
        .from("product")
        .select("id, name, image_path, price, discount_price, is_available, est_prep_time, category");

    if (menuProductError) {
        throw new Error(menuProductError.message)
    }

    return (
        <>
            <OrderNavBar />
            <MenuCatalog products={menuProducts} />
            <h1>HELLO CUSTOMER</h1>
        </>
    )
}
import OrderNavBar from "./_components/OrderNavBar"
import MenuCatalog from "./_components/MenuCatalog"
import { supabase } from "../../../lib/supabase"

export default async function OrderPage() {

    const { data: menuProducts, error: menuProductError } = await supabase
        .from("product")
        .select("*");

    return (
        <>
            <OrderNavBar />
            <MenuCatalog />
            <h1>HELLO CUSTOMER</h1>
        </>
    )
}
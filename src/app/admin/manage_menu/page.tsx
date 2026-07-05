"use client";
import { createClient } from "@/../lib/supabase"
import { toggleProductAvailabilityAction } from "@/app/actions";
import { Search, SquarePen } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Product {
    id: string,
    name: string,
    image_path: string,
    image_url: string,
    price: string,
    discount_price: string,
    is_available: boolean,
    est_prep_time: string,
    category?: {
        name: string
    }
}

interface Category {
    id: string,
    name: string
}

export default function MenuManagementPage() {

    // Data States
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [textToSearch, setTextToSearch] = useState<string | null>(null);

    //UI states
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [isToggling, setIsToggling] = useState(false);

    const [supabase] = useState(() => createClient());

    //Search function
    const handleSearch = (value: string) => {
        const searchTimeOut = setTimeout(() => {
            setTextToSearch(value);
        }, 500);
        return clearTimeout(searchTimeOut);
    }

    useEffect(() => {
        const fetchMenuData = async () => {
            const [catRes, prodRes] = await Promise.all([
                supabase.from("product_category").select("name, id"),
                supabase.from("product").select("id, name, image_path, price, discount_price, is_available, est_prep_time, product_category(name)")
            ]);

            if (catRes.data) {
                setCategories(catRes.data);
                if (catRes.data.length > 0) setActiveCategoryId(catRes.data[0].id);
            }
            if (prodRes.data) {
                const productsWithUrls = prodRes.data.map((product) => {
                    // 2. Generate the URL for each path
                    const { data } = supabase.storage
                        .from('product_images') // Replace with your actual bucket name
                        .getPublicUrl(product.image_path);

                    // 3. Attach it to the product object
                    return {
                        ...product,
                        image_url: data.publicUrl
                    };
                });

                // 4. Save the transformed array to state
                setProducts(productsWithUrls as unknown as Product[]);
            }
        };
        fetchMenuData();
        console.log(products);
    }, [supabase]);

    {/* Availability toggle */ }
    const handleToggleAvailability = async (productId: string, is_available: boolean) => {

        setIsToggling(true);
        //Optimistic UI
        const previousProducts = [...products];
        setProducts(products.map((product) =>
            product.id === productId ? { ...product, is_available: !product.is_available } : product
        )
        );

        const result = await toggleProductAvailabilityAction(productId, is_available);

        setIsToggling(false);
        if (result.error) {
            alert("Failed to change availability" + result.error)
            setProducts(previousProducts);
        }
    }

    return (
        <>
            <div className="pt-20 px-4">
                <div className="flex border-1 rounded-xl items-center px-2">
                    <Search className="w-10 h-10 content-center" />
                    <input onChange={(e) => handleSearch(e.target.value)} className="py-4 flex-grow text-xl px-2 outline-none content-center" type="text" />
                </div>
            </div>
            {/* Menu Catalog */}
            <div className="w-full grid grid-cols-1 gap-3 px-4 py-4 place-items-center">
                {products.map((product) => (
                    <div key={product.id} className="flex flex-col border-1 rounded-xl w-6/8 py-4 px-4">
                        <div className="relative aspect-square rounded-t-2xl overflow-hidden">
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 300px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p>{product.name}</p>
                            <p>Price: ₱{product.price}</p>
                            <p>Discount Price: ₱{product.discount_price}</p>
                            <p>Preparation Time: {product.est_prep_time} mins</p>
                        </div>
                        <div className="mt-3 flex flex-col gap-2">
                            <button onClick={() => handleToggleAvailability(product.id, product.is_available)} className={`${product.is_available === true ? "bg-green-600" : "bg-red-500"} font-semibold flex gap-2 justify-center items-center text-kae-light px-4 py-2 rounded-xl`}>
                                {product.is_available === true ? "Available" : "Not Available"}
                            </button>
                            <button className=" flex gap-2 justify-center items-center bg-kae-dark text-kae-light px-4 py-2 rounded-xl">
                                <SquarePen />EDIT ITEM
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
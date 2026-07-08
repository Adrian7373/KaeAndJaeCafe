"use client";
import { createClient } from "@/../lib/supabase"
import { addCategoryAction, toggleProductAvailabilityAction, upsertProductAction } from "@/app/actions";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import EditMenuItemModal from "./_components/EditMenuItemModal";
import NewCategoryModal from "./_components/AddNewCategoryModal";
import { deleteMenuItem } from "@/app/actions";

export interface Product {
    id: string,
    name: string,
    image_path: string,
    image_url: string,
    price: string,
    discount_price: string,
    is_available: boolean,
    est_prep_time: string,
    product_category?: {
        id: string
    }
}

export interface Category {
    id: string,
    name: string
}

export default function MenuManagementPage() {

    // Data States
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [textToSearch, setTextToSearch] = useState<string | null>(null);

    //UI states
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>("all");
    const [isToggling, setIsToggling] = useState(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [itemToEdit, setItemToEdit] = useState<Partial<Product> | null>(null)
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [supabase] = useState(() => createClient());

    const toggleEdit = (item: Product) => {
        setItemToEdit(item);
    }

    const toggleClose = () => {
        setIsAddingCategory(false);
    }

    //Search function
    useEffect(() => {
        const searchTimeOut = setTimeout(() => {
            setTextToSearch(searchInput);
        }, 500);
        return () => clearTimeout(searchTimeOut);
    }, [searchInput])

    useEffect(() => {
        const fetchMenuData = async () => {
            const [catRes, prodRes] = await Promise.all([
                supabase.from("product_category").select("name, id"),
                supabase.from("product").select("id, name, image_path, price, discount_price, is_available, est_prep_time, product_category(id)")
            ]);

            if (catRes.data) {
                setCategories(catRes.data);
            }
            if (prodRes.data) {
                const productsWithUrls = prodRes.data.map((product) => {

                    const { data } = supabase.storage
                        .from('product_images')
                        .getPublicUrl(product.image_path);


                    return {
                        ...product,
                        image_url: data.publicUrl
                    };
                });


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

    const visibleProducts = products.filter((product) => {

        const matchesCategory = activeCategoryId === "all" || String(product.product_category?.id) === String(activeCategoryId);

        const hasSearchText = textToSearch && textToSearch.trim() !== "";

        if (hasSearchText) {
            return product.name.toLowerCase().includes(textToSearch.toLowerCase());
        }

        return matchesCategory;
    });

    const closeEditModal = () => {
        setItemToEdit(null);
    }

    const handleSaveProduct = async (updatedData: any, newImageFile: File | null) => {
        let finalImagePath = updatedData.image_path;


        if (newImageFile) {
            const fileExt = newImageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product_images')
                .upload(filePath, newImageFile);

            if (uploadError) {
                alert("Error uploading image: " + uploadError.message);
                return;
            }

            finalImagePath = filePath;
        }


        const productPayload = {
            ...updatedData,
            image_path: finalImagePath
        };

        const result = await upsertProductAction(productPayload);

        if (result.success) {
            setItemToEdit(null);
            window.location.reload();
        } else {
            alert("Failed to save product: " + result.error);
        }
    };

    const handleNewCategory = async (newCategory: string) => {
        if (!newCategory.trim()) return;

        const tempId = "1234567890";
        const optimisticCategory = { id: tempId, name: newCategory };
        setCategories((prevCategories) => [...prevCategories, optimisticCategory]);

        setActiveCategoryId(tempId);

        const result = await addCategoryAction(newCategory);
        if (result && result.success) {
            setCategories((prevCategories) => prevCategories.map((category) => (
                category.id === tempId ? result.data : category
            )))
            setActiveCategoryId(result.data.id)
        } else {
            alert("Failed to add category" + result.error)
            setCategories((prevCategories) =>
                prevCategories.filter((cat) => (
                    cat.id !== tempId)
                ));
            setActiveCategoryId("all");
        }
        setIsAddingCategory(false);
    }

    const handleDeleteMenuItem = async (productId: string) => {
        setIsDeleting(false);
        const previousProducts = [...products];
        setProducts((prev) => prev.filter((product) => {
            product.id !== productId
        }))
        const result = await deleteMenuItem(productId);

        if (result?.error) {
            alert(result.error)
            setProducts(previousProducts)
        }
    }

    return (
        <>
            <div className="pt-24 px-4 flex gap-1">
                <div className="flex border-1 rounded-xl items-center px-2 max-w-6/10 bg-kae-light">
                    <Search className="w-8 h-8 content-center" />
                    <input value={searchInput} onChange={(e) => {
                        setSearchInput(e.target.value); if (e.target.value.trim() !== "") {
                            setActiveCategoryId("all");
                        }
                    }} className="py-3 max-w-6/8 text-lg px-2 outline-none content-center" type="text" placeholder="Search Menu..." />
                </div>
                <select className="border-1 px-2 rounded-xl flex-grow bg-kae-light" onChange={(e) => {
                    setActiveCategoryId(e.target.value); if (e.target.value !== "all") {
                        setSearchInput("");
                        setTextToSearch("");
                    }
                }} value={activeCategoryId ?? "all"}>
                    <option value="all">All items</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex px-4 gap-2 justify-center">
                <button onClick={() => setIsAddingCategory(true)} className="bg-transparent px-2 py-4 my-5 flex content-center justify-center items-center text-green-600 rounded-xl border-1 border-green-600"><Plus /> Add new Category</button>
                <button onClick={() => setItemToEdit({})} className="bg-green-600 px-6 py-4 my-5 flex content-center justify-center items-center text-kae-light rounded-xl border-1 border-green-600"><Plus /> Add new Item</button>
            </div>
            {/* Menu Catalog */}
            <div className="w-full grid grid-cols-1 gap-3 px-4 py-4 place-items-center">
                {visibleProducts.map((product) => (
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
                            <div className="flex rounded-xl overflow-hidden">
                                <button onClick={() => toggleEdit(product)} className=" flex gap-2 justify-center items-center bg-kae-dark text-kae-light px-4 py-2 flex-grow">
                                    <SquarePen />EDIT
                                </button>
                                <button onClick={() => handleDeleteMenuItem(product.id)} className=" flex gap-2 justify-center items-center bg-red-400 text-kae-light px-4 py-2">
                                    <Trash2 />DELETE
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {itemToEdit && (
                <EditMenuItemModal product={itemToEdit} onClose={closeEditModal} categories={categories} onSave={handleSaveProduct} />
            )}
            {isAddingCategory && (
                <NewCategoryModal toggleClose={toggleClose} onSave={handleNewCategory} />
            )}

        </>
    )
}
"use client";
import { createClient } from "@/../lib/supabase"
import { addCategoryAction, toggleProductAvailabilityAction, upsertProductAction } from "@/app/actions";
import { Plus, Search, SquarePen, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import EditMenuItemModal from "./_components/EditMenuItemModal";
import NewCategoryModal from "./_components/AddNewCategoryModal";
import { deleteMenuItem } from "@/app/actions";
import { useRouter } from "next/navigation";
import DeleteCategoryModal from "./_components/DeleteCategoryButton";

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
        name: string
    }
}

export interface Category {
    id: string,
    name: string
}

export default function MenuManagementPage() {

    const router = useRouter();
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!user || error) {
                router.push("/login")
            }
        };
        checkAuth();
    }, [supabase, router]);

    // Data States
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [textToSearch, setTextToSearch] = useState<string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Product | null>(null);

    //UI states
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>("all");
    const [isToggling, setIsToggling] = useState(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [itemToEdit, setItemToEdit] = useState<Partial<Product> | null>(null)
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
                supabase.from("product").select("id, name, image_path, price, discount_price, is_available, est_prep_time, product_category(id, name)").eq("is_archived", false)
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

    const handleDeleteMenuItem = async () => {
        if (!itemToDelete) return;

        setIsDeleting(true);

        const previousProducts = [...products];

        setProducts((prev) => prev.filter((product) => product.id !== itemToDelete.id));

        const targetProduct = itemToDelete;
        setItemToDelete(null);
        setIsDeleting(false);

        const result = await deleteMenuItem(targetProduct);

        if (result?.error) {
            alert(result.error);
            setProducts(previousProducts);
        }
    }

    return (
        <>
            <div className="flex flex-col lg:flex-row lg:justify-center">
                <div className="pt-24 2xl:pt-30 px-4 flex gap-1 max-w-lg mx-auto lg:mx-0">
                    <div className="flex border-1 rounded-xl items-center px-2 w-[60%] bg-kae-light">
                        <Search className="w-8 h-8 content-center" />
                        <input value={searchInput} onChange={(e) => {
                            setSearchInput(e.target.value); if (e.target.value.trim() !== "") {
                                setActiveCategoryId("all");
                            }
                        }} className="py-3 max-w-6/8 text-lg px-2 outline-none content-center" type="text" placeholder="Search Menu..." />
                    </div>
                    <select className="cursor-pointer border-1 px-2 rounded-xl w-[40%] flex-grow bg-kae-light" onChange={(e) => {
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
                <div className="flex px-4 gap-2 justify-center lg:pt-24 2xl:pt-30">
                    <DeleteCategoryModal categories={categories} />
                    <button onClick={() => setIsAddingCategory(true)} className="hover:bg-green-600 hover:text-kae-light transition-colors duration-300 cursor-pointer bg-transparent px-2 py-4 my-5 flex content-center justify-center items-center text-green-600 rounded-xl border-1 border-green-600 lg:my-0"><Plus /> Add new Category</button>
                    <button onClick={() => setItemToEdit({})} className="cursor-pointer hover:bg-green-800 transition-colors duration-300 bg-green-600 px-6 py-4 my-5 flex content-center justify-center items-center text-kae-light rounded-xl border-1 border-green-600 lg:my-0"><Plus /> Add new Item</button>
                </div>
            </div>
            {/* Menu Catalog */}
            <div className="w-full grid grid-cols-1 gap-3 px-4 py-4 place-items-center sm:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {visibleProducts.map((product) => (
                    <div key={product.id} className="flex flex-col border-1 border-gray-400 shadow-md rounded-xl w-6/8 py-4 px-4 sm:w-full">
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
                            <p className="font-semibold text-lg md:text-xl">{product.name}</p>
                            <div className="flex flex-col gap-1 md:text-lg">
                                <p>Category: {product.product_category?.name || "None"}</p>
                                <p>Price: ₱{product.price}</p>
                                <p>Discount Price: ₱{product.discount_price}</p>
                                <p>Preparation Time: {product.est_prep_time} mins</p>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-col gap-2">
                            <button onClick={() => handleToggleAvailability(product.id, product.is_available)} className={`${product.is_available === true ? "bg-green-600 hover:bg-green-800" : "bg-red-500 hover:bg-red-700"} transition-colors duration-300 cursor-pointer font-semibold flex gap-2 justify-center items-center text-kae-light px-4 py-2 rounded-xl`}>
                                {product.is_available === true ? "Available" : "Not Available"}
                            </button>
                            <div className="flex rounded-xl overflow-hidden">
                                <button onClick={() => toggleEdit(product)} className="cursor-pointer hover:bg-kae-purple transition-colors duration-300 flex gap-2 justify-center items-center bg-kae-dark text-kae-light px-4 py-2 flex-grow">
                                    <SquarePen />EDIT
                                </button>
                                <button onClick={() => setItemToDelete(product)} className="cursor-pointer hover:bg-red-700 transition-colors duration-300 flex gap-2 justify-center items-center bg-red-400 text-kae-light px-4 py-2">
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
            {itemToDelete && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center">

                        {/* Warning Icon Container */}
                        <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                            <X size={32} strokeWidth={3} />
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Are you sure you want to delete item <span className="font-bold text-gray-800">{itemToDelete?.name}</span>? This action cannot be undone.
                        </p>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setItemToDelete(null)}
                                disabled={isDeleting}
                                className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleDeleteMenuItem}
                                disabled={isDeleting}
                                className="flex-1 py-3 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center"
                            >
                                {isDeleting ? "DELETING..." : "DELETE"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}
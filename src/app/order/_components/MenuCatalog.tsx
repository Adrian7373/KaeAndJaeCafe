"use client";

import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Search, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../../context/CartContext";
import CartAddOns from "./CartAddOns";

export interface AddOn {
    id: string,
    name: string,
    discount_price: number,
    image_path: string,
    image_url: string
}

export interface Product {
    imageUrl: string;
    id: string;
    name: string;
    image_path: string;
    price: number;
    discount_price: number;
    is_available: boolean;
    est_prep_time: string;
    product_category?: {
        name: string
    };
}

export interface Category {
    id: string;
    name: string
}

export interface MenuCatalogProps {
    products: Product[]
    isStoreOpen: boolean
    categories: Category[]
    mode?: 'default' | 'replacement'
    onSelectReplacement?: (product: Product) => void
    addOns: AddOn[] | []
}

const ALL = "All items";
const peso = (n: number) => `₱${n.toFixed(2)}`;

/* ------------------------------------------------------------------ */
/* Product card                                                        */
/* ------------------------------------------------------------------ */

function ProductCard({ product, mode, onSelectReplacement }: {
    product: Product;
    mode: "default" | "replacement";
    onSelectReplacement?: (product: Product) => void;
}) {
    const { cart, addToCart, incrementItem, decrementItem } = useCart();
    const inCart = cart.find((item) => item.id === product.id);
    const onSale = product.discount_price < product.price;
    const off = onSale ? Math.round((1 - product.discount_price / product.price) * 100) : 0;
    const soldOut = !product.is_available;

    return (
        <article className="group flex flex-col overflow-hidden rounded-2xl border-2 border-kae-dark bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-kae-pink)]">
            <div className="relative aspect-square overflow-hidden bg-kae-pink-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] ${soldOut ? "opacity-50 grayscale" : ""}`}
                />
                {onSale && !soldOut && (
                    <span className="absolute top-3 left-3 rounded-full bg-kae-gochujang px-2.5 py-1 font-label text-[0.65rem] text-kae-cream">
                        {off}% OFF
                    </span>
                )}
                {soldOut && (
                    <span className="absolute top-3 left-3 rounded-full bg-kae-dark px-2.5 py-1 font-label text-[0.65rem] text-kae-cream">
                        SOLD OUT
                    </span>
                )}
            </div>

            <div className="flex grow flex-col gap-3 p-4">
                <h3 className="ed-display text-lg leading-tight text-kae-dark">{product.name}</h3>

                <div className="mt-auto flex flex-col gap-3">
                    <p className="flex items-baseline gap-2 font-label">
                        <span className="text-lg text-kae-dark">{peso(product.discount_price)}</span>
                        {onSale && <s className="text-xs text-kae-dark/50">₱{product.price}</s>}
                    </p>

                    {mode === "replacement" ? (
                        <button
                            type="button"
                            onClick={() => onSelectReplacement?.(product)}
                            className="rounded-full bg-kae-purple px-4 py-2.5 font-body text-sm font-bold text-kae-cream transition hover:bg-kae-dark"
                        >
                            Use as replacement
                        </button>
                    ) : soldOut ? (
                        <button
                            type="button"
                            disabled
                            className="rounded-full bg-kae-dark/15 px-4 py-2.5 font-body text-sm font-bold text-kae-dark/40"
                        >
                            Sold out
                        </button>
                    ) : inCart ? (
                        <div className="flex items-center justify-between rounded-full bg-kae-purple p-1 text-kae-cream">
                            <button
                                type="button"
                                onClick={() => decrementItem(inCart)}
                                aria-label={inCart.qty === 1 ? `Remove ${product.name}` : `One less ${product.name}`}
                                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-kae-pink hover:text-kae-dark active:scale-95"
                            >
                                {inCart.qty === 1 ? <Trash2 size={16} /> : <Minus size={16} strokeWidth={3} />}
                            </button>
                            <span className="font-label text-sm whitespace-nowrap" aria-live="polite"><span className="sr-only">In cart: </span>{inCart.qty}</span>
                            <button
                                type="button"
                                onClick={() => incrementItem(inCart)}
                                aria-label={`One more ${product.name}`}
                                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-kae-pink hover:text-kae-dark active:scale-95"
                            >
                                <Plus size={16} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => addToCart(product, e)}
                            className="rounded-full bg-kae-purple px-4 py-2.5 font-body text-sm font-bold text-kae-cream transition hover:bg-kae-pink hover:text-kae-dark active:scale-[0.98]"
                        >
                            Add to cart
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */

export default function MenuCatalog({ products, isStoreOpen, categories, mode = "default", onSelectReplacement, addOns }: MenuCatalogProps) {

    const { cart, isOpen, incrementItem, decrementItem, toggleCart } = useCart();
    const [activeTab, setActiveTab] = useState(ALL);
    const [query, setQuery] = useState("");
    const router = useRouter();

    const totalPrice = cart.reduce((total, item) => total + item.discount_price * item.qty, 0);
    const totalItems = cart.reduce((total, item) => total + item.qty, 0);
    const savings = cart.reduce((total, item) => total + Math.max(0, item.price - item.discount_price) * item.qty, 0);

    // Esc closes the cart, and the page behind it stops scrolling while it is open.
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") toggleCart(); };
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [isOpen, toggleCart]);

    const sections = useMemo(() => {
        const q = query.trim().toLowerCase();
        const visible = products.filter((p) => {
            if (mode === "replacement" && !p.is_available) return false;
            if (q && !p.name.toLowerCase().includes(q)) return false;
            if (activeTab !== ALL && p.product_category?.name !== activeTab) return false;
            return true;
        });
        // available first, sold-out items sink to the end of their section
        const rank = (p: Product) => (p.is_available ? 0 : 1);
        const names = [...categories.map((c) => c.name), "Other"];
        return names
            .map((name) => ({
                name,
                items: visible
                    .filter((p) => (p.product_category?.name ?? "Other") === name)
                    .sort((a, b) => rank(a) - rank(b)),
            }))
            .filter((s) => s.items.length > 0);
    }, [products, categories, activeTab, query, mode]);

    const resultCount = sections.reduce((n, s) => n + s.items.length, 0);
    const tabs = [ALL, ...categories.map((c) => c.name)];

    return (
        <section className="bg-kae-cream font-body text-kae-dark">
            {/* Masthead */}
            <div className="mx-auto max-w-[1920px] px-5 pt-10 pb-8 md:px-12 md:pt-16 2xl:px-30">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-5 flex items-center gap-2 font-label text-xs">
                            <span className={`inline-block h-2.5 w-2.5 rounded-full ${isStoreOpen ? "bg-kae-scallion" : "bg-kae-gochujang"}`} />
                            {isStoreOpen ? "Open now · cooked when you order" : "Closed right now · browse the menu, order when we open"}
                        </p>
                        <h1 className="ed-display text-5xl leading-[1.02] md:text-7xl">
                            What are you <span className="ed-italic text-kae-purple">craving</span>?
                        </h1>
                    </div>

                    <div className="w-full lg:max-w-sm">
                        <label htmlFor="menu-search" className="sr-only">Search the menu</label>
                        <div className="relative">
                            <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-kae-dark/60" />
                            <input
                                id="menu-search"
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search wings, waffles, milk tea"
                                className="w-full rounded-xl border-2 border-kae-dark bg-white py-3 pr-4 pl-11 font-body outline-none transition placeholder:text-kae-dark/40 focus:border-kae-purple focus:ring-4 focus:ring-kae-pink/60"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="sticky top-[67px] z-30 border-y-2 border-kae-dark bg-kae-cream/95 backdrop-blur">
                <div className="mx-auto max-w-[1920px] px-5 md:px-12 2xl:px-30">
                    <div
                        role="tablist"
                        aria-label="Menu categories"
                        className="-mx-5 flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
                    >
                        {tabs.map((tab) => {
                            const active = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    role="tab"
                                    aria-selected={active}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`shrink-0 rounded-full border-2 border-kae-dark px-4 py-1.5 font-body text-sm font-bold transition active:scale-95 ${active
                                        ? "bg-kae-dark text-kae-cream"
                                        : "bg-transparent text-kae-dark hover:bg-kae-pink"
                                        }`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Menu */}
            <div className="mx-auto min-h-[60vh] max-w-[1920px] px-5 py-10 md:px-12 2xl:px-30">
                {resultCount === 0 ? (
                    <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-kae-dark bg-white p-10 text-center">
                        <p className="ed-display text-3xl leading-tight">
                            Nothing <span className="ed-italic text-kae-purple">here</span> yet.
                        </p>
                        <p className="mt-3 text-kae-dark/75">
                            {query ? `No dishes match “${query}”.` : "This category has no dishes right now."} Try another word or category.
                        </p>
                        <button
                            type="button"
                            onClick={() => { setQuery(""); setActiveTab(ALL); }}
                            className="mt-6 rounded-full border-2 border-kae-dark px-6 py-2.5 text-sm font-bold transition hover:bg-kae-dark hover:text-kae-cream"
                        >
                            Show the full menu
                        </button>
                    </div>
                ) : (
                    <div className="space-y-14">
                        {sections.map((section) => (
                            <section key={section.name} aria-labelledby={`cat-${section.name}`}>
                                {(activeTab === ALL || query) && (
                                    <div className="mb-6 flex items-baseline gap-4">
                                        <h2 id={`cat-${section.name}`} className="ed-display text-3xl leading-none md:text-4xl">{section.name}</h2>
                                        <span className="h-0.5 grow bg-kae-dark/20" aria-hidden />
                                        <span className="font-label text-xs text-kae-dark/60">{section.items.length}</span>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 min-[1920px]:grid-cols-7">
                                    {section.items.map((product) => (
                                        <ProductCard key={product.id} product={product} mode={mode} onSelectReplacement={onSelectReplacement} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            {mode === "default" && (
                <>
                    {/* Mobile cart bar */}
                    {totalItems > 0 && !isOpen && (
                        <button
                            type="button"
                            onClick={toggleCart}
                            className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full border-2 border-kae-dark bg-kae-purple px-6 py-4 font-body font-bold text-kae-cream shadow-[4px_4px_0_0_var(--color-kae-dark)] transition active:translate-y-px md:hidden"
                        >
                            <span>View cart · {totalItems} {totalItems === 1 ? "item" : "items"}</span>
                            <span className="font-label">{peso(totalPrice)}</span>
                        </button>
                    )}

                    {/* Cart drawer */}
                    <div
                        className={`fixed inset-0 z-[80] bg-kae-dark/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
                        onClick={toggleCart}
                        aria-hidden
                    />
                    <aside
                        role="dialog"
                        aria-modal="true"
                        aria-label="Your cart"
                        aria-hidden={!isOpen}
                        inert={!isOpen}
                        className={`fixed inset-y-0 right-0 z-[90] flex w-full flex-col border-l-2 border-kae-dark bg-kae-cream transition-transform duration-300 ease-out md:w-[30rem] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
                    >
                        <div className="flex items-center justify-between border-b-2 border-kae-dark px-5 py-4">
                            <h2 className="ed-display text-3xl leading-none">
                                Your <span className="ed-italic text-kae-purple">order</span>
                            </h2>
                            <button
                                type="button"
                                onClick={toggleCart}
                                aria-label="Close cart"
                                className="grid h-10 w-10 place-items-center rounded-full border-2 border-kae-dark transition hover:bg-kae-dark hover:text-kae-cream"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grow space-y-5 overflow-y-auto px-5 py-5">
                            {cart.length === 0 ? (
                                <div className="rounded-2xl border-2 border-dashed border-kae-dark bg-white p-8 text-center">
                                    <p className="ed-display text-2xl leading-tight">Your cart is empty.</p>
                                    <p className="mt-2 text-sm text-kae-dark/70">Add a dish and it shows up here.</p>
                                    <button
                                        type="button"
                                        onClick={toggleCart}
                                        className="mt-5 rounded-full bg-kae-purple px-6 py-2.5 text-sm font-bold text-kae-cream transition hover:bg-kae-dark"
                                    >
                                        Browse the menu
                                    </button>
                                </div>
                            ) : (
                                <ul className="rounded-2xl border-2 border-dashed border-kae-dark bg-white px-4">
                                    {cart.map((item) => (
                                        <li key={item.id} className="flex items-center gap-3 border-b border-dashed border-kae-dark/30 py-4 last:border-b-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl border-2 border-kae-dark bg-kae-pink-soft object-cover" />
                                            <div className="min-w-0 grow">
                                                <p className="ed-display text-base leading-tight">{item.name}</p>
                                                <div className="mt-2 flex items-center gap-1 rounded-full border-2 border-kae-dark p-0.5 w-fit">
                                                    <button
                                                        type="button"
                                                        onClick={() => decrementItem(item)}
                                                        aria-label={item.qty === 1 ? `Remove ${item.name}` : `One less ${item.name}`}
                                                        className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-kae-gochujang hover:text-kae-cream"
                                                    >
                                                        {item.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} strokeWidth={3} />}
                                                    </button>
                                                    <span className="min-w-6 text-center font-label text-sm">{item.qty}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => incrementItem(item)}
                                                        aria-label={`One more ${item.name}`}
                                                        className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-kae-pink"
                                                    >
                                                        <Plus size={14} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-right font-label">
                                                <p className="text-base">{peso(item.discount_price * item.qty)}</p>
                                                {item.price > item.discount_price && (
                                                    <s className="text-xs text-kae-dark/50">₱{item.price * item.qty}</s>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <CartAddOns addOns={addOns} />
                        </div>

                        <div className="space-y-4 border-t-2 border-kae-dark bg-white px-5 py-5">
                            {!isStoreOpen && (
                                <p className="rounded-xl bg-kae-gochujang px-4 py-3 text-sm font-bold text-kae-cream">
                                    We&rsquo;re closed right now. You can fill your cart and check out when we open.
                                </p>
                            )}
                            {savings > 0 && (
                                <div className="flex justify-between font-label text-sm text-kae-scallion">
                                    <span>You save</span>
                                    <span>{peso(savings)}</span>
                                </div>
                            )}
                            <div className="flex items-baseline justify-between">
                                <span className="ed-display text-2xl">Subtotal</span>
                                <span className="ed-display text-3xl text-kae-purple">{peso(totalPrice)}</span>
                            </div>
                            <button
                                type="button"
                                disabled={cart.length === 0 || !isStoreOpen}
                                onClick={() => { toggleCart(); router.push("/checkout"); }}
                                className="w-full rounded-full bg-kae-purple px-6 py-3.5 font-body text-base font-bold text-kae-cream transition hover:bg-kae-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-kae-dark/15 disabled:text-kae-dark/40"
                            >
                                Check out
                            </button>
                        </div>
                    </aside>
                </>
            )}
        </section>
    );
}

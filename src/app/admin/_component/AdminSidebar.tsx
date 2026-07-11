"use client";

import { Menu, Store, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoreStatusAction, toggleStoreStatusAction } from "@/app/actions";

export default function AdminSideBar() {
    const pathname = usePathname();

    const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            const status = await getStoreStatusAction();
            setIsAcceptingOrders(status);
            setIsLoading(false);
        };
        fetchStatus();
    }, []);

    const tabs = [
        { name: "Dashboard", href: "/admin/dashboard" },
        { name: "Orders", href: "/admin/orders" },
        { name: "Menu Management", href: "/admin/manage_menu" },
        { name: "Order History", href: "/admin/history" }
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleToggle = async () => {
        const newStatus = !isAcceptingOrders;

        // Optimistic UI update
        setIsAcceptingOrders(newStatus);

        // Server Sync
        const result = await toggleStoreStatusAction(newStatus);
        if (!result.success) {
            alert("Failed to update store status.");
            setIsAcceptingOrders(!newStatus); // Revert on fail
        }
    };

    // Reusable Toggle Button Component to avoid code duplication
    const StoreStatusToggle = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={`flex items-center gap-1 flex-col ${isMobile ? "w-full mt-auto border-t border-gray-200 p-4" : ""}`}>
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`relative h-10 rounded-full transition-colors duration-300 flex items-center justify-center font-black text-white text-xs px-4 shadow-sm
                    ${isMobile ? "w-full" : "w-32"}
                    ${isAcceptingOrders ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {isAcceptingOrders ? 'ACCEPTING' : 'PAUSED'}
            </button>
        </div>
    );

    return (
        <header className="fixed top-0 w-full z-50 shadow-sm">
            <nav className="flex py-2 px-4 items-center justify-between bg-kae-pink 2xl:px-30 2xl:py-5">

                {/* Logo & Branding */}
                <Link href="/admin/dashboard" className="flex items-center gap-3">
                    <img className="w-12 h-12 md:w-15 md:h-15" src="/logo.svg" alt="Kae and Jae logo" />
                    <div className="flex flex-col font-pacifico leading-tight md:hidden">
                        <h1 className="hidden">Kae and Jae</h1>
                        <h1 className="text-kae-dark text-lg md:text-xl">Kae and</h1>
                        <h1 className="text-kae-dark text-lg md:text-xl">Jae Cafe</h1>
                    </div>
                </Link>

                {/* Mobile Hamburger Icon */}
                <button onClick={toggleMenu} className="md:hidden p-2 text-kae-dark hover:bg-black/5 rounded-lg transition-colors">
                    <Menu className="h-8 w-8" />
                </button>

                {/* Desktop Navigation */}
                <div className="gap-4 lg:gap-6 hidden md:flex items-center">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`font-semibold 2xl:text-lg transition duration-300 py-2 px-3 lg:px-4 rounded-full text-sm lg:text-base whitespace-nowrap
                                    ${isActive
                                        ? "bg-kae-dark text-kae-light shadow-md"
                                        : "text-kae-dark hover:bg-black/10"
                                    }`}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}

                    {/* Vertical Divider */}
                    <div className="w-px h-8 bg-kae-dark/20 mx-2 block"></div>

                    {/* Desktop Store Status Toggle */}
                    <StoreStatusToggle />
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                onClick={toggleMenu}
                className={`fixed inset-0 bg-kae-dark/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            />

            {/* Mobile Sliding Menu */}
            <div
                className={`fixed top-0 right-0 h-dvh w-[80%] max-w-sm bg-kae-light/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col border-l border-white/50 transition-transform duration-300 ease-in-out md:hidden
                    ${isOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* Close Button */}
                <div className="flex justify-end p-4 border-b border-gray-200/50">
                    <button onClick={toggleMenu} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col p-4 gap-3 flex-grow overflow-y-auto">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                onClick={() => setIsOpen(false)} // Close menu instantly on click
                                className={`w-full flex font-bold items-center justify-center gap-3 px-4 py-4 rounded-xl transition-all
                                    ${isActive
                                        ? "bg-kae-purple text-white shadow-md"
                                        : "text-gray-500 hover:bg-gray-200 hover:text-kae-dark"
                                    }`}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Store Status Toggle */}
                <StoreStatusToggle isMobile={true} />
            </div>
        </header>
    );
}
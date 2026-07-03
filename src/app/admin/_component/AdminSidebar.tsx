"use client";

import { Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSideBar() {
    const pathname = usePathname();

    const tabs = [
        { name: "Dashboard", href: "/admin/dashboard" },
        { name: "Orders", href: "/admin/orders" },
        { name: "Menu Management", href: "/admin/manage_menu" },
    ];

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <header className="fixed w-full max-w-9xl z-50">
            <nav className={`flex py-2 px-4 items-center justify-between bg-kae-pink md:bg-kae-light 2xl:px-30 2xl:py-5`}>
                <div className="flex items-center gap-3">
                    <a href="#"><img className="w-15 h-15" src="/logo.svg" alt="Kae and Jae logo" /></a>
                    <div className="flex flex-col font-pacifico">
                        <h1 className="hidden">Kae and Jae</h1>
                        <h1 className="text-kae-dark text-lg ">Kae and</h1>
                        <h1 className="text-kae-dark text-lg ">Jae Cafe</h1>
                    </div>
                </div>
                <Menu className="h-8 w-8 md:hidden" onClick={toggleMenu} />
                <div className="gap-5 hidden md:flex items-center">
                    <a className="text-kae-dark font-semibold 2xl:text-lg transition duration-300 hover:bg-kae-dark hover:text-kae-light lg:py-2 lg:px-4 rounded-full" href="#home">Home</a>
                    <a className="text-kae-dark font-semibold 2xl:text-lg transition duration-300 hover:bg-kae-dark hover:text-kae-light lg:py-2 lg:px-4 rounded-full" href="#about">About</a>
                    <a className="text-kae-dark font-semibold 2xl:text-lg transition duration-300 hover:bg-kae-dark hover:text-kae-light lg:py-2 lg:px-4 rounded-full" href="#menu">Menu</a>
                    <a className="text-kae-dark font-semibold 2xl:text-lg transition duration-300 hover:bg-kae-dark hover:text-kae-light lg:py-2 lg:px-4 rounded-full" href="#testimonials">Testimonials</a>
                    <a className="text-kae-dark font-semibold 2xl:text-lg transition duration-300 hover:bg-kae-dark hover:text-kae-light lg:py-2 lg:px-4 rounded-full" href="#gallery">Gallery</a>
                    <a className="text-kae-dark font-semibold 2xl:text-lg transition duration-300 hover:bg-kae-dark hover:text-kae-light lg:py-2 lg:px-4 rounded-full" href="#contact">Contact</a>
                </div>
            </nav>
            <div
                onClick={toggleMenu}
                className={`fixed inset-0 bg-kae-dark/40 backdrop-blur-sm z-40 transition-all duration-300 md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            ></div>

            {/* Hamburger Menu */}
            <div className={`h-dvh w-6/8 flex flex-col bg-kae-light/60 absolute top-0 right-0 backdrop-blur-md shadow-2xl z-50 border-r border-white/20 transition-all duration-300 ${isOpen ? "flex" : "hidden"} `}>
                <div className="flex flex-col">
                    <div className="w-full px-4 py-2 h-[76px] flex items-center h-12 w-12">
                        <X className="ml-auto" onClick={toggleMenu} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        {tabs.map((tab) => {
                            // Check if this tab is the active page
                            const isActive = pathname === tab.href;

                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all font-xl
                ${isActive
                                            ? "bg-kae-purple text-white shadow-md"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                        }`}
                                >
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </header>
    )
}
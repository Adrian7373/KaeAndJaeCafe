// components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
    const pathname = usePathname();

    const tabs = [
        { name: "Dashboard", href: "/admin/dashboard", icon: "🔥" },
        { name: "Orders", href: "/admin/orders", icon: "📋" },
        { name: "Menu Management", href: "/admin/manage_menu", icon: "⚙️" },
    ];

    return (
        <aside className="w-64 bg-kae-dark text-white flex flex-col h-full shadow-xl">
            <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold tracking-widest">KAE & JAE</h2>
                <p className="text-sm text-gray-400">Staff Portal</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {tabs.map((tab) => {
                    // Check if this tab is the active page
                    const isActive = pathname === tab.href;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                ${isActive
                                    ? "bg-kae-purple text-white shadow-md"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout button stays at the bottom */}
            <div className="p-4 border-t border-gray-700">
                <button className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors">
                    🚪 Logout
                </button>
            </div>
        </aside>
    );
}
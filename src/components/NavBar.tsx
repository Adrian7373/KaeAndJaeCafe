"use client";

import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function NavBar() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <header className="fixed w-full max-w-9xl z-50">
            <nav className="flex py-2 px-4 items-center justify-between bg-kae-light md:bg-kae-pink 2xl:px-30 2xl:py-5">
                <div className="flex items-center gap-3">
                    <a href="#"><img className="w-15 h-15" src="logo.svg" alt="cafe logo" /></a>
                    <div className="flex flex-col font-pacifico">
                        <a className="text-kae-dark text-lg " href="#">Kae and</a>
                        <a className="text-kae-dark text-lg " href="#">Jae Cafe</a>
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
                className={`fixed inset-0 bg-kae-dark/40 backdrop-blur-sm z-40 transition-all duration-3000 md:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            ></div>

            {/* Hamburger Menu */}
            <div className={`h-dvh w-6/8 flex flex-col bg-kae-light/60 absolute top-0 right-0 backdrop-blur-md shadow-2xl z-50 border-r border-white/20 transition-all duration-300 ${isOpen ? "flex" : "hidden"} `}>
                <div className="flex flex-col">
                    <div className="w-full px-4 py-2 h-[76px] flex items-center h-12 w-12">
                        <X className="ml-auto" onClick={toggleMenu} />
                    </div>
                    <div className="flex flex-col items-center gap-10">
                        <a onClick={toggleMenu} className="text-kae-dark font-semibold text-lg transition" href="#home">Home</a>
                        <a onClick={toggleMenu} className="text-kae-dark font-semibold text-lg transition" href="#about">About</a>
                        <a onClick={toggleMenu} className="text-kae-dark font-semibold text-lg transition" href="#menu">Menu</a>
                        <a onClick={toggleMenu} className="text-kae-dark font-semibold text-lg transition" href="#testimonials">Testimonials</a>
                        <a onClick={toggleMenu} className="text-kae-dark font-semibold text-lg transition" href="#gallery">Gallery</a>
                        <a onClick={toggleMenu} className="text-kae-dark font-semibold text-lg transition" href="#contact">Contact</a>
                    </div>
                </div>
            </div>
        </header>
    )
}
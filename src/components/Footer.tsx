"use client";

import { FaFacebook, FaFacebookMessenger } from "react-icons/fa"

export default function Footer() {
    return (
        <footer className="bg-kae-dark p-5 flex flex-col items-center gap-3">
            <h1 className="text-kae-light font-md font-inter">© 2026 Kae and Jae Cafe</h1>
            <div className="flex gap-2">
                <a href="https://www.facebook.com/profile.php?id=61569261819780"><FaFacebook className="w-8 h-8 text-kae-light" /></a>
                <a href="https://www.facebook.com/messages/t/1051738004696972"><FaFacebookMessenger className="w-8 h-8 text-kae-light" /></a>
            </div>
        </footer>
    )
}
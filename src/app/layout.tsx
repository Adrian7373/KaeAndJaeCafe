import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Pacifico, Libertinus_Serif, Roboto, Fraunces, Archivo, DM_Mono, Black_Han_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../../context/CartContext";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"]
})

const libertinusSerif = Libertinus_Serif({
  variable: "--font-libertinus-serif",
  subsets: ["latin"],
  weight: "400",
  adjustFontFallback: false,
})

const fraunces = Fraunces({
  variable: "--font-fraunces-src",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo-src",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono-src",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const blackHanSans = Black_Han_Sans({
  variable: "--font-black-han-src",
  weight: "400",
  preload: false,
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Kae & Jae Cafe",
  description: "Order your favorite cravings from Kae & Jae Cafe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} ${libertinusSerif.variable} ${roboto.variable} ${fraunces.variable} ${archivo.variable} ${dmMono.variable} ${blackHanSans.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col"><CartProvider><main className="max-w-[1920px] mx-auto w-full min-h-screen bg-white shadow-md">{children}</main></CartProvider></body>
    </html>
  );
}

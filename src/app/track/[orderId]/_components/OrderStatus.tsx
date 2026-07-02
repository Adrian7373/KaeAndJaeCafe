"use client";
import { ArrowLeft, Bike, CircleCheck, CircleCheckBig, Hamburger, Menu, Store } from "lucide-react";

export default function OrderStatus() {
    return (
        <>
            <div className="flex flex-col">
                <header>
                    <nav className="flex justify-between items-center bg-kae-pink px-4 py-4">
                        <ArrowLeft className="h-8 w-8" />
                        <Menu className="h-8 w-8" />
                    </nav>
                </header>
                <div>

                </div>
                <div className="flex flex-col justify-center border-1 rounded-t-3xl px-6 py-4 gap-5 bg-kae-light">
                    <p className="text-center">Track your order</p>
                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <Store />
                            <p>Order Accepted</p>
                        </div>
                        <CircleCheck fill="bg-kae-dark" color="white" />
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <Hamburger />
                            <p>Order Ready</p>
                        </div>
                        <CircleCheck fill="bg-kae-dark" color="white" />
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <Bike />
                            <p>Order Picked up</p>
                        </div>
                        <CircleCheck fill="bg-kae-dark" color="white" />
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <CircleCheckBig />
                            <p>Order Delivered</p>
                        </div>
                    </div>
                    <div className="flex justify-between border-1 rounded-xl px-4 py-3">
                        <p>Total: ₱67.00</p>
                        <button className="text-kae-dark">Order Details</button>
                    </div>
                </div>
            </div>
        </>
    )
}
"use client";

import React from "react";
import Lottie from "lottie-react";

// 1. Directly import the JSON files!
import waitingAnim from "../animations/Waiting.json"
import cookingAnim from "../animations/Cooking.json"
import foodPreparedAnim from "../animations/FoodPrepared.json"
import outForDeliveryAnim from "../animations/OutForDelivery.json"
import successAnim from "../animations/Success.json"

export default function OrderAnimation({ status }: { status: string }) {

    // 2. Map the status string to the imported JSON file
    const getAnimationData = () => {
        switch (status?.toLowerCase()) {
            case "pending": return waitingAnim;
            case "cooking": return cookingAnim;
            case "prepared": return foodPreparedAnim;
            case "delivering": return outForDeliveryAnim;
            case "success": return successAnim;
            default: return waitingAnim; // Fallback
        }
    };

    const animationData = getAnimationData();

    return (
        <div className="w-64 h-64 mx-auto flex items-center justify-center">
            <Lottie
                animationData={animationData}
                loop={status.toLowerCase() === "success" ? false : true}
                autoplay={true}
            />
        </div>
    );
}
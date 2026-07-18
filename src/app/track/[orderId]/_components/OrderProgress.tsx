import { CheckCircle, ChefHat, ClipboardList, Motorbike, PackageOpen, XCircle } from "lucide-react";

interface OrderProgressProps {
    status: string;
    orderType: string;
}

export default function OrderProgress({ status, orderType }: OrderProgressProps) {
    const isDelivery = orderType === "delivery";
    const isCancelled = status === "cancelled";

    // 1. Dynamically build the steps
    const steps = [
        { id: "pending", label: "Order Placed", icon: ClipboardList },
        { id: "cooking", label: "Cooking", icon: ChefHat },
        { id: "prepared", label: isDelivery ? "Prepared" : "Ready for Pickup", icon: PackageOpen },
    ];

    if (isDelivery) {
        steps.push({ id: "delivering", label: "On the Way", icon: Motorbike });
    }

    steps.push({ id: "success", label: "Completed", icon: CheckCircle });

    // 2. Find the current step index
    const getCurrentStepIndex = () => {
        if (isCancelled) return -1;
        const index = steps.findIndex(step => step.id === status);
        return index !== -1 ? index : 0;
    };

    const currentIndex = getCurrentStepIndex();

    // 3. Render Cancelled State
    if (isCancelled) {
        return (
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex flex-col items-center text-center gap-3 w-full max-w-2xl mx-auto">
                <XCircle className="text-red-500 w-12 h-12 md:w-16 md:h-16" />
                <p className="font-bold text-red-700 text-lg md:text-xl">Order Cancelled</p>
                <p className="text-sm md:text-base text-red-600">This order has been cancelled. Please contact the cafe if you have questions.</p>
            </div>
        );
    }

    // 4. Render Responsive Active Timeline
    return (
        // Generous bottom padding ensures absolute text labels don't get clipped
        <div className="w-full pt-4 pb-8 sm:pb-12 lg:pb-14 overflow-visible">
            <div className="relative flex justify-between items-center w-full max-w-3xl mx-auto px-2 sm:px-6 lg:px-8">

                {/* Background Line (Scales height on desktop) */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 sm:h-1.5 lg:h-2 bg-gray-200 z-0 rounded-full" />

                {/* Colored Progress Line */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 sm:h-1.5 lg:h-2 bg-kae-purple z-0 rounded-full transition-all duration-700 ease-in-out"
                    style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                />

                {/* The Step Nodes */}
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentIndex;
                    const isActive = index === currentIndex;
                    const isFinalStep = index === steps.length - 1;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">

                            {/* The Step Circle */}
                            <div
                                className={`
        flex items-center justify-center rounded-full transition-all duration-500
        w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16
        ${isCompleted
                                        ? "bg-kae-purple text-white shadow-lg shadow-purple-200 sm:scale-110 border-none"
                                        : "bg-white border-2 border-gray-200 text-gray-300"
                                    } 
        ${isActive && !isFinalStep ? "animate-pulse ring-4 ring-purple-100" : ""}
    `}
                            >
                                {/* Using Tailwind classes instead of fixed size={} so the icon scales perfectly */}
                                <Icon
                                    className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
                                    strokeWidth={isCompleted ? 2.5 : 2}
                                />
                            </div>

                            {/* The Step Label */}
                            <span
                                className={`
                                    absolute top-10 sm:top-16 lg:top-20
                                    text-center font-bold tracking-tight leading-tight
                                    w-[60px] sm:w-[80px] lg:w-[100px]
                                    text-[10px] sm:text-xs lg:text-sm
                                    transition-colors duration-300
                                    ${isCompleted ? "text-gray-800" : "text-gray-400"}
                                `}
                            >
                                {step.label}
                            </span>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
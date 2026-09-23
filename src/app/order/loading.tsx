// loading.tsx

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 animate-pulse">
            {/* Navbar Skeleton */}
            <div className="h-[75px] 2xl:h-[100px] w-full bg-gray-200 border-b"></div>

            <section className="flex flex-col min-h-dvh bg-white">
                {/* Category Navigation Skeleton */}
                <div className="flex mt-2 justify-center border-b overflow-hidden">
                    <div className="p-3">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    </div>

                    <div className="flex flex-1 gap-4 px-4 py-2 xl:justify-center overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-10 w-24 shrink-0 bg-gray-200 rounded-md"
                            ></div>
                        ))}
                    </div>

                    <div className="p-3">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    </div>
                </div>

                {/* Product Grid Skeleton */}
                <div className="flex-grow w-full">
                    <div className="w-full grid grid-cols-2 px-4 py-6 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 xl:px-15 2xl:px-30 min-[1920px]:grid-cols-8">
                        {[...Array(14)].map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                            >
                                {/* Image Placeholder */}
                                <div className="relative w-full aspect-square bg-gray-200"></div>

                                {/* Content Placeholder */}
                                <div className="flex flex-col flex-grow p-4 gap-2">
                                    {/* Title */}
                                    <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>

                                    <div className="flex flex-col mt-auto justify-between gap-1">
                                        {/* Original Price */}
                                        <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
                                        {/* Discount Price */}
                                        <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-2"></div>
                                        {/* Button */}
                                        <div className="h-8 bg-gray-200 rounded-md w-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Skeleton */}
            <div className="h-40 w-full bg-gray-200 mt-auto"></div>
        </div>
    );
}
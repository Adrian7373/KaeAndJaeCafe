// components/dashboard/TopSellersCard.tsx
import Image from "next/image";

type TopSeller = {
    name: string;
    imageUrl: string;
    totalSold: number;
};

export default function TopSellersCard({ topSellers }: { topSellers: TopSeller[] }) {
    return (
        <>
            <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md gap-3 flex flex-col  ">
                <p className="text-sm font-bold text-gray-500 md:text-lg">Today's Top Sellers</p>
                {topSellers.map((item) => (
                    <div key={item.name} className="flex flex-col items-center py-2 justify-between border-1 border-gray-300 rounded-xl sm:flex-row sm:justify-evenly">
                        <div className="flex flex-col gap-3 justify-center items-center max-w-[50%]">
                            <div className="h-25 w-25 rounded-full overflow-hidden bg-gray-100 relative shrink-0">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-800 content-center">{item.name}</p>
                        </div>
                        <p className="text-md content-center text-center sm:text-xl"><b>{item.totalSold} Sold</b></p>

                    </div>
                ))}
            </div>
        </>
    );
}
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
            <div className="border-1 border-gray-200 bg-kae-light shadow-lg p-4 rounded-md">
                <p className="text-xl">Today's Top Sellers</p>
                {topSellers.map((item) => (
                    <div key={item.name} className="flex items-center py-2 justify-between">
                        <div className="flex gap-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 relative shrink-0">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-800 content-center">{item.name}</p>
                        </div>
                        <p className="text-sm content-center text-center">{item.totalSold} Sold</p>

                    </div>
                ))}
            </div>
        </>
    );
}
// Skeleton that mirrors the order page layout (design-system paper, ink borders)

export default function Loading() {
    return (
        <div className="min-h-screen animate-pulse bg-kae-cream motion-reduce:animate-none" aria-busy="true">
            <div className="h-[67px] border-b-2 border-kae-dark bg-kae-cream" />

            <div className="mx-auto max-w-[1920px] px-5 pt-10 pb-8 md:px-12 md:pt-16 2xl:px-30">
                <div className="mb-5 h-3 w-56 rounded-full bg-kae-dark/15" />
                <div className="h-14 w-full max-w-xl rounded-xl bg-kae-dark/15 md:h-20" />
            </div>

            <div className="border-y-2 border-kae-dark">
                <div className="mx-auto flex max-w-[1920px] gap-2 overflow-hidden px-5 py-3 md:px-12 2xl:px-30">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="h-9 w-24 shrink-0 rounded-full border-2 border-kae-dark/20 bg-kae-dark/10" />
                    ))}
                </div>
            </div>

            <div className="mx-auto grid max-w-[1920px] grid-cols-2 gap-3 px-5 py-10 sm:grid-cols-3 md:gap-5 md:px-12 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 2xl:px-30">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border-2 border-kae-dark/20 bg-white">
                        <div className="aspect-square bg-kae-pink-soft" />
                        <div className="space-y-3 p-4">
                            <div className="h-5 w-3/4 rounded-md bg-kae-dark/15" />
                            <div className="h-5 w-1/3 rounded-md bg-kae-dark/15" />
                            <div className="h-10 w-full rounded-full bg-kae-dark/10" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

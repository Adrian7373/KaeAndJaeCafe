"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/../lib/supabase"; // Adjust path to your supabase client
import { Save, Plus, Trash2, Loader2, Maximize, Minimize } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuth } from "../../../../context/AuthContext";
import { useRouter } from "next/navigation";
import ChangePasswordSection from "./_components/ChangePasswordSection";

const LiveRadiusMap = dynamic(() => import("./_components/AdminRadiusMap"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full min-h-[400px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
            <span className="text-gray-400 font-bold">Loading Live Map...</span>
        </div>
    )
});

interface Rate { distance: number; price: number; }

export default function SettingsPage() {
    const supabase = createClient();
    const [rates, setRates] = useState<Rate[]>([]);
    const [maxFee, setMaxFee] = useState(84);
    const [maxRadius, setMaxRadius] = useState(10);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (role !== "owner") {
            router.push("/login");
        }
    }, [role, router])

    useEffect(() => {
        const fetchSettings = async () => {
            const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).single();
            if (data) {
                setRates(data.delivery_rates);
                setMaxFee(data.max_fee);
                setMaxRadius(data.max_radius);
            }
            setLoading(false);
        };
        fetchSettings();
    }, [supabase]);

    const handleSave = async () => {
        setSaving(true);
        setFeedback("");

        // Sort rates by distance before saving to ensure logic flows correctly
        const sortedRates = [...rates].sort((a, b) => a.distance - b.distance);
        setRates(sortedRates);

        const { error } = await supabase
            .from('store_settings')
            .update({ delivery_rates: sortedRates, max_fee: maxFee, max_radius: maxRadius })
            .eq('id', 1);

        if (error) setFeedback("❌ Failed to save settings.");
        else setFeedback("✅ Settings saved successfully!");

        setSaving(false);
        setTimeout(() => setFeedback(""), 3000);
    };

    const updateRate = (index: number, field: keyof Rate, value: string) => {
        const newRates = [...rates];
        newRates[index][field] = Number(value);
        setRates(newRates);
    };

    const removeRate = (index: number) => {
        setRates(rates.filter((_, i) => i !== index));
    };

    const addRate = () => {
        // Add a blank template row at the end
        setRates([...rates, { distance: (rates[rates.length - 1]?.distance || 0) + 0.5, price: 0 }]);
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto pt-24 2xl:pt-30">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Store Settings</h1>
            </div>

            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* LEFT COLUMN: The Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <div>
                            <h2 className="text-lg font-bold">Delivery Fee Brackets</h2>
                            <p className="text-sm text-gray-500">Map updates automatically as you type.</p>
                        </div>
                        <button onClick={addRate} className="bg-kae-dark text-white px-4 py-2 rounded-lg font-bold flex gap-2 items-center text-sm transition-transform active:scale-95">
                            <Plus size={16} /> Add Bracket
                        </button>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex gap-4 px-2 text-xs font-bold text-gray-400">
                            <div className="flex-1">UP TO DISTANCE (KM)</div>
                            <div className="flex-1">DELIVERY FEE (₱)</div>
                            <div className="w-10"></div>
                        </div>

                        {rates.map((rate, i) => (
                            <div key={i} className="flex gap-4 items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500 font-bold">≤</span>
                                    <input
                                        type="number" step="0.1"
                                        value={rate.distance}
                                        onChange={(e) => updateRate(i, 'distance', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 pl-8 font-bold focus:border-kae-purple outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500 font-bold">₱</span>
                                    <input
                                        type="number"
                                        value={rate.price}
                                        onChange={(e) => updateRate(i, 'price', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2 pl-8 font-bold focus:border-kae-purple outline-none transition-colors"
                                    />
                                </div>
                                <button onClick={() => removeRate(i)} className="text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-md transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Max Delivery Radius (KM)</label>
                            <p className="text-xs text-gray-500 mb-2">Block orders beyond this distance.</p>
                            <input
                                type="number"
                                value={maxRadius}
                                onChange={(e) => setMaxRadius(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-md p-2 font-bold focus:border-kae-purple outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Fallback Max Fee (₱)</label>
                            <p className="text-xs text-gray-500 mb-2">Price for anything over the highest bracket.</p>
                            <input
                                type="number"
                                value={maxFee}
                                onChange={(e) => setMaxFee(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-md p-2 font-bold focus:border-kae-purple outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-8 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex gap-2 items-center transition-all disabled:opacity-50 active:scale-95 shadow-sm"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Settings
                        </button>
                        {feedback && (
                            <span className={`font-bold text-sm animate-in fade-in slide-in-from-left-2 ${feedback.includes('❌') ? 'text-red-500' : 'text-green-600'}`}>
                                {feedback}
                            </span>
                        )}
                    </div>
                    <ChangePasswordSection />
                </div>

                {/* RIGHT COLUMN: The Live Map */}
                <div
                    className={isFullscreen
                        ? "fixed inset-0 z-[999] bg-white p-2 sm:p-4 flex flex-col animate-in zoom-in-95 duration-200"
                        : "sticky top-24 h-[500px] lg:h-[calc(100vh-120px)] shadow-lg rounded-2xl border border-gray-200 bg-white p-2"
                    }
                >
                    {/* Badge */}
                    <div className={`absolute z-[400] bg-purple-50 text-purple-800 text-xs font-bold px-3 py-2 rounded-xl shadow-md border border-purple-200 bg-opacity-90 backdrop-blur-sm transition-all ${isFullscreen ? 'top-6 left-6' : 'top-4 left-4'}`}>
                        Live Radius Preview
                    </div>

                    {/* Fullscreen Toggle Button */}
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className={`absolute z-[400] bg-white text-gray-700 hover:text-kae-purple p-2 rounded-xl shadow-md border border-gray-200 hover:bg-purple-50 transition-all active:scale-95 ${isFullscreen ? 'top-6 right-6' : 'top-4 right-4'}`}
                        title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
                    >
                        {isFullscreen ? <Minimize size={20} strokeWidth={2.5} /> : <Maximize size={20} strokeWidth={2.5} />}
                    </button>

                    {/* Map Container Wrapper */}
                    <div className="w-full h-full rounded-xl overflow-hidden relative z-0 border border-gray-100">
                        {/* Pass the exact react state straight into the map! */}
                        <LiveRadiusMap rates={rates} maxRadius={maxRadius} isFullscreen={isFullscreen} />
                    </div>
                </div>

            </div>
        </div>
    );
}
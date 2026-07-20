"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { changeRolePasswordAction } from "@/app/actions"; // We will build this next

export default function ChangePasswordSection() {
    const [role, setRole] = useState("rider");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (newPassword.length < 6) {
            setFeedback({ message: "Password must be at least 6 characters.", type: "error" });
            return;
        }
        if (newPassword !== confirmPassword) {
            setFeedback({ message: "Passwords do not match.", type: "error" });
            return;
        }

        setIsSubmitting(true);

        // Call our server action
        const result = await changeRolePasswordAction(role, newPassword);

        if (result.success) {
            setFeedback({ message: `${role.toUpperCase()} password updated successfully!`, type: "success" });
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setFeedback({ message: result.error || "Failed to update password.", type: "error" });
        }

        setIsSubmitting(false);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
            <div className="flex items-center gap-2 mb-4 border-b pb-4">
                <KeyRound className="text-gray-600" size={20} />
                <div>
                    <h2 className="text-lg font-bold">Manage Passwords</h2>
                    <p className="text-sm text-gray-500">Change login credentials for your staff accounts.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">SELECT ACCOUNT</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 font-bold focus:border-kae-purple outline-none transition-colors bg-white"
                    >
                        <option value="rider">Rider</option>
                        <option value="cashier">Cashier</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 mb-1">NEW PASSWORD</label>
                    <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 pr-12 font-bold focus:border-kae-purple outline-none transition-colors"
                        placeholder="Enter new password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-[28px] text-gray-400 hover:text-kae-purple transition-colors cursor-pointer"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 mb-1">CONFIRM PASSWORD</label>
                    <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 pr-12 font-bold focus:border-kae-purple outline-none transition-colors"
                        placeholder="Confirm new password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 bg-kae-dark hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
                </button>

                {feedback && (
                    <div className={`p-3 rounded-xl text-sm font-bold border ${feedback.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {feedback.message}
                    </div>
                )}
            </form>
        </div>
    );
}
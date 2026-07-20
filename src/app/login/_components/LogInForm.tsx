"use client";

import { useActionState, useState } from "react";
import { loginAdmin } from "@/app/actions";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAdmin, null);

    // NEW: State to track password visibility
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form action={formAction} className="border-1 border-gray-400 p-8 m-auto flex flex-col justify-center items-center gap-3 rounded-2xl bg-kae-light">
            <p className="text-center text-2xl">Log In</p>
            <label className="flex gap-2 items-center" htmlFor="role">Login as:
                <select className="border-1 px-4 py-2 rounded-lg" name="role" id="role">
                    <option value="rider">Rider</option>
                    <option value="cashier">Cashier</option>
                    <option value="admin">Admin</option>
                </select>
            </label>
            <div className="relative w-full max-w-sm">
                <input
                    required
                    name="password"
                    id="password"
                    type={showPassword ? "text" : "password"} // Dynamic type
                    placeholder="password"
                    // Added pr-12 to prevent text from hiding behind the icon
                    className="border-gray-500 rounded-xl peer border-1 w-full pl-4 pr-12 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent"
                />
                <label htmlFor="password" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Password</label>

                {/* NEW: Toggle Button */}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-kae-purple transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <button disabled={isPending} type="submit" className="text-md bg-kae-dark text-kae-light px-6 py-2 rounded-xl">Proceed</button>
            {state?.error && (
                <div className="border-1 border-red-500 bg-red-300 px-4 py-2 rounded-xl">
                    <p>{state.error}</p>
                </div>
            )}
        </form>
    )
}
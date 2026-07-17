"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/actions";

export default function LoginForm() {

    const [state, formAction, isPending] = useActionState(loginAdmin, null)

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
            <div className="relative">
                <input required name="password" id="password" type="password" placeholder="password" className="border-gray-500 rounded-xl peer border-1 w-full px-4 text-lg pb-2 pt-6 placeholder-transparent transition-colors focus:border-kae-purple bg-transparent" />
                <label htmlFor="username" className="absolute left-4 top-2 text-xs font-bold text-gray-400 transition-all pointer-events-none
                   peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal
                   peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-kae-purple">Password</label>
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
import LoginForm from "./_components/LogInForm";
import { createServerClient } from "../../../lib/supabase-server";
import { redirect } from "next/navigation";

export default async function LoginPage() {

    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user && !error) {
        redirect("/admin/dashboard");
    }

    return (
        <div className="flex justify-center items-center w-full h-dvh">
            <LoginForm />
        </div>
    )
}
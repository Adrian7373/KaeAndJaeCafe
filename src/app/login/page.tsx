import LoginForm from "./_components/LogInForm";
import { supabase } from "@/../lib/supabase";
import { redirect } from "next/navigation";

export default async function LoginPage() {

    const { data: user } = await supabase.auth.getUser();
    if (user) {
        redirect("/admin/dashboard");
    }

    return (
        <>
            <LoginForm />
        </>
    )
}
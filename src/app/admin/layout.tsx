import { getAuthenticatedUser, getCurrentUser } from "../actions";
import AdminSidebar from "./_component/AdminSidebar";
import { AuthProvider } from "../../../context/AuthContext";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

    const role = await getAuthenticatedUser()

    return (
        <AuthProvider role={role?.role}>
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <AdminSidebar role={role?.role} />

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}
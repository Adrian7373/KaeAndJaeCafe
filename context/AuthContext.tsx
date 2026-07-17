"use client";

import { createContext, useContext } from 'react';

// Define the shape of your context
const AuthContext = createContext<{ role: string | undefined }>({ role: undefined });

export function AuthProvider({ role, children }: { role: string | undefined, children: React.ReactNode }) {
    return (
        <AuthContext.Provider value={{ role }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use the role anywhere in your app
export const useAuth = () => useContext(AuthContext);
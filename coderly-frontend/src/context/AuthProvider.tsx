import { useState, useEffect } from "react";
import type { ReactNode } from 'react';
import type { User } from '../types';
import { getMe } from '../api/users';
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children : ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getMe()
                .then(setUser)
                .catch(() => {
                    setToken(null);
                    localStorage.removeItem('token');
                })
                .finally(() => setIsLoading(false));
        } else {
            setTimeout(() => setIsLoading(false), 0);
        }
    }, [token]);

    function login(newToken: string) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }

    function logout() {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

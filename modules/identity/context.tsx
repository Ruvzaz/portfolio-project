"use client";

import React, { createContext, useContext, useState } from "react";
import { User } from "./types";
import { AuthService } from "./services/auth.service";

// กำหนดหน้าตาของ Context
interface IdentityContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    setError: (err: string | null) => void;
    login: (email: string) => Promise<void>;
    register: (name: string, email: string) => Promise<void>;
    logout: () => void;
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

// Provider Component: ตัวห่อหุ้มที่จะส่งข้อมูลให้ลูกๆ
export function IdentityProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await AuthService.authenticate(email);
            setUser(user);
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const newUser = await AuthService.register(name, email);
            setUser(newUser);
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setError(null);
    };

    return (
        <IdentityContext.Provider value={{ user, isLoading, error, setError, login, register, logout }}>
            {children}
        </IdentityContext.Provider>
    );
}

// Custom Hook เพื่อดึงข้อมูลจาก Context (แทนการสร้าง State ใหม่)
export function useIdentity() {
    const context = useContext(IdentityContext);
    if (!context) {
        throw new Error("useIdentity must be used within an IdentityProvider");
    }
    return context;
}
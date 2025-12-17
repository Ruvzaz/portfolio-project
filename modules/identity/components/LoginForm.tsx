"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, LogOut, User as UserIcon, Mail, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function LoginForm() {
    // State สำหรับสลับโหมด (Login / Register)
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    // Form States
    const [email, setEmail] = useState("demo@example.com"); // ค่า default เพื่อให้เทสง่าย
    const [name, setName] = useState("");

    // เรียกใช้ Hook (ต้องมั่นใจว่า useAuth export setError มาแล้วตามขั้นตอนก่อนหน้า)
    const { login, register, user, isLoading, error, setError, logout } = useAuth();

    // ------------------------------------------------------------------
    // 🟢 STATE 1: LOGGED IN (แสดงข้อมูล User แบบการ์ดสวยงาม)
    // ------------------------------------------------------------------
    if (user) {
        return (
            <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-300 relative overflow-hidden">
                {/* Background Effect จางๆ ด้านหลัง */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500" />

                <CardHeader className="text-center pb-3 pt-8">
                    <div className="mx-auto bg-zinc-800 p-1.5 rounded-full w-fit mb-4 border border-zinc-700 shadow-inner">
                        <div className="bg-zinc-950 rounded-full p-3">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                            ) : (
                                <UserIcon className="w-20 h-20 text-zinc-500" />
                            )}
                        </div>
                    </div>

                    <CardTitle className="text-2xl text-green-400 font-bold tracking-tight">Welcome Back!</CardTitle>
                    <CardDescription className="text-zinc-300 text-xl font-semibold pt-2">
                        {user.name}
                    </CardDescription>
                </CardHeader>

                <CardContent className="text-center space-y-5 pt-3">
                    {/* Email Badge */}
                    <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-zinc-950 border border-zinc-800 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-sm text-zinc-400 font-mono">{user.email}</span>
                    </div>

                    {/* Info Badges */}
                    <div className="flex justify-center gap-2.5 mt-3">
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-blue-950/40 border border-blue-900/50 text-blue-400 text-sm font-bold uppercase tracking-wider">
                            <Shield className="w-4 h-4" /> {user.role}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-mono">
                            ID: {user.id.slice(0, 6)}...
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-5 pb-7">
                    <Button
                        onClick={logout}
                        variant="outline"
                        className="w-full border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:text-red-400 transition-all text-zinc-400 group h-11 text-base"
                    >
                        <LogOut className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // ------------------------------------------------------------------
    // ⚪ STATE 2: LOGGED OUT (แสดงฟอร์ม Login / Register)
    // ------------------------------------------------------------------
    return (
        <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900 shadow-xl overflow-hidden">
            <CardHeader className="space-y-2 pb-4">
                <CardTitle className="text-2xl md:text-3xl font-bold text-center tracking-tight text-white">
                    {isRegisterMode ? "Create an account" : "Identity Module"}
                </CardTitle>
                <CardDescription className="text-center text-zinc-400 text-base">
                    {isRegisterMode
                        ? "Enter your details below to create your account"
                        : "Enter your email below to simulate login"
                    }
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
                {error && (
                    <Alert variant="destructive" className="bg-red-950/20 border-red-900/50 text-red-300">
                        <AlertDescription className="flex items-center gap-2">
                            <span className="font-bold">Error:</span> {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* --- ส่วนฟอร์ม Input --- */}
                <div className="space-y-4">

                    {/* ช่องใส่ชื่อ (เฉพาะตอน Register) */}
                    {isRegisterMode && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200 fade-in">
                            <Label htmlFor="name" className="text-zinc-400 text-sm font-medium">Full Name</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                                <Input
                                    id="name"
                                    placeholder="e.g. John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 bg-zinc-950 border-zinc-800 focus:border-blue-500/50 focus:ring-blue-500/20 h-11 text-base"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-400 text-sm font-medium">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 bg-zinc-950 border-zinc-800 focus:border-blue-500/50 focus:ring-blue-500/20 h-11 text-base"
                            />
                        </div>
                    </div>
                </div>

                {/* ปุ่ม Action หลัก */}
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-3 shadow-lg shadow-blue-900/20 transition-all h-11 text-base font-semibold"
                    disabled={isLoading}
                    onClick={() => {
                        if (isRegisterMode) {
                            register(name, email);
                        } else {
                            login(email);
                        }
                    }}
                >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {isLoading ? "Processing..." : (isRegisterMode ? "Sign Up with Email" : "Sign In with Email")}
                </Button>

                {/* เส้นคั่น */}
                <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
                    </div>
                </div>

                {/* ปุ่มสลับโหมด */}
                <div className="text-center text-sm">
                    <span className="text-zinc-400">
                        {isRegisterMode ? "Already have an account? " : "Don't have an account? "}
                    </span>
                    <button
                        className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
                        onClick={() => {
                            setIsRegisterMode(!isRegisterMode);
                            setError(null); // ล้าง Error เก่าออกตอนสลับหน้า
                        }}
                    >
                        {isRegisterMode ? "Sign In" : "Sign Up"}
                    </button>
                </div>

            </CardContent>
        </Card>
    );
}
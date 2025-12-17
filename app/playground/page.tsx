"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Box,
    Users,
    CreditCard,
    Activity,
    Terminal,
    ArrowLeft,
    Menu
} from "lucide-react";

// Import Hooks และ Component จาก Module
import { LoginForm, UserList, IdentityProvider, useIdentity } from "@/modules/identity";
import { ProductList, ProductManager } from "@/modules/inventory";

// --- MODULE CONFIG ---
const MODULES = [
    { id: "dashboard", name: "System Overview", icon: Activity, description: "ภาพรวมสถานะของระบบทั้งหมด" },
    { id: "auth", name: "Identity Module", icon: Users, description: "จัดการ User, Authentication และ Permissions" },
    { id: "payment", name: "Payment Module", icon: CreditCard, description: "จำลอง Transaction และ Wallet" },
    { id: "inventory", name: "Inventory Module", icon: Box, description: "จัดการ Stock สินค้าและ SKU" },
];

// -----------------------------------------------------------------------------
// Component ย่อย: จัด Layout ของ Auth Module
// -----------------------------------------------------------------------------
function AuthWorkspace() {
    const { user } = useIdentity();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="w-full max-w-6xl mx-auto animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-zinc-100">Identity & Access Control</h2>
                <p className="text-zinc-400 text-xs md:text-sm max-w-lg mx-auto">
                    Module นี้ทำงานแบบ <strong>Self-contained</strong>: มี Logic, State และ UI เป็นของตัวเอง
                    โดยใช้ Context ภายในเพื่อแชร์สถานะ Login
                </p>
            </div>

            <div className={`
            min-h-[50vh] flex flex-col xl:flex-row gap-8 transition-all duration-500
            justify-center items-center 
            ${isAdmin ? 'xl:items-start' : ''} 
        `}>
                <div className="w-full max-w-sm shrink-0">
                    <LoginForm />
                </div>

                {isAdmin && (
                    <div className="w-full max-w-sm shrink-0 xl:-mt-6 animate-in slide-in-from-right-8 fade-in duration-500">
                        <UserList />
                    </div>
                )}
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// 🚀 MAIN PAGE COMPONENT
// -----------------------------------------------------------------------------
export default function PlaygroundPage() {
    const [activeModule, setActiveModule] = useState("dashboard");
    const currentModule = MODULES.find((m) => m.id === activeModule);

    return (
        // ✅ ย้าย IdentityProvider มาครอบตรงนี้!! (นอกสุด)
        // เพื่อให้ข้อมูล Login "อมตะ" ไม่หายไปไหนแม้จะเปลี่ยนหน้า
        <IdentityProvider>
            <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">

                {/* DESKTOP SIDEBAR */}
                <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex-col hidden md:flex sticky top-0 h-screen shrink-0">
                    <div className="p-6">
                        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 text-sm group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        <div className="flex items-center gap-2 mb-1">
                            <Terminal className="w-6 h-6 text-blue-500" />
                            <span className="font-bold text-lg tracking-tight">Antigravity Lab</span>
                        </div>
                        <p className="text-xs text-zinc-500">Modular Monolith Environment</p>
                    </div>
                    <Separator className="bg-zinc-800" />
                    <nav className="flex-1 p-4 space-y-2">
                        {MODULES.map((module) => {
                            const Icon = module.icon;
                            const isActive = activeModule === module.id;
                            return (
                                <Button
                                    key={module.id}
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"}`}
                                    onClick={() => setActiveModule(module.id)}
                                >
                                    <Icon className="w-4 h-4 mr-3" />
                                    {module.name}
                                </Button>
                            );
                        })}
                    </nav>
                    <div className="p-4 border-t border-zinc-800">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            System Online
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">

                    {/* MOBILE NAV */}
                    <div className="md:hidden mb-8 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-6 h-6 text-blue-500" />
                                <span className="font-bold text-lg tracking-tight">Antigravity</span>
                            </div>
                            <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
                            {MODULES.map((module) => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveModule(module.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${activeModule === module.id
                                        ? "bg-zinc-100 text-zinc-950 border-white shadow-lg shadow-white/10"
                                        : "bg-zinc-900 text-zinc-400 border-zinc-800"
                                        }`}
                                >
                                    <module.icon className="w-4 h-4" />
                                    {module.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* HEADER */}
                    <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 tracking-tight">{currentModule?.name}</h1>
                            <p className="text-sm md:text-base text-zinc-400">{currentModule?.description}</p>
                        </div>
                        <Badge variant="outline" className="w-fit border-blue-500/50 text-blue-400 bg-blue-950/10 px-3 py-1">
                            Module Active
                        </Badge>
                    </header>

                    {/* STAGE AREA */}
                    <div className="min-h-[500px]">
                        {activeModule === "dashboard" && <OverviewComponent />}

                        {activeModule === "auth" && (
                            // ตรงนี้ไม่ต้องใส่ IdentityProvider แล้ว เพราะเราครอบไว้ข้างบนสุดแล้ว
                            <AuthWorkspace />
                        )}

                        {activeModule === "payment" && (
                            <PlaceholderComponent icon={CreditCard} name="Payment Module" />
                        )}

                        {activeModule === "inventory" && (
                            <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
                                <div className="text-center space-y-2 mb-8">
                                    <h2 className="text-xl md:text-2xl font-bold text-zinc-100">Inventory & Store</h2>
                                    <p className="text-zinc-400 text-sm max-w-lg mx-auto">
                                        Module นี้สาธิต <strong>Inter-module Communication</strong> และ <strong>CRUD Management</strong><br />
                                        User ทั่วไปซื้อของได้ แต่ Admin เท่านั้นที่จัดการสินค้าได้
                                    </p>
                                </div>

                                {/* หน้าร้านค้า (คนทั่วไปเห็น) */}
                                <ProductList />

                                {/* หน้าจัดการสินค้า (Admin เห็นเท่านั้น) */}
                                <ProductManager />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </IdentityProvider>
    );
}

// --- Helper Components ---
function OverviewComponent() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <StatsCard title="Total Requests" value="1,234" sub="20.1% from last hour" color="green" />
            <StatsCard title="Active Modules" value="4" sub="All systems operational" />
            <StatsCard title="System Health" value="99.9%" sub="Uptime: 14d 2h" valueColor="text-green-400" />
        </div>
    )
}

function StatsCard({ title, value, sub, color, valueColor = "text-white" }: any) {
    return (
        <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
                <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                    {color === 'green' && <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                    {sub}
                </p>
            </CardContent>
        </Card>
    )
}

function PlaceholderComponent({ icon: Icon, name }: any) {
    return (
        <div className="flex flex-col items-center justify-center h-[300px] md:h-[400px] border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/30 text-zinc-500 gap-4 p-4 text-center">
            <Icon className="w-12 h-12 opacity-50" />
            <p>🛠 พื้นที่สำหรับ {name} (Coming Soon)</p>
        </div>
    )
}
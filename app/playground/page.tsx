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
    Menu,
    Lock
} from "lucide-react";
// อย่าลืม import hook ที่เพิ่งสร้าง
import { useDashboard } from "@/hooks/useDashboard";
import { RefreshCcw } from "lucide-react"; // ไอคอนรีเฟรช
// Import Hooks และ Component จาก Module
import { LoginForm, UserList, IdentityProvider, useIdentity } from "@/modules/identity";
import { ProductList, ProductManager } from "@/modules/inventory";
import { WalletCard, TransactionList } from "@/modules/payment";

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
                            <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
                                <div className="text-center space-y-2 mb-8">
                                    <h2 className="text-xl md:text-2xl font-bold text-zinc-100">Digital Wallet & Transactions</h2>
                                    <p className="text-zinc-400 text-sm max-w-lg mx-auto">
                                        Module นี้จัดการระบบการเงิน: ยอดเงินคงเหลือ, การเติมเงิน, และประวัติธุรกรรม <br />
                                        ทำงานร่วมกับ Identity เพื่อแยกกระเป๋าเงินของแต่ละ User
                                    </p>
                                </div>

                                {/* เรียกใช้ AuthGuard เพื่อเช็คว่า Login หรือยัง */}
                                <AuthGuard>
                                    <div className="grid gap-8">
                                        {/* บัตรเครดิต */}
                                        <WalletCard />

                                        {/* ประวัติธุรกรรม */}
                                        <TransactionList />
                                    </div>
                                </AuthGuard>
                            </div>
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
    const { stats, isLoading, refresh } = useDashboard();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-zinc-500 animate-pulse">
                Calculating system analytics...
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

            {/* Header พร้อมปุ่ม Refresh */}
            <div className="flex justify-between items-center">
                <h3 className="text-zinc-400 text-sm font-medium">Real-time Analytics</h3>
                <Button variant="ghost" size="sm" onClick={refresh} className="text-zinc-500 hover:text-zinc-300">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Refresh Data
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* CARD 1: IDENTITY STATS */}
                <StatsCard
                    title="Total Users"
                    value={stats.identity.totalUsers}
                    sub={`${stats.identity.admins} Admins, ${stats.identity.users} Users`}
                    icon={Users}
                    color="blue"
                />

                {/* CARD 2: INVENTORY VALUE */}
                <StatsCard
                    title="Inventory Value"
                    value={`฿${stats.inventory.totalValue.toLocaleString()}`}
                    sub={`${stats.inventory.totalItems} Products (${stats.inventory.lowStockItems} Low Stock)`}
                    icon={Box}
                    color={stats.inventory.lowStockItems > 0 ? "orange" : "green"}
                    valueColor="text-zinc-100"
                />

                {/* CARD 3: SYSTEM MONEY */}
                <StatsCard
                    title="Total System Money"
                    value={`฿${stats.payment.totalMoneyInSystem.toLocaleString()}`}
                    sub={`${stats.payment.totalTransactions} Transactions processed`}
                    icon={CreditCard}
                    color="green"
                    valueColor="text-green-400"
                />
            </div>

            {/* เพิ่มส่วน System Health */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-lg mt-6">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" /> System Health
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-400">Identity Module</span>
                            <span className="text-green-500 font-bold">Operational</span>
                        </div>
                        <Separator className="bg-zinc-800" />
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-400">Inventory Module</span>
                            <span className="text-green-500 font-bold">Operational</span>
                        </div>
                        <Separator className="bg-zinc-800" />
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-400">Payment Module</span>
                            <span className="text-green-500 font-bold">Operational</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}

// อัปเดต StatsCard ให้รับ Icon ได้
function StatsCard({ title, value, sub, color, valueColor = "text-white", icon: Icon }: any) {
    return (
        <Card className="bg-zinc-900 border-zinc-800 shadow-lg relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color === 'green' ? 'text-green-500' : 'text-blue-500'}`}>
                {Icon && <Icon className="w-16 h-16" />}
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
                <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1 relative z-10">
                    {color === 'green' && <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                    {color === 'orange' && <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
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

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user } = useIdentity();
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                <Lock className="w-10 h-10 mb-4 opacity-50" />
                <p>Please Login in Identity Module first to access Wallet.</p>
            </div>
        )
    }
    return <>{children}</>;
}
// อย่าลืม import Lock จาก lucide-react ด้วยนะ


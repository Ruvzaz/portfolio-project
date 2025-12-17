"use client";

import { useState } from "react";
import { usePayment } from "../hooks/usePayment";
import { useIdentity } from "@/modules/identity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, CreditCard, Wifi, Loader2 } from "lucide-react";

export function WalletCard() {
    const { user } = useIdentity();
    const { balance, isLoading, topUp, isProcessing } = usePayment();

    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [amount, setAmount] = useState(1000);

    const handleTopUp = async () => {
        await topUp(amount);
        setIsTopUpOpen(false);
    };

    if (!user) return null;

    return (
        <div className="w-full max-w-md mx-auto">
            {/* 💳 VIRTUAL CARD DESIGN */}
            <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 shadow-2xl transition-transform hover:scale-[1.02] duration-300 group">

                {/* Abstract Background Decoration */}
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-600/20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-600/20 blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <div className="relative flex h-full flex-col justify-between p-6">
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/5 rounded-lg backdrop-blur-md border border-white/10">
                                <Wallet className="h-6 w-6 text-zinc-100" />
                            </div>
                            <span className="font-bold text-zinc-100 tracking-wider">Antigravity Pay</span>
                        </div>
                        <Wifi className="h-6 w-6 text-zinc-500 rotate-90" />
                    </div>

                    {/* Middle Section (Balance) */}
                    <div className="space-y-1">
                        <p className="text-zinc-400 text-xs uppercase tracking-widest font-medium">Total Balance</p>
                        {isLoading ? (
                            <div className="h-8 w-32 bg-zinc-800 animate-pulse rounded" />
                        ) : (
                            <div className="flex items-baseline gap-1 text-zinc-100">
                                <span className="text-2xl font-light">฿</span>
                                <h2 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                                    {balance.toLocaleString()}
                                </h2>
                            </div>
                        )}
                    </div>

                    {/* Bottom Section (User Info & Actions) */}
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-zinc-500 text-[10px] uppercase mb-1">Card Holder</p>
                            <p className="text-zinc-200 font-medium tracking-wide">{user.name.toUpperCase()}</p>
                            <p className="text-zinc-600 text-xs font-mono mt-0.5">**** **** **** {user.id.slice(-4)}</p>
                        </div>

                        {/* ปุ่มเติมเงิน (Top Up) */}
                        <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-full px-4 font-bold shadow-lg shadow-white/10 transition-all hover:-translate-y-0.5">
                                    <Plus className="w-4 h-4 mr-1" /> Top Up
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-xs">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-blue-500" /> Top Up Wallet
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Amount (฿)</Label>
                                        <Input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            className="bg-zinc-950 border-zinc-800 text-lg font-bold text-center h-12"
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-center">
                                        {[1000, 5000, 10000].map(val => (
                                            <button
                                                key={val}
                                                onClick={() => setAmount(val)}
                                                className="px-3 py-1 text-xs rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700 transition-colors"
                                            >
                                                +{val.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        onClick={handleTopUp}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Top Up"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
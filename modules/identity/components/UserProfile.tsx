"use client";

import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, XCircle, Calendar, Key, ShieldAlert, Smartphone, Activity } from "lucide-react";

export function UserProfile() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <Card className="w-full border-zinc-800 bg-zinc-900 animate-in slide-in-from-right-8 fade-in duration-500 h-full">
            <CardHeader className="border-b border-zinc-800/50 pb-4">
                <CardTitle className="text-xl font-semibold text-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Activity className="w-6 h-6 text-green-500" />
                        My Account Status
                    </div>
                    <Badge variant="outline" className="border-green-900 text-green-400 bg-green-950/30 px-3 py-1">
                        Active Member
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-8">

                {/* 1. Account Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 flex items-center gap-4">
                        <div className="bg-blue-900/20 p-3 rounded-full">
                            <Calendar className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Member Since</p>
                            <p className="text-zinc-200 font-semibold">December 2025</p>
                        </div>
                    </div>
                    <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 flex items-center gap-4">
                        <div className="bg-purple-900/20 p-3 rounded-full">
                            <Shield className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Account Type</p>
                            <p className="text-zinc-200 font-semibold uppercase">{user.role}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Permissions Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <Key className="w-4 h-4" /> Access Permissions
                    </h3>
                    <div className="bg-zinc-950/30 rounded-xl border border-zinc-800 p-1">
                        {/* Perm 1 */}
                        <div className="flex items-center justify-between p-3 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-zinc-300">Access Payment Module</span>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        {/* Perm 2 */}
                        <div className="flex items-center justify-between p-3 border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-zinc-300">View Inventory</span>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        {/* Perm 3 (No Access) */}
                        <div className="flex items-center justify-between p-3 hover:bg-zinc-900/50 transition-colors rounded-b-lg opacity-60">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                <span className="text-zinc-500 line-through">Manage Users (Admin)</span>
                            </div>
                            <XCircle className="w-5 h-5 text-zinc-600" />
                        </div>
                    </div>
                </div>

                {/* 3. Security Health - Removed */}

            </CardContent>
        </Card>
    );
}

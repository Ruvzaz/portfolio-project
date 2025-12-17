"use client";

import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth"; // ✅ 1. Import useAuth เข้ามา
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, Users, ShieldAlert } from "lucide-react";

export function UserList() {
    // ✅ 2. ดึงข้อมูล User ปัจจุบันมาเช็คสิทธิ์
    const { user } = useAuth();
    const { users, isLoading, removeUser } = useUsers();

    // 🔒 SECURITY CHECKPOINT 🔒
    // กฎ: ถ้ายังไม่ Login (user เป็น null) หรือ Role ไม่ใช่ 'admin'
    // ให้ Return null (ไม่แสดงผลอะไรเลย)
    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <Card className="w-full border-zinc-800 bg-zinc-900 animate-in slide-in-from-bottom-2 duration-500">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-xl font-semibold text-zinc-200 flex items-center gap-2.5">
                    <Users className="w-6 h-6 text-blue-500" />
                    User Management
                    <span className="text-xs bg-red-900/30 text-red-400 border border-red-900 px-2.5 py-1 rounded ml-2 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" /> Admin Only
                    </span>
                </CardTitle>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1.5 rounded-full font-medium">
                    Total: {users.length}
                </span>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="text-center text-zinc-500 py-6">Loading users...</div>
                ) : (
                    <div className="space-y-3">
                        {users.map((u) => (
                            <div
                                key={u.id}
                                className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-all"
                            >
                                <div className="flex items-center gap-3.5">
                                    <Avatar className="h-10 w-10 border border-zinc-800">
                                        <AvatarImage src={u.avatarUrl} />
                                        <AvatarFallback>{u.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-200">
                                            {u.name}
                                            {/* แสดงว่าเป็นตัวเอง */}
                                            {user.id === u.id && <span className="text-zinc-500 ml-2 text-xs">(You)</span>}
                                        </p>
                                        <p className="text-xs text-zinc-500">{u.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`text-xs uppercase font-bold px-3 py-1 rounded ${u.role === 'admin'
                                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                        : 'bg-zinc-800 text-zinc-400'
                                        }`}>
                                        {u.role}
                                    </span>

                                    {/* ปุ่มลบ (ห้ามลบตัวเอง) */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={user.id === u.id}
                                        className="h-9 w-9 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 disabled:opacity-30"
                                        onClick={() => removeUser(u.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
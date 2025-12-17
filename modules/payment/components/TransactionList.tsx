"use client";

import { usePayment } from "../hooks/usePayment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Clock, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TransactionList() {
    const { transactions, isLoading } = usePayment();

    return (
        <Card className="w-full border-zinc-800 bg-zinc-900/50 mt-8">
            <CardHeader className="pb-3 border-b border-zinc-800/50">
                <CardTitle className="flex items-center gap-2 text-zinc-100 text-lg">
                    <History className="w-5 h-5 text-zinc-500" /> Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="p-8 text-center text-zinc-500 animate-pulse">Loading transactions...</div>
                ) : (
                    <div className="divide-y divide-zinc-800/50">
                        {transactions.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500">No transactions yet.</div>
                        ) : (
                            transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-zinc-900 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${tx.type === 'payment'
                                                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                                : 'bg-green-500/10 border-green-500/20 text-green-500'
                                            }`}>
                                            {tx.type === 'payment' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-200">{tx.description}</p>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                                                <Clock className="w-3 h-3" />
                                                {new Date(tx.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className={`font-bold font-mono ${tx.type === 'payment' ? 'text-zinc-100' : 'text-green-400'
                                            }`}>
                                            {tx.type === 'payment' ? '-' : '+'}฿{tx.amount.toLocaleString()}
                                        </p>
                                        <Badge variant="outline" className={`text-[10px] border-0 px-1.5 py-0 ${tx.status === 'success' ? 'text-green-500/70' : 'text-red-500/70'
                                            }`}>
                                            {tx.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
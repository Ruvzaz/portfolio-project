// src/modules/payment/hooks/usePayment.ts
import { useState, useEffect, useCallback } from "react";
import { Transaction } from "../types";
import { PaymentService } from "../services/payment.service";
import { useIdentity } from "@/modules/identity"; // เราต้องรู้ว่าใคร Login อยู่

export function usePayment() {
    const { user } = useIdentity();

    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // สำหรับ Loading ตอนจ่ายเงิน

    // โหลดข้อมูล (ยอดเงิน + ประวัติ)
    const fetchData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const [bal, txs] = await Promise.all([
                PaymentService.getBalance(user.id),
                PaymentService.getTransactions(user.id),
            ]);
            setBalance(bal);
            setTransactions(txs);
        } catch (error) {
            console.error("Failed to load wallet info", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // จ่ายเงิน
    const pay = async (amount: number, description: string) => {
        if (!user) return false;
        setIsProcessing(true);
        try {
            await PaymentService.processPayment(user.id, amount, description);
            await fetchData(); // อัปเดตยอดเงินทันที
            return true;
        } catch (error: any) {
            alert(error.message || "Payment Failed");
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    // เติมเงิน
    const topUp = async (amount: number, description?: string) => {
        if (!user) return;
        setIsProcessing(true);
        try {
            // ✅ ส่ง description ต่อไปให้ Service
            await PaymentService.topUp(user.id, amount, description);
            await fetchData();
        } catch (error) {
            alert("Top Up Failed");
        } finally {
            setIsProcessing(false);
        }
    };

    // โหลดข้อมูลเมื่อ Login
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        balance,
        transactions,
        isLoading,
        isProcessing,
        pay,
        topUp,
        refresh: fetchData
    };
}
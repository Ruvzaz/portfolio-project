// src/modules/payment/services/payment.service.ts
import { Wallet, Transaction } from "../types";

// 💰 1. Mock Database: กระเป๋าเงินของแต่ละคน
// Key คือ User ID (ต้องตรงกับใน Identity Module)
let MOCK_WALLETS: Record<string, number> = {
    "uid-001": 50000, // Admin User
    "uid-002": 50000, // Wuttichai
    "uid-003": 5000,  // Jeff (ให้เงินน้อยหน่อย จะได้เทสตอนเงินหมด)
};

// 📝 2. Mock Database: ประวัติธุรกรรม
let MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: "tx-001",
        userId: "uid-002",
        type: "deposit",
        amount: 50000,
        description: "Welcome Bonus",
        timestamp: new Date().toISOString(),
        status: "success",
    }
];

export const PaymentService = {
    // ดูยอดเงินคงเหลือ
    async getBalance(userId: string): Promise<number> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_WALLETS[userId] || 0;
    },

    // ดึงประวัติธุรกรรม
    async getTransactions(userId: string): Promise<Transaction[]> {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return MOCK_TRANSACTIONS
            .filter((tx) => tx.userId === userId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    // 💸 ฟังก์ชันจ่ายเงิน (ตัดเงิน)
    async processPayment(userId: string, amount: number, description: string): Promise<Transaction> {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // จำลองโหลดนานหน่อยเหมือนติดต่อธนาคาร

        const currentBalance = MOCK_WALLETS[userId] || 0;

        // เช็คเงินพอไหม?
        if (currentBalance < amount) {
            throw new Error("Insufficient funds (เงินไม่พอครับลูกพี่)");
        }

        // ตัดเงินจริง
        MOCK_WALLETS[userId] = currentBalance - amount;

        // บันทึก Transaction
        const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            userId,
            type: "payment",
            amount,
            description,
            timestamp: new Date().toISOString(),
            status: "success",
        };
        MOCK_TRANSACTIONS.unshift(newTx);

        return newTx;
    },

    // ➕ ฟังก์ชันเติมเงิน (Top Up)
    async topUp(userId: string, amount: number): Promise<Transaction> {
        await new Promise((resolve) => setTimeout(resolve, 800));

        MOCK_WALLETS[userId] = (MOCK_WALLETS[userId] || 0) + amount;

        const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            userId,
            type: "deposit",
            amount,
            description: "Top Up via Mobile Banking",
            timestamp: new Date().toISOString(),
            status: "success",
        };
        MOCK_TRANSACTIONS.unshift(newTx);

        return newTx;
    },
    // เพิ่มต่อท้ายใน PaymentService
    async getStats() {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // คำนวณเงินทั้งหมดในระบบ (รวมทุกกระเป๋า)
        const totalMoneyInSystem = Object.values(MOCK_WALLETS).reduce((acc, val) => acc + val, 0);
        const totalTransactions = MOCK_TRANSACTIONS.length;

        return { totalMoneyInSystem, totalTransactions };
    }
};
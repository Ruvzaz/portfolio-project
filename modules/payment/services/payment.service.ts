import { Transaction } from "../types";
import { StorageAdapter } from "@/lib/storage";

const WALLET_KEY = "payment_wallets";
const TX_KEY = "payment_transactions";

// ข้อมูลเริ่มต้น
const INITIAL_WALLETS: Record<string, number> = {
    "uid-001": 50000, // Admin
    "uid-002": 50000, // User 2
    "uid-003": 5000,  // User 3
};

const INITIAL_TXS: Transaction[] = [
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

// Helper Functions
const getWallets = () => StorageAdapter.getItem(WALLET_KEY, INITIAL_WALLETS);
const saveWallets = (data: any) => StorageAdapter.setItem(WALLET_KEY, data);
const getTxs = () => StorageAdapter.getItem<Transaction[]>(TX_KEY, INITIAL_TXS);
const saveTxs = (data: Transaction[]) => StorageAdapter.setItem(TX_KEY, data);

export const PaymentService = {
    async getBalance(userId: string): Promise<number> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const wallets = getWallets();
        return wallets[userId] || 0;
    },

    async getTransactions(userId: string): Promise<Transaction[]> {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const txs = getTxs();
        return txs
            .filter((tx) => tx.userId === userId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    async processPayment(userId: string, amount: number, description: string): Promise<Transaction> {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const wallets = getWallets();
        const currentBalance = wallets[userId] || 0;

        if (currentBalance < amount) throw new Error("Insufficient funds");

        // ตัดเงิน
        wallets[userId] = currentBalance - amount;
        saveWallets(wallets); // ✅ บันทึกยอดเงินใหม่

        // บันทึกประวัติ
        const txs = getTxs();
        const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            userId,
            type: "payment",
            amount,
            description,
            timestamp: new Date().toISOString(),
            status: "success",
        };
        txs.unshift(newTx);
        saveTxs(txs); // ✅ บันทึกประวัติใหม่

        return newTx;
    },

    async topUp(userId: string, amount: number): Promise<Transaction> {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const wallets = getWallets();
        wallets[userId] = (wallets[userId] || 0) + amount;
        saveWallets(wallets); // ✅ บันทึกยอดเงินใหม่

        const txs = getTxs();
        const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            userId,
            type: "deposit",
            amount,
            description: "Top Up via Mobile Banking",
            timestamp: new Date().toISOString(),
            status: "success",
        };
        txs.unshift(newTx);
        saveTxs(txs); // ✅ บันทึกประวัติใหม่

        return newTx;
    },
    async deleteWallet(userId: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const wallets = getWallets();
        // ลบ Key ของ User คนนั้นทิ้ง
        delete wallets[userId];

        saveWallets(wallets); // บันทึกค่าใหม่
    },
    async getStats() {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const wallets = getWallets();
        const txs = getTxs();

        const totalMoneyInSystem = Object.values(wallets).reduce((acc: number, val: number) => acc + val, 0);
        const totalTransactions = txs.length;

        return { totalMoneyInSystem, totalTransactions };
    }
};
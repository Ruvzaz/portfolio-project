// src/modules/payment/types.ts

export type TransactionType = 'payment' | 'deposit' | 'refund';
export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    timestamp: string; // ISO Date string
    status: TransactionStatus;
}

export interface Wallet {
    userId: string;
    balance: number;
}
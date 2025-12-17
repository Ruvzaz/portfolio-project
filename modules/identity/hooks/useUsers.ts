import { useState, useEffect } from "react";
import { User } from "../types";
import { AuthService } from "../services/auth.service";

// ✅ 1. Import PaymentService ข้าม Module เข้ามา
import { PaymentService } from "@/modules/payment/services/payment.service";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = async () => {
        // ... (code เดิม)
        setIsLoading(true);
        try {
            const data = await AuthService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeUser = async (id: string) => {
        // Optimistic Update
        const originalUsers = [...users];
        setUsers(users.filter(u => u.id !== id));

        try {
            // ✅ 2. สั่งลบ User (Identity)
            await AuthService.deleteUser(id);

            // ✅ 3. สั่งลบ Wallet (Payment) ตามไปด้วย
            // (Cascading Delete)
            await PaymentService.deleteWallet(id);

        } catch (error) {
            setUsers(originalUsers);
            alert("Failed to delete user");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, isLoading, removeUser, refresh: fetchUsers };
}
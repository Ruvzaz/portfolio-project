import { useState, useEffect } from "react";
import { AuthService } from "@/modules/identity/services/auth.service";
import { InventoryService } from "@/modules/inventory/services/inventory.service";
import { PaymentService } from "@/modules/payment/services/payment.service";

export function useDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            // เรียก 3 Service พร้อมกัน (Parallel Fetching)
            const [identity, inventory, payment] = await Promise.all([
                AuthService.getStats(),
                InventoryService.getStats(),
                PaymentService.getStats(),
            ]);

            setStats({ identity, inventory, payment });
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, isLoading, refresh: fetchStats };
}
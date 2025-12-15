import { useState, useEffect } from "react";
import { User } from "../types";
import { AuthService } from "../services/auth.service";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // โหลดข้อมูลทันทีที่เรียกใช้ Hook
    const fetchUsers = async () => {
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

    // ฟังก์ชันลบ User
    const removeUser = async (id: string) => {
        // Optimistic Update: ลบออกจากหน้าจอทันทีเพื่อให้รู้สึกเร็ว
        const originalUsers = [...users];
        setUsers(users.filter(u => u.id !== id));

        try {
            await AuthService.deleteUser(id);
        } catch (error) {
            // ถ้าลบพลาด ให้คืนค่าเดิมกลับมา
            setUsers(originalUsers);
            alert("Failed to delete user");
        }
    };

    // Initial load
    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, isLoading, removeUser, refresh: fetchUsers };
}
import { User } from "../types";

// ✅ 1. ใช้ข้อมูลชุดใหม่ของคุณ
let MOCK_USER_DB: User[] = [
    {
        id: "uid-001",
        name: "Admin User",
        email: "demo@example.com",
        avatarUrl: "https://github.com/shadcn.png",
        role: "admin",
    },
    {
        id: "uid-002",
        name: "Wuttichai",
        email: "wuttichai7734@gmail.com",
        avatarUrl: "https://github.com/shadcn.png",
        role: "admin",
    },
    {
        id: "uid-003",
        name: "Jeff",
        email: "test@test.com",
        avatarUrl: "https://github.com/shadcn.png",
        role: "user",
    },
];

export const AuthService = {
    // --- Auth Methods (Login/Register) เดิม ---
    async authenticate(email: string): Promise<User> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const user = MOCK_USER_DB.find((u) => u.email === email);
        if (user) return user;
        throw new Error("User not found.");
    },

    async register(name: string, email: string): Promise<User> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (MOCK_USER_DB.find((u) => u.email === email)) {
            throw new Error("Email already exists");
        }
        const newUser: User = {
            id: `uid-${Date.now()}`,
            name: name,
            email: email,
            role: "user",
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        };
        MOCK_USER_DB.push(newUser);
        return newUser;
    },

    getSession(): User | null { return null; },

    // --- ✅ NEW: Management Methods (เพิ่มใหม่ตรงนี้) ---

    // ดึงข้อมูลผู้ใช้ทั้งหมด (สำหรับ Admin)
    async getAllUsers(): Promise<User[]> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return [...MOCK_USER_DB]; // ส่งสำเนา array กลับไป
    },

    // ลบผู้ใช้ตาม ID
    async deleteUser(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        MOCK_USER_DB = MOCK_USER_DB.filter(user => user.id !== id);
    },

    // เพิ่มต่อท้ายใน AuthService
    async getStats() {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
            totalUsers: MOCK_USER_DB.length,
            admins: MOCK_USER_DB.filter(u => u.role === 'admin').length,
            users: MOCK_USER_DB.filter(u => u.role === 'user').length,
        };
    }
};


// src/lib/storage.ts

export const StorageAdapter = {
    // ดึงข้อมูล (ถ้าไม่มี ให้ใช้ค่าเริ่มต้นที่เรากำหนด)
    getItem: <T>(key: string, initialValue: T): T => {
        if (typeof window === "undefined") return initialValue; // กัน Error เวลา Next.js รันฝั่ง Server

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    },

    // บันทึกข้อมูล
    setItem: <T>(key: string, value: T): void => {
        if (typeof window === "undefined") return;

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving localStorage key "${key}":`, error);
        }
    },

    // ลบข้อมูล (เผื่ออยาก Reset)
    removeItem: (key: string): void => {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(key);
    }
};
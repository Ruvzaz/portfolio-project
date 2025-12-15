import { useIdentity } from "../context";

// เราแค่ส่งต่อ (Re-export) จาก Context เพื่อให้ Component อื่นๆ ไม่ต้องแก้โค้ดเยอะ
export function useAuth() {
    return useIdentity();
}
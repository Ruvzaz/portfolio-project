export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
    isAnonymous?: boolean;
    // ✅ เพิ่ม 2 ค่านี้ เพื่อจำว่าตอนส่งข้อความนี้ ใช้ชื่ออะไร
    anonymousName?: string;
    anonymousColor?: string;
}

// ... ส่วนอื่นๆ เหมือนเดิม

export interface ChatContact {
    id: string;
    name: string;
    avatarUrl?: string;
    role: string;
    lastMessage?: string; // เอาไว้โชว์ตัวอย่างข้อความล่าสุด
    lastMessageTime?: string;
    unreadCount: number;
}
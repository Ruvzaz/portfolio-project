import { Message } from "../types";
import { StorageAdapter } from "@/lib/storage";

const CHAT_STORAGE_KEY = "chat_messages";
// ✅ จอง ID พิเศษสำหรับห้องรวม
export const GLOBAL_CHAT_ID = "system-global";

const getMessagesDB = () => StorageAdapter.getItem<Message[]>(CHAT_STORAGE_KEY, []);
const saveMessagesDB = (data: Message[]) => StorageAdapter.setItem(CHAT_STORAGE_KEY, data);

export const ChatService = {
    // ดึงข้อความส่วนตัว (เหมือนเดิม)
    async getMyMessages(userId: string): Promise<Message[]> {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const allMessages = getMessagesDB();
        return allMessages.filter(m => m.senderId === userId || m.receiverId === userId);
    },

    // ✅ ฟังก์ชันใหม่: ดึงข้อความห้องรวม (Public Board)
    async getGlobalMessages(): Promise<Message[]> {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const allMessages = getMessagesDB();
        return allMessages.filter(m => m.receiverId === GLOBAL_CHAT_ID);
    },

    // ✅ แก้ Signature: รับ object anonymousIdentity เพิ่มเข้ามา
    async sendMessage(
        senderId: string,
        receiverId: string,
        text: string,
        isAnonymous: boolean = false,
        anonymousIdentity?: { name: string, color: string } // รับค่าชื่อ/สี
    ): Promise<Message> {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const allMessages = getMessagesDB();
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId,
            receiverId,
            text,
            timestamp: new Date().toISOString(),
            isRead: false,
            isAnonymous: isAnonymous,
            // ✅ บันทึกชื่อและสีลงไปในข้อความเลย (ถ้าเป็น Anonymous)
            anonymousName: isAnonymous ? anonymousIdentity?.name : undefined,
            anonymousColor: isAnonymous ? anonymousIdentity?.color : undefined,
        };

        allMessages.push(newMessage);
        saveMessagesDB(allMessages);

        return newMessage;
    },

    async markAsRead(senderId: string, receiverId: string): Promise<void> {
        const allMessages = getMessagesDB();
        let hasChanges = false;

        // ถ้าเป็น Global Chat ไม่ต้อง Mark Read (หรือจะทำก็ได้ แต่เพื่อความง่ายเราข้ามไปก่อน)
        if (receiverId === GLOBAL_CHAT_ID) return;

        allMessages.forEach(msg => {
            if (msg.senderId === senderId && msg.receiverId === receiverId && !msg.isRead) {
                msg.isRead = true;
                hasChanges = true;
            }
        });

        if (hasChanges) saveMessagesDB(allMessages);
    }
};
import { useState, useEffect, useCallback } from "react";
// ... imports อื่นๆ เหมือนเดิม
import { Message, ChatContact } from "../types";
import { ChatService, GLOBAL_CHAT_ID } from "../services/chat.service";
import { useIdentity } from "@/modules/identity";
import { AuthService } from "@/modules/identity/services/auth.service";

// ✅ ย้ายฟังก์ชันสุ่มมาไว้ที่นี่ และเปลี่ยนให้ใช้ Math.random() (สุ่มสดๆ ไม่สน ID)
const generateRandomIdentity = () => {
    const adjectives = ["Spooky", "Neon", "Mysterious", "Grumpy", "Sleepy", "Sneaky", "Hyper", "Cyber", "Magic"];
    const nouns = ["Ghost", "Zombie", "Robot", "Ninja", "Alien", "Pumpkin", "Vampire", "Wizard", "Cat"];
    const colors = [
        "text-purple-400", "text-pink-400", "text-orange-400", "text-green-400",
        "text-cyan-400", "text-yellow-400", "text-rose-400", "text-indigo-400"
    ];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return {
        name: `${randomAdjective} ${randomNoun}`,
        color: randomColor
    };
};

export function useChat() {
    const { user: currentUser } = useIdentity();

    // ... State เดิม ...
    const [contacts, setContacts] = useState<ChatContact[]>([]);
    const [activeContactId, setActiveContactId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userMap, setUserMap] = useState<Record<string, string>>({});

    // ✅ สร้างตัวตนใหม่ทุกครั้งที่เข้ามาหน้านี้ (Refresh หรือเข้าใหม่ ก็จะได้ชื่อใหม่)
    const [myAnonymousIdentity] = useState(generateRandomIdentity());

    // ... fetchContacts และ loadChatRoom เหมือนเดิม ...
    // (Copy โค้ดเก่ามาวางได้เลย)
    const fetchContacts = useCallback(async () => {
        // ... โค้ดเดิม
        if (!currentUser) return;
        setIsLoading(true);
        try {
            const allUsers = await AuthService.getAllUsers();
            const map: Record<string, string> = {};
            allUsers.forEach(u => { map[u.id] = u.name; });
            setUserMap(map);

            const myMessages = await ChatService.getMyMessages(currentUser.id);
            const globalMessages = await ChatService.getGlobalMessages();

            const sortedGlobal = globalMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            const globalRoom: ChatContact = {
                id: GLOBAL_CHAT_ID,
                name: "Public Board",
                role: "system",
                avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=PB&backgroundColor=2563eb",
                lastMessage: sortedGlobal[0]?.text || "Welcome to public board!",
                lastMessageTime: sortedGlobal[0]?.timestamp,
                unreadCount: 0
            };

            const contactList: ChatContact[] = allUsers
                .filter(u => u.id !== currentUser.id)
                .map(u => {
                    const conversation = myMessages.filter(
                        m => (m.senderId === currentUser.id && m.receiverId === u.id) ||
                            (m.senderId === u.id && m.receiverId === currentUser.id)
                    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                    const lastMsg = conversation[0];
                    const unreadCount = conversation.filter(m => m.senderId === u.id && !m.isRead).length;

                    return {
                        id: u.id,
                        name: u.name,
                        avatarUrl: u.avatarUrl,
                        role: u.role,
                        lastMessage: lastMsg?.text,
                        lastMessageTime: lastMsg?.timestamp,
                        unreadCount
                    };
                });

            setContacts([globalRoom, ...contactList]);

        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    const loadChatRoom = useCallback(async (contactId: string) => {
        // ... โค้ดเดิม
        if (!currentUser) return;
        let roomMsgs: Message[] = [];
        if (contactId === GLOBAL_CHAT_ID) {
            const globalMsgs = await ChatService.getGlobalMessages();
            roomMsgs = globalMsgs;
        } else {
            await ChatService.markAsRead(contactId, currentUser.id);
            const allMsgs = await ChatService.getMyMessages(currentUser.id);
            roomMsgs = allMsgs.filter(
                m => (m.senderId === currentUser.id && m.receiverId === contactId) ||
                    (m.senderId === contactId && m.receiverId === currentUser.id)
            );
        }
        roomMsgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setMessages(roomMsgs);
        setActiveContactId(contactId);
        if (contactId !== GLOBAL_CHAT_ID) fetchContacts();
    }, [currentUser, fetchContacts]);

    // ✅ แก้ sendMessage ให้ส่ง identity ปัจจุบันไปด้วย
    const sendMessage = async (text: string, isAnonymous: boolean = false) => {
        if (!currentUser || !activeContactId) return;

        await ChatService.sendMessage(
            currentUser.id,
            activeContactId,
            text,
            isAnonymous,
            isAnonymous ? myAnonymousIdentity : undefined // ส่งชื่อปลอมไปด้วย
        );

        await loadChatRoom(activeContactId);
        if (activeContactId === GLOBAL_CHAT_ID) fetchContacts();
    };

    useEffect(() => {
        fetchContacts();
        const interval = setInterval(() => { if (activeContactId) { /* poll */ } }, 5000);
        return () => clearInterval(interval);
    }, [fetchContacts, activeContactId]);

    return {
        contacts,
        activeContactId,
        messages,
        isLoading,
        selectContact: loadChatRoom,
        sendMessage,
        refresh: fetchContacts,
        getUserName: (id: string) => userMap[id] || "Unknown User",
        // ✅ ส่งตัวตนปัจจุบันออกไป (เผื่อเอาไปโชว์ที่ UI ว่า "ตอนนี้ฉันชื่ออะไร")
        myAnonymousIdentity
    };
}
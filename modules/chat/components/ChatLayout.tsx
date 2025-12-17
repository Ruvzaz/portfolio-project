"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { useIdentity } from "@/modules/identity";
import { GLOBAL_CHAT_ID } from "../services/chat.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, MoreVertical, Phone, Video, Globe, Users, Ghost } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatLayout() {
    const { user: currentUser } = useIdentity();
    const { contacts, activeContactId, messages, selectContact, sendMessage, isLoading, getUserName, myAnonymousIdentity } = useChat();

    const [inputText, setInputText] = useState("");
    const [isAnonymousMode, setIsAnonymousMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        setIsAnonymousMode(false);
    }, [activeContactId]);

    const activeContact = contacts.find(c => c.id === activeContactId);
    const isGlobalChat = activeContactId === GLOBAL_CHAT_ID;

    const handleSend = () => {
        if (!inputText.trim()) return;
        sendMessage(inputText, isAnonymousMode);
        setInputText("");
    };

    if (!currentUser) return null;

    return (
        // ✅ Fix 1: เพิ่ม overflow-hidden ที่ Container หลัก กันมันขยายทะลุจอ
        <div className="flex h-[600px] w-full max-w-6xl mx-auto bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">

            {/* -------------------------------------------------------------------------- */}
            {/* 👈 LEFT SIDEBAR */}
            {/* -------------------------------------------------------------------------- */}
            <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-900/50 shrink-0">
                <div className="p-4 border-b border-zinc-800 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input placeholder="Search..." className="pl-9 bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-700" />
                    </div>
                </div>

                {/* List ต้องใช้ flex-1 min-h-0 เพื่อให้ scroll ได้ในพื้นที่ที่เหลือ */}
                <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full">
                        <div className="p-2 space-y-1">
                            {isLoading && contacts.length === 0 ? (
                                <div className="text-center text-zinc-500 py-4">Loading contacts...</div>
                            ) : (
                                contacts.map(contact => {
                                    const isGlobal = contact.id === GLOBAL_CHAT_ID;
                                    return (
                                        <button
                                            key={contact.id}
                                            onClick={() => selectContact(contact.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
                                                activeContactId === contact.id
                                                    ? "bg-zinc-800 shadow-md border border-zinc-700"
                                                    : "hover:bg-zinc-800/50 border border-transparent"
                                            )}
                                        >
                                            <div className="relative shrink-0">
                                                {isGlobal ? (
                                                    <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                                                        <Globe className="w-5 h-5" />
                                                    </div>
                                                ) : (
                                                    <Avatar>
                                                        <AvatarImage src={contact.avatarUrl} />
                                                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                )}

                                                {!isGlobal && contact.role === 'admin' && (
                                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-zinc-900"></span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline">
                                                    <span className={cn("font-medium truncate", activeContactId === contact.id ? "text-white" : "text-zinc-300")}>
                                                        {contact.name}
                                                    </span>
                                                    {contact.lastMessageTime && (
                                                        <span className="text-[10px] text-zinc-500 shrink-0 ml-2">
                                                            {new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className={cn("text-xs truncate max-w-[140px]", isGlobal ? "text-blue-400" : "text-zinc-500")}>
                                                        {isGlobal ? "Public Board" : (contact.lastMessage || "No messages")}
                                                    </p>
                                                    {contact.unreadCount > 0 && (
                                                        <Badge className="h-5 px-1.5 min-w-[20px] bg-blue-600 hover:bg-blue-600 flex justify-center">
                                                            {contact.unreadCount}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* -------------------------------------------------------------------------- */}
            {/* 👉 RIGHT SIDE: CHAT WINDOW */}
            {/* -------------------------------------------------------------------------- */}
            {/* ✅ Fix 2: flex-1 + min-w-0 + overflow-hidden คือหัวใจสำคัญ กัน Flexbox ระเบิด */}
            <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 relative overflow-hidden">

                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(#333 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

                {activeContact ? (
                    <>
                        {/* 1. Chat Header (Fixed Height) */}
                        <div className="h-16 shrink-0 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/80 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-3">
                                {isGlobalChat ? (
                                    <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={activeContact.avatarUrl} />
                                        <AvatarFallback>{activeContact.name[0]}</AvatarFallback>
                                    </Avatar>
                                )}

                                <div>
                                    <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                                        {activeContact.name}
                                        {isGlobalChat && <Badge variant="outline" className="text-[10px] border-blue-500/50 text-blue-400">Global</Badge>}
                                    </h3>
                                    {isGlobalChat ? (
                                        <p className="text-xs text-zinc-400">Visible to everyone</p>
                                    ) : (
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            <span className="text-xs text-zinc-400">Online</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!isGlobalChat && (
                                <div className="flex gap-2 text-zinc-400">
                                    <Button size="icon" variant="ghost" className="hover:text-white"><Phone className="w-5 h-5" /></Button>
                                    <Button size="icon" variant="ghost" className="hover:text-white"><Video className="w-5 h-5" /></Button>
                                    <Button size="icon" variant="ghost" className="hover:text-white"><MoreVertical className="w-5 h-5" /></Button>
                                </div>
                            )}
                        </div>

                        {/* 2. Messages Area (Flexible Height) */}
                        {/* ✅ Fix 3: ใช้ flex-1 min-h-0 เพื่อบอกให้ ScrollArea กินพื้นที่ที่เหลือเท่านั้น ห้ามดัน Parent */}
                        <div className="flex-1 min-h-0 relative z-0">
                            <ScrollArea className="h-full p-6">
                                <div className="space-y-4 pb-4">
                                    {messages.length === 0 && (
                                        <div className="text-center text-zinc-600 py-10 mt-10">
                                            <p>{isGlobalChat ? "Welcome to the Public Board!" : `Start conversation with ${activeContact.name}`}</p>
                                        </div>
                                    )}

                                    {messages.map((msg) => {
                                        const isMe = msg.senderId === currentUser.id;

                                        let displayName = getUserName(msg.senderId);
                                        let displayColor = "text-zinc-400";

                                        if (msg.isAnonymous) {
                                            displayName = (msg.anonymousName || "Unknown Ghost") + " 👻";
                                            displayColor = msg.anonymousColor || "text-zinc-500";
                                        }

                                        return (
                                            <div key={msg.id} className={cn("flex w-full flex-col", isMe ? "items-end" : "items-start")}>

                                                {isGlobalChat && !isMe && (
                                                    <span className={cn(
                                                        "text-[10px] mb-1 ml-1 font-medium flex items-center gap-1",
                                                        displayColor
                                                    )}>
                                                        {displayName}
                                                    </span>
                                                )}

                                                <div className={cn(
                                                    "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative group break-words", // break-words กันข้อความยาวทะลุ
                                                    isMe
                                                        ? "bg-blue-600 text-white rounded-br-none"
                                                        : (msg.isAnonymous ? "bg-zinc-800 border border-zinc-700 text-zinc-200" : "bg-zinc-800 text-zinc-100") + " rounded-bl-none"
                                                )}>
                                                    {msg.text}
                                                    <span className={cn(
                                                        "text-[10px] block text-right mt-1 opacity-70",
                                                        isMe ? "text-blue-200" : (msg.isAnonymous ? "text-zinc-500" : "text-zinc-400")
                                                    )}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>
                        </div>

                        {/* 3. Input Area (Fixed Height at Bottom) */}
                        {/* ✅ Fix 4: shrink-0 ห้ามโดนบีบเด็ดขาด */}
                        <div className="bg-zinc-900 border-t border-zinc-800 z-10 shrink-0">
                            <div className="p-4 flex flex-col">

                                <div className="flex gap-2 items-center relative z-20">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={!isGlobalChat}
                                        title={isGlobalChat ? "Toggle Anonymous Mode" : "Anonymous mode available in Public Board only"}
                                        onClick={() => setIsAnonymousMode(!isAnonymousMode)}
                                        className={cn(
                                            "shrink-0 transition-all duration-300",
                                            isAnonymousMode
                                                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] scale-105"
                                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800",
                                            !isGlobalChat && "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-zinc-500"
                                        )}
                                    >
                                        <Ghost className="w-5 h-5" />
                                    </Button>

                                    <Input
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder={isAnonymousMode ? "Whispering anonymously..." : (isGlobalChat ? "Post to public board..." : `Message ${activeContact.name}...`)}
                                        className={cn(
                                            "bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500 transition-all duration-300",
                                            isAnonymousMode && "border-purple-500/50 focus-visible:ring-purple-500 placeholder:text-purple-400/50 bg-purple-950/10"
                                        )}
                                    />

                                    <Button
                                        onClick={handleSend}
                                        size="icon"
                                        className={cn(
                                            "text-white shrink-0 transition-all duration-300",
                                            isAnonymousMode
                                                ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/20"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        )}
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Collapsible Warning Message */}
                                <div
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        (isAnonymousMode && isGlobalChat) ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-purple-900/10 border border-purple-500/10">
                                            <span className="relative flex h-2 w-2 shrink-0">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                            </span>
                                            <p className="text-[10px] text-purple-300 font-medium truncate">
                                                You are in Anonymous Mode as <span className={`font-bold border-b border-purple-500 ${myAnonymousIdentity?.color || 'text-white'}`}>{myAnonymousIdentity?.name}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </>
                ) : (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                            <Users className="w-8 h-8 opacity-50 ml-1" />
                        </div>
                        <h3 className="text-lg font-medium text-zinc-300">Welcome to Team Chat</h3>
                        <p className="text-sm">Select "Public Board" or a friend to start chatting.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Mail, MapPin, Terminal, Cpu, ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 p-6 md:p-12 flex justify-center items-center">

      {/* Container หลัก: กำหนด Grid 3 คอลัมน์ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">

        {/* --- 1. HERO CARD (รูปโปรไฟล์ + แนะนำตัว) --- */}
        <Card className="col-span-1 md:col-span-2 bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <Avatar className="w-28 h-28 border-2 border-zinc-700">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AG</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left space-y-3">
              <h1 className="text-3xl font-bold text-zinc-100">"Antigravity"</h1>
              <p className="text-zinc-400 text-base">Software Engineer & Modular Monolith Enthusiast</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 px-3 py-1">TypeScript</Badge>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 px-3 py-1">Go</Badge>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 px-3 py-1">System Design</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- 2. LOCATION / MAP --- */}
        <Card className="col-span-1 bg-zinc-900 border-zinc-800 flex flex-col justify-center items-center p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-zinc-800/30 group-hover:bg-zinc-800/50 transition-colors" />
          <MapPin className="w-10 h-10 text-zinc-400 mb-3 z-10" />
          <h3 className="text-zinc-200 font-semibold text-lg z-10">Based in</h3>
          <p className="text-zinc-500 z-10">Bangkok, Thailand</p>
        </Card>

        {/* --- 3. THE PLAYGROUND (คลิกได้ทั้งการ์ดแล้ว!) --- */}
        {/* ใช้ Link ครอบ Card ทั้งใบ */}
        <Link href="/playground" className="col-span-1 md:col-span-3 block group relative">
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden h-full transition-all group-hover:border-zinc-600">
            {/* Effect พื้นหลังตอน Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-blue-400" />
                  <CardTitle className="text-zinc-100 text-xl">Modular Playground</CardTitle>
                </div>
                <ArrowUpRight className="w-6 h-6 text-zinc-500 group-hover:text-zinc-100 transition-colors" />
              </div>
              <CardDescription className="text-base mt-2">
                พื้นที่ทดลองระบบ Modular Monolith: Auth, Payment, และ Inventory Modules ที่ทำงานแยกส่วนกันแต่เชื่อมต่อกัน
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="bg-zinc-950 rounded-lg p-5 font-mono text-sm text-green-400 border border-zinc-800">
                <p>{`> Initializing modules...`}</p>
                <p>{`> [Auth] Service ready.`}</p>
                <p>{`> [Payment] Service ready.`}</p>
                <p className="animate-pulse">{`> Waiting for input..._`}</p>
              </div>

              {/* เปลี่ยนจาก Button เป็น div ธรรมดาที่หน้าตาเหมือนปุ่ม (เพื่อไม่ให้ error ซ้อนลิ้งก์) */}
              <div className="w-full bg-zinc-100 text-zinc-900 mt-5 h-11 px-4 py-2 rounded-lg flex items-center justify-center text-base font-semibold transition-colors group-hover:bg-zinc-200">
                Enter The Lab
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* --- 4. TECH STACK --- */}
        <Card className="col-span-1 bg-zinc-900 border-zinc-800 p-8 flex flex-col justify-center gap-4">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-6 h-6 text-zinc-400" />
            <h3 className="text-zinc-200 font-semibold text-lg">Stack</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-base text-zinc-400">
            <span>Next.js</span>
            <span>Tailwind</span>
            <span>PostgreSQL</span>
            <span>Docker</span>
          </div>
        </Card>

        {/* --- 5. SOCIAL / CONNECT --- */}
        <Card className="col-span-1 md:col-span-2 bg-zinc-900 border-zinc-800 p-8 flex flex-col justify-center">
          <h3 className="text-zinc-200 font-semibold text-lg mb-5">Let's Connect</h3>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="border-zinc-700 hover:bg-zinc-800 h-11 w-11">
              <Github className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="border-zinc-700 hover:bg-zinc-800 h-11 w-11">
              <Linkedin className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="flex-1 border-zinc-700 hover:bg-zinc-800 text-zinc-300 h-11 text-base">
              <Mail className="w-5 h-5 mr-2" />
              Email Me
            </Button>
          </div>
        </Card>

      </div>
    </main>
  );
}
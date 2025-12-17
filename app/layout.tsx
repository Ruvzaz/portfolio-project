import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// ... imports อื่นๆ

// ✅ 1. Import Toaster มา
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

// ... metadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}

        {/* ✅ 2. วาง Component นี้ไว้ล่างสุด ก่อนปิด body */}
        {/* richColors ทำให้ toast มีสีเขียว/แดง ตามสถานะ */}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
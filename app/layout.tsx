// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // หรือฟอนต์อื่นที่คุณชอบ
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wuttichai",
  description: "My Digital Playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // เติม class="dark" ตรงนี้ครับ เพื่อบังคับ Dark Mode ตลอดเวลา
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
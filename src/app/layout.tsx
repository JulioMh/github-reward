import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Wallet } from "@/components/Wallet";
import { Notifier } from "@/components/Notifier";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Wallet>
          <Notifier>
            <Navbar />
            <div className="p-24">{children}</div>
          </Notifier>
        </Wallet>
      </body>
    </html>
  );
}

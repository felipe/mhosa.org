import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MHOSA - Milehigh HO-scale Slotcar Association",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-stone-300 ${quicksand.className}`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

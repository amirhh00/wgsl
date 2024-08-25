import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Navigation from "@/components/global/layout/Navigation";
import Footer from "@/components/global/layout/Footer";

import "@/styles/globals.css";
import SideNavigation from "../components/global/layout/SideNavigation";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "WGSL101",
  description: "WebGPU Shading Language 101",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body className={cn("bg-background font-sans antialiased", fontSans.variable)}>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <div className="mainWrapper w-full flex flex-1">
            <main className="w-full flex">{children}</main>
          </div>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}

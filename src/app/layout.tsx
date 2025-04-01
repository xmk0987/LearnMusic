import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Music } from "next/font/google";
import "./globals.css";
import { AudioContextProvider } from "@/context/AudioContext";
import { SidebarProvider } from "@/context/SidebarContext";
import AppLayout from "../layouts/AppLayout/AppLayout";
import { ChaptersProvider } from "@/context/ChaptersContext";
import { NotificationProvider } from "@/context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoMusic = Noto_Music({
  weight: "400",
  variable: "--font-noto-music",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LearnMusic",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoMusic.variable} antialiased`}
      >
        <NotificationProvider>
          <ChaptersProvider>
            <AudioContextProvider>
              <SidebarProvider>
                <AppLayout>{children}</AppLayout>
              </SidebarProvider>
            </AudioContextProvider>
          </ChaptersProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

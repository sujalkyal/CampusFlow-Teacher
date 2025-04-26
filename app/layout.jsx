"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { EdgeStoreProvider } from "./lib/edgestore";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/auth/signin" || pathname === "/auth/signup";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <EdgeStoreProvider>
          <SessionProvider>
            {!hideNavbar && <Navbar />}
            {children}
            <Footer />
          </SessionProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

import {
  ClerkProvider
} from '@clerk/nextjs';
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { Navbar } from "./navbar";
import UrlErrors from "./url-errors";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bez Azbest",
  description: "Report asbestos in your area. Help us make Macedonia a safer place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body className={`${inter.className} min-w-full min-h-dvh w-full h-dvh !pt-navbar`}>
          <Navbar />
          {children}
          <Toaster richColors={true} />
          <UrlErrors />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

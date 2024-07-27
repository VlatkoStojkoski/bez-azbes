import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider
} from '@clerk/nextjs';
import "./globals.css";
import { Navbar } from "./navbar";

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
        </body>
      </html>
    </ClerkProvider>
  );
}

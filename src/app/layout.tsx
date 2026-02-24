import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/app/providers/AuthProvider";
import { CartPersistenceProvider } from "@/app/providers/CartPersistenceProvider";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ReduxProvider } from "@/app/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web Shop",
  description:
    "Production-grade Web Shop SPA built with Next.js (App Router) and TypeScript. Features advanced filtering, sorting, search, pagination, authentication, and cart functionality. Implements scalable architecture, TanStack Query + Redux state management, Jest testing, Storybook, CI/CD, and responsive design with Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ReduxProvider>
            <AuthProvider>
              <CartPersistenceProvider>{children}</CartPersistenceProvider>
            </AuthProvider>
          </ReduxProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

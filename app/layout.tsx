import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'react-hot-toast';

import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VA Helper",
  description: "Helping Veterans with the VA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html suppressHydrationWarning lang="en">
          <body className={inter.className}>{children}
          <Toaster />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}

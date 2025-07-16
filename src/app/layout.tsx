import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import React from "react";
import Layout from '@/components/layout/Layout';
import ClientChat from '@/components/chat/ClientChat';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: "Alistair Grenyer | Software Engineer",
  description: "Professional portfolio of Alistair Grenyer, a software engineer specializing in modern web technologies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <Layout>
          {children}
          <ClientChat />
        </Layout>
      </body>
    </html>
  );
}

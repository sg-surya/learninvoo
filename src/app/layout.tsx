
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import fonts
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});



export const metadata: Metadata = {
  title: "Learnivo AI Teacher Dashboard",
  description: "AI-powered dashboard for teachers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

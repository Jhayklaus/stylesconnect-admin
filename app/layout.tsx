import type { Metadata } from "next";
import { Jost, Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jost",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StyleConnect Admin",
  description: "Internal admin platform for StyleConnect.",
  // An admin panel must never be indexed.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jost.variable} ${inter.variable} font-jost antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

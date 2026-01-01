import type { Metadata } from "next";
import { Micro_5, Funnel_Sans, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const micro5 = Micro_5({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
});

const funnelSans = Funnel_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-text",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "nextup",
  description: "nextup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${micro5.variable} ${funnelSans.variable} ${plusJakarta.variable} ${spaceMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

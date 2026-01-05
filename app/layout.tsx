import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
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
  title: "Nextup – Data-driven features for your users",
  description:
    "Nextup analyzes your web product data to forge the features your users actually need. Join the waitlist.",
  metadataBase: new URL("https://nextup.build"),
  openGraph: {
    title: "Nextup – What should you build next?",
    description:
      "Nextup analyzes your web product data to forge the features your users actually need.",
    url: "https://nextup.build",
    siteName: "Nextup",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextup – What should you build next?",
    description:
      "Nextup analyzes your web product data to forge the features your users actually need.",
  },
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
        <Analytics />
      </body>
    </html>
  );
}

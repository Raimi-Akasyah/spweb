import type { Metadata } from "next";
import { Hanken_Grotesk, Instrument_Serif, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SenangPlanner — Wedding & Event Management",
  description:
    "Kami uruskan stress, anda nikmati majlis. Perancangan dan koordinasi acara di seluruh Malaysia.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  ),
  openGraph: {
    title: "SenangPlanner — Kami uruskan stress, anda nikmati majlis.",
    description:
      "Perancangan dan koordinasi acara di seluruh Malaysia. Mulakan dengan konsultasi percuma.",
    siteName: "SenangPlanner",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body className={`${sora.variable} ${hanken.variable} ${instrumentSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}

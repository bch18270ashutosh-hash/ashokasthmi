import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ashok Asthmi | Pure & Authentic Puja Products",
  description: "Your one-stop destination for premium, authentic, and pure puja essentials for every ritual.",
  openGraph: {
    title: "Ashok Asthmi | Pure & Authentic Puja Products",
    description: "Premium puja items delivered to your doorstep.",
    url: "https://ashokasthmi.in",
    siteName: "Ashok Asthmi",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <AppLayout>{children}</AppLayout>
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VerifiedBusiness.in — Premium Local Business Directory for India",
  description:
    "A clean, confident, distinctly Indian local business directory. Find verified businesses across every city, district, and pincode in India.",
  keywords: [
    "India business directory",
    "local businesses India",
    "city directory",
    "verified listings",
    "Bharat directory",
  ],
  authors: [{ name: "VerifiedBusiness.in" }],
  manifest: "/manifest.json",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "VerifiedBusiness.in",
    description: "Premium local business directory for India",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jakarta.variable} antialiased`}
        style={{
          backgroundColor: "var(--color-base)",
          color: "var(--color-text-primary)",
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

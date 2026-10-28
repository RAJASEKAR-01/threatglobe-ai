import type { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ThreatGlobe AI — Planetary Cyber Defense",
  description:
    "Interactive 3D real-time cyber threat intelligence globe with Gemini AI incident triage and tactical defense synthesis.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-tg-bg text-tg-text antialiased selection:bg-tg-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}
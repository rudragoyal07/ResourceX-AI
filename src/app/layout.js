import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ResourceX AI — Intelligent Emergency Resource Exchange",
  description: "An AI-powered emergency logistics coordination platform to redistribute critical resources during crises, natural disasters, and pandemics.",
  metadataBase: new URL("https://resourcex-ai.vercel.app"),
  openGraph: {
    title: "ResourceX AI — Intelligent Emergency Resource Exchange",
    description: "An AI-powered emergency logistics coordination platform to redistribute critical resources during crises, natural disasters, and pandemics.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >

      <body className="min-h-full flex flex-col bg-[#060913] text-[#f3f4f6]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

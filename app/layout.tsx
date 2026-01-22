import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Crypto Dashboard | Real-Time Cryptocurrency Tracker",
    template: "%s | Crypto Dashboard",
  },
  description:
    "Track top 50 cryptocurrencies in real-time. Monitor prices, market cap, trading volume, and trends with interactive charts. Free crypto tracking dashboard.",
  keywords: [
    "cryptocurrency",
    "crypto dashboard",
    "bitcoin",
    "ethereum",
    "crypto tracker",
    "cryptocurrency prices",
    "market cap",
    "crypto charts",
    "real-time crypto",
    "crypto watchlist",
  ],
  authors: [{ name: "Axl Guillen" }],
  creator: "Axl Guillen",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crypto-dashboard.vercel.app",
    siteName: "Crypto Dashboard",
    title: "Crypto Dashboard | Real-Time Cryptocurrency Tracker",
    description:
      "Track top 50 cryptocurrencies in real-time. Monitor prices, market cap, trading volume, and trends with interactive charts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Crypto Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Dashboard | Real-Time Cryptocurrency Tracker",
    description:
      "Track top 50 cryptocurrencies in real-time. Monitor prices, market cap, and trends.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

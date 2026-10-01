import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import PageWrapper from "@/components/page-wrapper";
import { WhatsAppWidget } from "@/components/sections/whatsapp-widget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brimus Consultancy Ltd - Leading Consulting Firm in Africa",
    template: "%s | Brimus Consultancy Ltd",
  },
  description:
    "Brimus Consultancy Ltd is a leading Kenyan consulting firm specializing in audit, accountancy, financial consultancy, tax, research, policy analysis, and strategic management. Trusted by NGOs, donors, and private sector clients across Africa.",
  keywords: [
    "Brimus Consultancy",
    "audit Kenya",
    "accountancy Nairobi",
    "financial consultancy",
    "tax services Kenya",
    "policy analysis Africa",
    "strategic management",
    "consulting firm Nairobi",
  ],
  authors: [{ name: "Brimus Consultancy Ltd" }],
  creator: "Brimus Consultancy Ltd",
  openGraph: {
    title: "Brimus Consultancy Ltd - Leading Consulting Firm in Africa",
    description:
      "Professional audit, accountancy, financial consultancy, tax, research, and strategic management services across Africa.",
    url: "https://brimus.co.ke",
    siteName: "Brimus Consultancy Ltd",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Brimus Consultancy Ltd",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brimus Consultancy Ltd",
    description:
      "Leading Kenyan consulting firm for audit, accountancy, financial consultancy, tax, and strategic management.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0891b2" },
    { media: "(prefers-color-scheme: dark)", color: "#083344" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PageWrapper>
            {children}
          </PageWrapper>
          <WhatsAppWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}

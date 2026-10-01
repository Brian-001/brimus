import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import PageWrapper from "@/components/page-wrapper";
import { WhatsAppWidget } from "@/components/sections/whatsapp-widget";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brimus Consultancy | Audit, Tax & Advisory Services in Kenya",
    template: "%s | Brimus Consultancy Ltd",
  },
  description:
    "Brimus Consultancy provides audit, tax, advisory, research and strategic management services to businesses, NGOs and institutions in Kenya and across Africa.",
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
    title: "Brimus Consultancy | Audit, Tax & Advisory Services in Kenya",
    description:
      "Audit, tax, advisory, research and strategic management services for businesses, NGOs and institutions in Kenya and across Africa.",
    url: "https://brimus.co.ke",
    siteName: "Brimus Consultancy Ltd",
    images: [
      {
        url: "/images/og-image.png",
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
    title: "Brimus Consultancy | Audit, Tax & Advisory Services in Kenya",
    description:
      "Audit, tax, advisory, research and strategic management services in Kenya and across Africa.",
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
        <OrganizationJsonLd />
      </body>
    </html>
  );
}

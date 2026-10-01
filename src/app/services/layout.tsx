import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit, Tax & Advisory Services in Kenya",
  description:
    "Audit and assurance, tax compliance, advisory, research and business outsourcing & project management services for organisations in Kenya and across Africa.",
};

export default function ServicesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

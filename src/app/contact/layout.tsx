import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us in Thika, Kenya",
  description:
    "Contact Brimus Consultancy Ltd in Thika, Kenya. Call, email or send an enquiry about our audit, tax and advisory services — we respond within 24 hours.",
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

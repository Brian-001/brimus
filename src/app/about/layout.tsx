import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Brimus Consultancy Ltd is a Kenyan professional services firm founded by practitioners with Big 4 experience in audit, tax and advisory, serving clients across Africa.",
};

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

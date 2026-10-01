import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Experience & Team",
  description:
    "Decades of combined experience across NGOs, donors, private sector and public institutions — meet the people and engagements behind Brimus Consultancy.",
};

export default function ExperienceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

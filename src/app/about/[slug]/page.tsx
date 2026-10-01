import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { teamMembers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { ProfileJsonLd } from "@/components/seo/json-ld";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return teamMembers
    .filter((member) => member.slug)
    .map((member) => ({ slug: member.slug as string }));
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);
  if (!member) return { title: "Profile Not Found" };
  return {
    title: member.name,
    description: member.bio,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);
  if (!member || !member.slug) notFound();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="bg-grid-cyan absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
        <div className="absolute inset-0">
          <div className="animate-float-slow absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 md:pb-20 md:pt-44 lg:px-8">
          <BackButton className="mb-6" />
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/30 backdrop-blur-sm">
              <span className="text-4xl font-bold text-white">
                {member.name.charAt(0)}
              </span>
            </div>
            <div>
              <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-300">
                <span className="h-px w-6 bg-cyan-300/60" />
                Our Team
              </span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm md:text-5xl">
                {member.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-cyan-100">
                {member.role}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile body */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-3xl">
          <ProfileJsonLd
            name={member.name}
            role={member.role}
            bio={member.bio}
            slug={member.slug}
          />

          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Biography
          </h2>
          <p className="mb-10 text-base leading-relaxed text-muted-foreground">
            {member.bio}
          </p>

          {member.expertise && member.expertise.length > 0 && (
            <>
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Areas of Expertise
              </h2>
              <ul className="mb-10 flex flex-wrap gap-2">
                {member.expertise.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-muted-foreground ring-1 ring-border"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="flex flex-wrap gap-4">
            <Link href="/about/team">
              <Button variant="outline" size="lg" className="rounded-full">
                Back to Team
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="default" size="lg" className="rounded-full">
                Talk to an Advisor <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

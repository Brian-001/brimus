import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { SectionHeader } from "@/components/sections/stat-section";
import { teamMembers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the founders and senior professionals behind Brimus Consultancy — chartered accountants and advisors with Big 4 and international development experience.",
};

export default function TeamPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="bg-grid-cyan absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
        <div className="absolute inset-0">
          <div className="animate-float-slow absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="animate-pulse-soft absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 md:pb-20 md:pt-44 lg:px-8">
          <BackButton className="mb-6" />
          <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-300">
            <span className="h-px w-6 bg-cyan-300/60" />
            Our Team
          </span>
          <h1 className="mb-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
            The People Behind{" "}
            <span className="text-gradient block">Every Engagement</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-cyan-50/80">
            Founded by seasoned professionals with decades of combined
            experience across Big 4 firms and international development
            organisations.
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Leadership"
            title="Founders & Senior Professionals"
            description="Click any profile to read the full biography and areas of expertise."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => {
              const card = (
                <>
                  <div className="mx-auto mb-5 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <span className="text-4xl font-bold text-primary transition-colors duration-300 group-hover:text-white">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-center text-foreground mb-1">
                    {member.name}
                  </h2>
                  <p className="text-sm font-medium text-accent text-center mb-4">
                    {member.role}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {member.bio}
                  </p>
                  {member.expertise && (
                    <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
                      {member.expertise.map((item) => (
                        <li
                          key={item}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {member.slug && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5">
                      View profile <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </>
              );

              return member.slug ? (
                <Link
                  key={member.name}
                  href={`/about/${member.slug}`}
                  className="group rounded-xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover block h-full text-center"
                >
                  {card}
                </Link>
              ) : (
                <div
                  key={member.name}
                  className="rounded-xl border border-border bg-card p-8 shadow-card h-full text-center"
                >
                  {card}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/contact">
              <Button variant="default" className="rounded-lg">
                Work With Our Team <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

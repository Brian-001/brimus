import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { SectionHeader } from "@/components/sections/stat-section";
import { sortedInsights } from "@/content/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical guides and perspectives on audit, tax, advisory and financial management from the Brimus Consultancy team.",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function InsightsPage() {
  const posts = sortedInsights();

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
            Insights
          </span>
          <h1 className="mb-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm md:text-5xl lg:text-6xl">
            Perspectives &{" "}
            <span className="text-gradient block">Practical Guides</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-cyan-50/80">
            Clear, usable thinking on audit, tax, advisory and financial
            management — written for the people who have to act on it.
          </p>
        </div>
      </section>

      {/* Article list */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Latest"
            title="Articles & Guides"
            description="Short, practical reads from our team. No jargon, no fluff."
          />

          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              New insights are on the way. Check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/insights/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover"
                >
                  <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      {formatDate(post.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {post.readingTime}
                    </span>
                  </div>
                  <h2 className="mb-3 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-all group-hover:gap-2.5">
                    Read article <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/contact">
              <Button variant="default" className="rounded-lg">
                Talk to an Advisor <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

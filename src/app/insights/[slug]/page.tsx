import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { ArticleJsonLd } from "@/components/seo/json-ld";
import { getInsight, insights } from "@/content/insights";

export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) {
    return { title: "Insight Not Found" };
  }

  return {
    title: insight.title,
    description: insight.description,
    openGraph: {
      title: insight.title,
      description: insight.description,
      type: "article",
      publishedTime: `${insight.date}T00:00:00.000Z`,
      url: `/insights/${insight.slug}`,
    },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) {
    notFound();
  }

  const { default: Post } = await import(`@/content/insights/${slug}.mdx`);

  return (
    <main className="min-h-screen">
      <ArticleJsonLd
        title={insight.title}
        description={insight.description}
        date={insight.date}
        slug={insight.slug}
      />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="bg-grid-cyan absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
        <div className="absolute inset-0">
          <div className="animate-float-slow absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="animate-pulse-soft absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 md:pb-20 md:pt-44 lg:px-8">
          <BackButton href="/insights" label="All insights" className="mb-6" />
          <span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-cyan-300">
            <span className="h-px w-6 bg-cyan-300/60" />
            Insight
          </span>
          <h1 className="mb-6 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm md:text-4xl lg:text-5xl">
            {insight.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cyan-100/85">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-cyan-300" />
              {formatDate(insight.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-cyan-300" />
              {insight.readingTime}
            </span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="section-padding bg-background">
        <div className="mx-auto max-w-3xl">
          <article>
            <Post />
          </article>

          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-border pt-8">
            <Link href="/insights">
              <Button variant="outline" className="rounded-lg">
                All insights
              </Button>
            </Link>
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

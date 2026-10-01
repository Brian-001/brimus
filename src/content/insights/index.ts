export interface Insight {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) used for sorting and display. */
  date: string;
  readingTime: string;
}

/**
 * Registry of published insight articles.
 * Each entry must have a matching `<slug>.mdx` file in this directory.
 * Listing order is derived from `date` (newest first), not array order.
 */
export const insights: Insight[] = [
  {
    slug: "choosing-an-audit-firm",
    title: "Choosing an Audit Firm: Five Questions to Ask Before You Sign",
    description:
      "Fees matter, but independence, staffing and timeline are what determine whether an audit adds value or just paperwork.",
    date: "2026-09-12",
    readingTime: "4 min read",
  },
  {
    slug: "cash-flow-forecasting-for-smes",
    title: "Cash Flow Forecasting: A Practical Starting Point for SMEs",
    description:
      "A simple 13-week cash flow forecast helps you see shortfalls before they happen — here is how to build one.",
    date: "2026-09-26",
    readingTime: "5 min read",
  },
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((insight) => insight.slug === slug);
}

export function sortedInsights(): Insight[] {
  return [...insights].sort((a, b) => b.date.localeCompare(a.date));
}

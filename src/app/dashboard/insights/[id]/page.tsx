"use client";

import { use } from "react";
import Link from "next/link";
import { InsightForm } from "@/components/dashboard/insight-form";
import type { Id } from "@convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";

export default function EditInsightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/insights"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to insights
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Insight</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the article, then save your changes.
        </p>
      </div>
      <InsightForm id={id as Id<"insights">} />
    </div>
  );
}

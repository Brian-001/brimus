"use client";

import { use } from "react";
import { InsightForm } from "@/components/dashboard/insight-form";
import type { Id } from "@convex/_generated/dataModel";

export default function EditInsightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
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

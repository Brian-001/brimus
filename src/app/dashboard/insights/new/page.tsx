"use client";

import { InsightForm } from "@/components/dashboard/insight-form";

export default function NewInsightPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Insight</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write a new article. Unpublished drafts stay hidden from the public
          site.
        </p>
      </div>
      <InsightForm />
    </div>
  );
}

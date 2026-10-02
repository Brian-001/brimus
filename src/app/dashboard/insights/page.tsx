"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/lib/use-auth";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InsightsSkeleton } from "@/components/dashboard/skeletons";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";

export default function InsightsDashboardPage() {
  const { token, ready } = useAuth();
  const authed = ready && token ? { token } : "skip";
  const insights = useQuery(api.insights.listAll, authed);
  const remove = useMutation(api.insights.remove);
  const seed = useMutation(api.insights.seed);

  if (!insights) {
    return <InsightsSkeleton />;
  }

  const onDelete = async (id: (typeof insights)[number]["_id"], title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await remove({ token: token!, id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const onSeed = async () => {
    try {
      await seed();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to seed articles");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Insights</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Draft, publish and manage articles shown on the public Insights
            page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {insights.length === 0 && (
            <Button variant="outline" size="sm" onClick={onSeed}>
              <FileText className="h-4 w-4" /> Load starter articles
            </Button>
          )}
          <Link
            href="/dashboard/insights/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-hover hover:shadow-md active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> New Insight
          </Link>
        </div>
      </div>

      {insights.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No insights yet. Create your first article or load the starter
            articles to get going.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {insights.map((post) => (
            <Card key={post._id}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">
                    {post.title}
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    /insights/{post.slug} · {post.date} · {post.readingTime}
                  </p>
                </div>
                <Badge
                  variant={post.published ? "outline" : "secondary"}
                  className="capitalize"
                >
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {post.description}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/dashboard/insights/${post._id}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(post._id, post.title)}
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useAuth } from "@/lib/use-auth";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn } from "@/components/dashboard/data-table";
import { PublishedBadge } from "@/components/dashboard/status-badge";
import { InsightsSkeleton } from "@/components/dashboard/skeletons";
import {
  ExternalLink,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

export default function InsightsDashboardPage() {
  const router = useRouter();
  const { token, ready } = useAuth();
  const authed = ready && token ? { token } : "skip";
  const insights = useQuery(api.insights.listAll, authed);
  const remove = useMutation(api.insights.remove);
  const seed = useMutation(api.insights.seed);

  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: Id<"insights">;
    title: string;
  } | null>(null);

  if (!insights) {
    return <InsightsSkeleton />;
  }

  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? insights.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.slug.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle),
      )
    : insights;

  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove({ token: token!, id: deleteTarget.id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
    setDeleteTarget(null);
  };

  const onSeed = async () => {
    try {
      await seed();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to seed articles");
    }
  };

  const columns: DataTableColumn<(typeof insights)[number]>[] = [
    {
      key: "title",
      header: "Title",
      sortValue: (p) => p.title.toLowerCase(),
      cell: (p) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {p.title}
          </p>
          <p className="truncate font-mono text-xs text-muted-foreground">
            /insights/{p.slug}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (p) => (p.published ? "published" : "draft"),
      cell: (p) => <PublishedBadge published={p.published} />,
    },
    {
      key: "date",
      header: "Date",
      sortValue: (p) => p.date,
      headClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      cell: (p) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {p.date}
        </span>
      ),
    },
    {
      key: "reading",
      header: "Reading time",
      headClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
      cell: (p) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {p.readingTime}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
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
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
            data-testid="new-insight"
          >
            <Plus className="h-4 w-4" /> New Insight
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search insights…"
            aria-label="Search insights"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            data-testid="search-input"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {insights.length}{" "}
          {insights.length === 1 ? "article" : "articles"}
        </span>
      </div>

      <DataTable
        label="Insights"
        columns={columns}
        rows={filtered}
        getRowId={(p) => p._id}
        onRowClick={(p) => router.push(`/dashboard/insights/${p._id}`)}
        defaultSort={{ key: "date", dir: "desc" }}
        empty={
          needle ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Search className="h-8 w-8 opacity-50" />
              <p className="text-sm">No articles match “{q.trim()}”.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <FileText className="h-8 w-8 opacity-50" />
              <p className="text-sm">
                No insights yet. Create your first article or load the starter
                articles to get going.
              </p>
            </div>
          )
        }
        rowActions={(p) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                aria-label={`Actions for ${p.title}`}
                data-testid="row-actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/insights/${p._id}`)}
              >
                <Pencil /> Edit
              </DropdownMenuItem>
              {p.published && (
                <DropdownMenuItem asChild>
                  <a href={`/insights/${p.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink /> View on site
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  setDeleteTarget({ id: p._id, title: p.title })
                }
              >
                <Trash2 /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleteTarget?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the article from the dashboard and the
              public Insights page. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={onDelete}
              data-testid="confirm-delete"
            >
              Delete article
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

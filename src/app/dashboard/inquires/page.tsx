"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useAuth } from "@/lib/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn } from "@/components/dashboard/data-table";
import {
  AnsweredBadge,
  InquiryStatusBadge,
} from "@/components/dashboard/status-badge";
import { InquiriesSkeleton } from "@/components/dashboard/skeletons";
import { Eye, MoreHorizontal, Search, Trash2 } from "lucide-react";

type Status = "new" | "read" | "replied";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
];

export default function InquiresPage() {
  const router = useRouter();
  const { token, ready } = useAuth();
  const authed = ready && token ? { token } : "skip";
  const inquires = useQuery(api.inquires.list, authed);
  const setStatus = useMutation(api.inquires.setStatus);
  const remove = useMutation(api.inquires.remove);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<{
    id: Id<"inquires">;
    name: string;
  } | null>(null);

  if (!inquires) {
    return <InquiriesSkeleton />;
  }

  const needle = q.trim().toLowerCase();
  const filtered = inquires.filter((i) => {
    const matchesQuery =
      !needle ||
      i.fullName.toLowerCase().includes(needle) ||
      i.email.toLowerCase().includes(needle) ||
      i.message.toLowerCase().includes(needle);
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const onStatus = async (id: Id<"inquires">, status: Status) => {
    try {
      await setStatus({ token: token!, id, status });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove({ token: token!, id: deleteTarget.id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
    setDeleteTarget(null);
  };

  const columns: DataTableColumn<(typeof inquires)[number]>[] = [
    {
      key: "contact",
      header: "Contact",
      sortValue: (i) => i.fullName.toLowerCase(),
      cell: (i) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {i.fullName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{i.email}</p>
        </div>
      ),
    },
    {
      key: "services",
      header: "Services",
      headClassName: "hidden lg:table-cell",
      cellClassName: "hidden lg:table-cell",
      cell: (i) => (
        <div className="flex max-w-[22rem] flex-wrap gap-1.5">
          {i.services.slice(0, 2).map((service) => (
            <span
              key={service}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground ring-1 ring-border"
            >
              {service}
            </span>
          ))}
          {i.services.length > 2 && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-border">
              +{i.services.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (i) => i.status,
      cell: (i) => <InquiryStatusBadge status={i.status} />,
    },
    {
      key: "resolution",
      header: "Resolution",
      sortValue: (i) => (i.answered ? 1 : 0),
      cell: (i) =>
        i.answered ? (
          <AnsweredBadge />
        ) : (
          <span
            data-testid="awaiting-badge"
            className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground ring-1 ring-border"
          >
            Awaiting answer
          </span>
        ),
    },
    {
      key: "received",
      header: "Received",
      sortValue: (i) => i.submittedAt,
      headClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      cell: (i) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {new Date(i.submittedAt).toLocaleDateString(undefined, {
            dateStyle: "medium",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact form submissions from the website, newest first.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search inquiries…"
            aria-label="Search inquiries"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            data-testid="search-input"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-40" data-testid="status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {inquires.length}{" "}
          {inquires.length === 1 ? "inquiry" : "inquiries"}
        </span>
      </div>

      <DataTable
        label="Inquiries"
        columns={columns}
        rows={filtered}
        getRowId={(i) => i._id}
        onRowClick={(i) => router.push(`/dashboard/inquires/${i._id}`)}
        defaultSort={{ key: "received", dir: "desc" }}
        empty={
          needle || statusFilter !== "all" ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Search className="h-8 w-8 opacity-50" />
              <p className="text-sm">No inquiries match your filters.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Search className="h-8 w-8 opacity-50" />
              <p className="text-sm">
                No inquiries yet. Submissions from the contact form will appear
                here.
              </p>
            </div>
          )
        }
        rowActions={(i) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                aria-label={`Actions for ${i.fullName}`}
                data-testid="row-actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/inquires/${i._id}`)}
              >
                <Eye /> View details
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Mark as</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  {(["new", "read", "replied"] as Status[]).map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onSelect={() => onStatus(i._id, s)}
                      data-testid={`status-${s}`}
                    >
                      <span className="capitalize">{s}</span>
                      {i.status === s && (
                        <span className="ml-auto text-xs text-primary">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() =>
                  setDeleteTarget({ id: i._id, name: i.fullName })
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
            <AlertDialogTitle>Delete inquiry from {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes this submission. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={onDelete}
              data-testid="confirm-delete"
            >
              Delete inquiry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

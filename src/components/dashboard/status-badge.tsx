import { cn } from "@/lib/utils";
import { ROLE_LABELS, type Role } from "@convex/roles";
import { CheckCircle2 } from "lucide-react";

export type InquiryStatus = "new" | "read" | "replied";

/** Channels an inquiry can be answered through, in menu order. */
export const INQUIRY_METHODS = [
  "email",
  "phone",
  "meeting",
  "chat",
  "other",
] as const;

export type InquiryMethod = (typeof INQUIRY_METHODS)[number];

export const INQUIRY_METHOD_LABELS: Record<InquiryMethod, string> = {
  email: "Email",
  phone: "Phone call",
  meeting: "Meeting",
  chat: "Chat / WhatsApp",
  other: "Other",
};

const STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800",
  read: "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-800",
  replied: "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800",
};

export function InquiryStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const key: InquiryStatus = status in STATUS_STYLES ? (status as InquiryStatus) : "new";
  return (
    <span
      data-testid="status-badge"
      data-status={key}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1",
        STATUS_STYLES[key],
        className,
      )}
    >
      {key}
    </span>
  );
}

/** Marks an inquiry as answered (from its latest answered comment). */
export function AnsweredBadge({
  method,
  className,
}: {
  method?: string | null;
  className?: string;
}) {
  const label =
    method && method in INQUIRY_METHOD_LABELS
      ? `Answered · ${INQUIRY_METHOD_LABELS[method as InquiryMethod]}`
      : "Answered";
  return (
    <span
      data-testid="answered-badge"
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-400",
        className,
      )}
    >
      <CheckCircle2 className="h-3 w-3" />
      {label}
    </span>
  );
}

export function RoleBadge({ role, className }: { role: Role | string; className?: string }) {
  return (
    <span
      data-testid="role-badge"
      className={cn(
        "inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-primary ring-1 ring-border",
        className,
      )}
    >
      {ROLE_LABELS[role as Role] ?? role}
    </span>
  );
}

export function UserStatusBadge({ pending }: { pending: boolean }) {
  return pending ? (
    <span
      data-testid="password-pending"
      className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-400"
    >
      Password pending
    </span>
  ) : (
    <span
      data-testid="user-active"
      className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-400"
    >
      Active
    </span>
  );
}

export function PublishedBadge({ published }: { published: boolean }) {
  return published ? (
    <span
      data-testid="published-badge"
      className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-500/30 dark:text-emerald-400"
    >
      Published
    </span>
  ) : (
    <span
      data-testid="draft-badge"
      className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground ring-1 ring-border"
    >
      Draft
    </span>
  );
}

export function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

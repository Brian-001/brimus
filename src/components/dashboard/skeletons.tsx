import { cn } from "@/lib/utils";

/** Loading skeletons for dashboard pages — shown while Convex queries resolve. */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-secondary", className)} />;
}

function SkelCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-card", className)}>
      {children}
    </div>
  );
}

function SkelRoot({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" data-testid="page-skeleton" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** Shared shape for the list pages: heading + toolbar + data table. */
function ListTableSkeleton({
  label,
  titleWidth,
  descWidth,
  action = false,
  select = false,
  avatar = false,
}: {
  label: string;
  titleWidth: string;
  descWidth: string;
  action?: boolean;
  select?: boolean;
  avatar?: boolean;
}) {
  return (
    <SkelRoot label={label} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className={cn("h-7", titleWidth)} />
          <Skeleton className={cn("h-4 max-w-full", descWidth)} />
        </div>
        {action && <Skeleton className="h-9 w-32" />}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-72 max-w-[calc(100%-1rem)]" />
        {select && <Skeleton className="h-10 w-40" />}
        <Skeleton className="h-4 w-24" />
      </div>

      <SkelCard className="overflow-hidden">
        <div className="flex h-11 items-center gap-6 border-b border-border bg-secondary/40 px-4">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="ml-auto h-3 w-10" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-border px-4 py-4 last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              {avatar && <Skeleton className="h-9 w-9 shrink-0 rounded-full" />}
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3 w-52 max-w-full" />
              </div>
            </div>
            <Skeleton className="h-5 w-24 shrink-0 rounded-full" />
            <Skeleton className="hidden h-4 w-24 md:block" />
            <Skeleton className="ml-auto h-8 w-8 shrink-0" />
          </div>
        ))}
      </SkelCard>
    </SkelRoot>
  );
}

export function OverviewSkeleton() {
  return (
    <SkelRoot label="Loading overview…" className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkelCard key={i} className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-3 w-36 max-w-full" />
          </SkelCard>
        ))}
      </div>
      <SkelCard>
        <div className="flex items-center justify-between p-6 pb-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="space-y-3 p-6 pt-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
            >
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </SkelCard>
    </SkelRoot>
  );
}

export function InquiriesSkeleton() {
  return (
    <ListTableSkeleton
      label="Loading inquiries…"
      titleWidth="w-32"
      descWidth="w-96"
      select
    />
  );
}

export function InsightsSkeleton() {
  return (
    <ListTableSkeleton
      label="Loading insights…"
      titleWidth="w-28"
      descWidth="w-96"
      action
    />
  );
}

export function UsersSkeleton() {
  return (
    <ListTableSkeleton
      label="Loading users…"
      titleWidth="w-24"
      descWidth="w-96"
      action
      avatar
    />
  );
}

export function ProfileSkeleton() {
  return (
    <SkelRoot label="Loading profile…" className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <SkelCard>
        <div className="p-6 pb-4">
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="space-y-6 p-6 pt-0">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="space-y-2 rounded-lg border border-border bg-background p-3"
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3.5 w-32 max-w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </SkelCard>

      <SkelCard>
        <div className="p-6 pb-4">
          <Skeleton className="h-5 w-44" />
        </div>
        <div className="space-y-4 p-6 pt-0">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-9 w-48" />
        </div>
      </SkelCard>
    </SkelRoot>
  );
}

export function InsightFormSkeleton() {
  return (
    <SkelRoot label="Loading article…" className="space-y-5">
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-96 w-full" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-3.5 w-64 max-w-full" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-3.5 w-14" />
      </div>
    </SkelRoot>
  );
}

export function UserDetailSkeleton() {
  return (
    <SkelRoot label="Loading user…" className="space-y-6">
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64 max-w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-28 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SkelCard className="space-y-4 p-6">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-9 w-32" />
          </SkelCard>
        </div>
        <div className="space-y-6">
          <SkelCard className="space-y-3 p-6">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-36" />
          </SkelCard>
          <SkelCard className="space-y-3 p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-36" />
          </SkelCard>
        </div>
      </div>
    </SkelRoot>
  );
}

export function InquiryDetailSkeleton() {
  return (
    <SkelRoot label="Loading inquiry…" className="space-y-6">
      <Skeleton className="h-4 w-36" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SkelCard className="space-y-4 p-6">
            <Skeleton className="h-5 w-44" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="space-y-2 rounded-lg border border-border bg-background p-3"
                >
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3.5 w-36 max-w-full" />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </SkelCard>
          <SkelCard className="space-y-3 p-6">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-32 w-full" />
          </SkelCard>
          <SkelCard className="space-y-4 p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-24 w-full" />
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-28" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </SkelCard>
        </div>
        <div className="space-y-6">
          <SkelCard className="space-y-4 p-6">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-28" />
            </div>
            <Skeleton className="h-3 w-56 max-w-full" />
          </SkelCard>
          <SkelCard className="space-y-3 p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-9 w-36" />
          </SkelCard>
        </div>
      </div>
    </SkelRoot>
  );
}

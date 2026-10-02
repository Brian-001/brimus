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
    <SkelRoot label="Loading inquiries…" className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkelCard key={i}>
            <div className="flex items-start justify-between gap-3 p-6 pb-4">
              <div className="min-w-0 space-y-1.5">
                <Skeleton className="h-5 w-40 max-w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-4 p-6 pt-0">
              <div className="flex flex-wrap gap-5">
                <Skeleton className="h-3.5 w-56" />
                <Skeleton className="h-3.5 w-40" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-16 w-full rounded-lg" />
              <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </SkelCard>
        ))}
      </div>
    </SkelRoot>
  );
}

export function InsightsSkeleton() {
  return (
    <SkelRoot label="Loading insights…" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkelCard key={i}>
            <div className="flex items-center justify-between gap-3 p-6 pb-4">
              <div className="min-w-0 space-y-1.5">
                <Skeleton className="h-4 w-64 max-w-full" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border p-6 pt-4">
              <Skeleton className="h-3.5 w-1/2 max-w-full" />
              <div className="flex shrink-0 gap-1">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-18" />
              </div>
            </div>
          </SkelCard>
        ))}
      </div>
    </SkelRoot>
  );
}

export function UsersSkeleton() {
  return (
    <SkelRoot label="Loading users…" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkelCard key={i}>
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="min-w-0 space-y-1.5">
                <Skeleton className="h-3.5 w-40 max-w-full" />
                <Skeleton className="h-3 w-64 max-w-full" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </SkelCard>
        ))}
      </div>
    </SkelRoot>
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

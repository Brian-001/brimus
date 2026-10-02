/**
 * Shown inside the dashboard content column while a route's payload loads.
 * The shell (sidebar + header) is a parent layout and stays untouched.
 */
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading page">
      <div className="space-y-2">
        <div className="h-7 w-44 rounded-lg bg-secondary" />
        <div className="h-4 w-72 rounded bg-secondary" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-card" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-32 rounded-xl border border-border bg-card" />
        <div className="h-32 rounded-xl border border-border bg-card" />
      </div>
    </div>
  );
}

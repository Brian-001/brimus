"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/lib/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileText, Inbox, Users } from "lucide-react";

function StatCard({
  title,
  value,
  detail,
  href,
  icon: Icon,
}: {
  title: string;
  value: string;
  detail: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link href={href}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800",
  read: "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-800",
  replied: "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800",
};

export default function DashboardOverviewPage() {
  const { token, ready } = useAuth();
  const authed = ready && token ? { token } : "skip";

  const me = useQuery(api.users.me, authed);
  const inquires = useQuery(api.inquires.list, authed);
  const insights = useQuery(api.insights.listAll, authed);
  const users = useQuery(api.users.list, authed);

  if (!ready || !me || !inquires || !insights || !users) {
    return <p className="text-sm text-muted-foreground">Loading overview…</p>;
  }

  const newCount = inquires.filter((i) => i.status === "new").length;
  const published = insights.filter((i) => i.published).length;
  const drafts = insights.length - published;
  const recent = inquires.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {me.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across Brimus right now.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="New inquiries"
          value={String(newCount)}
          detail="Awaiting your first look"
          href="/dashboard/inquires"
          icon={AlertCircle}
        />
        <StatCard
          title="Total inquiries"
          value={String(inquires.length)}
          detail="All time contact form submissions"
          href="/dashboard/inquires"
          icon={Inbox}
        />
        <StatCard
          title="Insights"
          value={String(insights.length)}
          detail={`${published} published · ${drafts} draft${drafts === 1 ? "" : "s"}`}
          href="/dashboard/insights"
          icon={FileText}
        />
        <StatCard
          title="Team members"
          value={String(users.length)}
          detail="Dashboard accounts"
          href="/dashboard/users"
          icon={Users}
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Recent inquiries</CardTitle>
          <Link
            href="/dashboard/inquires"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No inquiries yet. Submissions from the contact form will appear
              here.
            </p>
          ) : (
            recent.map((inquiry) => (
              <div
                key={inquiry._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {inquiry.fullName}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {inquiry.email}
                    </span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {inquiry.services.join(", ")} ·{" "}
                    {new Date(inquiry.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ${STATUS_STYLES[inquiry.status] ?? STATUS_STYLES.new}`}
                >
                  {inquiry.status}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

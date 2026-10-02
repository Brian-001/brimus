"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/lib/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, Trash2 } from "lucide-react";

type Status = "new" | "read" | "replied";

const STATUS_STYLES: Record<Status, string> = {
  new: "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800",
  read: "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:ring-sky-800",
  replied: "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800",
};

export default function InquiresPage() {
  const { token, ready } = useAuth();
  const authed = ready && token ? { token } : "skip";
  const inquires = useQuery(api.inquires.list, authed);
  const setStatus = useMutation(api.inquires.setStatus);
  const remove = useMutation(api.inquires.remove);

  if (!inquires) {
    return <p className="text-sm text-muted-foreground">Loading inquiries…</p>;
  }

  const onDelete = async (id: (typeof inquires)[number]["_id"]) => {
    if (!confirm("Delete this inquiry? This cannot be undone.")) return;
    try {
      await remove({ token: token!, id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const onStatus = async (
    id: (typeof inquires)[number]["_id"],
    status: Status,
  ) => {
    try {
      await setStatus({ token: token!, id, status });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact form submissions from the website, newest first.
        </p>
      </div>

      {inquires.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No inquiries yet. Submissions from the contact form will appear
            here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquires.map((inquiry) => (
            <Card key={inquiry._id}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div className="min-w-0">
                  <CardTitle className="text-lg">{inquiry.fullName}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(inquiry.submittedAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ${STATUS_STYLES[inquiry.status]}`}
                >
                  {inquiry.status}
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5" /> {inquiry.email}
                  </a>
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="inline-flex items-center gap-1.5 hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5" /> {inquiry.phone}
                  </a>
                  {inquiry.company && <span>· {inquiry.company}</span>}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {inquiry.services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground ring-1 ring-border"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <p className="whitespace-pre-wrap rounded-lg bg-secondary/50 px-3 py-2.5 text-sm text-foreground">
                  {inquiry.message}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Status:
                    </span>
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) =>
                        onStatus(inquiry._id, value as Status)
                      }
                    >
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(inquiry._id)}
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

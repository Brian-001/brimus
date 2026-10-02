"use client";

import { use, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useAuth } from "@/lib/use-auth";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/ui/submit-button";
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
  AnsweredBadge,
  INQUIRY_METHODS,
  INQUIRY_METHOD_LABELS,
  InquiryStatusBadge,
  initialsOf,
  type InquiryMethod,
} from "@/components/dashboard/status-badge";
import { canManageUsers } from "@convex/roles";
import { InquiryDetailSkeleton } from "@/components/dashboard/skeletons";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Mail,
  Phone,
  Send,
  Trash2,
} from "lucide-react";

type Status = "new" | "read" | "replied";

const STATUSES: Status[] = ["new", "read", "replied"];

export default function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { token, ready } = useAuth();
  const inquiry = useQuery(
    api.inquires.getById,
    ready && token ? { token, id: id as Id<"inquires"> } : "skip",
  );
  const setStatus = useMutation(api.inquires.setStatus);
  const remove = useMutation(api.inquires.remove);
  const me = useQuery(api.users.me, ready && token ? { token } : "skip");
  const createComment = useMutation(api.inquiryComments.create);
  const removeComment = useMutation(api.inquiryComments.remove);
  const comments = useQuery(
    api.inquiryComments.list,
    ready && token && inquiry ? { token, inquiryId: inquiry._id } : "skip",
  );

  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [answered, setAnswered] = useState(false);
  const [method, setMethod] = useState<InquiryMethod>("email");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<
    Id<"inquiry_comments"> | null
  >(null);
  const [deleteCommentError, setDeleteCommentError] = useState<string | null>(
    null,
  );

  if (inquiry === undefined) {
    return <InquiryDetailSkeleton />;
  }

  if (inquiry === null) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Mail className="h-10 w-10 text-muted-foreground opacity-50" />
        <div>
          <h1 className="text-xl font-bold text-foreground">Inquiry not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This submission may have been deleted.
          </p>
        </div>
        <Link
          href="/dashboard/inquires"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ArrowLeft className="h-4 w-4" /> Back to inquiries
        </Link>
      </div>
    );
  }

  const lastAnswered =
    comments?.filter((c) => c.answered).at(-1) ?? null;

  const onStatus = async (status: Status) => {
    try {
      await setStatus({ token: token!, id: inquiry._id, status });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const onDelete = async () => {
    setDeleteError(null);
    try {
      await remove({ token: token!, id: inquiry._id });
      router.push("/dashboard/inquires");
    } catch (err) {
      setDeleteError(
        err instanceof Error && err.message ? err.message : "Failed to delete",
      );
      setShowDelete(false);
    }
  };

  const onPost = async (e: FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (text.length < 2 || posting) return;
    setPosting(true);
    setPostError(null);
    try {
      await createComment({
        token: token!,
        inquiryId: inquiry._id,
        body: text,
        answered,
        ...(answered ? { method } : {}),
      });
      setBody("");
      setAnswered(false);
      setMethod("email");
    } catch (err) {
      setPostError(
        err instanceof Error && err.message
          ? err.message
          : "Failed to post comment",
      );
    } finally {
      setPosting(false);
    }
  };

  const onDeleteComment = async () => {
    if (!deleteCommentId) return;
    setDeleteCommentError(null);
    try {
      await removeComment({ token: token!, commentId: deleteCommentId });
    } catch (err) {
      setDeleteCommentError(
        err instanceof Error && err.message
          ? err.message
          : "Failed to delete comment",
      );
    }
    setDeleteCommentId(null);
  };

  const canDeleteComment = (authorId: string) =>
    !!me && (me._id === authorId || canManageUsers(me.role));

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/inquires"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to inquiries
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              {inquiry.fullName}
            </h1>
            <InquiryStatusBadge status={inquiry.status} />
            {lastAnswered && <AnsweredBadge method={lastAnswered.method} />}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(inquiry.submittedAt).toLocaleString(undefined, {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>
        <a
          href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
            `Re: your Brimus inquiry`,
          )}`}
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
        >
          <Mail className="h-4 w-4" /> Reply via email
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-3">
                  <dt className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </dt>
                  <dd className="mt-1 truncate text-sm">
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="text-primary hover:underline"
                    >
                      {inquiry.email}
                    </a>
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <dt className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> Phone
                  </dt>
                  <dd className="mt-1 text-sm">
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="text-primary hover:underline"
                    >
                      {inquiry.phone}
                    </a>
                  </dd>
                </div>
                {inquiry.company && (
                  <div className="rounded-lg border border-border bg-background p-3 sm:col-span-2">
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" /> Company
                    </dt>
                    <dd className="mt-1 text-sm text-foreground">
                      {inquiry.company}
                    </dd>
                  </div>
                )}
              </dl>

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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap rounded-lg bg-secondary/50 px-4 py-3.5 text-sm leading-relaxed text-foreground">
                {inquiry.message}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg">Comments</CardTitle>
              {lastAnswered && <AnsweredBadge method={lastAnswered.method} />}
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={onPost} className="space-y-3">
                <Textarea
                  label="Add a comment"
                  placeholder="How did you handle this inquiry?"
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  data-testid="comment-body"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Checkbox
                    label="This inquiry was answered"
                    checked={answered}
                    onChange={(e) => setAnswered(e.target.checked)}
                    data-testid="comment-answered"
                  />
                  {answered && (
                    <Select
                      value={method}
                      onValueChange={(v) => setMethod(v as InquiryMethod)}
                    >
                      <SelectTrigger
                        className="h-9 w-56"
                        data-testid="comment-method-trigger"
                        aria-label="How was it answered"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INQUIRY_METHODS.map((m) => (
                          <SelectItem
                            key={m}
                            value={m}
                            data-testid={`comment-method-${m}`}
                          >
                            {INQUIRY_METHOD_LABELS[m]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Comments record whether and how the inquiry was answered.
                </p>
                {postError && (
                  <p className="text-sm text-destructive" data-testid="post-error">
                    {postError}
                  </p>
                )}
                <div className="flex justify-end">
                  <SubmitButton
                    className="px-4 py-2"
                    loading={posting}
                    loadingText="Posting…"
                    disabled={body.trim().length < 2 || posting}
                    data-testid="post-comment"
                  >
                    <Send className="h-4 w-4" /> Post comment
                  </SubmitButton>
                </div>
              </form>

              <Separator />

              <div className="space-y-3">
                {comments === undefined ? (
                  <p className="animate-pulse text-sm text-muted-foreground">
                    Loading comments…
                  </p>
                ) : !comments || comments.length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid="comments-empty"
                  >
                    No comments yet. Add the first note about this inquiry.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c._id}
                      data-testid="comment-item"
                      data-answered={c.answered ? "true" : "false"}
                      className="space-y-2 rounded-xl border border-border bg-background p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {initialsOf(c.authorName)}
                          </span>
                          <div className="min-w-0">
                            <p
                              className="truncate text-sm font-semibold text-foreground"
                              data-testid="comment-author"
                            >
                              {c.authorName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {c.authorEmail} ·{" "}
                              {new Date(c.createdAt).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {c.answered && <AnsweredBadge method={c.method} />}
                          {canDeleteComment(c.userId) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              aria-label="Delete comment"
                              onClick={() => {
                                setDeleteCommentError(null);
                                setDeleteCommentId(c._id);
                              }}
                              data-testid="delete-comment"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p
                        className="whitespace-pre-wrap text-sm leading-relaxed text-foreground"
                        data-testid="comment-text"
                      >
                        {c.body}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={inquiry.status}
                onValueChange={(v) => onStatus(v as Status)}
                className="flex flex-wrap gap-2"
                aria-label="Inquiry status"
              >
                {STATUSES.map((s) => (
                  <label
                    key={s}
                    data-testid={`status-option-${s}`}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium capitalize text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground",
                      "has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:text-primary",
                    )}
                  >
                    <RadioGroupItem value={s} className="sr-only" />
                    {s}
                  </label>
                ))}
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                Updates save immediately and apply across the dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">
                Danger zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Permanently delete this inquiry submission.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDeleteError(null);
                  setShowDelete(true);
                }}
                data-testid="delete-inquiry"
              >
                <Trash2 className="h-4 w-4" /> Delete inquiry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete inquiry from {inquiry.fullName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes this submission. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}
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

      <AlertDialog
        open={deleteCommentId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCommentId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the comment and its answer record. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteCommentError && (
            <p className="text-sm text-destructive">{deleteCommentError}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={onDeleteComment}
              data-testid="confirm-delete-comment"
            >
              Delete comment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

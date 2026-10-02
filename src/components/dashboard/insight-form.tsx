"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useAuth } from "@/lib/use-auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "@/components/ui/submit-button";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Fields {
  title: string;
  slug: string;
  description: string;
  date: string;
  readingTime: string;
  content: string;
  published: boolean;
}

function InsightFields({
  initial,
  slugEditable,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: Fields;
  slugEditable: boolean;
  submitLabel: string;
  onSubmit: (fields: Fields) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!slugEditable);
  const [description, setDescription] = useState(initial.description);
  const [date, setDate] = useState(initial.date);
  const [readingTime, setReadingTime] = useState(initial.readingTime);
  const [content, setContent] = useState(initial.content);
  const [published, setPublished] = useState(initial.published);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const validate = (): Fields | null => {
    const next: Record<string, string> = {};
    if (title.trim().length < 3 || title.length > 200)
      next.title = "Title must be 3-200 characters";
    if (!SLUG_RE.test(slug))
      next.slug = "Slug must be lowercase letters, numbers and hyphens";
    if (description.trim().length < 10 || description.length > 500)
      next.description = "Description must be 10-500 characters";
    if (!DATE_RE.test(date)) next.date = "Date must be YYYY-MM-DD";
    if (!readingTime.trim() || readingTime.length > 50)
      next.readingTime = "Reading time is required (max 50 characters)";
    if (content.trim().length < 10) next.content = "Content is required";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setError("Please fix the highlighted fields.");
      return null;
    }
    setError(null);
    return {
      title: title.trim(),
      slug,
      description: description.trim(),
      date,
      readingTime: readingTime.trim(),
      content,
      published,
    };
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fields = validate();
    if (!fields) return;
    setBusy(true);
    try {
      await onSubmit(fields);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <Input
        label="Title"
        placeholder="Article title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        error={errors.title}
      />
      <Input
        label="Slug"
        placeholder="article-url-slug"
        value={slug}
        onChange={(e) => {
          setSlugTouched(true);
          setSlug(e.target.value.toLowerCase());
        }}
        error={errors.slug}
        disabled={!slugEditable}
        className="font-mono text-xs"
      />
      {!slugEditable && (
        <p className="-mt-3 text-xs text-muted-foreground">
          The slug is locked so existing URLs keep working.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
        <Input
          label="Reading time"
          placeholder="5 min read"
          value={readingTime}
          onChange={(e) => setReadingTime(e.target.value)}
          error={errors.readingTime}
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Short summary used on listing cards and meta description"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />

      <Textarea
        label="Content (Markdown)"
        placeholder="# Heading&#10;&#10;Write your article in Markdown…"
        rows={16}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={errors.content}
        className="font-mono text-xs leading-relaxed"
      />

      <Checkbox
        label="Published (visible on the public Insights page)"
        checked={published}
        onChange={(e) => setPublished(e.target.checked)}
      />

      {error && (
        <p className="rounded-lg border border-red-300/40 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton loading={busy} loadingText="Saving…">
          {submitLabel}
        </SubmitButton>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function InsightForm({ id }: { id?: Id<"insights"> }) {
  const router = useRouter();
  const { token, ready } = useAuth();
  const create = useMutation(api.insights.create);
  const update = useMutation(api.insights.update);
  const post = useQuery(
    api.insights.getById,
    ready && token && id ? { token, id } : "skip",
  );

  if (id && (!ready || post === undefined)) {
    return <p className="text-sm text-muted-foreground">Loading article…</p>;
  }
  if (id && post === null) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Article not found — it may have been deleted.
        </p>
        <Link
          href="/dashboard/insights"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to insights
        </Link>
      </div>
    );
  }

  const editing = !!post;
  const initial: Fields = post
    ? {
        title: post.title,
        slug: post.slug,
        description: post.description,
        date: post.date,
        readingTime: post.readingTime,
        content: post.content,
        published: post.published,
      }
    : {
        title: "",
        slug: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        readingTime: "5 min read",
        content: "",
        published: false,
      };

  const onSubmit = async (fields: Fields) => {
    if (editing && post) {
      await update({
        token: token!,
        id: post._id,
        title: fields.title,
        description: fields.description,
        date: fields.date,
        readingTime: fields.readingTime,
        content: fields.content,
        published: fields.published,
      });
    } else {
      await create({ token: token!, ...fields });
    }
    router.push("/dashboard/insights");
  };

  return (
    <InsightFields
      key={editing ? post!._id : "new"}
      initial={initial}
      slugEditable={!editing}
      submitLabel={editing ? "Save Changes" : "Create Insight"}
      onSubmit={onSubmit}
      onCancel={() => router.push("/dashboard/insights")}
    />
  );
}

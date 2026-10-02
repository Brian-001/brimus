import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserBySession, requireActiveUser } from "./auth";
import { seedInsights } from "./seedData";

/** Public: published insight metadata (no body), newest first. */
export const list = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("insights")
      .withIndex("by_published_date", (q) => q.eq("published", true))
      .order("desc")
      .collect();

    return posts.map((post) => ({
      _id: post._id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      readingTime: post.readingTime,
      published: post.published,
    }));
  },
});

/** Public: full article by slug; null for unknown or unpublished. */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("insights")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!post || !post.published) return null;
    return post;
  },
});

/** Authenticated: every insight incl. drafts, newest first. */
export const listAll = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const user = await getUserBySession(ctx, token);
    if (!user) return null;
    const posts = await ctx.db.query("insights").order("desc").collect();
    return posts;
  },
});

/** Authenticated: full document for the edit form; null when not found. */
export const getById = query({
  args: { token: v.string(), id: v.id("insights") },
  handler: async (ctx, { token, id }) => {
    const user = await getUserBySession(ctx, token);
    if (!user) return null;
    return await ctx.db.get(id);
  },
});

/** Public but idempotent: seeds the starter articles only when the table is empty. */
export const seed = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("insights").take(1);
    if (existing.length > 0) return { seeded: 0 };

    for (const post of seedInsights) {
      await ctx.db.insert("insights", { ...post, published: true });
    }
    return { seeded: seedInsights.length };
  },
});

function validatePost(args: {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  content: string;
}) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.slug)) {
    throw new Error("Slug must be lowercase letters, numbers and hyphens");
  }
  if (args.title.trim().length < 3 || args.title.length > 200) {
    throw new Error("Title must be 3-200 characters");
  }
  if (args.description.trim().length < 10 || args.description.length > 500) {
    throw new Error("Description must be 10-500 characters");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
    throw new Error("Date must be YYYY-MM-DD");
  }
  if (args.readingTime.trim().length === 0 || args.readingTime.length > 50) {
    throw new Error("Reading time is required (max 50 characters)");
  }
  if (args.content.trim().length < 10) {
    throw new Error("Content is required");
  }
}

/** Authenticated: create an insight. */
export const create = mutation({
  args: {
    token: v.string(),
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    date: v.string(),
    readingTime: v.string(),
    content: v.string(),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireActiveUser(ctx, args.token);
    validatePost(args);

    const clash = await ctx.db
      .query("insights")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (clash) throw new Error(`Insight already exists: ${args.slug}`);

    return await ctx.db.insert("insights", {
      slug: args.slug,
      title: args.title.trim(),
      description: args.description.trim(),
      date: args.date,
      readingTime: args.readingTime.trim(),
      content: args.content,
      published: args.published,
    });
  },
});

/** Authenticated: update an insight (slug immutable to keep URLs stable). */
export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("insights"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
    readingTime: v.optional(v.string()),
    content: v.optional(v.string()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireActiveUser(ctx, args.token);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Insight not found");

    const merged = {
      slug: existing.slug,
      title: args.title ?? existing.title,
      description: args.description ?? existing.description,
      date: args.date ?? existing.date,
      readingTime: args.readingTime ?? existing.readingTime,
      content: args.content ?? existing.content,
    };
    validatePost(merged);

    await ctx.db.patch(args.id, {
      ...(args.title !== undefined ? { title: args.title.trim() } : {}),
      ...(args.description !== undefined ? { description: args.description.trim() } : {}),
      ...(args.date !== undefined ? { date: args.date } : {}),
      ...(args.readingTime !== undefined ? { readingTime: args.readingTime.trim() } : {}),
      ...(args.content !== undefined ? { content: args.content } : {}),
      ...(args.published !== undefined ? { published: args.published } : {}),
    });
  },
});

/** Authenticated: delete an insight. */
export const remove = mutation({
  args: { token: v.string(), id: v.id("insights") },
  handler: async (ctx, { token, id }) => {
    await requireActiveUser(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Insight not found");
    await ctx.db.delete(id);
  },
});

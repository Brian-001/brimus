import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /** Contact form submissions. */
  inquires: defineTable({
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    company: v.optional(v.string()),
    services: v.array(v.string()),
    message: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("read"),
      v.literal("replied"),
    ),
    submittedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status", "submittedAt"]),

  /** Insight articles (markdown bodies). */
  insights: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    /** ISO date, YYYY-MM-DD. */
    date: v.string(),
    readingTime: v.string(),
    content: v.string(),
    published: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_published_date", ["published", "date"]),

  /** Dashboard accounts. */
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("founder"),
      v.literal("cofounder"),
      v.literal("engineer"),
      v.literal("admin"),
    ),
    image: v.optional(v.string()),
    createdAt: v.number(),
    /** PBKDF2-SHA256 hash (hex) — computed client-side, never the raw password. */
    passwordHash: v.string(),
    /** Per-user random salt (hex). */
    passwordSalt: v.string(),
    /**
     * When true the user must set a new password before any other dashboard
     * action is allowed (first login with an issued password).
     */
    mustChangePassword: v.optional(v.boolean()),
    /** Single active session token (hex); cleared on logout. */
    sessionToken: v.optional(v.string()),
    sessionExpiresAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_sessionToken", ["sessionToken"]),
});

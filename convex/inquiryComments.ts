import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserBySession, requireActiveUser } from "./auth";
import { canManageUsers } from "./roles";

const METHOD = v.union(
  v.literal("email"),
  v.literal("phone"),
  v.literal("meeting"),
  v.literal("chat"),
  v.literal("other"),
);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

/** Authenticated: comments on an inquiry, oldest first. Null when not signed in or the inquiry is gone. */
export const list = query({
  args: { token: v.string(), inquiryId: v.id("inquires") },
  handler: async (ctx, { token, inquiryId }) => {
    const user = await getUserBySession(ctx, token);
    if (!user) return null;
    const inquiry = await ctx.db.get(inquiryId);
    if (!inquiry) return null;
    return await ctx.db
      .query("inquiry_comments")
      .withIndex("by_inquiry", (q) => q.eq("inquiryId", inquiryId))
      .order("asc")
      .collect();
  },
});

/** Authenticated: post a comment; an answered comment also marks the inquiry as replied. */
export const create = mutation({
  args: {
    token: v.string(),
    inquiryId: v.id("inquires"),
    body: v.string(),
    answered: v.boolean(),
    method: v.optional(METHOD),
  },
  handler: async (ctx, args) => {
    const actor = await requireActiveUser(ctx, args.token);
    const inquiry = await ctx.db.get(args.inquiryId);
    assert(inquiry, "Inquiry not found");

    const body = args.body.trim();
    assert(body.length >= 2 && body.length <= 2000, "Comment must be 2-2000 characters");
    if (args.answered) {
      assert(args.method, "How was the inquiry answered?");
    }

    const id = await ctx.db.insert("inquiry_comments", {
      inquiryId: args.inquiryId,
      userId: actor._id,
      authorName: actor.name,
      authorEmail: actor.email,
      body,
      answered: args.answered,
      ...(args.answered ? { method: args.method! } : {}),
      createdAt: Date.now(),
    });

    if (args.answered && inquiry.status !== "replied") {
      await ctx.db.patch(args.inquiryId, { status: "replied" });
    }
    return id;
  },
});

/** Authenticated: delete a comment (its author or a manager only). */
export const remove = mutation({
  args: { token: v.string(), commentId: v.id("inquiry_comments") },
  handler: async (ctx, { token, commentId }) => {
    const actor = await requireActiveUser(ctx, token);
    const comment = await ctx.db.get(commentId);
    assert(comment, "Comment not found");
    assert(
      comment.userId === actor._id || canManageUsers(actor.role),
      "Only the comment author or a manager can delete this comment",
    );
    await ctx.db.delete(commentId);
  },
});

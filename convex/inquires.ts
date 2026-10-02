import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserBySession, requireActiveUser } from "./auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

/** Public: called by the contact form. Validates like the client-side zod schema. */
export const create = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    company: v.optional(v.string()),
    services: v.array(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const fullName = args.fullName.trim();
    const email = args.email.trim().toLowerCase();
    const phone = args.phone.trim();
    const company = args.company?.trim();
    const message = args.message.trim();
    const services = args.services.map((s) => s.trim()).filter(Boolean);

    assert(fullName.length >= 2 && fullName.length <= 100, "Full name must be 2-100 characters");
    assert(EMAIL_RE.test(email), "Please enter a valid email address");
    assert(phone.length >= 8 && phone.length <= 20, "Phone number must be 8-20 characters");
    assert(company === undefined || company.length <= 200, "Company name must not exceed 200 characters");
    assert(services.length >= 1, "Please select at least one service of interest");
    assert(services.length <= 20 && services.every((s) => s.length <= 100), "Invalid services selection");
    assert(message.length >= 10 && message.length <= 2000, "Message must be 10-2000 characters");

    return await ctx.db.insert("inquires", {
      fullName,
      email,
      phone,
      ...(company ? { company } : {}),
      services,
      message,
      status: "new",
      submittedAt: Date.now(),
    });
  },
});

/** Authenticated: all inquiries, newest first, each annotated with answer info from its comments. Null when not signed in. */
export const list = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const user = await getUserBySession(ctx, token);
    if (!user) return null;
    const inquires = await ctx.db.query("inquires").order("desc").collect();
    const comments = await ctx.db.query("inquiry_comments").collect();

    const byInquiry = new Map<string, typeof comments>();
    for (const c of comments) {
      const arr = byInquiry.get(c.inquiryId);
      if (arr) arr.push(c);
      else byInquiry.set(c.inquiryId, [c]);
    }

    return inquires.map((inquiry) => {
      const cs = byInquiry.get(inquiry._id);
      let answered = false;
      let answeredAt: number | undefined;
      let answeredBy: string | undefined;
      let method: string | undefined;
      for (const c of cs ? [...cs].sort((a, b) => a.createdAt - b.createdAt) : []) {
        if (c.answered) {
          answered = true;
          answeredAt = c.createdAt;
          answeredBy = c.authorName;
          method = c.method;
        }
      }
      return { ...inquiry, answered, answeredAt, answeredBy, method };
    });
  },
});

/** Authenticated: a single inquiry by id (detail page), or null when not found. */
export const getById = query({
  args: { token: v.string(), id: v.id("inquires") },
  handler: async (ctx, { token, id }) => {
    const user = await getUserBySession(ctx, token);
    if (!user) return null;
    return await ctx.db.get(id);
  },
});

/** Authenticated: change an inquiry's status. */
export const setStatus = mutation({
  args: {
    token: v.string(),
    id: v.id("inquires"),
    status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
  },
  handler: async (ctx, { token, id, status }) => {
    await requireActiveUser(ctx, token);
    const existing = await ctx.db.get(id);
    assert(existing, "Inquiry not found");
    await ctx.db.patch(id, { status });
  },
});

/** Authenticated: delete an inquiry. */
export const remove = mutation({
  args: { token: v.string(), id: v.id("inquires") },
  handler: async (ctx, { token, id }) => {
    await requireActiveUser(ctx, token);
    const existing = await ctx.db.get(id);
    assert(existing, "Inquiry not found");
    await ctx.db.delete(id);
  },
});

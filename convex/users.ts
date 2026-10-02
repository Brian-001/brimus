import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  publicUser,
  randomToken,
  requireUser,
  requireActiveUser,
  getUserBySession,
  SESSION_DURATION_MS,
} from "./auth";
import { canManageUsers, ROLES, type Role } from "./roles";

const HEX64 = /^[0-9a-f]{64}$/;
const HEX32 = /^[0-9a-f]{32}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_VALUES = ROLES as readonly string[];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function newSession() {
  return { sessionToken: randomToken(), sessionExpiresAt: Date.now() + SESSION_DURATION_MS };
}

/** Public: whether any account exists yet (drives the setup-vs-login screen). */
export const count = query({
  handler: async (ctx) => {
    const rows = await ctx.db.query("users").take(1);
    return rows.length;
  },
});

/**
 * Public: the stored password salt for an email, so the client can derive the
 * same PBKDF2 hash at login. Salts are not secret. Unknown emails get a
 * dummy salt so responses don't reveal which accounts exist.
 */
export const getSalt = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .unique();
    return {
      passwordSalt: user
        ? user.passwordSalt
        : "00000000000000000000000000000000",
    };
  },
});

/** Public: bootstrap the very first account — only works while the table is empty. */
export const setup = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    passwordSalt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("users").take(1);
    assert(existing.length === 0, "Setup already completed — please sign in");

    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    assert(name.length >= 2 && name.length <= 100, "Name must be 2-100 characters");
    assert(EMAIL_RE.test(email), "Please enter a valid email address");
    assert(HEX64.test(args.passwordHash), "Invalid password hash");
    assert(HEX32.test(args.passwordSalt), "Invalid password salt");

    const session = newSession();
    const _id = await ctx.db.insert("users", {
      name,
      email,
      role: "founder",
      createdAt: Date.now(),
      passwordHash: args.passwordHash,
      passwordSalt: args.passwordSalt,
      ...session,
    });
    return { token: session.sessionToken, userId: _id };
  },
});

/** Public: verify credentials (client sends PBKDF2 hash, never the password). */
export const login = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user || user.passwordHash !== args.passwordHash) {
      throw new Error("Invalid email or password");
    }

    const session = newSession();
    await ctx.db.patch(user._id, session);
    return { token: session.sessionToken, user: publicUser(user) };
  },
});

/** Public: clear the session for a token (idempotent). */
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const user = await getUserBySession(ctx, token);
    if (user) {
      await ctx.db.patch(user._id, {
        sessionToken: undefined,
        sessionExpiresAt: undefined,
      });
    }
  },
});

/** Public: current user for a session token, or null (never throws). */
export const me = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const user = await getUserBySession(ctx, token);
    return user ? publicUser(user) : null;
  },
});

/** Authenticated: all users (sanitized), newest first. */
export const list = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const user = await getUserBySession(ctx, token);
    if (!user) return null;
    const users = await ctx.db.query("users").order("desc").collect();
    return users.map(publicUser);
  },
});

/** Authenticated: create an account with an initial password (managers only). */
export const create = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("founder"),
      v.literal("cofounder"),
      v.literal("engineer"),
      v.literal("admin"),
    ),
    passwordHash: v.string(),
    passwordSalt: v.string(),
  },
  handler: async (ctx, args) => {
    const actor = await requireActiveUser(ctx, args.token);
    assert(canManageUsers(actor.role), "Only founders and co-founders can manage users");
    assert(ROLE_VALUES.includes(args.role), "Invalid role");

    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    assert(name.length >= 2 && name.length <= 100, "Name must be 2-100 characters");
    assert(EMAIL_RE.test(email), "Please enter a valid email address");
    assert(HEX64.test(args.passwordHash), "Invalid password hash");
    assert(HEX32.test(args.passwordSalt), "Invalid password salt");

    const clash = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    assert(!clash, "A user with this email already exists");

    return await ctx.db.insert("users", {
      name,
      email,
      role: args.role,
      createdAt: Date.now(),
      passwordHash: args.passwordHash,
      passwordSalt: args.passwordSalt,
      // Issued accounts must choose their own password on first login.
      mustChangePassword: true,
    });
  },
});

/**
 * Authenticated: edit a profile (name), assign roles, or change a password.
 *
 * - Anyone may edit their own name; role changes always require manage rights,
 *   so users can never promote themselves.
 * - A user changing their own password must send the current password hash
 *   (users flagged with `mustChangePassword` are exempt — they just proved
 *   it by signing in).
 * - A user who must change their password may only change that password
 *   (which clears the flag).
 * - Managers (founder/co-founder) may edit anyone; a manager changing someone
 *   else's password forces that user to change it on their next login.
 */
export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("users"),
    name: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("founder"),
        v.literal("cofounder"),
        v.literal("engineer"),
        v.literal("admin"),
      ),
    ),
    passwordHash: v.optional(v.string()),
    passwordSalt: v.optional(v.string()),
    currentPasswordHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requireUser(ctx, args.token);
    const target = await ctx.db.get(args.id);
    assert(target, "User not found");

    const isSelf = actor._id === args.id;
    const changingPassword =
      args.passwordHash !== undefined && args.passwordSalt !== undefined;
    const profileEdits = args.name !== undefined || args.role !== undefined;
    const passwordOnlySelf = isSelf && changingPassword && !profileEdits;

    if (actor.mustChangePassword) {
      assert(passwordOnlySelf, "Password change required");
    } else if (!isSelf) {
      assert(canManageUsers(actor.role), "Only founders and co-founders can manage users");
    } else if (args.role !== undefined) {
      assert(canManageUsers(actor.role), "Only founders and co-founders can manage users");
    }
    if (args.role !== undefined) assert(ROLE_VALUES.includes(args.role), "Invalid role");
    if (args.currentPasswordHash !== undefined) {
      assert(HEX64.test(args.currentPasswordHash), "Invalid password hash");
    }
    if (changingPassword && isSelf && !actor.mustChangePassword) {
      assert(args.currentPasswordHash !== undefined, "Current password is required");
      assert(args.currentPasswordHash === target.passwordHash, "Current password is incorrect");
    }

    const patch: {
      name?: string;
      role?: Role;
      passwordHash?: string;
      passwordSalt?: string;
      mustChangePassword?: boolean;
      sessionToken?: undefined;
      sessionExpiresAt?: undefined;
    } = {};

    if (args.name !== undefined) {
      const name = args.name.trim();
      assert(name.length >= 2 && name.length <= 100, "Name must be 2-100 characters");
      patch.name = name;
    }
    if (args.role !== undefined) patch.role = args.role;
    if (changingPassword) {
      assert(HEX64.test(args.passwordHash!), "Invalid password hash");
      assert(HEX32.test(args.passwordSalt!), "Invalid password salt");
      assert(
        args.passwordHash !== target.passwordHash,
        "New password must be different from the current one",
      );
      patch.passwordHash = args.passwordHash;
      patch.passwordSalt = args.passwordSalt;
      if (isSelf) {
        // Completing your own (forced) password change keeps the session alive.
        patch.mustChangePassword = false;
      } else {
        // A manager reset makes the target choose a new password on next login.
        patch.mustChangePassword = true;
        patch.sessionToken = undefined;
        patch.sessionExpiresAt = undefined;
      }
    }

    await ctx.db.patch(args.id, patch);
  },
});

/** Authenticated: delete a user (managers only; self-delete needs a successor). */
export const remove = mutation({
  args: { token: v.string(), id: v.id("users") },
  handler: async (ctx, { token, id }) => {
    const actor = await requireUser(ctx, token);
    assert(canManageUsers(actor.role), "Only founders and co-founders can manage users");
    const target = await ctx.db.get(id);
    assert(target, "User not found");

    if (actor._id === id) {
      // Allow self-delete only when another manager remains, so an account can
      // retire itself without locking everyone out.
      const users = await ctx.db.query("users").collect();
      const others = users.filter((u) => u._id !== id);
      assert(
        others.some((u) => canManageUsers(u.role)),
        "You cannot delete your own account — another founder or co-founder must remain",
      );
    }
    await ctx.db.delete(id);
  },
});

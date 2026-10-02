import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";

export type Ctx = QueryCtx | MutationCtx;

/**
 * Resolve a user from a session token. Returns null when the token is
 * missing, unknown, or expired. Authenticated *queries* return null so
 * clients can redirect to /login without tripping error boundaries;
 * mutations should use {@link requireUser} to throw instead.
 */
export async function getUserBySession(
  ctx: Ctx,
  token: string | undefined,
): Promise<Doc<"users"> | null> {
  if (!token) return null;
  const user = await ctx.db
    .query("users")
    .withIndex("by_sessionToken", (q) => q.eq("sessionToken", token))
    .unique();
  if (!user || !user.sessionExpiresAt || user.sessionExpiresAt < Date.now()) {
    return null;
  }
  return user;
}

/** For mutations: throws when the session is invalid. */
export async function requireUser(
  ctx: Ctx,
  token: string | undefined,
): Promise<Doc<"users">> {
  const user = await getUserBySession(ctx, token);
  if (!user) throw new Error("Not authenticated");
  return user;
}

/**
 * Like {@link requireUser}, but additionally rejects sessions whose password
 * has not been changed yet — every action except the password change itself
 * is blocked until the user sets a new password.
 */
export async function requireActiveUser(
  ctx: Ctx,
  token: string | undefined,
): Promise<Doc<"users">> {
  const user = await requireUser(ctx, token);
  if (user.mustChangePassword) {
    throw new Error("Password change required");
  }
  return user;
}

/** Strip sensitive fields before returning a user to clients. */
export function publicUser(user: Doc<"users">) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image,
    createdAt: user.createdAt,
    mustChangePassword: user.mustChangePassword ?? false,
  };
}

/** Cryptographically secure random token (32 bytes → 64 hex chars). */
export function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

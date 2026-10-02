/** Role values accepted by the users table. */
export const ROLES = ["founder", "cofounder", "engineer", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  founder: "Founder",
  cofounder: "Co-founder",
  engineer: "Software Engineer",
  admin: "Admin",
};

/** Roles offered in the UI (admin is a legacy bootstrap role, hidden). */
export const SELECTABLE_ROLES: Role[] = ["founder", "cofounder", "engineer"];

/**
 * Roles allowed to create users, assign roles, reset passwords and delete
 * accounts. "admin" is the legacy first-boot role: it keeps manage rights so
 * the bootstrap account can be migrated/removed, but it is never selectable.
 */
export function canManageUsers(role: Role): boolean {
  return role === "founder" || role === "cofounder" || role === "admin";
}

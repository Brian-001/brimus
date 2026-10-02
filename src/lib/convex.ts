import { ConvexReactClient } from "convex/react";

// NEXT_PUBLIC_* values are inlined into the client bundle (public by design).
// Falls back to the project's Convex deployment so builds on hosts that don't
// receive .env.local (e.g. Vercel) still succeed; the env var takes precedence.
const url =
  process.env.NEXT_PUBLIC_CONVEX_URL ||
  "https://fast-peccary-215.eu-west-1.convex.cloud";

export const convex = new ConvexReactClient(url);

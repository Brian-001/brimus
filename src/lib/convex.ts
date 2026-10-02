import { ConvexReactClient } from "convex/react";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!url) {
  throw new Error(
    "Missing NEXT_PUBLIC_CONVEX_URL. Run `npx convex dev` in the project root to configure your Convex deployment.",
  );
}

export const convex = new ConvexReactClient(url);

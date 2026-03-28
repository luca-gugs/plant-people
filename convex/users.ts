import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Return the authenticated user's full document, or null if not signed in.
// The @convex-dev/auth library auto-creates user docs on first sign-in,
// so this will always return a doc for authenticated users.
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get("users", userId);
  },
});

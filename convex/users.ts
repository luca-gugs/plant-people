import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
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

// Update the current user's nickname
export const updateNickname = mutation({
  args: { nickname: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    await ctx.db.patch("users", userId, { nickname: args.nickname });
  },
});

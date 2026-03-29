import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── List ───
// Returns recent moisture readings for a plant box (newest first)
export const list = query({
  args: {
    plantBoxId: v.id("plantBoxes"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const user = await ctx.db.get("users", userId);
    if (user === null || user.householdId === undefined) return [];

    const box = await ctx.db.get("plantBoxes", args.plantBoxId);
    if (box === null || box.householdId !== user.householdId) return [];

    return await ctx.db
      .query("readings")
      .withIndex("by_plantBoxId_and_timestamp", (q) =>
        q.eq("plantBoxId", args.plantBoxId),
      )
      .order("desc")
      .take(args.limit ?? 100);
  },
});

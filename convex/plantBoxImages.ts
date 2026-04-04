import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const add = mutation({
  args: {
    plantBoxId: v.id("plantBoxes"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const user = await ctx.db.get("users", userId);
    if (user === null) throw new Error("User not found");

    const box = await ctx.db.get("plantBoxes", args.plantBoxId);
    if (box === null) throw new Error("Plant box not found");
    if (box.householdId !== user.householdId) throw new Error("Not authorized");

    return await ctx.db.insert("plantBoxImages", {
      plantBoxId: args.plantBoxId,
      storageId: args.storageId,
      uploadedAt: Date.now(),
    });
  },
});

export const list = query({
  args: { plantBoxId: v.id("plantBoxes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const user = await ctx.db.get("users", userId);
    if (user === null || user.householdId === undefined) return [];

    const box = await ctx.db.get("plantBoxes", args.plantBoxId);
    if (box === null || box.householdId !== user.householdId) return [];

    const images = await ctx.db
      .query("plantBoxImages")
      .withIndex("by_plantBoxId", (q) => q.eq("plantBoxId", args.plantBoxId))
      .order("desc")
      .take(50);

    const results: { _id: (typeof images)[number]["_id"]; url: string; uploadedAt: number }[] = [];
    for (const img of images) {
      const url = await ctx.storage.getUrl(img.storageId);
      if (url !== null) {
        results.push({ _id: img._id, url, uploadedAt: img.uploadedAt });
      }
    }
    return results;
  },
});

export const remove = mutation({
  args: { imageId: v.id("plantBoxImages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const user = await ctx.db.get("users", userId);
    if (user === null) throw new Error("User not found");

    const image = await ctx.db.get("plantBoxImages", args.imageId);
    if (image === null) throw new Error("Image not found");

    const box = await ctx.db.get("plantBoxes", image.plantBoxId);
    if (box === null || box.householdId !== user.householdId)
      throw new Error("Not authorized");

    await ctx.db.delete("plantBoxImages", args.imageId);
  },
});

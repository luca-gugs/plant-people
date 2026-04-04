import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const add = mutation({
  args: {
    plantId: v.id("plants"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const user = await ctx.db.get("users", userId);
    if (user === null) throw new Error("User not found");

    const plant = await ctx.db.get("plants", args.plantId);
    if (plant === null) throw new Error("Plant not found");

    const box = await ctx.db.get("plantBoxes", plant.plantBoxId);
    if (box === null || box.householdId !== user.householdId)
      throw new Error("Not authorized");

    return await ctx.db.insert("plantImages", {
      plantId: args.plantId,
      storageId: args.storageId,
      uploadedAt: Date.now(),
    });
  },
});

export const list = query({
  args: { plantId: v.id("plants") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const user = await ctx.db.get("users", userId);
    if (user === null || user.householdId === undefined) return [];

    const plant = await ctx.db.get("plants", args.plantId);
    if (plant === null) return [];

    const box = await ctx.db.get("plantBoxes", plant.plantBoxId);
    if (box === null || box.householdId !== user.householdId) return [];

    const images = await ctx.db
      .query("plantImages")
      .withIndex("by_plantId", (q) => q.eq("plantId", args.plantId))
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
  args: { imageId: v.id("plantImages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const user = await ctx.db.get("users", userId);
    if (user === null) throw new Error("User not found");

    const image = await ctx.db.get("plantImages", args.imageId);
    if (image === null) throw new Error("Image not found");

    const plant = await ctx.db.get("plants", image.plantId);
    if (plant === null) throw new Error("Plant not found");

    const box = await ctx.db.get("plantBoxes", plant.plantBoxId);
    if (box === null || box.householdId !== user.householdId)
      throw new Error("Not authorized");

    await ctx.db.delete("plantImages", args.imageId);
  },
});

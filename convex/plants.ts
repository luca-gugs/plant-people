import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── List ───
// Returns all plants for a given plant box
export const list = query({
  args: { plantBoxId: v.id("plantBoxes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const user = await ctx.db.get("users", userId);
    if (user === null || user.householdId === undefined) return [];

    // Ownership check
    const box = await ctx.db.get("plantBoxes", args.plantBoxId);
    if (box === null || box.householdId !== user.householdId) return [];

    return await ctx.db
      .query("plants")
      .withIndex("by_plantBoxId", (q) => q.eq("plantBoxId", args.plantBoxId))
      .take(200);
  },
});

// ─── Create ───
export const create = mutation({
  args: {
    plantBoxId: v.id("plantBoxes"),
    name: v.string(),
    species: v.optional(v.string()),
    plantedDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const user = await ctx.db.get("users", userId);
    if (user === null) throw new Error("User not found");

    const box = await ctx.db.get("plantBoxes", args.plantBoxId);
    if (box === null) throw new Error("Plant box not found");
    if (box.householdId !== user.householdId) throw new Error("Not authorized");

    return await ctx.db.insert("plants", {
      plantBoxId: args.plantBoxId,
      name: args.name,
      species: args.species,
      plantedDate: args.plantedDate,
      notes: args.notes,
      status: "growing",
    });
  },
});

// ─── Update ───
export const update = mutation({
  args: {
    plantId: v.id("plants"),
    name: v.optional(v.string()),
    species: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("growing"),
        v.literal("harvested"),
        v.literal("removed"),
      ),
    ),
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

    const { plantId, ...updates } = args;
    await ctx.db.patch("plants", plantId, updates);
  },
});

// ─── Remove ───
export const remove = mutation({
  args: { plantId: v.id("plants") },
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

    // Cascade-delete plant images
    let plantImgs = await ctx.db
      .query("plantImages")
      .withIndex("by_plantId", (q) => q.eq("plantId", args.plantId))
      .take(256);
    while (plantImgs.length > 0) {
      for (const img of plantImgs) {
        await ctx.db.delete("plantImages", img._id);
      }
      plantImgs = await ctx.db
        .query("plantImages")
        .withIndex("by_plantId", (q) => q.eq("plantId", args.plantId))
        .take(256);
    }

    await ctx.db.delete("plants", args.plantId);
  },
});

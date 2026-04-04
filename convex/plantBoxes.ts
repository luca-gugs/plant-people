import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser, batchDelete } from "./helpers";

// ─── Get ───
// Returns a single plant box by ID with enriched stats
export const get = query({
  args: { plantBoxId: v.id("plantBoxes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get("users", userId);
    if (user === null || user.householdId === undefined) return null;

    const box = await ctx.db.get("plantBoxes", args.plantBoxId);
    if (box === null || box.householdId !== user.householdId) return null;

    // Enrich with plant count and latest moisture reading
    const plants = await ctx.db
      .query("plants")
      .withIndex("by_plantBoxId", (q) => q.eq("plantBoxId", box._id))
      .take(200);
    // Only count plants that are actively growing (harvested/removed are "done")
    const growingCount = plants.filter((p) => p.status === "growing").length;

    const latestReading = await ctx.db
      .query("readings")
      .withIndex("by_plantBoxId_and_timestamp", (q) =>
        q.eq("plantBoxId", box._id),
      )
      .order("desc")
      .first();

    // Resolve device name if paired
    const device = box.deviceId ? await ctx.db.get("devices", box.deviceId) : null;

    return {
      ...box,
      plantCount: growingCount,
      latestMoisturePct: latestReading?.moisturePct ?? null,
      deviceName: device?.name ?? null,
      deviceStatus: device?.status ?? null,
    };
  },
});

// ─── Update ───
// Updates editable fields on a plant box
export const update = mutation({
  args: {
    plantBoxId: v.id("plantBoxes"),
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    lightCondition: v.optional(
      v.union(
        v.literal("full_sun"),
        v.literal("partial_shade"),
        v.literal("deep_shade"),
      ),
    ),
    coverImageUrl: v.optional(v.string()),
    // Hardware binding
    deviceId: v.optional(v.id("devices")),
    sensorChannel: v.optional(v.number()),
    pumpChannel: v.optional(v.number()),
    moistureThresholdLow: v.optional(v.number()),
    moistureThresholdHigh: v.optional(v.number()),
    maxPumpDurationMs: v.optional(v.number()),
    wateringMode: v.optional(
      v.union(v.literal("auto"), v.literal("manual")),
    ),
    // Calibration
    sensorDryRaw: v.optional(v.number()),
    sensorWetRaw: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireUser(ctx);

    const box = await ctx.db.get("plantBoxes", args.plantBoxId);
    if (box === null) throw new Error("Plant box not found");
    if (box.householdId !== user.householdId) throw new Error("Not authorized");

    const { plantBoxId, ...updates } = args;
    await ctx.db.patch("plantBoxes", plantBoxId, updates);
  },
});

// ─── List ───
// Returns all plant boxes for the user's household with live stats
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const user = await ctx.db.get("users", userId);
    if (user === null || user.householdId === undefined) return [];

    // Fetch boxes for this household
    const boxes = await ctx.db
      .query("plantBoxes")
      .withIndex("by_householdId", (q) => q.eq("householdId", user.householdId!))
      .take(50);

    // Enrich each box with growing-plant count and latest moisture %
    // Note: list() returns minimal enrichment; use get() for full details including device name
    const enriched = await Promise.all(
      boxes.map(async (box) => {
        // Only count plants that are actively growing (harvested/removed are "done")
        const plants = await ctx.db
          .query("plants")
          .withIndex("by_plantBoxId", (q) => q.eq("plantBoxId", box._id))
          .take(200);
        const growingCount = plants.filter((p) => p.status === "growing").length;

        // Grab the most recent sensor reading (if any)
        const latestReading = await ctx.db
          .query("readings")
          .withIndex("by_plantBoxId_and_timestamp", (q) =>
            q.eq("plantBoxId", box._id),
          )
          .order("desc")
          .first();

        return {
          ...box,
          plantCount: growingCount,
          latestMoisturePct: latestReading?.moisturePct ?? null,
        };
      }),
    );

    return enriched;
  },
});

// ─── Create ───
// Registers a new plant box under the user's household
export const create = mutation({
  args: {
    name: v.string(),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    lightCondition: v.optional(
      v.union(
        v.literal("full_sun"),
        v.literal("partial_shade"),
        v.literal("deep_shade"),
      ),
    ),
    coverImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireUser(ctx);

    if (user.householdId === undefined)
      throw new Error("Not part of a household");

    // Insert with household binding — no hardware fields yet
    const id = await ctx.db.insert("plantBoxes", {
      householdId: user.householdId,
      name: args.name,
      location: args.location,
      description: args.description,
      lightCondition: args.lightCondition,
      coverImageUrl: args.coverImageUrl,
    });

    return id;
  },
});

// ─── Remove ───
// Deletes a plant box and cascades to plants, readings, and pump events.
// WARNING: If new tables reference plants/readings/pumpEvents, add their
// deletion here to avoid orphaned data.
export const remove = mutation({
  args: { plantBoxId: v.id("plantBoxes") },
  handler: async (ctx, args) => {
    const { user } = await requireUser(ctx);

    const box = await ctx.db.get("plantBoxes", args.plantBoxId);
    if (box === null) throw new Error("Plant box not found");
    if (box.householdId !== user.householdId)
      throw new Error("Not authorized");

    // Cascade-delete plant box images
    await batchDelete(ctx, () =>
      ctx.db
        .query("plantBoxImages")
        .withIndex("by_plantBoxId", (q) => q.eq("plantBoxId", args.plantBoxId))
        .take(256),
    );

    // Cascade-delete plants — each plant's images must be removed first
    let plants = await ctx.db
      .query("plants")
      .withIndex("by_plantBoxId", (q) => q.eq("plantBoxId", args.plantBoxId))
      .take(256);
    while (plants.length > 0) {
      for (const plant of plants) {
        await batchDelete(ctx, () =>
          ctx.db
            .query("plantImages")
            .withIndex("by_plantId", (q) => q.eq("plantId", plant._id))
            .take(256),
        );
        await ctx.db.delete(plant._id);
      }
      plants = await ctx.db
        .query("plants")
        .withIndex("by_plantBoxId", (q) => q.eq("plantBoxId", args.plantBoxId))
        .take(256);
    }

    await batchDelete(ctx, () =>
      ctx.db
        .query("readings")
        .withIndex("by_plantBoxId_and_timestamp", (q) =>
          q.eq("plantBoxId", args.plantBoxId),
        )
        .take(256),
    );

    await batchDelete(ctx, () =>
      ctx.db
        .query("pumpEvents")
        .withIndex("by_plantBoxId_and_timestamp", (q) =>
          q.eq("plantBoxId", args.plantBoxId),
        )
        .take(256),
    );

    await ctx.db.delete(args.plantBoxId);
  },
});

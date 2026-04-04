import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser } from "./helpers";

// ─── List ───
// Returns all devices for the user's household
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const user = await ctx.db.get("users", userId);
    if (user === null || user.householdId === undefined) return [];

    return await ctx.db
      .query("devices")
      .withIndex("by_householdId", (q) =>
        q.eq("householdId", user.householdId!),
      )
      .take(20);
  },
});

// ─── Register ───
// Adds a new device to the household
export const register = mutation({
  args: {
    name: v.string(),
    deviceKey: v.string(),
  },
  handler: async (ctx, args) => {
    const { user } = await requireUser(ctx);

    if (user.householdId === undefined)
      throw new Error("Not part of a household");

    // Check for duplicate device key
    const existing = await ctx.db
      .query("devices")
      .withIndex("by_deviceKey", (q) => q.eq("deviceKey", args.deviceKey))
      .first();
    if (existing !== null) throw new Error("Device key already registered");

    return await ctx.db.insert("devices", {
      householdId: user.householdId,
      name: args.name,
      deviceKey: args.deviceKey,
      status: "offline",
    });
  },
});

// ─── Remove ───
export const remove = mutation({
  args: { deviceId: v.id("devices") },
  handler: async (ctx, args) => {
    const { user } = await requireUser(ctx);

    const device = await ctx.db.get("devices", args.deviceId);
    if (device === null) throw new Error("Device not found");
    if (device.householdId !== user.householdId)
      throw new Error("Not authorized");

    await ctx.db.delete(args.deviceId);
  },
});

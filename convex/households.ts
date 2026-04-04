import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser } from "./helpers";

// Characters that are easy to read and share — no I/L/O/0/1 to avoid ambiguity
const JOIN_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

// 32 characters in the alphabet divides evenly into 256 (32 × 8 = 256),
// so there is no modulo bias when mapping random bytes to the alphabet.
function generateJoinCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => JOIN_CODE_ALPHABET[b % JOIN_CODE_ALPHABET.length])
    .join("");
}

// Create a new household and make the current user its owner
export const create = mutation({
  args: { name: v.string(), nickname: v.string() },
  handler: async (ctx, args) => {
    const { userId, user } = await requireUser(ctx);

    if (user.householdId !== undefined)
      throw new Error("Already in a household");

    // Generate a unique join code (retry on the rare chance of collision)
    let joinCode = generateJoinCode();
    while (
      (await ctx.db
        .query("households")
        .withIndex("by_joinCode", (q) => q.eq("joinCode", joinCode))
        .unique()) !== null
    ) {
      joinCode = generateJoinCode();
    }

    // Create the household
    const householdId = await ctx.db.insert("households", {
      name: args.name,
      joinCode,
    });

    // Link the user to the household as owner
    await ctx.db.patch("users", userId, {
      householdId,
      role: "owner",
      nickname: args.nickname,
    });

    return householdId;
  },
});

// Join an existing household using a 6-character code
export const join = mutation({
  args: { joinCode: v.string(), nickname: v.string() },
  handler: async (ctx, args) => {
    const { userId, user } = await requireUser(ctx);

    if (user.householdId !== undefined)
      throw new Error("Already in a household");

    // Look up the household by join code (case-insensitive)
    const household = await ctx.db
      .query("households")
      .withIndex("by_joinCode", (q) =>
        q.eq("joinCode", args.joinCode.toUpperCase()),
      )
      .unique();

    if (household === null) throw new Error("Invalid join code");

    // Link the user to the household as a member
    await ctx.db.patch("users", userId, {
      householdId: household._id,
      role: "member",
      nickname: args.nickname,
    });

    return household._id;
  },
});

// List all members of the current user's household
export const members = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const user = await ctx.db.get("users", userId);
    if (user === null || user.householdId === undefined) return [];

    const users = await ctx.db
      .query("users")
      .withIndex("by_householdId", (q) => q.eq("householdId", user.householdId!))
      .collect();

    return users.map((u) => ({
      _id: u._id,
      nickname: u.nickname ?? "Unknown",
      role: u.role ?? "member",
    }));
  },
});

// Get the current user's household (or null if they don't have one)
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const user = await ctx.db.get("users", userId);
    if (user === null || user.householdId === undefined) return null;

    return await ctx.db.get("households", user.householdId);
  },
});

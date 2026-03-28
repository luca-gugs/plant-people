import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Characters that are easy to read and share — no I/L/O/0/1 to avoid ambiguity
const JOIN_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

// Generate a random 6-character join code
function generateJoinCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code +=
      JOIN_CODE_ALPHABET[Math.floor(Math.random() * JOIN_CODE_ALPHABET.length)];
  }
  return code;
}

// Create a new household and make the current user its owner
export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    // Verify the user is authenticated
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    // Ensure the user isn't already in a household
    const user = await ctx.db.get("users", userId);
    if (user === null) throw new Error("User not found");
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
    await ctx.db.patch("users", userId, { householdId, role: "owner" });

    return householdId;
  },
});

// Join an existing household using a 6-character code
export const join = mutation({
  args: { joinCode: v.string() },
  handler: async (ctx, args) => {
    // Verify the user is authenticated
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    // Ensure the user isn't already in a household
    const user = await ctx.db.get("users", userId);
    if (user === null) throw new Error("User not found");
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
    });

    return household._id;
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

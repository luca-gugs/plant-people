import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  households: defineTable({
    name: v.string(),
    joinCode: v.string(),
  }).index("by_joinCode", ["joinCode"]),

  users: defineTable({
    // Auth fields (managed by @convex-dev/auth)
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // App fields
    householdId: v.optional(v.id("households")),
    role: v.optional(v.union(v.literal("owner"), v.literal("member"))),
  }).index("by_householdId", ["householdId"]),

  devices: defineTable({
    householdId: v.id("households"),
    name: v.string(),
    deviceKey: v.string(),
    lastHeartbeat: v.optional(v.number()),
    status: v.union(v.literal("online"), v.literal("offline")),
  })
    .index("by_householdId", ["householdId"])
    .index("by_deviceKey", ["deviceKey"]),

  plantBoxes: defineTable({
    householdId: v.id("households"),
    deviceId: v.id("devices"),
    name: v.string(),
    location: v.optional(v.string()),
    sensorChannel: v.number(),
    pumpChannel: v.number(),
    moistureThresholdLow: v.number(),
    moistureThresholdHigh: v.number(),
    maxPumpDurationMs: v.number(),
    wateringMode: v.union(v.literal("auto"), v.literal("manual")),
  })
    .index("by_householdId", ["householdId"])
    .index("by_deviceId", ["deviceId"]),

  plants: defineTable({
    plantBoxId: v.id("plantBoxes"),
    name: v.string(),
    species: v.optional(v.string()),
    plantedDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("growing"),
      v.literal("harvested"),
      v.literal("removed"),
    ),
  }).index("by_plantBoxId", ["plantBoxId"]),

  readings: defineTable({
    plantBoxId: v.id("plantBoxes"),
    moistureLevel: v.number(),
    moisturePct: v.number(),
    timestamp: v.number(),
  }).index("by_plantBoxId_and_timestamp", ["plantBoxId", "timestamp"]),

  pumpEvents: defineTable({
    plantBoxId: v.id("plantBoxes"),
    trigger: v.union(v.literal("auto"), v.literal("manual")),
    durationMs: v.number(),
    moistureBefore: v.number(),
    moistureAfter: v.optional(v.number()),
    timestamp: v.number(),
  }).index("by_plantBoxId_and_timestamp", ["plantBoxId", "timestamp"]),
});

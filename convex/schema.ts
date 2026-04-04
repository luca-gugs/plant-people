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
    nickname: v.optional(v.string()),
    householdId: v.optional(v.id("households")),
    role: v.optional(v.union(v.literal("owner"), v.literal("member"))),
  })
    // Auth-required indexes (the auth library queries users by email/phone internally)
    .index("email", ["email"])
    .index("phone", ["phone"])
    .index("by_householdId", ["householdId"]),

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
    name: v.string(),
    location: v.optional(v.string()),
    // Visual / descriptive fields
    description: v.optional(v.string()),
    lightCondition: v.optional(
      v.union(
        v.literal("full_sun"),
        v.literal("partial_shade"),
        v.literal("deep_shade"),
      ),
    ),
    coverImageUrl: v.optional(v.string()),
    // Hardware binding fields (optional until device is paired)
    deviceId: v.optional(v.id("devices")),
    sensorChannel: v.optional(v.number()),
    pumpChannel: v.optional(v.number()),
    moistureThresholdLow: v.optional(v.number()),
    moistureThresholdHigh: v.optional(v.number()),
    maxPumpDurationMs: v.optional(v.number()),
    wateringMode: v.optional(
      v.union(v.literal("auto"), v.literal("manual")),
    ),
    // Calibration values (raw analog readings for 0% and 100% moisture)
    sensorDryRaw: v.optional(v.number()),
    sensorWetRaw: v.optional(v.number()),
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

  // Command queue: app → device communication
  // When a user triggers an action (e.g. "Water Now"), a pending command is
  // inserted here. The ESP32's next heartbeat picks it up and executes it.
  commands: defineTable({
    plantBoxId: v.id("plantBoxes"),
    type: v.literal("pump"),
    pumpChannel: v.number(),
    durationMs: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("executed"),
    ),
    createdAt: v.number(),
  }).index("by_plantBoxId_and_status", ["plantBoxId", "status"]),

  plantBoxImages: defineTable({
    plantBoxId: v.id("plantBoxes"),
    storageId: v.id("_storage"),
    uploadedAt: v.number(),
  }).index("by_plantBoxId", ["plantBoxId"]),

  plantImages: defineTable({
    plantId: v.id("plants"),
    storageId: v.id("_storage"),
    uploadedAt: v.number(),
  }).index("by_plantId", ["plantId"]),
});

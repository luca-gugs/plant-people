/**
 * deviceApi.ts — The server-side "API" that the ESP32 talks to.
 *
 * HOW THIS WORKS:
 * The ESP32 can't use Convex's JavaScript client (it runs C++, not JS).
 * So instead, it makes plain HTTP requests — just like a browser fetching a URL.
 *
 * Convex lets us define HTTP endpoints via "httpActions". These are functions
 * that receive a raw HTTP request and return a raw HTTP response — similar to
 * Express routes or Next.js API routes, but running inside Convex's infrastructure.
 *
 * The ESP32 will POST JSON to:
 *   https://grandiose-salmon-181.convex.site/api/device/heartbeat
 *   https://grandiose-salmon-181.convex.site/api/device/pump-event
 *
 * Note the domain: .convex.site (not .convex.cloud). The .site domain serves
 * HTTP endpoints. The .cloud domain is for the JS client's WebSocket connection.
 *
 * IMPORTANT CONVEX CONCEPT — httpAction vs internalMutation:
 * httpActions handle the HTTP layer (parsing the request, building the response)
 * but they CANNOT access the database directly (no ctx.db).
 * To read/write data, they call internalMutations via ctx.runMutation().
 * Think of it as: httpAction = the API route, internalMutation = the database logic.
 *
 * "internal" means these mutations are private — they can't be called from the
 * web app or from outside. Only other Convex functions can call them.
 */

import { v } from "convex/values";
import { httpAction, internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─────────────────────────────────────────────────────────────────────────────
// HTTP ACTION: Heartbeat
// ─────────────────────────────────────────────────────────────────────────────
// Route: POST /api/device/heartbeat  (registered in http.ts)
//
// This is the ESP32's main communication channel. Every 30 seconds the device
// sends a POST request with:
//   { deviceKey: "PP-A3F8", readings: [{ channel: 0, rawValue: 2100 }] }
//
// The server responds with the device's current config and any pending commands:
//   { config: [...], commands: [{ type: "pump", pumpChannel: 0, durationMs: 5000 }] }
//
// This "push data up, pull commands down" pattern in a single round-trip is
// called a poll-based heartbeat. It's simpler than WebSockets or MQTT because
// the device just makes a normal HTTP request — no persistent connections needed.
// ─────────────────────────────────────────────────────────────────────────────

export const heartbeat = httpAction(async (ctx, req) => {
  // Parse the JSON body from the ESP32's HTTP request.
  // req is a standard Fetch API Request object — same as in a Service Worker.
  const body = await req.json();
  const { deviceKey, readings } = body as {
    deviceKey: string;
    readings: { channel: number; rawValue: number }[];
  };

  // Delegate to the internalMutation that actually touches the database.
  // ctx.runMutation() is how httpActions call other Convex functions.
  // `internal.deviceApi.processHeartbeat` is the function reference —
  // "internal" = private, "deviceApi" = this file, "processHeartbeat" = the function name.
  const result = await ctx.runMutation(internal.deviceApi.processHeartbeat, {
    deviceKey,
    readings,
  });

  // If the device key doesn't match any registered device, return 404.
  // HTTP status codes: 200 = success, 404 = not found, 500 = server error.
  if (!result) {
    return new Response(JSON.stringify({ error: "Device not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Return the config + commands as JSON for the ESP32 to parse.
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// HTTP ACTION: Pump Event
// ─────────────────────────────────────────────────────────────────────────────
// Route: POST /api/device/pump-event  (registered in http.ts)
//
// After the ESP32 finishes running a pump, it reports what happened:
//   {
//     deviceKey: "PP-A3F8",
//     pumpChannel: 0,
//     trigger: "auto",          ← was this auto-watering or a manual command?
//     durationMs: 3000,         ← how long the pump actually ran
//     moistureBefore: 25,       ← moisture % before pumping
//     moistureAfter: 60         ← moisture % after pumping
//   }
//
// This data powers the pump history chart in the web app, and lets users see
// whether their watering thresholds are working well.
// ─────────────────────────────────────────────────────────────────────────────

export const pumpEvent = httpAction(async (ctx, req) => {
  const body = await req.json();
  const {
    deviceKey,
    pumpChannel,
    trigger,
    durationMs,
    moistureBefore,
    moistureAfter,
  } = body as {
    deviceKey: string;
    pumpChannel: number;
    trigger: "auto" | "manual";
    durationMs: number;
    moistureBefore: number;
    moistureAfter: number;
  };

  await ctx.runMutation(internal.deviceApi.recordPumpEvent, {
    deviceKey,
    pumpChannel,
    trigger,
    durationMs,
    moistureBefore,
    moistureAfter,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL MUTATION: Process Heartbeat
// ─────────────────────────────────────────────────────────────────────────────
// This is where the real work happens. It:
//   1. Finds the device by its unique key
//   2. Updates the device's "last seen" timestamp and marks it online
//   3. Converts raw sensor readings → moisture percentages and saves them
//   4. Gathers the current config for each plant box (thresholds, watering mode)
//   5. Picks up any pending commands (e.g. "Water Now" from the app)
//
// "internalMutation" means:
//   - It CAN read/write the database (ctx.db)
//   - It CANNOT be called from the web app — only from other server functions
//   - It runs as a transaction: all writes succeed or all fail together
// ─────────────────────────────────────────────────────────────────────────────

export const processHeartbeat = internalMutation({
  // Argument validators — Convex validates these automatically before the
  // handler runs. If the ESP32 sends malformed data, it gets rejected.
  args: {
    deviceKey: v.string(),
    readings: v.array(v.object({ channel: v.number(), rawValue: v.number() })),
  },
  handler: async (ctx, args) => {
    // ── Step 1: Find the device ──
    // .withIndex() uses the "by_deviceKey" index we defined in schema.ts.
    // Indexes let Convex find rows instantly instead of scanning every row.
    // .unique() returns exactly one result (or null), since deviceKey is unique.
    const device = await ctx.db
      .query("devices")
      .withIndex("by_deviceKey", (q) => q.eq("deviceKey", args.deviceKey))
      .unique();

    if (!device) return null;

    // ── Step 2: Update heartbeat ──
    // ctx.db.patch() merges these fields into the existing document.
    // This is how the web app knows the device is alive — it checks lastHeartbeat.
    await ctx.db.patch("devices", device._id, {
      lastHeartbeat: Date.now(),
      status: "online" as const,
    });

    // ── Step 3: Find all plant boxes paired to this device ──
    // A single ESP32 can serve multiple plant boxes (up to 8 sensor channels).
    // .take(8) limits the result — we know there can't be more than 8 channels.
    const plantBoxes = await ctx.db
      .query("plantBoxes")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", device._id))
      .take(8);

    const now = Date.now();

    // ── Step 4: Save sensor readings ──
    for (const reading of args.readings) {
      // Match the reading's channel number to the plant box that uses that channel.
      // Example: if a plant box has sensorChannel=0, it gets readings from channel 0.
      const box = plantBoxes.find((b) => b.sensorChannel === reading.channel);
      if (!box) continue;

      // Convert raw ADC value → 0-100% using the calibration points.
      //
      // HOW CALIBRATION WORKS:
      // Capacitive soil moisture sensors output a voltage proportional to moisture.
      // The ESP32's ADC converts that voltage to a number (0-4095 for 12-bit).
      // But "dry" and "wet" raw values vary per sensor, so we calibrate:
      //   - sensorDryRaw: the reading when the sensor is in dry air (e.g. 3500)
      //   - sensorWetRaw: the reading when submerged in water (e.g. 1500)
      //
      // Note: capacitive sensors read HIGH when dry, LOW when wet — that's why
      // the formula is (dryRaw - rawValue) / (dryRaw - wetRaw), not the reverse.
      //
      // Math.max(0, Math.min(100, ...)) clamps the result to 0-100%.
      const dryRaw = box.sensorDryRaw ?? 3500;
      const wetRaw = box.sensorWetRaw ?? 1500;
      const pct = Math.max(
        0,
        Math.min(100, ((dryRaw - reading.rawValue) / (dryRaw - wetRaw)) * 100),
      );

      await ctx.db.insert("readings", {
        plantBoxId: box._id,
        moistureLevel: reading.rawValue, // Raw value — useful for debugging calibration
        moisturePct: Math.round(pct), // The percentage the web app displays
        timestamp: now,
      });
    }

    // ── Step 5: Build config response ──
    // Send back each plant box's current settings so the ESP32 knows:
    //   - Which channels to read/control
    //   - What thresholds to use for auto-watering
    //   - Calibration values (so it can do local % conversion too)
    const config = plantBoxes.map((box) => ({
      sensorChannel: box.sensorChannel ?? 0,
      pumpChannel: box.pumpChannel ?? 0,
      thresholdLow: box.moistureThresholdLow ?? 30,
      thresholdHigh: box.moistureThresholdHigh ?? 70,
      maxPumpDurationMs: box.maxPumpDurationMs ?? 5000,
      wateringMode: box.wateringMode ?? "manual",
      dryRaw: box.sensorDryRaw ?? 3500,
      wetRaw: box.sensorWetRaw ?? 1500,
    }));

    // ── Step 6: Collect pending commands ──
    // When a user presses "Water Now" in the app, a command row is inserted
    // with status "pending". Here we pick those up and mark them "sent".
    // The ESP32 will execute them and report back via the pump-event endpoint.
    const commands = [];
    for (const box of plantBoxes) {
      const pending = await ctx.db
        .query("commands")
        .withIndex("by_plantBoxId_and_status", (q) =>
          q.eq("plantBoxId", box._id).eq("status", "pending"),
        )
        .take(5);

      for (const cmd of pending) {
        // Mark as "sent" so it won't be picked up again on the next heartbeat
        await ctx.db.patch("commands", cmd._id, { status: "sent" as const });
        commands.push({
          type: cmd.type,
          pumpChannel: cmd.pumpChannel,
          durationMs: cmd.durationMs,
        });
      }
    }

    return { config, commands };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL MUTATION: Record Pump Event
// ─────────────────────────────────────────────────────────────────────────────
// Called when the ESP32 reports it finished running a pump.
// Saves the event to the pumpEvents table and marks any matching commands
// as "executed" so the web app can show the command was fulfilled.
// ─────────────────────────────────────────────────────────────────────────────

export const recordPumpEvent = internalMutation({
  args: {
    deviceKey: v.string(),
    pumpChannel: v.number(),
    trigger: v.union(v.literal("auto"), v.literal("manual")),
    durationMs: v.number(),
    moistureBefore: v.number(),
    moistureAfter: v.number(),
  },
  handler: async (ctx, args) => {
    // Find the device
    const device = await ctx.db
      .query("devices")
      .withIndex("by_deviceKey", (q) => q.eq("deviceKey", args.deviceKey))
      .unique();

    if (!device) return;

    // Find the plant box mapped to this pump channel
    const plantBoxes = await ctx.db
      .query("plantBoxes")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", device._id))
      .take(8);

    const box = plantBoxes.find((b) => b.pumpChannel === args.pumpChannel);
    if (!box) return;

    // Save the pump event — this powers the "Watering History" view in the app
    await ctx.db.insert("pumpEvents", {
      plantBoxId: box._id,
      trigger: args.trigger,
      durationMs: args.durationMs,
      moistureBefore: args.moistureBefore,
      moistureAfter: args.moistureAfter,
      timestamp: Date.now(),
    });

    // Mark matching "sent" commands as "executed" so the app UI can show completion
    const sentCommands = await ctx.db
      .query("commands")
      .withIndex("by_plantBoxId_and_status", (q) =>
        q.eq("plantBoxId", box._id).eq("status", "sent"),
      )
      .take(5);

    for (const cmd of sentCommands) {
      if (cmd.pumpChannel === args.pumpChannel) {
        await ctx.db.patch("commands", cmd._id, {
          status: "executed" as const,
        });
      }
    }
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC MUTATION: Queue Command
// ─────────────────────────────────────────────────────────────────────────────
// Called from the web app — e.g. the "Water Now" button or the setup wizard's
// "Test Pump" step.
//
// "mutation" (not "internalMutation") means this IS part of the public API.
// The web app calls it like: useMutation(api.deviceApi.queueCommand)
//
// It's auth-gated: only logged-in users who belong to the same household as
// the plant box can queue commands. This prevents strangers from watering
// your plants (or worse, running your pump dry).
// ─────────────────────────────────────────────────────────────────────────────

export const queueCommand = mutation({
  args: {
    plantBoxId: v.id("plantBoxes"),
    pumpChannel: v.number(),
    durationMs: v.number(),
  },
  handler: async (ctx, args) => {
    // Verify the user is logged in
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const box = await ctx.db.get("plantBoxes", args.plantBoxId);
    if (!box) throw new Error("Plant box not found");

    // Verify user belongs to the same household as the plant box
    const user = await ctx.db.get("users", userId);
    if (!user?.householdId || user.householdId !== box.householdId) {
      throw new Error("Not authorized");
    }

    // Insert the command — it sits here with status "pending" until
    // the ESP32's next heartbeat picks it up (within ~30 seconds)
    await ctx.db.insert("commands", {
      plantBoxId: args.plantBoxId,
      type: "pump",
      pumpChannel: args.pumpChannel,
      durationMs: args.durationMs,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

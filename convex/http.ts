/**
 * http.ts — Defines all HTTP routes for the Convex app.
 *
 * WHAT ARE HTTP ROUTES?
 * When someone makes an HTTP request to your Convex site URL
 * (https://grandiose-salmon-181.convex.site), this router decides
 * which function handles it based on the path and method.
 *
 * Example: POST to /api/device/heartbeat → runs the heartbeat httpAction
 *
 * PATH = the part of the URL after the domain (e.g. "/api/device/heartbeat")
 * METHOD = the HTTP verb (GET, POST, PUT, DELETE, etc.)
 *   - GET = "give me data" (like loading a web page)
 *   - POST = "here's some data, process it" (like submitting a form)
 *
 * The ESP32 uses POST because it's sending sensor data to the server.
 *
 * WHY /api/device/ PREFIX?
 * It's just organization — grouping all device-related endpoints under one
 * path prefix. Similar to how you'd organize files in folders.
 */

import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { heartbeat, pumpEvent } from "./deviceApi";

const http = httpRouter();

// Auth routes (login, signup, token refresh) — added by @convex-dev/auth
auth.addHttpRoutes(http);

// ── Device API routes ──
// These are the endpoints the ESP32 POSTs to. No auth token required —
// the device identifies itself via its deviceKey in the request body.
// (ESP32s can't easily manage JWT tokens, so we use the device key instead.)

http.route({
  path: "/api/device/heartbeat",
  method: "POST",
  handler: heartbeat,
});

http.route({
  path: "/api/device/pump-event",
  method: "POST",
  handler: pumpEvent,
});

export default http;

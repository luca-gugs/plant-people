/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ResendOTP from "../ResendOTP.js";
import type * as auth from "../auth.js";
import type * as deviceApi from "../deviceApi.js";
import type * as devices from "../devices.js";
import type * as files from "../files.js";
import type * as helpers from "../helpers.js";
import type * as households from "../households.js";
import type * as http from "../http.js";
import type * as plantBoxImages from "../plantBoxImages.js";
import type * as plantBoxes from "../plantBoxes.js";
import type * as plantImages from "../plantImages.js";
import type * as plants from "../plants.js";
import type * as pumpEvents from "../pumpEvents.js";
import type * as readings from "../readings.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  auth: typeof auth;
  deviceApi: typeof deviceApi;
  devices: typeof devices;
  files: typeof files;
  helpers: typeof helpers;
  households: typeof households;
  http: typeof http;
  plantBoxImages: typeof plantBoxImages;
  plantBoxes: typeof plantBoxes;
  plantImages: typeof plantImages;
  plants: typeof plants;
  pumpEvents: typeof pumpEvents;
  readings: typeof readings;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

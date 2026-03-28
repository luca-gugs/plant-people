# Plant People — Schema Design Plan

## Context
The app monitors and waters plant boxes using ESP32 microcontrollers with moisture sensors and pumps. Multiple plant boxes exist, some with a variety of plants. The system needs to be **multi-tenant** (multiple households) and flexible enough to support various hardware configurations (1 ESP32 per box, or 1 ESP32 driving multiple sensors/pumps).

## Design Decisions

### Auth: Magic links + shareable join code
- `@convex-dev/auth` with email OTP (magic links) — passwordless login
- Households get a unique join code (e.g. 6 chars) — share it via text/in-person
- No email provider needed for invitations, just for login
- Keeps it dead simple for a 2-person household while still supporting multi-tenant

### Plant tracking: Catalog per-plant, water per-box
- Moisture sensors measure soil for a zone/box, not individual plants
- Pumps water the entire box
- But users want to track what's growing where (species, planting date, notes)
- → Separate `plants` table with FK to `plantBoxes`

### Hardware: Decouple devices from boxes
- `devices` table (ESP32s) linked to `plantBoxes` via FK
- Each box specifies which sensor/pump channel it uses on the device
- Works for 1:1 or 1:many configurations

### Config: Thresholds + safety limits
- Per-box moisture thresholds (low = start watering, high = stop)
- Pump duration safety limit
- Auto/manual mode toggle
- Scheduling can be added later without schema changes

### High-churn data separation
- Per Convex best practices, `readings` and `pumpEvents` are separate tables from `plantBoxes`
- Avoids write contention between frequent sensor data and stable config

---

## Schema

### `households`
Multi-tenant root. All data is scoped to a household.

| Field       | Type   | Description                                    |
|-------------|--------|------------------------------------------------|
| name        | string | e.g. "The Smiths"                             |
| joinCode    | string | shareable 6-char code for joining (e.g. "A3X9K2") |

**Indexes:** `by_joinCode`

### `users`
Linked to `@convex-dev/auth` via `authSubject`. The auth library manages its own `authAccounts` and `authSessions` tables automatically.

| Field             | Type                         | Description                        |
|-------------------|------------------------------|------------------------------------|
| authSubject       | string                       | subject from auth provider, unique |
| householdId       | optional Id\<"households"\>  | null until they join/create one    |
| name              | optional string              | display name                       |
| email             | string                       | from auth                          |
| role              | "owner" \| "member"          | permissions within household       |

**Indexes:** `by_authSubject`, `by_householdId`

### `devices`
ESP32 microcontrollers.

| Field          | Type                  | Description                              |
|----------------|-----------------------|------------------------------------------|
| householdId    | Id\<"households"\>    | owner household                          |
| name           | string                | e.g. "Kitchen ESP32"                     |
| deviceKey      | string                | unique hardware identifier (MAC/custom)  |
| lastHeartbeat  | optional number       | unix ms of last check-in                 |
| status         | "online" \| "offline" | connectivity state                       |

**Indexes:** `by_householdId`, `by_deviceKey`

### `plantBoxes`
Physical containers/zones. Each has one sensor and one pump.

| Field                 | Type                  | Description                                  |
|-----------------------|-----------------------|----------------------------------------------|
| householdId           | Id\<"households"\>    | owner household                              |
| deviceId              | Id\<"devices"\>       | which ESP32 manages this box                 |
| name                  | string                | e.g. "Kitchen Herbs"                         |
| location              | optional string       | e.g. "Kitchen windowsill"                    |
| sensorChannel         | number                | which analog input on the ESP32 (0-based)    |
| pumpChannel           | number                | which relay output on the ESP32 (0-based)    |
| moistureThresholdLow  | number                | % below which auto-watering triggers         |
| moistureThresholdHigh | number                | % above which auto-watering stops            |
| maxPumpDurationMs     | number                | safety cutoff (e.g. 30000 = 30s)             |
| wateringMode          | "auto" \| "manual"    | whether the system waters automatically      |

**Indexes:** `by_householdId`, `by_deviceId`

### `plants`
Individual plants cataloged within a box.

| Field       | Type                  | Description                                    |
|-------------|-----------------------|------------------------------------------------|
| plantBoxId  | Id\<"plantBoxes"\>    | which box this plant lives in                  |
| name        | string                | e.g. "Basil", "Cherry Tomato"                  |
| species     | optional string       | botanical name                                 |
| plantedDate | optional number       | unix ms                                        |
| notes       | optional string       | free-form notes                                |
| status      | "growing" \| "harvested" \| "removed" | lifecycle state              |

**Indexes:** `by_plantBoxId`

### `readings`
High-frequency sensor telemetry.

| Field         | Type                  | Description                      |
|---------------|-----------------------|----------------------------------|
| plantBoxId    | Id\<"plantBoxes"\>    | which box this reading is from   |
| moistureLevel | number                | raw analog value (0-4095)        |
| moisturePct   | number                | calculated percentage            |
| timestamp     | number                | unix ms from ESP32               |

**Indexes:** `by_plantBoxId_and_timestamp ["plantBoxId", "timestamp"]`

### `pumpEvents`
Watering log.

| Field          | Type                  | Description                              |
|----------------|-----------------------|------------------------------------------|
| plantBoxId     | Id\<"plantBoxes"\>    | which box was watered                    |
| trigger        | "auto" \| "manual"    | what initiated the watering              |
| durationMs     | number                | how long the pump ran                    |
| moistureBefore | number                | % reading that triggered it              |
| moistureAfter  | optional number       | % reading after pump stops               |
| timestamp      | number                | unix ms                                  |

**Indexes:** `by_plantBoxId_and_timestamp ["plantBoxId", "timestamp"]`

---

## ESP32 → Convex Communication

The ESP32 will POST readings and receive config via Convex HTTP endpoints (`convex/http.ts`). The `deviceKey` field authenticates/identifies the hardware. This will be built separately.

## Verification

1. Run `npx convex dev` — schema should deploy without errors
2. Inspect the Convex dashboard to confirm all tables and indexes are created
3. Types should be correctly generated in `convex/_generated/dataModel.d.ts`

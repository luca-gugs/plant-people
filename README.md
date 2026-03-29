# Tend — Smart Plant Monitoring & Watering

Tend is an open-source app for monitoring and automatically watering your plants using ESP32 microcontrollers with moisture sensors and pumps. It supports multiple households, multiple plant boxes, and per-box auto/manual watering control.

## Features

- **Real-time moisture monitoring** — live sensor data from ESP32 hardware
- **Automatic watering** — configurable thresholds trigger pumps automatically
- **Manual watering** — trigger pumps on demand from the app
- **Plant catalog** — track what's growing in each box (species, planting date, notes)
- **Multi-household** — invite others via a shareable join code
- **Passwordless auth** — sign in with a one-time code sent to your email
- **ESP32 provisioning** — flash and register devices directly from the browser

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + React Router + TypeScript |
| Backend | [Convex](https://convex.dev) (serverless DB + functions) |
| Styling | Tailwind CSS 4 |
| Forms | React Hook Form |
| Charts | Recharts |
| Auth | Convex Auth + Resend (email OTP) |
| Hardware | ESP32 via [esp-web-tools](https://esphome.github.io/esp-web-tools/) |

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Convex](https://convex.dev) account (free tier works)
- A [Resend](https://resend.com) account for sending sign-in emails (free tier works)
- ESP32 hardware with moisture sensors and relay-controlled pumps (optional for dev)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/luca-gugs/plant-people.git
cd plant-people
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local` — see the [Environment Variables](#environment-variables) section below.

### 3. Set up Convex

```bash
npx convex dev --until-success
```

This will prompt you to log in to Convex and create a new project. Copy the deployment URL it prints — that's your `VITE_CONVEX_URL`.

Then configure the Convex environment variables (these live on the backend, not in `.env.local`):

```bash
npx convex env set AUTH_RESEND_KEY re_your_key_here
npx convex env set AUTH_EMAIL "Tend <hello@yourdomain.com>"
npx convex env set CONVEX_SITE_URL http://localhost:5173
```

### 4. Run the app

```bash
npm run dev
```

This starts both the Vite dev server and the Convex backend in parallel. Open [http://localhost:5173](http://localhost:5173).

## Environment Variables

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `VITE_CONVEX_URL` | Your Convex deployment URL (e.g. `https://xxx.convex.cloud`) |

### Convex backend (set via `npx convex env set`)

| Variable | Description |
|---|---|
| `CONVEX_SITE_URL` | Public URL of the app — used for auth callbacks |
| `AUTH_RESEND_KEY` | Resend API key for sending sign-in emails |
| `AUTH_EMAIL` | "From" address for sign-in emails (must be a verified Resend sender) |

See `.env.example` for templates and descriptions.

## Project Structure

```
plant-people/
├── src/                    # React frontend
│   ├── pages/              # Route-level components
│   ├── layouts/            # Auth & household wrappers
│   ├── components/         # Shared UI components
│   └── contexts/           # React context (household)
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema
│   ├── auth.ts             # Authentication setup
│   ├── households.ts       # Household logic
│   ├── devices.ts          # ESP32 device management
│   ├── plantBoxes.ts       # Plant box CRUD + queries
│   ├── plants.ts           # Plant catalog
│   ├── readings.ts         # Sensor telemetry
│   └── pumpEvents.ts       # Watering history
└── project-plan.md         # Schema design notes
```

## Hardware

Each plant box uses an ESP32 with:
- An analog moisture sensor (capacitive recommended)
- A relay module controlling a small pump

The ESP32 communicates with Convex via HTTP endpoints. Device provisioning is handled in-browser via the setup wizard using [esp-web-tools](https://esphome.github.io/esp-web-tools/).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, conventions, and how to submit changes.

## License

[PolyForm Noncommercial 1.0.0](LICENSE.txt) — free for personal, educational, and non-commercial use. Commercial use is not permitted.
Copyright 2024 The Gardening Society of San Rafael.

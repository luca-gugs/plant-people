import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "convex/react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Cpu,
  Wifi,
  Droplets,
  Zap,
  Check,
  AlertTriangle,
  Usb,
  Monitor,
  Wrench,
  Gauge,
  CircleCheckBig,
  X,
} from "lucide-react";
import "esp-web-tools";

// ─── Step definitions ───

const STEPS = [
  {
    id: "intro",
    title: "What You'll Need",
    icon: Cpu,
    description:
      "Before we start, gather the hardware. This guide will walk you through connecting everything step by step.",
  },
  {
    id: "flash-firmware",
    title: "Flash Firmware",
    icon: Usb,
    description:
      "Install the Plant People firmware onto your ESP32 — right from this page, no extra software needed.",
  },
  {
    id: "assembly",
    title: "Wire It Up",
    icon: Wrench,
    description:
      "Connect the moisture sensor, relay module, and pump to your ESP32.",
  },
  {
    id: "connect-wifi",
    title: "Connect to Wi-Fi",
    icon: Wifi,
    description:
      "Get your ESP32 connected to your home Wi-Fi network so it can talk to Plant People.",
  },
  {
    id: "register-device",
    title: "Register Device",
    icon: Zap,
    description:
      "Tell Plant People about your device so it knows where sensor readings are coming from.",
  },
  {
    id: "pair-sensor",
    title: "Pair Sensor & Pump",
    icon: Droplets,
    description:
      "Assign your moisture sensor and water pump channels to this planting station.",
  },
  {
    id: "calibrate",
    title: "Calibrate Sensor",
    icon: Gauge,
    description:
      "Teach your sensor what 'dry' and 'wet' look like so moisture readings are accurate.",
  },
  {
    id: "confirm",
    title: "Test & Confirm",
    icon: CircleCheckBig,
    description:
      "Run a quick test to make sure the sensor reads correctly and the pump delivers water.",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

// ─── Browser detection ───

function isChromiumBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // Chrome, Edge, Arc, Brave, Opera all include "Chrome" in UA
  return /Chrome/.test(ua) && !/Firefox/.test(ua);
}

// ─── Animation variants ───

const mapVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0, transformOrigin: "center" },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    scaleX: 0,
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Component ───

interface DeviceSetupWizardProps {
  plantBoxId: Id<"plantBoxes">;
  onClose?: () => void;
}

export default function DeviceSetupWizard({
  plantBoxId,
  onClose,
}: DeviceSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<StepId>("intro");
  const devices = useQuery(api.devices.list);
  const registerDevice = useMutation(api.devices.register);
  const updateBox = useMutation(api.plantBoxes.update);

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const StepIcon = STEPS[stepIndex].icon;

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function goNext() {
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id);
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 font-body">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        variants={mapVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative modal-content w-full max-w-4xl flex flex-col md:flex-row min-h-[600px]"
      >
        {/* ─── Side Panel ─── */}
        <div className="hidden md:flex w-1/3 bg-parchment-dark border-r border-border/60 flex-col items-center justify-center p-8">
          <div className="text-center space-y-6">
            <div className="divider-botanical mx-auto opacity-40" />
            <div>
              <span className="label-xs block mb-2">Installation Protocol</span>
              <h2 className="text-3xl heading-botanical leading-tight">
                Device Setup
              </h2>
            </div>
            <p className="text-xs text-muted-italic px-4">
              "Continuous substrate monitoring for informed irrigation decisions."
            </p>
            <div className="divider-botanical mx-auto opacity-40" />

            {/* Progress visualization */}
            <div className="pt-8 space-y-3 w-full">
              {STEPS.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => i <= stepIndex && setCurrentStep(step.id)}
                  className="flex items-center gap-3 w-full text-left"
                  disabled={i > stepIndex}
                >
                  <div
                    className={`w-2 h-2 rounded-full border transition-colors shrink-0 ${
                      i === stepIndex
                        ? "bg-botanical border-botanical"
                        : i < stepIndex
                          ? "bg-ink-faint border-ink-faint"
                          : "border-border"
                    }`}
                  />
                  <span
                    className={`label-xs transition-opacity ${
                      i === stepIndex
                        ? "!text-botanical font-bold"
                        : i < stepIndex
                          ? "!text-ink-faint"
                          : "opacity-40"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Main Content ─── */}
        <div className="flex-1 flex flex-col p-6 md:p-10">
          {/* Header */}
          <header className="flex justify-between items-start mb-8 border-b border-border/40 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <StepIcon className="w-5 h-5 text-botanical opacity-70" />
                <span className="label-xs font-sans">
                  Step {stepIndex + 1} of {STEPS.length}
                </span>
              </div>
              <h3 className="text-2xl heading-botanical">
                {STEPS[stepIndex].title}
              </h3>
              <p className="text-sm text-muted-italic max-w-lg">
                {STEPS[stepIndex].description}
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-parchment-dark transition-colors rounded-full"
              >
                <X className="w-5 h-5 text-ink-faint" />
              </button>
            )}
          </header>

          {/* Step body */}
          <main className="flex-1 overflow-y-auto pr-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {currentStep === "intro" && <IntroStep onNext={goNext} />}
                {currentStep === "flash-firmware" && (
                  <FlashFirmwareStep onNext={goNext} onBack={goBack} />
                )}
                {currentStep === "assembly" && (
                  <AssemblyStep onNext={goNext} onBack={goBack} />
                )}
                {currentStep === "connect-wifi" && (
                  <ConnectWifiStep onNext={goNext} onBack={goBack} />
                )}
                {currentStep === "register-device" && (
                  <RegisterDeviceStep
                    devices={devices ?? []}
                    registerDevice={registerDevice}
                    onNext={goNext}
                    onBack={goBack}
                  />
                )}
                {currentStep === "pair-sensor" && (
                  <PairSensorStep
                    plantBoxId={plantBoxId}
                    devices={devices ?? []}
                    updateBox={updateBox}
                    onNext={goNext}
                    onBack={goBack}
                  />
                )}
                {currentStep === "calibrate" && (
                  <CalibrateStep
                    plantBoxId={plantBoxId}
                    updateBox={updateBox}
                    onNext={goNext}
                    onBack={goBack}
                  />
                )}
                {currentStep === "confirm" && (
                  <ConfirmStep plantBoxId={plantBoxId} onBack={goBack} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="mt-8 pt-4 border-t border-border/40 flex justify-between items-center opacity-40">
            <span className="label-xs">
              Station ID: {plantBoxId.substring(0, 8)}
            </span>
            <span className="text-[9px] italic text-ink-faint">
              Plant People Monitor — fw v2.4
            </span>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Step 1: Intro / shopping list ───

function IntroStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink">You will need:</p>
      <ul className="space-y-2 text-sm text-muted-italic">
        <li className="flex items-start gap-2">
          <span className="text-ink">1.</span>
          <span>
            <strong className="text-ink font-normal">ESP32 board</strong> — any
            ESP32 dev board with Wi-Fi (e.g. ESP32-WROOM-32)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-ink">2.</span>
          <span>
            <strong className="text-ink font-normal">
              Capacitive soil moisture sensor
            </strong>{" "}
            — connects to an analog pin on the ESP32 to measure soil moisture
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-ink">3.</span>
          <span>
            <strong className="text-ink font-normal">
              12V peristaltic pump + relay module
            </strong>{" "}
            — the relay lets the ESP32 safely switch the pump on and off
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-ink">4.</span>
          <span>
            <strong className="text-ink font-normal">
              USB power supply + tubing
            </strong>{" "}
            — to power the ESP32 and route water from a reservoir to your plant
            box
          </span>
        </li>
      </ul>

      <div className="pt-4">
        <button
          onClick={onNext}
          className="text-sm px-6 py-2 bg-ink text-parchment"
        >
          I have everything — let's go
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Flash firmware via browser ───

function FlashFirmwareStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const isCompatible = isChromiumBrowser();

  return (
    <div className="space-y-5">
      {/* Chromium browser requirement callout */}
      <div
        className={`flex items-start gap-3 p-4 border ${
          isCompatible
            ? "border-border/40 bg-border/10"
            : "border-alert/40 bg-alert/5"
        }`}
      >
        {isCompatible ? (
          <Monitor className="w-5 h-5 text-ink shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-alert shrink-0 mt-0.5" />
        )}
        <div>
          <p className="text-sm text-ink font-medium">
            {isCompatible
              ? "You're using a compatible browser"
              : "Chromium browser required"}
          </p>
          <p className="text-xs text-muted-italic mt-1">
            {isCompatible
              ? "Your browser supports Web Serial — you're good to go."
              : "Firmware flashing requires the Web Serial API, which is only available in Chromium-based browsers. Please open this page in Chrome, Edge, Arc, or Brave to continue."}
          </p>
          {!isCompatible && (
            <p className="text-xs text-muted-italic mt-2 italic">
              Safari and Firefox are not supported for this step.
            </p>
          )}
        </div>
      </div>

      {/* Flash instructions */}
      <ol className="space-y-3 text-sm text-muted-italic list-decimal list-inside">
        <li>
          Plug your ESP32 into your computer using a USB cable.
        </li>
        <li>
          Click the <strong className="text-ink font-normal">"Install Firmware"</strong>{" "}
          button below.
        </li>
        <li>
          Your browser will ask you to select a serial port — pick the one that
          appeared when you plugged in the device (usually something like{" "}
          <code className="text-ink bg-border/30 px-1">
            CP2102 USB to UART
          </code>{" "}
          or{" "}
          <code className="text-ink bg-border/30 px-1">
            USB Serial
          </code>
          ).
        </li>
        <li>
          Wait about 30 seconds while the firmware installs. Don't unplug the
          device.
        </li>
      </ol>

      {/* ESP Web Tools flash button */}
      <div className="py-4">
        <esp-web-install-button manifest="/firmware/manifest.json">
          <button
            slot="activate"
            disabled={!isCompatible}
            className="text-sm px-6 py-3 bg-ink text-parchment disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Install Firmware
          </button>
        </esp-web-install-button>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 text-muted-italic border border-border"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="text-sm px-6 py-2 bg-ink text-parchment"
        >
          Firmware installed — next
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Connect device to Wi-Fi ───

function ConnectWifiStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <ol className="space-y-3 text-sm text-muted-italic list-decimal list-inside">
        <li>
          After flashing, the ESP32 will reboot and create a Wi-Fi hotspot
          called{" "}
          <code className="text-ink bg-border/30 px-1">PlantPeople-Setup</code>.
        </li>
        <li>
          On your phone or laptop, connect to that hotspot. A setup page should
          open automatically — if it doesn't, go to{" "}
          <code className="text-ink bg-border/30 px-1">192.168.4.1</code> in
          your browser.
        </li>
        <li>
          Enter your home Wi-Fi network name and password, then tap{" "}
          <strong className="text-ink font-normal">Save</strong>.
        </li>
        <li>
          The ESP32 will restart and connect to your home network. The LED will
          stop blinking once connected.
        </li>
        <li>
          The device's screen (or serial monitor) will show a{" "}
          <strong className="text-ink font-normal">Device Key</strong> — a short
          code like{" "}
          <code className="text-ink bg-border/30 px-1">PP-A3F8</code>. Write
          it down for the next step.
        </li>
      </ol>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 text-muted-italic border border-border"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="text-sm px-6 py-2 bg-ink text-parchment"
        >
          Device is on Wi-Fi — next
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Register device in the app ───

interface RegisterDeviceStepProps {
  devices: { _id: Id<"devices">; name: string; deviceKey: string }[];
  registerDevice: (args: {
    name: string;
    deviceKey: string;
  }) => Promise<Id<"devices">>;
  onNext: () => void;
  onBack: () => void;
}

function RegisterDeviceStep({
  devices,
  registerDevice,
  onNext,
  onBack,
}: RegisterDeviceStepProps) {
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ name: string; deviceKey: string }>({
    defaultValues: { name: "", deviceKey: "" },
  });

  async function onSubmit(data: { name: string; deviceKey: string }) {
    setError("");
    try {
      await registerDevice({
        name: data.name.trim(),
        deviceKey: data.deviceKey.trim().toUpperCase(),
      });
      onNext();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register device",
      );
    }
  }

  return (
    <div className="space-y-4">
      {/* Already registered devices */}
      {devices.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-ink">
            Already registered devices — you can skip this step if your device
            is listed:
          </p>
          <ul className="space-y-1">
            {devices.map((d) => (
              <li key={d._id} className="text-sm text-muted-italic">
                {d.name}{" "}
                <code className="text-ink bg-border/30 px-1">
                  {d.deviceKey}
                </code>
              </li>
            ))}
          </ul>
          <button onClick={onNext} className="text-sm text-ink underline">
            Skip — use an existing device
          </button>
        </div>
      )}

      {/* Register new device form */}
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="space-y-3 border-t border-border/40 pt-4"
      >
        <p className="text-sm text-ink">Register a new device:</p>
        <input
          type="text"
          placeholder="Give it a name (e.g. Kitchen ESP32)"
          {...register("name", { required: true })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Device Key (e.g. PP-A3F8)"
          {...register("deviceKey", { required: true })}
          className="input-field"
        />
        {error && <p className="text-sm text-alert">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-sm px-4 py-2 text-muted-italic border border-border"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-sm px-6 py-2 bg-ink text-parchment disabled:opacity-50"
          >
            Register Device
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Step 5: Pair sensor & pump to this plant box ───

interface PairSensorStepProps {
  plantBoxId: Id<"plantBoxes">;
  devices: {
    _id: Id<"devices">;
    name: string;
    deviceKey: string;
    status: "online" | "offline";
  }[];
  updateBox: (args: {
    plantBoxId: Id<"plantBoxes">;
    deviceId?: Id<"devices">;
    sensorChannel?: number;
    pumpChannel?: number;
    moistureThresholdLow?: number;
    moistureThresholdHigh?: number;
    maxPumpDurationMs?: number;
    wateringMode?: "auto" | "manual";
  }) => Promise<null>;
  onNext: () => void;
  onBack: () => void;
}

function PairSensorStep({
  plantBoxId,
  devices,
  updateBox,
  onNext,
  onBack,
}: PairSensorStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{
    deviceId: string;
    sensorChannel: number;
    pumpChannel: number;
  }>({
    defaultValues: {
      deviceId: devices[0]?._id ?? "",
      sensorChannel: 0,
      pumpChannel: 0,
    },
  });

  async function onSubmit(data: {
    deviceId: string;
    sensorChannel: number;
    pumpChannel: number;
  }) {
    await updateBox({
      plantBoxId,
      deviceId: data.deviceId as Id<"devices">,
      sensorChannel: Number(data.sensorChannel),
      pumpChannel: Number(data.pumpChannel),
      moistureThresholdLow: 30,
      moistureThresholdHigh: 70,
      maxPumpDurationMs: 5000,
      wateringMode: "manual",
    });
    onNext();
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-italic">
        Tell us which device and channels to use for this planting station. If
        your ESP32 has multiple sensors or pumps, each one uses a different
        channel number (starting from 0).
      </p>

      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="space-y-4"
      >
        {/* Device selector */}
        <label className="flex flex-col gap-1">
          <span className="text-sm text-ink">Device</span>
          <select
            {...register("deviceId", { required: true })}
            className="input-field"
          >
            {devices.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.deviceKey}) — {d.status}
              </option>
            ))}
          </select>
        </label>

        {/* Channel assignments */}
        <div className="flex gap-6">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-ink">Sensor Channel</span>
            <span className="text-xs text-muted-italic">
              Which analog input the moisture sensor is wired to
            </span>
            <input
              type="number"
              min={0}
              max={7}
              {...register("sensorChannel", {
                required: true,
                valueAsNumber: true,
              })}
              className="input-field w-20"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-ink">Pump Channel</span>
            <span className="text-xs text-muted-italic">
              Which relay output controls the pump
            </span>
            <input
              type="number"
              min={0}
              max={7}
              {...register("pumpChannel", {
                required: true,
                valueAsNumber: true,
              })}
              className="input-field w-20"
            />
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="text-sm px-4 py-2 text-muted-italic border border-border"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting || devices.length === 0}
            className="text-sm px-6 py-2 bg-ink text-parchment disabled:opacity-50"
          >
            Pair & Continue
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Step 3: Assembly / wiring guide ───

function AssemblyStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-ink">
        With the firmware installed, wire up the sensor, relay, and pump before
        powering on.
      </p>

      {/* Wiring instructions */}
      <div className="space-y-4">
        <div className="border border-border/40 p-4 space-y-2">
          <p className="text-sm text-ink font-medium">Moisture Sensor</p>
          <ul className="text-sm text-muted-italic space-y-1">
            <li>
              <strong className="text-ink font-normal">VCC</strong> → ESP32{" "}
              <code className="text-ink bg-border/30 px-1">3.3V</code>
            </li>
            <li>
              <strong className="text-ink font-normal">GND</strong> → ESP32{" "}
              <code className="text-ink bg-border/30 px-1">GND</code>
            </li>
            <li>
              <strong className="text-ink font-normal">AOUT</strong> → ESP32{" "}
              <code className="text-ink bg-border/30 px-1">GPIO 34</code>{" "}
              (analog input, channel 0)
            </li>
          </ul>
        </div>

        <div className="border border-border/40 p-4 space-y-2">
          <p className="text-sm text-ink font-medium">Relay Module</p>
          <ul className="text-sm text-muted-italic space-y-1">
            <li>
              <strong className="text-ink font-normal">VCC</strong> → ESP32{" "}
              <code className="text-ink bg-border/30 px-1">5V</code> (or{" "}
              <code className="text-ink bg-border/30 px-1">VIN</code>)
            </li>
            <li>
              <strong className="text-ink font-normal">GND</strong> → ESP32{" "}
              <code className="text-ink bg-border/30 px-1">GND</code>
            </li>
            <li>
              <strong className="text-ink font-normal">IN</strong> → ESP32{" "}
              <code className="text-ink bg-border/30 px-1">GPIO 26</code>{" "}
              (digital output, channel 0)
            </li>
          </ul>
        </div>

        <div className="border border-border/40 p-4 space-y-2">
          <p className="text-sm text-ink font-medium">Pump</p>
          <ul className="text-sm text-muted-italic space-y-1">
            <li>
              Connect the pump's positive wire to the relay's{" "}
              <strong className="text-ink font-normal">NO</strong> (normally
              open) terminal.
            </li>
            <li>
              Connect the relay's{" "}
              <strong className="text-ink font-normal">COM</strong> terminal to
              your 12V power supply positive.
            </li>
            <li>
              Connect the pump's negative wire to the 12V power supply negative.
            </li>
          </ul>
        </div>

        <div className="border border-border/40 p-4 space-y-2">
          <p className="text-sm text-ink font-medium">Tubing</p>
          <p className="text-sm text-muted-italic">
            Attach tubing from your water reservoir to the pump inlet, and from
            the pump outlet to your plant box. For even distribution in longer
            planters, use a soaker line or drip emitters at the outlet end.
          </p>
        </div>
      </div>

      {/* TODO: placeholder for wiring diagram image */}
      <div className="border border-dashed border-border/60 p-6 text-center">
        <p className="text-xs text-muted-italic italic">
          Wiring diagram will be added here
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 text-muted-italic border border-border"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="text-sm px-6 py-2 bg-ink text-parchment"
        >
          Everything is wired — next
        </button>
      </div>
    </div>
  );
}

// ─── Step 7: Calibrate sensor ───

interface CalibrateStepProps {
  plantBoxId: Id<"plantBoxes">;
  updateBox: (args: {
    plantBoxId: Id<"plantBoxes">;
    sensorDryRaw?: number;
    sensorWetRaw?: number;
  }) => Promise<null>;
  onNext: () => void;
  onBack: () => void;
}

function CalibrateStep({
  plantBoxId,
  updateBox,
  onNext,
  onBack,
}: CalibrateStepProps) {
  const [dryReading, setDryReading] = useState<number | null>(null);
  const [wetReading, setWetReading] = useState<number | null>(null);
  const [phase, setPhase] = useState<"dry" | "wet" | "saving">("dry");

  // TODO: These will come from a live reading query once the heartbeat
  // endpoint is built. For now, the user enters them manually from the
  // device's display / serial output.

  async function saveCalibration() {
    if (dryReading === null || wetReading === null) return;
    setPhase("saving");
    await updateBox({
      plantBoxId,
      sensorDryRaw: dryReading,
      sensorWetRaw: wetReading,
    });
    onNext();
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-italic">
        Every sensor reads slightly differently. We need two reference points so
        your moisture percentages are accurate.
      </p>

      {/* Step A: Dry reading */}
      <div
        className={`border p-4 space-y-3 ${
          phase === "dry" ? "border-ink/30" : "border-border/40 opacity-60"
        }`}
      >
        <p className="text-sm text-ink font-medium">
          A. Dry Air Reading (0% moisture)
        </p>
        <ol className="text-sm text-muted-italic list-decimal list-inside space-y-1">
          <li>Hold the sensor in the air — don't touch the metal pads.</li>
          <li>
            Read the raw value from the device's display or serial output.
          </li>
          <li>Enter it below.</li>
        </ol>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="e.g. 3400"
            value={dryReading ?? ""}
            onChange={(e) => setDryReading(Number(e.target.value) || null)}
            disabled={phase !== "dry"}
            className="input-field w-32"
          />
          {phase === "dry" && dryReading !== null && (
            <button
              onClick={() => setPhase("wet")}
              className="text-sm px-4 py-1.5 bg-ink text-parchment"
            >
              Recorded — next
            </button>
          )}
        </div>
      </div>

      {/* Step B: Wet reading */}
      <div
        className={`border p-4 space-y-3 ${
          phase === "wet" ? "border-ink/30" : "border-border/40 opacity-60"
        }`}
      >
        <p className="text-sm text-ink font-medium">
          B. Water Reading (100% moisture)
        </p>
        <ol className="text-sm text-muted-italic list-decimal list-inside space-y-1">
          <li>
            Submerge the sensor up to the line in a glass of water (don't
            submerge the electronics at the top).
          </li>
          <li>Wait a few seconds for the reading to stabilize.</li>
          <li>Enter the raw value below.</li>
        </ol>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="e.g. 1200"
            value={wetReading ?? ""}
            onChange={(e) => setWetReading(Number(e.target.value) || null)}
            disabled={phase !== "wet"}
            className="input-field w-32"
          />
        </div>
      </div>

      {/* Summary */}
      {dryReading !== null && wetReading !== null && (
        <div className="border border-border/40 p-4 bg-border/5">
          <p className="text-sm text-ink">Calibration summary:</p>
          <p className="text-sm text-muted-italic mt-1">
            Dry (0%):{" "}
            <strong className="text-ink font-normal">{dryReading}</strong>
            {" — "}
            Wet (100%):{" "}
            <strong className="text-ink font-normal">{wetReading}</strong>
          </p>
          <p className="text-xs text-muted-italic mt-2 italic">
            The firmware will map all readings between these values to 0–100%.
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 text-muted-italic border border-border"
        >
          Back
        </button>
        <button
          onClick={() => void saveCalibration()}
          disabled={
            dryReading === null || wetReading === null || phase === "saving"
          }
          className="text-sm px-6 py-2 bg-ink text-parchment disabled:opacity-40"
        >
          {phase === "saving" ? "Saving..." : "Save Calibration & Continue"}
        </button>
      </div>
    </div>
  );
}

// ─── Step 8: Test & Confirm ───

interface ConfirmStepProps {
  plantBoxId: Id<"plantBoxes">;
  onBack: () => void;
}

function ConfirmStep({ plantBoxId, onBack }: ConfirmStepProps) {
  const [testState, setTestState] = useState<
    "idle" | "pumping" | "done" | "error"
  >("idle");

  const readings = useQuery(api.readings.list, { plantBoxId, limit: 1 });
  const latestReading = readings?.[0] ?? null;

  // TODO: Wire this to an actual pump command mutation once the heartbeat
  // HTTP endpoint and command queue are built. For now this is a shell.
  function triggerTestPump() {
    setTestState("pumping");
    // Simulated — will be replaced with real mutation
    setTimeout(() => setTestState("done"), 3000);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-italic">
        Let's make sure everything works before you walk away.
      </p>

      {/* Check 1: Sensor reading */}
      <div className="border border-border/40 p-4 space-y-2">
        <p className="text-sm text-ink font-medium">1. Verify Sensor Reading</p>
        <p className="text-sm text-muted-italic">
          Place the sensor in the soil of your plant box. You should see a
          moisture reading appear:
        </p>
        <div className="flex items-center gap-3 pt-2">
          {latestReading ? (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-ink">
                Reading: {latestReading.moisturePct}% moisture
              </span>
            </div>
          ) : (
            <span className="text-sm text-muted-italic italic">
              Waiting for first reading from device...
            </span>
          )}
        </div>
      </div>

      {/* Check 2: Pump test */}
      <div className="border border-border/40 p-4 space-y-2">
        <p className="text-sm text-ink font-medium">2. Test the Pump</p>
        <p className="text-sm text-muted-italic">
          Make sure the tubing is in your water reservoir and the outlet is
          pointed at the plant box (or into a cup for testing). This will run the
          pump for 2 seconds.
        </p>
        <div className="flex items-center gap-3 pt-2">
          {testState === "idle" && (
            <button
              onClick={triggerTestPump}
              className="text-sm px-4 py-1.5 bg-ink text-parchment"
            >
              Run Test Pump (2 sec)
            </button>
          )}
          {testState === "pumping" && (
            <span className="text-sm text-muted-italic italic">
              Pumping...
            </span>
          )}
          {testState === "done" && (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-ink">
                Pump test complete — did water come out?
              </span>
            </div>
          )}
          {testState === "error" && (
            <span className="text-sm text-alert">
              Pump did not respond. Check wiring and try again.
            </span>
          )}
        </div>
      </div>

      {/* Check 3: Confirm everything */}
      <div className="border border-border/40 p-4 space-y-2">
        <p className="text-sm text-ink font-medium">3. Confirm Setup</p>
        <ul className="text-sm text-muted-italic space-y-1">
          <li className="flex items-center gap-2">
            <span>{latestReading ? "✓" : "○"}</span>
            <span>Sensor is reading moisture levels</span>
          </li>
          <li className="flex items-center gap-2">
            <span>{testState === "done" ? "✓" : "○"}</span>
            <span>Pump delivered water successfully</span>
          </li>
        </ul>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 text-muted-italic border border-border"
        >
          Back
        </button>
        {/* Reloads the page — the device-paired UI replaces the wizard
            since deviceId is now set */}
        <button
          onClick={() => window.location.reload()}
          className="text-sm px-6 py-2 bg-ink text-parchment"
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
}

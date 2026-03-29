import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";

interface WateringControlsProps {
  box: Doc<"plantBoxes"> & {
    plantCount: number;
    latestMoisturePct: number | null;
    deviceName: string | null;
    deviceStatus: string | null;
  };
}

export default function WateringControls({ box }: WateringControlsProps) {
  const updateBox = useMutation(api.plantBoxes.update);

  const mode = box.wateringMode ?? "manual";
  const thresholdLow = box.moistureThresholdLow ?? 30;
  const thresholdHigh = box.moistureThresholdHigh ?? 70;
  const maxDuration = box.maxPumpDurationMs ?? 5000;

  function toggleMode() {
    void updateBox({
      plantBoxId: box._id,
      wateringMode: mode === "auto" ? "manual" : "auto",
    });
  }

  return (
    <div>
      <h2 className="text-xl font-light italic text-ink mb-4">
        Watering Controls
      </h2>

      <div className="border border-border/40 p-4 space-y-6">
        {/* Mode toggle */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-ink block">Watering Mode</span>
            <span className="text-xs text-muted-italic">
              {mode === "auto"
                ? "Pump activates automatically when moisture drops below threshold"
                : "Pump only activates when you trigger it manually"}
            </span>
          </div>
          <button
            onClick={toggleMode}
            className="text-sm px-4 py-1.5 border border-border"
          >
            {mode === "auto" ? "Auto" : "Manual"}
          </button>
        </div>

        {/* Thresholds (only meaningful in auto mode) */}
        <div className="space-y-3">
          <span className="text-sm text-ink block">Moisture Thresholds</span>
          <div className="flex gap-6">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-italic">
                Low (triggers pump)
              </span>
              <input
                type="number"
                value={thresholdLow}
                onChange={(e) =>
                  void updateBox({
                    plantBoxId: box._id,
                    moistureThresholdLow: Number(e.target.value),
                  })
                }
                min={0}
                max={100}
                className="input-field w-20"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-italic">
                High (stops pump)
              </span>
              <input
                type="number"
                value={thresholdHigh}
                onChange={(e) =>
                  void updateBox({
                    plantBoxId: box._id,
                    moistureThresholdHigh: Number(e.target.value),
                  })
                }
                min={0}
                max={100}
                className="input-field w-20"
              />
            </label>
          </div>
        </div>

        {/* Max pump duration */}
        <label className="flex flex-col gap-1">
          <span className="text-sm text-ink">Max Pump Duration</span>
          <span className="text-xs text-muted-italic">
            Safety limit — pump will stop after this many seconds regardless of
            moisture level
          </span>
          <input
            type="number"
            value={maxDuration / 1000}
            onChange={(e) =>
              void updateBox({
                plantBoxId: box._id,
                maxPumpDurationMs: Number(e.target.value) * 1000,
              })
            }
            min={1}
            max={60}
            className="input-field w-20"
          />
        </label>

        {/* Manual trigger */}
        <div>
          <button
            disabled={box.deviceStatus !== "online"}
            className="text-sm px-6 py-2 bg-ink text-parchment disabled:opacity-40"
          >
            {box.deviceStatus === "online"
              ? "Water Now"
              : "Device Offline"}
          </button>
        </div>
      </div>
    </div>
  );
}

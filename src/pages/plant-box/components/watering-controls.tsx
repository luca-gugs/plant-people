import { useState } from "react";
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

  // Local state for threshold/duration inputs — mutations fire on blur, not on
  // every keystroke, to avoid a database write for each character typed.
  const [low, setLow] = useState(box.moistureThresholdLow ?? 30);
  const [high, setHigh] = useState(box.moistureThresholdHigh ?? 70);
  const [duration, setDuration] = useState(
    Math.round((box.maxPumpDurationMs ?? 5000) / 1000),
  );

  function setMode(newMode: "auto" | "manual") {
    void updateBox({ plantBoxId: box._id, wateringMode: newMode });
  }

  return (
    <div className="panel-ornate">
      <h2 className="text-sm uppercase tracking-widest text-botanical mb-6 text-center">
        Irrigation Controls
      </h2>

      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setMode("auto")}
          className={mode === "auto" ? "btn-primary" : "btn-secondary"}
        >
          Automatic
        </button>
        <button
          onClick={() => setMode("manual")}
          className={mode === "manual" ? "btn-primary" : "btn-secondary"}
        >
          Manual
        </button>
      </div>

      {/* Thresholds */}
      <div className="grid grid-cols-2 gap-8 text-center mb-8">
        <div>
          <span className="label-xs block mb-2">Low Threshold</span>
          <input
            type="number"
            value={low}
            onChange={(e) => setLow(Number(e.target.value))}
            onBlur={() =>
              void updateBox({ plantBoxId: box._id, moistureThresholdLow: low })
            }
            min={0}
            max={100}
            className="input-field text-center text-2xl w-full"
            style={{ fontFamily: "Georgia, serif" }}
          />
          <span className="label-xs block mt-1">Triggers pump</span>
        </div>
        <div>
          <span className="label-xs block mb-2">High Threshold</span>
          <input
            type="number"
            value={high}
            onChange={(e) => setHigh(Number(e.target.value))}
            onBlur={() =>
              void updateBox({
                plantBoxId: box._id,
                moistureThresholdHigh: high,
              })
            }
            min={0}
            max={100}
            className="input-field text-center text-2xl w-full"
            style={{ fontFamily: "Georgia, serif" }}
          />
          <span className="label-xs block mt-1">Stops pump</span>
        </div>
      </div>

      {/* Max duration */}
      <div className="text-center mb-8">
        <span className="label-xs block mb-2">Max Pump Duration</span>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          onBlur={() =>
            void updateBox({
              plantBoxId: box._id,
              maxPumpDurationMs: duration * 1000,
            })
          }
          min={1}
          max={60}
          className="input-field text-center text-2xl w-24"
          style={{ fontFamily: "Georgia, serif" }}
        />
        <span className="label-xs block mt-1">seconds</span>
      </div>

      {/* Manual trigger */}
      <button
        disabled={box.deviceStatus !== "online"}
        className="btn-outline-botanical w-full"
      >
        {box.deviceStatus === "online" ? "Irrigate Now" : "Device Offline"}
      </button>
    </div>
  );
}

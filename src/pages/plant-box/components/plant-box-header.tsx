import { Link } from "react-router";
import { ArrowLeft, MapPin, Sun } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { LIGHT_BY_VALUE } from "../../../constants/light-conditions";

interface PlantBoxHeaderProps {
  box: Doc<"plantBoxes"> & {
    plantCount: number;
    latestMoisturePct: number | null;
    deviceName: string | null;
    deviceStatus: string | null;
  };
}

export default function PlantBoxHeader({ box }: PlantBoxHeaderProps) {
  return (
    <header>
      {/* Cover image */}
      {box.coverImageUrl && (
        <div className="relative h-48 md:h-64 overflow-hidden">
          <img
            src={box.coverImageUrl}
            alt={box.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-parchment/80" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 pt-6">
        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-italic hover:text-ink transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Ledger</span>
        </Link>

        {/* Title & metadata */}
        <h1 className="text-3xl md:text-4xl font-light italic text-ink mb-2">
          {box.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-italic">
          {box.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {box.location}
            </span>
          )}
          {box.lightCondition && (
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              {LIGHT_BY_VALUE[box.lightCondition]?.label ?? box.lightCondition}
            </span>
          )}
          <span>{box.plantCount} specimen{box.plantCount !== 1 ? "s" : ""}</span>
          {box.latestMoisturePct !== null && (
            <span>Moisture: {box.latestMoisturePct}%</span>
          )}
        </div>

        {box.description && (
          <p className="mt-3 text-sm text-muted-italic max-w-2xl">
            {box.description}
          </p>
        )}

        {/* Device status badge */}
        {box.deviceName && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                box.deviceStatus === "online" ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-muted-italic">
              {box.deviceName} — {box.deviceStatus ?? "unknown"}
            </span>
          </div>
        )}

        <div className="mt-6 h-px w-full bg-border/60" />
      </div>
    </header>
  );
}

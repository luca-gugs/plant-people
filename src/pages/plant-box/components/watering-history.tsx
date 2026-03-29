import { Doc } from "../../../../convex/_generated/dataModel";
import { CheckCircle2 } from "lucide-react";

interface WateringHistoryProps {
  events: Doc<"pumpEvents">[];
}

export default function WateringHistory({ events }: WateringHistoryProps) {
  const recent = events.slice(0, 8);

  return (
    <div className="panel-sidebar">
      <p className="label-xs mb-4">Recent Watering Activity</p>

      {recent.length === 0 ? (
        <p className="text-sm text-muted-italic py-4 text-center">
          No watering events yet.
        </p>
      ) : (
        <ul className="space-y-4 text-sm italic border-t border-border pt-6">
          {recent.map((event) => (
            <li key={event._id} className="flex justify-between items-start">
              <div>
                <span className="label-xs block not-italic mb-1">
                  {new Date(event.timestamp).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span>
                  {event.trigger === "auto" ? "Automatic" : "Manual"} hydration
                  — {(event.durationMs / 1000).toFixed(1)}s
                </span>
                <span className="text-xs text-ink-faint block">
                  {event.moistureBefore}%
                  {event.moistureAfter !== undefined &&
                    ` → ${event.moistureAfter}%`}
                </span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-botanical shrink-0 mt-1" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

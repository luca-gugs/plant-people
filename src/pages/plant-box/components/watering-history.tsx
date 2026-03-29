import { Doc } from "../../../../convex/_generated/dataModel";
import { Droplets } from "lucide-react";

interface WateringHistoryProps {
  events: Doc<"pumpEvents">[];
}

export default function WateringHistory({ events }: WateringHistoryProps) {
  return (
    <div>
      <h2 className="text-xl font-light italic text-ink mb-4">
        Watering History
      </h2>

      {events.length === 0 ? (
        <p className="text-sm text-muted-italic py-6 text-center">
          No watering events recorded yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event._id}
              className="flex items-center justify-between border-b border-border/40 py-3"
            >
              <div className="flex items-center gap-3">
                <Droplets className="w-4 h-4 text-muted-italic" />
                <div>
                  <span className="text-sm text-ink block">
                    {event.trigger === "auto" ? "Auto" : "Manual"} —{" "}
                    {(event.durationMs / 1000).toFixed(1)}s
                  </span>
                  <span className="text-xs text-muted-italic">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-muted-italic">
                <span>Before: {event.moistureBefore}%</span>
                {event.moistureAfter !== undefined && (
                  <span className="ml-3">After: {event.moistureAfter}%</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

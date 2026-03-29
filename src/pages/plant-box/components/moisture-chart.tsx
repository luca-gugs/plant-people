import { Doc } from "../../../../convex/_generated/dataModel";

interface MoistureChartProps {
  readings: Doc<"readings">[];
}

export default function MoistureChart({ readings }: MoistureChartProps) {
  // Readings come in desc order from the API; reverse for chronological display
  const chronological = [...readings].reverse();
  const latest = readings[0] ?? null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-light italic text-ink">Moisture Readings</h2>
        {latest && (
          <span className="text-sm text-muted-italic">
            Current: {latest.moisturePct}%
          </span>
        )}
      </div>

      {chronological.length === 0 ? (
        <p className="text-sm text-muted-italic py-6 text-center">
          No sensor readings yet. Once your device is online, readings will
          appear here.
        </p>
      ) : (
        <div className="border border-border/40 p-4">
          {/* TODO: Replace with actual chart (recharts, visx, etc.) */}
          <div className="h-48 flex items-end gap-px">
            {chronological.slice(-60).map((r) => (
              <div
                key={r._id}
                className="flex-1 bg-ink/20 min-w-[2px]"
                style={{ height: `${r.moisturePct}%` }}
                title={`${r.moisturePct}% — ${new Date(r.timestamp).toLocaleString()}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-italic">
            <span>
              {chronological.length > 0 &&
                new Date(chronological[0].timestamp).toLocaleDateString()}
            </span>
            <span>
              {chronological.length > 0 &&
                new Date(
                  chronological[chronological.length - 1].timestamp,
                ).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

import { Doc } from "../../../../convex/_generated/dataModel";
import { CalendarDays } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MoistureChartProps {
  readings: Doc<"readings">[];
}

export default function MoistureChart({ readings }: MoistureChartProps) {
  // Readings come in desc order from the API; reverse for chronological display
  const chronological = [...readings].reverse();
  const latest = readings[0] ?? null;

  // Transform for recharts
  const chartData = chronological.slice(-60).map((r) => ({
    time: new Date(r.timestamp).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    moisturePct: r.moisturePct,
  }));

  return (
    <div className="panel-sidebar">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="w-5 h-5 text-botanical" />
        <h2 className="text-lg uppercase tracking-widest text-botanical">
          Maintenance Log
        </h2>
      </div>

      {chartData.length === 0 ? (
        <p className="text-sm text-muted-italic py-6 text-center">
          No sensor readings yet.
        </p>
      ) : (
        <>
          <p className="label-xs mb-3">Moisture Level Over Time</p>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="moistureGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#3A4D39"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="#3A4D39"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#D4CBB7"
                />
                <XAxis
                  dataKey="time"
                  stroke="#8C7B65"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FBF8F3",
                    border: "1px solid #D4CBB7",
                    fontSize: "10px",
                    fontFamily: "Georgia, serif",
                  }}
                  formatter={(value: number) => [`${value}%`, "Moisture"]}
                />
                <Area
                  type="monotone"
                  dataKey="moisturePct"
                  stroke="#3A4D39"
                  fill="url(#moistureGrad)"
                  strokeWidth={2}
                  dot={{
                    fill: "#3A4D39",
                    strokeWidth: 2,
                    r: 3,
                  }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Current reading */}
      {latest && (
        <div className="mt-6 pt-4 border-t border-border text-center">
          <span
            className="text-2xl"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {latest.moisturePct}%
          </span>
          <span className="label-xs block mt-1">Current Moisture</span>
        </div>
      )}
    </div>
  );
}
